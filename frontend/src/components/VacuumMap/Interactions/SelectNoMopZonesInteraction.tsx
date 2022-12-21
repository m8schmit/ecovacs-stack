import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import Draw, { createBox } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { FC, useContext, useEffect, useState } from 'react';

import { getNoMopMapSubsetsList } from '../../../store/vacuum/mapSlice';
import { WebSocketContext } from '../../../utils/socket.utils';
import { MapContext } from '../../UI/Map/MapContex';
import { InteractionProps, LayerProps } from '../Layers/Layer.type';
import { getCoordinates, PixelRatio } from '../Map.utils';

const SelectNoMopZonesInteraction: FC<LayerProps & InteractionProps> = ({ ZIndex, isInteractable }) => {
  const map = useContext(MapContext);
  // const dispatch = useAppDispatch();
  const selectedNoMopZonesList = getNoMopMapSubsetsList();
  const socket = useContext(WebSocketContext);

  const source = new VectorSource({
    wrapX: false,
  });

  const NoMopzonesDrawer = new Draw({
    source,
    type: 'Circle',
    stopClick: true,
    geometryFunction: createBox(),
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(255, 125, 0, 1)',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(255, 125, 0, 0.3)',
      }),
    }),
  });

  const [NoMopZonesLayer] = useState(
    new VectorLayer({
      source,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(255, 125, 0, 1)',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(255, 125, 0, 0.3)',
        }),
      }),
    }),
  );

  // TODO find the right type, geometry in drawend doesnt contain `getcoordinates()`
  const drawNewZone = (event: any) => {
    const coordinates = event.feature.getGeometry().getCoordinates() || [];

    coordinates.length && console.log('todo add new ?', coordinates);
  };

  useEffect(() => {
    if (!map) return;
    map.addLayer(NoMopZonesLayer);
    NoMopZonesLayer.setZIndex(ZIndex || 0);
    isInteractable ? map.addInteraction(NoMopzonesDrawer) : map.removeInteraction(NoMopzonesDrawer);

    return () => {
      map.removeInteraction(NoMopzonesDrawer);
      map.removeLayer(NoMopZonesLayer);
    };
  }, [map, isInteractable]);

  useEffect(() => {
    if (!NoMopzonesDrawer) return;
    NoMopzonesDrawer.on('drawend', drawNewZone);
    return () => {
      NoMopzonesDrawer.un('drawend', drawNewZone);
    };
  }, []);

  useEffect(() => {
    NoMopZonesLayer.getSource()?.clear();
    NoMopZonesLayer.getSource()?.addFeatures(
      selectedNoMopZonesList.map(
        ({ value }) =>
          new Feature({
            geometry: new Polygon([
              // need to add the PixelRatio as an offset to Y
              value.map((current) => [getCoordinates(+current[0], 'x'), getCoordinates(+current[1], 'y') + PixelRatio]),
            ]),
          }),
      ),
    );
  }, [selectedNoMopZonesList]);

  return null;
};

export default SelectNoMopZonesInteraction;
