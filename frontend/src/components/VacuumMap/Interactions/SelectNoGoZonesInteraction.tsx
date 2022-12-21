import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import Draw, { createBox, DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { FC, useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { getNoMopMapSubsetsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { InteractionProps, LayerProps } from '../Layers/Layer.type';
import { getCoordinates, PixelRatio, setCoordinates } from '../Map.utils';

const SelectNoGoZonesInteraction: FC<LayerProps & InteractionProps> = ({ ZIndex, isInteractable }) => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();
  //todo move to ZONE
  const selectedNoGoZonesList = getNoMopMapSubsetsList();

  const source = new VectorSource({
    wrapX: false,
  });

  const NoGozonesDrawer = new Draw({
    source,
    type: 'Circle',
    stopClick: true,
    geometryFunction: createBox(),
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.3)',
      }),
    }),
  });

  const [NoGozonesLayer] = useState(
    new VectorLayer({
      source,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 1)',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.3)',
        }),
      }),
    }),
  );

  // TODO find the right type, geometry in drawend doesnt contain `getcoordinates()`
  const drawNewZone = (event: any) => {
    console.log('here');
    const coordinates = event.feature.getGeometry().getCoordinates() || [];
    console.log('no go', event.feature.getGeometry().getCoordinates());

    // coordinates.length && dispatch(setNo(coordinate));
  };

  useEffect(() => {
    if (!map) return;
    map.addLayer(NoGozonesLayer);
    NoGozonesLayer.setZIndex(ZIndex || 0);
    isInteractable ? map.addInteraction(NoGozonesDrawer) : map.removeInteraction(NoGozonesDrawer);

    return () => {
      map.removeInteraction(NoGozonesDrawer);
      map.removeLayer(NoGozonesLayer);
    };
  }, [map, isInteractable]);

  useEffect(() => {
    if (!NoGozonesDrawer) return;
    NoGozonesDrawer.on('drawend', drawNewZone);
    return () => {
      NoGozonesDrawer.un('drawend', drawNewZone);
    };
  }, []);

  // useEffect(() => {
  //   NoGozonesLayer.getSource()?.clear();
  //   NoGozonesLayer.getSource()?.addFeatures(
  //     selectedNoGoZonesList.map(
  //       ({ value }) =>
  //         new Feature({
  //           geometry: new Polygon([
  //             // need to add the PixelRatio as an offset to Y
  //             value.map((current) => [getCoordinates(+current[0], 'x'), getCoordinates(+current[1], 'y') + PixelRatio]),
  //           ]),
  //         }),
  //     ),
  //   );
  // }, [selectedNoGoZonesList]);

  return null;
};

export default SelectNoGoZonesInteraction;
