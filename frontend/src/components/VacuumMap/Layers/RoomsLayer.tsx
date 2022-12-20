import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { FC, useContext, useEffect, useState } from 'react';

import { getMapSubsetsList, getSelectedRoomsList } from '../../../store/vacuum/mapSlice';
import getRandomColor from '../../../utils/colors.utils';
import { getCoordinates, PixelRatio } from '../Map.utils';
import { MapContext } from '../../UI/Map/MapContex';
import { LayerProps } from './Layer.type';

const RoomsLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const [roomsLayer] = useState<VectorLayer<VectorSource<Polygon>>>(new VectorLayer());
  const selectedRoomsList = getSelectedRoomsList();
  const mapSubsetsList = getMapSubsetsList();

  const isRoomSelected = (mssid: number) => selectedRoomsList?.find((current) => +current === +mssid) !== undefined;

  useEffect(() => {
    if (!map) return;

    map.addLayer(roomsLayer);
    roomsLayer.setZIndex(ZIndex || 0);
    return () => {
      map && map.removeLayer(roomsLayer);
    };
  }, [map]);

  useEffect(() => {
    roomsLayer.setSource(
      new Vector({
        features: mapSubsetsList.map(
          ({ value, mssid, name, subtype }) =>
            new Feature({
              geometry: new Polygon([
                // need to add the PixelRatio as an offset to Y
                value.map((current) => [
                  getCoordinates(+current[0], 'x'),
                  getCoordinates(+current[1], 'y') + PixelRatio,
                ]),
              ]),
              name: name ? name : `Room ${mssid}`,
              mssid,
              subtype,
            }),
        ),
      }),
    );
  }, [mapSubsetsList]);

  useEffect(() => {
    roomsLayer
      .getSource()
      ?.getFeatures()
      .forEach((feature, index) => {
        feature.setStyle(
          new Style({
            stroke: new Stroke({
              color: getRandomColor(index, isRoomSelected(feature.get('mssid')) ? 0.8 : 0.5),
              width: 2,
            }),
            fill: new Fill({
              color: getRandomColor(index, isRoomSelected(feature.get('mssid')) ? 0.8 : 0.5),
            }),
          }),
        );
      });
  }, [selectedRoomsList, roomsLayer?.getSource()]);

  return null;
};

export default RoomsLayer;
