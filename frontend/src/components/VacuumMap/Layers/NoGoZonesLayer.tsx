import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { getNoGoSubset, getSelectedNoGoList } from '../../../store/vacuum/editMapSlice';
import { getNoGoZoneMapSubsetsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { getCoordinates, PixelRatio } from '../Map.utils';
import { formatNoGoSubset, nogoZonesStyle, selectedNoGoStyle } from '../NoGo.utils';
import { LayerProps } from './Layer.type';

const NoGoZonesLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const selectedNoGoZonesList = getNoGoZoneMapSubsetsList();
  const nogoSubset = getNoGoSubset();
  const selectedNoGoList = getSelectedNoGoList();

  const [noGozonesLayer] = useState(
    new VectorLayer({
      source: new VectorSource({
        wrapX: false,
      }),
      style: nogoZonesStyle,
    }),
  );

  const isGoZoneSelected = (mssid: number) =>
    selectedNoGoList?.find((current) => current.mssid === +mssid && current.shape === 'zone' && current.type === 'vw');

  useEffect(() => {
    if (!map) return;
    map.addLayer(noGozonesLayer);
    noGozonesLayer.setZIndex(ZIndex || 0);
    noGozonesLayer.set('id', 'NoGozonesLayer');
    return () => {
      map.removeLayer(noGozonesLayer);
    };
  }, [map]);

  useEffect(() => {
    noGozonesLayer.getSource()?.clear();
    noGozonesLayer.getSource()?.addFeatures(
      formatNoGoSubset(selectedNoGoZonesList, nogoSubset).map(
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
  }, [selectedNoGoZonesList, nogoSubset]);

  useEffect(() => {
    noGozonesLayer
      .getSource()
      ?.getFeatures()
      .forEach((feature) => {
        feature.setStyle(isGoZoneSelected(feature.get('mssid')) ? selectedNoGoStyle : nogoZonesStyle);
      });
  }, [selectedNoGoList]);

  return null;
};

export default NoGoZonesLayer;
