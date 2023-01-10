import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import RegularShape from 'ol/style/RegularShape';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { MapContext } from '../../UI/Map/MapContex';

const SelectNoGoWallsInteraction = () => {
  const map = useContext(MapContext);
  let isLoaded = false;

  //TODO
  const dispatch = useAppDispatch();

  const [NoGoWallsDrawer, setNoGoWallsDrawer] = useState<Draw | null>();

  // TODO find the right type, geometry in drawend doesnt contain `getcoordinates()`
  const drawNewWall = (event: any) => {
    const coordinates = event.feature.getGeometry().getCoordinates() || [];
    console.log('no go', coordinates);

    // coordinates.length && dispatch(setNo(coordinate));
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
            style: new Style({
              stroke: new Stroke({
                color: 'rgba(255, 0, 0, 1)',
                width: 2,
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
    };
  }, [NoGoWallsDrawer]);

  return null;
};

export default SelectNoGoWallsInteraction;
