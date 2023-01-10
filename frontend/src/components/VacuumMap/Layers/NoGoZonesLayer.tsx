import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { getNoGoMapSubsetsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { getCoordinates, nogoZonesStyle, PixelRatio } from '../Map.utils';
import { LayerProps } from './Layer.type';

const NoGoZonesLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  //TODO add correct selector
  const selectedNoGoZonesList = getNoGoMapSubsetsList();

  const [NoGozonesLayer] = useState(
    new VectorLayer({
      source: new VectorSource({
        wrapX: false,
      }),
      style: nogoZonesStyle,
    }),
  );

  useEffect(() => {
    if (!map) return;
    map.addLayer(NoGozonesLayer);
    NoGozonesLayer.setZIndex(ZIndex || 0);
    NoGozonesLayer.set('id', 'NoGozonesLayer');
    return () => {
      map.removeLayer(NoGozonesLayer);
    };
  }, [map]);

  useEffect(() => {
    NoGozonesLayer.getSource()?.clear();
    NoGozonesLayer.getSource()?.addFeatures(
      selectedNoGoZonesList.map(
        ({ value }) =>
          new Feature({
            geometry: new Polygon([
              // need to add the PixelRatio as an offset to Y
              value.map((current) => [getCoordinates(+current[0], 'x'), getCoordinates(+current[1], 'y') + PixelRatio]),
            ]),
          }),
      ),
    );
  }, [selectedNoGoZonesList]);

  return null;
};

export default NoGoZonesLayer;
