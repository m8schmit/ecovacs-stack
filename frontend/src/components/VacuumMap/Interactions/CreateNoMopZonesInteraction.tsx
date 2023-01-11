import Draw, { createBox } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { setNoMopSubset } from '../../../store/vacuum/editMapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { mopZoneStyle } from '../NoGo.utils';

const CreateNoMopZonesInteraction = () => {
  const map = useContext(MapContext);
  let isLoaded = false;
  const dispatch = useAppDispatch();

  const [NoMopzonesDrawer, setNoMopZonesDrawer] = useState<Draw | null>();

  // TODO find the right type, geometry in drawend doesnt contain `getcoordinates()`
  const drawNewZone = (event: any) => {
    const coordinates = event.feature.getGeometry().getCoordinates()[0] || [];

    if (coordinates.length) {
      coordinates.pop();
      dispatch(setNoMopSubset(coordinates));
    }
  };

  useEffect(() => {
    if (!map || isLoaded) return;
    map.getAllLayers().forEach((layer) => {
      if (layer.get('id') === 'NoMopzonesLayer') {
        const source = layer.getSource() as VectorSource;
        if (source) {
          const initialDrawer = new Draw({
            source,
            type: 'Circle',
            stopClick: true,
            geometryFunction: createBox(),
            style: mopZoneStyle,
          });

          map.addInteraction(initialDrawer);
          setNoMopZonesDrawer(initialDrawer);
          isLoaded = true;
        }
      }
    });
  }, [map]);

  useEffect(() => {
    if (!NoMopzonesDrawer) return;
    NoMopzonesDrawer.on('drawend', drawNewZone);
    return () => {
      NoMopzonesDrawer.un('drawend', drawNewZone);
      map && map.removeInteraction(NoMopzonesDrawer);
      dispatch(setNoMopSubset([]));
    };
  }, [NoMopzonesDrawer]);

  return null;
};

export default CreateNoMopZonesInteraction;
