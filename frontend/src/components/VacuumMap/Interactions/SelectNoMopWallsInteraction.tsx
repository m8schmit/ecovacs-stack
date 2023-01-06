import Draw, { createBox } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { MapContext } from '../../UI/Map/MapContex';

const SelectNoMopWallsInteraction = () => {
  const map = useContext(MapContext);
  let isLoaded = false;
  //TODO
  const dispatch = useAppDispatch();

  const [NoMopWallsDrawer, setNoMopWallsDrawer] = useState<Draw | null>();

  // TODO find the right type, geometry in drawend doesnt contain `getcoordinates()`
  const drawNewWall = (event: any) => {
    const coordinates = event.feature.getGeometry().getCoordinates() || [];
    console.log('no go', coordinates);

    // coordinates.length && dispatch(setNo(coordinate));
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
            style: new Style({
              stroke: new Stroke({
                color: 'rgba(255, 125, 0, 1)',
                width: 2,
              }),
            }),
          });

          map.addInteraction(initialDrawer);
          setNoMopWallsDrawer(initialDrawer);
          isLoaded = true;
        }
      }
    });

    return () => {
      NoMopWallsDrawer && map.removeInteraction(NoMopWallsDrawer);
    };
  }, [map]);

  useEffect(() => {
    if (!NoMopWallsDrawer) return;
    NoMopWallsDrawer.on('drawend', drawNewWall);
    return () => {
      NoMopWallsDrawer.un('drawend', drawNewWall);
      map && map.removeInteraction(NoMopWallsDrawer);
    };
  }, [NoMopWallsDrawer]);

  return null;
};

export default SelectNoMopWallsInteraction;
