import ImageLayer from 'ol/layer/Image';
import ImageSource from 'ol/source/Image';
import Static from 'ol/source/ImageStatic';
import { FC, useContext, useEffect, useState } from 'react';

import { getVacuumMap } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../Map/MapContex';
import { LayerProps } from './Layer.type';

const MainLayer: FC<LayerProps> = ({ projection, ZIndex }) => {
  const map = useContext(MapContext);
  const [mainLayer] = useState<ImageLayer<ImageSource>>(new ImageLayer());
  const { data } = getVacuumMap();

  useEffect(() => {
    if (!map) return;

    map.addLayer(mainLayer);
    mainLayer.setZIndex(ZIndex || 0);
    return () => {
      map && map.removeLayer(mainLayer);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !data || !mainLayer || !projection) return;
    mainLayer.setSource(
      new Static({ url: `data:image/png;base64,${data}`, projection, imageExtent: projection.getExtent() }),
    );
  }, [data, map]);

  return null;
};

export default MainLayer;
