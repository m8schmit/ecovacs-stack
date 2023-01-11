import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { getNoMopSubset, getSelectedNoGoList } from '../../../store/vacuum/editMapSlice';
import { getNoMopWallMapSubsetsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { getCoordinates, PixelRatio } from '../Map.utils';
import { formatNoGoSubset, mopZoneStyle, selectedNoGoStyle } from '../NoGo.utils';
import { LayerProps } from './Layer.type';

const NoMopWallsLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const selectedNoMopWallsList = getNoMopWallMapSubsetsList();
  const noMopSubset = getNoMopSubset();
  const selectedNoGoList = getSelectedNoGoList();

  const [noMopWallsLayer] = useState(
    new VectorLayer({
      source: new VectorSource({
        wrapX: false,
      }),
      style: mopZoneStyle,
    }),
  );

  const isMopWallSelected = (mssid: number) =>
    selectedNoGoList?.find((current) => current.mssid === +mssid && current.shape === 'wall' && current.type === 'mw');

  useEffect(() => {
    if (!map) return;
    map.addLayer(noMopWallsLayer);
    noMopWallsLayer.setZIndex(ZIndex || 0);
    noMopWallsLayer.set('id', 'NoMopWallsLayer');
    return () => {
      map.removeLayer(noMopWallsLayer);
    };
  }, [map]);

  useEffect(() => {
    noMopWallsLayer.getSource()?.clear();
    noMopWallsLayer.getSource()?.addFeatures(
      formatNoGoSubset(selectedNoMopWallsList, noMopSubset).map(
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
  }, [selectedNoMopWallsList]);

  useEffect(() => {
    noMopWallsLayer
      .getSource()
      ?.getFeatures()
      .forEach((feature) => {
        feature.setStyle(isMopWallSelected(feature.get('mssid')) ? selectedNoGoStyle : mopZoneStyle);
      });
  }, [selectedNoGoList]);

  return null;
};

export default NoMopWallsLayer;
