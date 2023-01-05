import { Feature } from 'ol';
import { fromExtent } from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FC, useContext, useEffect, useState } from 'react';

import { getSelectedZonesList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { getCoordinatesFromExtend } from '../Map.utils';
import { LayerProps } from './Layer.type';

const SelectedZonesLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const selectedZonesList = getSelectedZonesList();

  const [SelectedZonesLayer] = useState(
    new VectorLayer({
      source: new VectorSource({
        wrapX: false,
      }),
    }),
  );

  useEffect(() => {
    if (!map) return;
    map.addLayer(SelectedZonesLayer);
    SelectedZonesLayer.setZIndex(ZIndex || 0);
    SelectedZonesLayer.set('id', 'SelectedZonesLayer');
    return () => {
      map.removeLayer(SelectedZonesLayer);
    };
  }, [map]);

  useEffect(() => {
    console.log('zone source, ', selectedZonesList);
    console.log('  SelectedZonesLayer.getSource()', SelectedZonesLayer.getSource());
    SelectedZonesLayer.getSource()?.clear();
    SelectedZonesLayer.getSource()?.addFeatures(
      selectedZonesList.map(
        (selectedZone) => new Feature({ geometry: fromExtent(getCoordinatesFromExtend(selectedZone)) }),
      ),
    );
  }, [selectedZonesList]);

  return null;
};

export default SelectedZonesLayer;
