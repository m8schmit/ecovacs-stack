import Draw, { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { setGoToCoordinates } from '../../../store/vacuum/mapSlice';
import { LayerProps } from '../Layers/Layer.type';
import { setCoordinates } from '../Map.utils';
import { MapContext } from '../Map/MapContex';

const GoToInteraction: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();

  const source = new VectorSource({ wrapX: false });

  const pointDrawer = new Draw({
    source,
    type: 'Point',
    stopClick: true,
  });

  const [goToLayer] = useState(
    new VectorLayer({
      source,
    }),
  );

  const drawNewPoint = (event: DrawEvent) => {
    goToLayer.getSource()?.clear();
    const extend = event.feature.getGeometry()?.getExtent();
    const coordinate = extend !== undefined ? setCoordinates(extend) : [];
    coordinate.length && dispatch(setGoToCoordinates(coordinate));
  };

  useEffect(() => {
    if (!map) return;
    map.addLayer(goToLayer);
    goToLayer.setZIndex(ZIndex || 0);
    map.addInteraction(pointDrawer);
    return () => {
      map.removeInteraction(pointDrawer);
      map.removeLayer(goToLayer);
    };
  }, [map]);

  useEffect(() => {
    if (!pointDrawer) return;
    pointDrawer.on('drawend', drawNewPoint);
    return () => pointDrawer.un('drawend', drawNewPoint);
  }, [pointDrawer]);

  return null;
};

export default GoToInteraction;
