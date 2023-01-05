import Draw, { createBox } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { FC, useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { MapContext } from '../../UI/Map/MapContex';

const SelectNoGoZonesInteraction = () => {
  const map = useContext(MapContext);
  //TODO
  const dispatch = useAppDispatch();

  const [NoGozonesDrawer, setNoGoZonesDrawer] = useState<Draw | null>();

  // TODO find the right type, geometry in drawend doesnt contain `getcoordinates()`
  const drawNewZone = (event: any) => {
    const coordinates = event.feature.getGeometry().getCoordinates() || [];
    console.log('no go', coordinates);

    // coordinates.length && dispatch(setNo(coordinate));
  };

  useEffect(() => {
    if (!map) return;
    map.getAllLayers().forEach((layer) => {
      if (layer.get('id') === 'NoGozonesLayer') {
        const source = layer.getSource() as VectorSource;
        if (source) {
          const NoGozonesDrawer = new Draw({
            source,
            type: 'Circle',
            stopClick: true,
            geometryFunction: createBox(),
            style: new Style({
              stroke: new Stroke({
                color: 'rgba(255, 0, 0, 1)',
                width: 2,
              }),
              fill: new Fill({
                color: 'rgba(255, 0, 0, 0.3)',
              }),
            }),
          });

          map.addInteraction(NoGozonesDrawer);
          setNoGoZonesDrawer(NoGozonesDrawer);
        }
      }
    });

    return () => {
      NoGozonesDrawer && map.removeInteraction(NoGozonesDrawer);
    };
  }, [map]);

  useEffect(() => {
    if (!NoGozonesDrawer) return;
    NoGozonesDrawer.on('drawend', drawNewZone);
    return () => {
      NoGozonesDrawer.un('drawend', drawNewZone);
    };
  }, [NoGozonesDrawer]);

  return null;
};

export default SelectNoGoZonesInteraction;
