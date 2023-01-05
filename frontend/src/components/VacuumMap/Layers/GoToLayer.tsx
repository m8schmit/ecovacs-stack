import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { getGoToCoordinates } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { getCoordinatesFromExtend } from '../Map.utils';
import { LayerProps } from './Layer.type';

const GoToLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const goToCoordinates = getGoToCoordinates();

  const [goToLayer] = useState(
    new VectorLayer({
      source: new VectorSource({
        wrapX: false,
      }),
    }),
  );

  useEffect(() => {
    if (!map) return;
    map.addLayer(goToLayer);
    goToLayer.setZIndex(ZIndex || 0);
    goToLayer.set('id', 'GoToLayer');
    return () => {
      map.removeLayer(goToLayer);
    };
  }, [map]);

  useEffect(() => {
    console.log('update coordinates', goToCoordinates);
    goToLayer.getSource()?.clear();
    goToLayer.getSource()?.addFeature(new Feature({ geometry: new Point(getCoordinatesFromExtend(goToCoordinates)) }));
  }, [goToCoordinates]);

  return null;
};

export default GoToLayer;
