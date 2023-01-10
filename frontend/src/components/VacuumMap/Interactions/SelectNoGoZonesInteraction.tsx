import Draw, { createBox } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import RegularShape from 'ol/style/RegularShape';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { MapContext } from '../../UI/Map/MapContex';

const SelectNoGoZonesInteraction = () => {
  const map = useContext(MapContext);
  let isLoaded = false;

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
            style: new Style({
              stroke: new Stroke({
                color: 'rgba(255, 0, 0, 1)',
                width: 2,
              }),
              fill: new Fill({
                color: 'rgba(255, 0, 0, 0.3)',
              }),
              image: new RegularShape({
                fill: new Fill({
                  color: 'rgba(255, 0, 0, 1)',
                }),
                points: 5,
                radius1: 5,
                radius2: 5,
              }),
            }),
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
    };
  }, [NoGozonesDrawer]);

  return null;
};

export default SelectNoGoZonesInteraction;
