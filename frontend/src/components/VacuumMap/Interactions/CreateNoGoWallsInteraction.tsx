import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { setNoGoSubset } from '../../../store/vacuum/editMapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { nogoZonesStyle } from '../NoGo.utils';

const CreateNoGoWallsInteraction = () => {
  const map = useContext(MapContext);
  let isLoaded = false;
  const dispatch = useAppDispatch();

  const [NoGoWallsDrawer, setNoGoWallsDrawer] = useState<Draw | null>();

  // TODO find the right type, geometry in drawend doesnt contain `getcoordinates()`
  const drawNewWall = (event: any) => {
    const coordinates = event.feature.getGeometry().getCoordinates() || [];

    if (coordinates.length) {
      dispatch(setNoGoSubset(coordinates));
    }
  };

  useEffect(() => {
    if (!map || isLoaded) return;
    map.getAllLayers().forEach((layer) => {
      if (layer.get('id') === 'NoGoWallsLayer') {
        const source = layer.getSource() as VectorSource;
        if (source) {
          const initialDrawer = new Draw({
            source,
            type: 'LineString',
            stopClick: true,
            maxPoints: 2,
            style: nogoZonesStyle,
          });

          map.addInteraction(initialDrawer);
          setNoGoWallsDrawer(initialDrawer);
          isLoaded = true;
        }
      }
    });
  }, [map]);

  useEffect(() => {
    if (!NoGoWallsDrawer) return;
    NoGoWallsDrawer.on('drawend', drawNewWall);
    return () => {
      NoGoWallsDrawer.un('drawend', drawNewWall);
      map && map.removeInteraction(NoGoWallsDrawer);
      dispatch(setNoGoSubset([]));
    };
  }, [NoGoWallsDrawer]);

  return null;
};

export default CreateNoGoWallsInteraction;
