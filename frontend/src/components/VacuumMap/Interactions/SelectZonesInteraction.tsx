import { Feature } from 'ol';
import { fromExtent } from 'ol/geom/Polygon';
import Draw, { createBox, DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { getSelectedZonesList, updateSelectedZonesList } from '../../../store/vacuum/mapSlice';
import { LayerProps } from '../Layers/Layer.type';
import { getCoordinatesFromExtend, setCoordinates } from '../Map.utils';
import { MapContext } from '../Map/MapContex';

const SelectZonesInteraction: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();
  const selectedZonesList = getSelectedZonesList();

  const source = new VectorSource({
    wrapX: false,
  });

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
    console.log('here');
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
    return () => {
      zonesDrawer.un('drawend', drawNewZone);
    };
  }, []);

  useEffect(() => {
    zonesLayer.getSource()?.clear();
    zonesLayer
      .getSource()
      ?.addFeatures(
        selectedZonesList.map(
          (selectedZone) => new Feature({ geometry: fromExtent(getCoordinatesFromExtend(selectedZone)) }),
        ),
      );
  }, [selectedZonesList]);

  return null;
};

export default SelectZonesInteraction;
