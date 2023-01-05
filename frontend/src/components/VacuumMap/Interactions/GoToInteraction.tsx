import Draw, { DrawEvent } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { setGoToCoordinates } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { setCoordinates } from '../Map.utils';

const GoToInteraction = () => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();
  let isLoaded = false;

  const [pointDrawer, setPointDrawer] = useState<Draw | undefined>();

  const drawNewPoint = (event: DrawEvent) => {
    const extend = event.feature.getGeometry()?.getExtent();
    const coordinate = extend !== undefined ? setCoordinates(extend) : [];
    coordinate.length && dispatch(setGoToCoordinates([coordinate[0], coordinate[1]]));
  };

  useEffect(() => {
    if (!map || isLoaded) return;
    map.getAllLayers().forEach((layer) => {
      if (layer.get('id') === 'GoToLayer') {
        const source = layer.getSource() as VectorSource;
        if (source) {
          const initialDrawer = new Draw({
            source,
            type: 'Point',
            stopClick: true,
          });

          map.addInteraction(initialDrawer);
          setPointDrawer(initialDrawer);
          isLoaded = true;
        }
      }
    });
  }, [map]);

  useEffect(() => {
    if (!pointDrawer) return;
    pointDrawer.on('drawend', drawNewPoint);
    return () => {
      pointDrawer.un('drawend', drawNewPoint);
      map && map.removeInteraction(pointDrawer);
    };
  }, [pointDrawer]);

  return null;
};

export default GoToInteraction;
