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

const NoMopWallsLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  //todo add correct selector
  const selectedNoMopWallsList = getNoMopMapSubsetsList();

  const [NoMopWallsLayer] = useState(
    new VectorLayer({
      source: new VectorSource({
        wrapX: false,
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(255, 125, 0, 1)',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(255, 125, 0, 0.2)',
        }),
      }),
    }),
  );

  useEffect(() => {
    if (!map) return;
    map.addLayer(NoMopWallsLayer);
    NoMopWallsLayer.setZIndex(ZIndex || 0);
    NoMopWallsLayer.set('id', 'NoMopWallsLayer');
    return () => {
      map.removeLayer(NoMopWallsLayer);
    };
  }, [map]);

  useEffect(() => {
    NoMopWallsLayer.getSource()?.clear();
    NoMopWallsLayer.getSource()?.addFeatures(
      selectedNoMopWallsList.map(
        ({ value }) =>
          new Feature({
            geometry: new Polygon([
              // need to add the PixelRatio as an offset to Y
              value.map((current) => [getCoordinates(+current[0], 'x'), getCoordinates(+current[1], 'y') + PixelRatio]),
            ]),
          }),
      ),
    );
  }, [selectedNoMopWallsList]);

  return null;
};

export default NoMopWallsLayer;
