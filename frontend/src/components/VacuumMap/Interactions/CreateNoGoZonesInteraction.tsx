import Draw, { createBox } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { setNoGoSubset } from '../../../store/vacuum/editMapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { nogoZonesStyle } from '../NoGo.utils';

const CreateNoGoZonesInteraction = () => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();
  const [NoGozonesDrawer, setNoGoZonesDrawer] = useState<Draw | null>();
  let isLoaded = false;

  // TODO find the right type, geometry in drawend doesnt contain `getcoordinates()`
  const drawNewZone = (event: any) => {
    const coordinates = event.feature.getGeometry().getCoordinates()[0] || [];

    if (coordinates.length) {
      coordinates.pop();
      dispatch(setNoGoSubset(coordinates));
    }
  };

  useEffect(() => {
    if (!map || isLoaded) return;
    map.getAllLayers().forEach((layer) => {
      if (layer.get('id') === 'NoGozonesLayer') {
        const source = layer.getSource() as VectorSource;
        if (source) {
          const initialDrawer = new Draw({
            source,
            type: 'Circle',
            stopClick: true,
            geometryFunction: createBox(),
            style: nogoZonesStyle,
          });

          map.addInteraction(initialDrawer);
          setNoGoZonesDrawer(initialDrawer);
          isLoaded = true;
        }
      }
    });
  }, [map]);

  useEffect(() => {
    if (!NoGozonesDrawer) return;
    NoGozonesDrawer.on('drawend', drawNewZone);
    return () => {
      NoGozonesDrawer.un('drawend', drawNewZone);
      map && map.removeInteraction(NoGozonesDrawer);
      dispatch(setNoGoSubset([]));
    };
  }, [NoGozonesDrawer]);

  return null;
};

export default CreateNoGoZonesInteraction;
