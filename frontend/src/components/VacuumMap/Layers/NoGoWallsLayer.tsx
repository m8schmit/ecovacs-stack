import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { FC, useContext, useEffect, useState } from 'react';

import { getNoMopMapSubsetsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { getCoordinates, PixelRatio } from '../Map.utils';
import { LayerProps } from './Layer.type';

const NoGoWallsLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  //TODO add correct selector
  const selectedNoGoWallsList = getNoMopMapSubsetsList();

  const [NoGoWallsLayer] = useState(
    new VectorLayer({
      source: new VectorSource({
        wrapX: false,
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 1)',
          width: 2,
        }),
      }),
    }),
  );

  useEffect(() => {
    if (!map) return;
    map.addLayer(NoGoWallsLayer);
    NoGoWallsLayer.setZIndex(ZIndex || 0);
    NoGoWallsLayer.set('id', 'NoGoWallsLayer');
    return () => {
      map.removeLayer(NoGoWallsLayer);
    };
  }, [map]);

  useEffect(() => {
    NoGoWallsLayer.getSource()?.clear();
    NoGoWallsLayer.getSource()?.addFeatures(
      selectedNoGoWallsList.map(
        ({ value }) =>
          new Feature({
            geometry: new Polygon([
              // need to add the PixelRatio as an offset to Y
              value.map((current) => [getCoordinates(+current[0], 'x'), getCoordinates(+current[1], 'y') + PixelRatio]),
            ]),
          }),
      ),
    );
  }, [selectedNoGoWallsList]);

  return null;
};

export default NoGoWallsLayer;
