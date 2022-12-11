import Draw, { createBox, DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { updateSelectedZonesList } from '../../../store/vacuum/mapSlice';
import { LayerProps } from '../Layers/Layer.type';
import { setCoordinates } from '../Map.utils';
import { MapContext } from '../Map/MapContex';

const SelectZonesInteraction: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();

  const source = new VectorSource({ wrapX: false });

  const zonesDrawer = new Draw({
    source,
    type: 'Circle',
    stopClick: true,
    geometryFunction: createBox(),
  });

  const [zonesLayer] = useState(
    new VectorLayer({
      source,
    }),
  );

  const drawNewZone = (event: DrawEvent) => {
    const extend = event.feature.getGeometry()?.getExtent();
    const coordinate = extend !== undefined ? setCoordinates(extend) : [];
    coordinate.length && dispatch(updateSelectedZonesList(coordinate));
  };

  useEffect(() => {
    if (!map) return;
    map.addLayer(zonesLayer);
    zonesLayer.setZIndex(ZIndex || 0);
    map.addInteraction(zonesDrawer);
    return () => {
      map.removeInteraction(zonesDrawer);
      map.removeLayer(zonesLayer);
    };
  }, [map]);

  useEffect(() => {
    if (!zonesDrawer) return;
    zonesDrawer.on('drawend', drawNewZone);
    return () => zonesDrawer.un('drawend', drawNewZone);
  }, [zonesDrawer]);

  return null;
};

export default SelectZonesInteraction;
