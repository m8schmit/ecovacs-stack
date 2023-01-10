import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { getNoMopWallMapSubsetsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { getCoordinates, mopZoneStyle, PixelRatio } from '../Map.utils';
import { LayerProps } from './Layer.type';

const NoMopWallsLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  //todo add correct selector
  const selectedNoMopWallsList = getNoMopWallMapSubsetsList();

  const [NoMopWallsLayer] = useState(
    new VectorLayer({
      source: new VectorSource({
        wrapX: false,
      }),
      style: mopZoneStyle,
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
