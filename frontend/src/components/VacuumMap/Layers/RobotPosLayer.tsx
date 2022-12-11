import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { FC, useContext, useEffect, useState } from 'react';

import { getVacuumPos } from '../../../store/vacuum/mapSlice';
import { BOT_ICON, getAngle, getCoordinates } from '../Map.utils';
import { MapContext } from '../Map/MapContex';
import { LayerProps } from './Layer.type';

const RobotPosLayer: FC<LayerProps> = ({ projection, ZIndex }) => {
  const map = useContext(MapContext);
  const robotPosition = getVacuumPos('bot');
  const [robotLayerStyle] = useState<Style>(
    new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        scale: 0.5,
        rotation: getAngle(robotPosition.a),
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: `data:image/png;base64,${BOT_ICON}`,
      }),
    }),
  );

  const [robotLayer] = useState<VectorLayer<VectorSource<Point>>>(
    new VectorLayer({
      extent: projection && projection.getExtent(),
      source: new Vector({
        features: [
          new Feature({
            geometry: new Point([getCoordinates(robotPosition.x, 'x'), getCoordinates(robotPosition.y, 'y')]),
            name: 'Vacuum Bot',
          }),
        ],
      }),
      style: robotLayerStyle,
    }),
  );

  useEffect(() => {
    if (!map) return;

    map.addLayer(robotLayer);
    robotLayer.setZIndex(ZIndex || 0);
    console.log('add robotLayer');
    return () => {
      map && map.removeLayer(robotLayer);
    };
  }, [map]);

  useEffect(() => {
    robotLayer
      .getSource()
      ?.getFeatures()[0]
      .setGeometry(new Point([getCoordinates(robotPosition.x, 'x'), getCoordinates(robotPosition.y, 'y')]));
    robotLayerStyle.getImage()?.setRotation(getAngle(robotPosition.a));
  }, [robotPosition]);

  return null;
};

export default RobotPosLayer;
