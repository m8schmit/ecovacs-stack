import Draw, { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { setSplitLine } from '../../../store/vacuum/editMapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { LayerProps } from '../Layers/Layer.type';
import { setCoordinates } from '../Map.utils';

const SplitRoomInteraction: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();

  const source = new VectorSource({
    wrapX: false,
  });

  const splitDrawer = new Draw({
    source,
    type: 'LineString',
    stopClick: true,
    maxPoints: 2,
  });

  const [splitLayer] = useState(
    new VectorLayer({
      source,
    }),
  );

  const drawNewLine = (event: DrawEvent) => {
    splitLayer.getSource()?.clear();
    const extend = event.feature.getGeometry()?.getExtent();
    const coordinate = extend !== undefined ? setCoordinates(extend) : [];
    console.log('will split at ', coordinate);
    coordinate.length && dispatch(setSplitLine(coordinate));
  };

  useEffect(() => {
    if (!map) return;
    map.addLayer(splitLayer);
    splitLayer.setZIndex(ZIndex || 0);
    console.log('add layer at ', ZIndex);
    map.addInteraction(splitDrawer);
    return () => {
      map.removeInteraction(splitDrawer);
      map.removeLayer(splitLayer);
    };
  }, [map]);

  useEffect(() => {
    if (!splitDrawer) return;
    splitDrawer.on('drawend', drawNewLine);
    return () => {
      splitDrawer.un('drawend', drawNewLine);
    };
  }, []);

  return null;
};

export default SplitRoomInteraction;
