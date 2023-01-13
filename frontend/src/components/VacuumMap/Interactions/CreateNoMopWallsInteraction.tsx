import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { setNoMopSubset } from '../../../store/vacuum/editMapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { setCoordinates } from '../Map.utils';
import { mopZoneStyle } from '../NoGo.utils';

const CreateNoMopWallsInteraction = () => {
  const map = useContext(MapContext);
  let isLoaded = false;
  const dispatch = useAppDispatch();

  const [NoMopWallsDrawer, setNoMopWallsDrawer] = useState<Draw | null>();

  // TODO find the right type, geometry in drawend doesnt contain `getcoordinates()`
  const drawNewWall = (event: any) => {
    const coordinates = event.feature.getGeometry().getCoordinates() || [];

    if (coordinates.length) {
      dispatch(setNoMopSubset(coordinates.map((current: number[]) => setCoordinates(current))));
    }
  };

  useEffect(() => {
    if (!map || isLoaded) return;
    map.getAllLayers().forEach((layer) => {
      if (layer.get('id') === 'NoMopWallsLayer') {
        const source = layer.getSource() as VectorSource;
        if (source) {
          const initialDrawer = new Draw({
            source,
            type: 'LineString',
            stopClick: true,
            maxPoints: 2,
            style: mopZoneStyle,
          });

          map.addInteraction(initialDrawer);
          setNoMopWallsDrawer(initialDrawer);
          isLoaded = true;
        }
      }
    });
  }, [map]);

  useEffect(() => {
    if (!NoMopWallsDrawer) return;
    NoMopWallsDrawer.on('drawend', drawNewWall);
    return () => {
      NoMopWallsDrawer.un('drawend', drawNewWall);
      map && map.removeInteraction(NoMopWallsDrawer);
      dispatch(setNoMopSubset([]));
    };
  }, [NoMopWallsDrawer]);

  return null;
};

export default CreateNoMopWallsInteraction;
