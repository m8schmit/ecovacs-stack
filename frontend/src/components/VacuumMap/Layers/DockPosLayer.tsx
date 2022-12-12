import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { FC, useContext, useEffect, useState } from 'react';
import { getVacuumPos } from '../../../store/vacuum/mapSlice';

import { CHARGING_DOCK_ICON, getCoordinates } from '../Map.utils';
import { MapContext } from '../Map/MapContex';
import { LayerProps } from './Layer.type';

const DockPosLayer: FC<LayerProps> = ({ projection, ZIndex }) => {
  const map = useContext(MapContext);
  const dockPosition = getVacuumPos('dock');

  const [dockPosLayer] = useState<VectorLayer<VectorSource<Point>>>(
    new VectorLayer({
      extent: projection && projection.getExtent(),
      source: new Vector({
        features: [
          new Feature({
            geometry: new Point([getCoordinates(dockPosition.x, 'x'), getCoordinates(dockPosition.y, 'y')]),
            finished: false,
            name: 'Charging dock',
          }),
        ],
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          scale: 0.5,
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: `data:image/png;base64,${CHARGING_DOCK_ICON}`,
        }),
      }),
    }),
  );

  useEffect(() => {
    if (!map) return;

    map.addLayer(dockPosLayer);
    dockPosLayer.setZIndex(ZIndex || 0);
    return () => {
      map && map.removeLayer(dockPosLayer);
    };
  }, [map]);

  useEffect(() => {
    dockPosLayer
      .getSource()
      ?.getFeatures()[0]
      .setGeometry(new Point([getCoordinates(dockPosition.x, 'x'), getCoordinates(dockPosition.y, 'y')]));
  }, [dockPosition]);

  return null;
};

export default DockPosLayer;
