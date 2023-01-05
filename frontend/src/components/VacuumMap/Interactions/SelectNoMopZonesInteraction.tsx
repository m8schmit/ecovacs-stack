import Draw, { createBox } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { FC, useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { MapContext } from '../../UI/Map/MapContex';

const SelectNoMopZonesInteraction = () => {
  const map = useContext(MapContext);
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
    if (!map) return;
    map.getAllLayers().forEach((layer) => {
      if (layer.get('id') === 'NoMopzonesLayer') {
        const source = layer.getSource() as VectorSource;
        if (source) {
          const NoMopzonesDrawer = new Draw({
            source,
            type: 'Circle',
            stopClick: true,
            geometryFunction: createBox(),
            style: new Style({
              stroke: new Stroke({
                color: 'rgba(255, 125, 0, 1)',
                width: 2,
              }),
              fill: new Fill({
                color: 'rgba(255, 125, 0, 0.3)',
              }),
            }),
          });

          map.addInteraction(NoMopzonesDrawer);
          setNoMopZonesDrawer(NoMopzonesDrawer);
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
    };
  }, [NoMopzonesDrawer]);

  return null;
};

export default SelectNoMopZonesInteraction;
