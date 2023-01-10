import { Feature } from 'ol';
import { MultiPoint, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Vector from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import { FC, useContext, useEffect, useState } from 'react';

import { getMapSubsetsList } from '../../../store/vacuum/mapSlice';
import { RoomType } from '../../../store/vacuum/mapSlice.type';
import getRandomColor from '../../../utils/colors.utils';
import { getSubsetName } from '../../../utils/subset.utils';
import { MapContext } from '../../UI/Map/MapContex';
import { getCoordinates, ROOM_TYPE_V2 } from '../Map.utils';
import { LayerProps } from './Layer.type';

const LabelsLayer: FC<LayerProps> = ({ projection, ZIndex }) => {
  const map = useContext(MapContext);
  const mapSubsetsList = getMapSubsetsList();
  const [labelsLayer] = useState<VectorLayer<VectorSource<MultiPoint>>>(
    new VectorLayer({
      extent: projection && projection.getExtent(),
      source: new Vector({
        features: [
          new Feature({
            geometry: new MultiPoint(
              mapSubsetsList.map(({ center }) => [
                getCoordinates(+center.split(',')[0], 'x'),
                getCoordinates(+center.split(',')[1], 'y'),
              ]),
            ),
          }),
        ],
      }),
    }),
  );

  useEffect(() => {
    if (!map) return;

    map.addLayer(labelsLayer);
    labelsLayer.setZIndex(ZIndex || 0);
    return () => {
      map && map.removeLayer(labelsLayer);
    };
  }, [map]);

  useEffect(() => {
    labelsLayer
      .getSource()
      ?.getFeatures()[0]
      .setGeometry(
        new MultiPoint(
          mapSubsetsList.map(({ center }) => [
            getCoordinates(+center.split(',')[0], 'x'),
            getCoordinates(+center.split(',')[1], 'y'),
          ]),
        ),
      );

    labelsLayer.setStyle(
      mapSubsetsList.map(
        ({ center, mssid, subtype }) =>
          new Style({
            image: new Icon({
              anchor: [0.5, 0.5],
              scale: 0.4,
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              src: `data:image/png;base64,${ROOM_TYPE_V2[+subtype as RoomType]}`,
              // opacity: 0.9,
              color: getRandomColor(+mssid),
            }),
            text: new Text({
              text: getSubsetName(mssid, mapSubsetsList),
              offsetY: 25,
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
            }),
            geometry: new Point([
              getCoordinates(+center.split(',')[0], 'x'),
              getCoordinates(+center.split(',')[1], 'y'),
            ]),
          }),
      ),
    );
  }, [mapSubsetsList]);

  return null;
};

export default LabelsLayer;
