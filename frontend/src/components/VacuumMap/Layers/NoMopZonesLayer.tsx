import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { getNoMopSubset, getSelectedNoGoList } from '../../../store/vacuum/editMapSlice';
import { getNoMopZoneMapSubsetsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { getCoordinates, PixelRatio } from '../Map.utils';
import { formatNoGoSubset, mopZoneStyle, selectedNoGoStyle } from '../NoGo.utils';
import { LayerProps } from './Layer.type';

const NoMopZonesLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const noMopZonesList = getNoMopZoneMapSubsetsList();
  const selectedNoGoList = getSelectedNoGoList();
  const noMopSubset = getNoMopSubset();

  const [noMopzonesLayer] = useState(
    new VectorLayer({
      source: new VectorSource({
        wrapX: false,
      }),
      style: mopZoneStyle,
    }),
  );

  const isMopZoneSelected = (mssid: number) =>
    selectedNoGoList?.find((current) => current.mssid === +mssid && current.shape === 'zone' && current.type === 'mw');

  useEffect(() => {
    if (!map) return;
    map.addLayer(noMopzonesLayer);
    noMopzonesLayer.setZIndex(ZIndex || 0);
    noMopzonesLayer.set('id', 'NoMopzonesLayer');
    return () => {
      map.removeLayer(noMopzonesLayer);
    };
  }, [map]);

  useEffect(() => {
    noMopzonesLayer.getSource()?.clear();
    noMopzonesLayer.getSource()?.addFeatures(
      formatNoGoSubset(noMopZonesList, noMopSubset).map(
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
  }, [noMopZonesList]);

  useEffect(() => {
    noMopzonesLayer
      .getSource()
      ?.getFeatures()
      .forEach((feature) => {
        feature.setStyle(isMopZoneSelected(feature.get('mssid')) ? selectedNoGoStyle : mopZoneStyle);
      });
  }, [selectedNoGoList]);

  return null;
};

export default NoMopZonesLayer;
