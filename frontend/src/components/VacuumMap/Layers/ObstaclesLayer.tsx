import { Feature } from 'ol';
import { MultiPoint, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { FC, useContext, useEffect, useState } from 'react';

import { getObstaclesList } from '../../../store/vacuum/mapSlice';
import { AiMapObstacle } from '../../../store/vacuum/mapSlice.type';
import { getCoordinates, RECOGNIZED_OBJECTS_ICON_LIST } from '../Map.utils';
import { MapContext } from '../../UI/Map/MapContex';
import { LayerProps } from './Layer.type';

const ObstaclesLayer: FC<LayerProps> = ({ projection, ZIndex }) => {
  const map = useContext(MapContext);
  const obstaclesList = getObstaclesList();

  const [obstaclesLayer] = useState<VectorLayer<VectorSource<MultiPoint>>>(
    new VectorLayer({
      extent: projection && projection.getExtent(),
      source: new Vector({
        features: [
          new Feature({
            geometry: new MultiPoint(
              obstaclesList.map((obstacle: AiMapObstacle) => [
                getCoordinates(obstacle.x, 'x'),
                getCoordinates(obstacle.y, 'y'),
              ]),
            ),
          }),
        ],
      }),
    }),
  );

  useEffect(() => {
    if (!map) return;

    map.addLayer(obstaclesLayer);
    obstaclesLayer.setZIndex(ZIndex || 0);
    return () => {
      map && map.removeLayer(obstaclesLayer);
    };
  }, [map]);

  useEffect(() => {
    obstaclesLayer
      .getSource()
      ?.getFeatures()[0]
      .setGeometry(
        new MultiPoint(
          obstaclesList.map((obstacle: AiMapObstacle) => [
            getCoordinates(obstacle.x, 'x'),
            getCoordinates(obstacle.y, 'y'),
          ]),
        ),
      );

    obstaclesLayer.setStyle(
      obstaclesList.map(
        (obstacle: AiMapObstacle) =>
          new Style({
            image: new Icon({
              anchor: [0.5, 0.5],
              scale: 0.5,
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              src: `data:image/png;base64,${RECOGNIZED_OBJECTS_ICON_LIST[obstacle.type]}`,
            }),
            geometry: new Point([getCoordinates(obstacle.x, 'x'), getCoordinates(obstacle.y, 'y')]),
          }),
      ),
    );
  }, [obstaclesList]);

  return null;
};

export default ObstaclesLayer;
