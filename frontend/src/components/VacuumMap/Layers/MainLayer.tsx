import ImageLayer from 'ol/layer/Image';
import Projection from 'ol/proj/Projection';
import ImageSource from 'ol/source/Image';
import Static from 'ol/source/ImageStatic';
import { FC, useContext, useEffect, useState } from 'react';

import { getVacuumMap } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../Map/MapContex';

export interface MainLayerProps {
  projection?: Projection;
}
const MainLayer: FC<MainLayerProps> = ({ projection = null }) => {
  const map = useContext(MapContext);
  const [mainLayer] = useState<ImageLayer<ImageSource>>(new ImageLayer());
  const { data } = getVacuumMap();

  useEffect(() => {
    if (!map) return;

    map.addLayer(mainLayer);
    mainLayer.setZIndex(0);
    console.log('add mainLayer');
    return () => {
      map && map.removeLayer(mainLayer);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !data || !mainLayer || !projection) return;
    console.log('update mainLayer');

    mainLayer.setSource(
      new Static({ url: `data:image/png;base64,${data}`, projection, imageExtent: projection.getExtent() }),
    );
  }, [data, map]);

  return null;
};

export default MainLayer;
