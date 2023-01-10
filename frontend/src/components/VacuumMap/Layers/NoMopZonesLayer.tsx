import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { getNoMopMapSubsetsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { getCoordinates, mopZoneStyle, PixelRatio } from '../Map.utils';
import { LayerProps } from './Layer.type';

const NoMopZonesLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const selectedNoMopZonesList = getNoMopMapSubsetsList();

  const [NoMopzonesLayer] = useState(
    new VectorLayer({
      source: new VectorSource({
        wrapX: false,
      }),
      style: mopZoneStyle,
    }),
  );

  useEffect(() => {
    if (!map) return;
    map.addLayer(NoMopzonesLayer);
    NoMopzonesLayer.setZIndex(ZIndex || 0);
    NoMopzonesLayer.set('id', 'NoMopzonesLayer');
    return () => {
      map.removeLayer(NoMopzonesLayer);
    };
  }, [map]);

  useEffect(() => {
    NoMopzonesLayer.getSource()?.clear();
    NoMopzonesLayer.getSource()?.addFeatures(
      selectedNoMopZonesList.map(
        ({ value }) =>
          new Feature({
            geometry: new Polygon([
              // need to add the PixelRatio as an offset to Y
              value.map((current) => [getCoordinates(+current[0], 'x'), getCoordinates(+current[1], 'y') + PixelRatio]),
            ]),
          }),
      ),
    );
  }, [selectedNoMopZonesList]);

  return null;
};

export default NoMopZonesLayer;
