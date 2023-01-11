import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { getNoGoSubset, getSelectedNoGoList } from '../../../store/vacuum/editMapSlice';
import { getNoGoWallMapSubsetsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { getCoordinates, PixelRatio } from '../Map.utils';
import { formatNoGoSubset, nogoZonesStyle, selectedNoGoStyle } from '../NoGo.utils';
import { LayerProps } from './Layer.type';

const NoGoWallsLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const selectedNoGoWallsList = getNoGoWallMapSubsetsList();
  const nogoSubset = getNoGoSubset();
  const selectedNoGoList = getSelectedNoGoList();

  const [noGoWallsLayer] = useState(
    new VectorLayer({
      source: new VectorSource({
        wrapX: false,
      }),
      style: nogoZonesStyle,
    }),
  );

  const isNoGoWallSelected = (mssid: number) =>
    selectedNoGoList?.find((current) => current.mssid === +mssid && current.shape === 'wall' && current.type === 'vw');

  useEffect(() => {
    if (!map) return;
    map.addLayer(noGoWallsLayer);
    noGoWallsLayer.setZIndex(ZIndex || 0);
    noGoWallsLayer.set('id', 'NoGoWallsLayer');
    return () => {
      map.removeLayer(noGoWallsLayer);
    };
  }, [map]);

  useEffect(() => {
    noGoWallsLayer.getSource()?.clear();
    noGoWallsLayer.getSource()?.addFeatures(
      formatNoGoSubset(selectedNoGoWallsList, nogoSubset).map(
        ({ value, mssid, type }) =>
          new Feature({
            geometry: new Polygon([
              // need to add the PixelRatio as an offset to Y
              value.map((current) => [getCoordinates(+current[0], 'x'), getCoordinates(+current[1], 'y') + PixelRatio]),
            ]),
            mssid,
            type,
          }),
      ),
    );
  }, [selectedNoGoWallsList]);

  useEffect(() => {
    noGoWallsLayer
      .getSource()
      ?.getFeatures()
      .forEach((feature) => {
        feature.setStyle(isNoGoWallSelected(feature.get('mssid')) ? selectedNoGoStyle : nogoZonesStyle);
      });
  }, [selectedNoGoList]);

  return null;
};

export default NoGoWallsLayer;
