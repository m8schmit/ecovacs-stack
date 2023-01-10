import Draw, { createBox } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { MapContext } from '../../UI/Map/MapContex';
import { mopZoneStyle } from '../Map.utils';

const SelectNoMopZonesInteraction = () => {
  const map = useContext(MapContext);
  let isLoaded = false;
  //TODO
  const dispatch = useAppDispatch();

  const [NoMopzonesDrawer, setNoMopZonesDrawer] = useState<Draw | null>();

  // TODO find the right type, geometry in drawend doesnt contain `getcoordinates()`
  const drawNewZone = (event: any) => {
    const coordinates = event.feature.getGeometry().getCoordinates() || [];
    console.log('no go', coordinates);

    // coordinates.length && dispatch(setNo(coordinate));
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

    return () => {
      NoMopzonesDrawer && map.removeInteraction(NoMopzonesDrawer);
    };
  }, [map]);

  useEffect(() => {
    if (!NoMopzonesDrawer) return;
    NoMopzonesDrawer.on('drawend', drawNewZone);
    return () => {
      NoMopzonesDrawer.un('drawend', drawNewZone);
      map && map.removeInteraction(NoMopzonesDrawer);
    };
  }, [NoMopzonesDrawer]);

  return null;
};

export default SelectNoMopZonesInteraction;
