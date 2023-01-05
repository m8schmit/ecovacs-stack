import Draw, { createBox, DrawEvent } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { updateSelectedZonesList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { setCoordinates } from '../Map.utils';

const SelectZonesInteraction = () => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();
  let isLoaded = false;

  const [zonesDrawer, setZonesDrawer] = useState<Draw | undefined>();

  //todo send real coordinates
  // const drawNewZone = (event: any) => {
  //   const coordinates = event.feature.getGeometry().getCoordinates() || [];
  //   console.log('no go', coordinates);

  //   // coordinates.length && dispatch(setNo(coordinate));
  // };
  const drawNewZone = (event: DrawEvent) => {
    const extend = event.feature.getGeometry()?.getExtent();
    const coordinate = extend !== undefined ? setCoordinates(extend) : [];
    coordinate.length && dispatch(updateSelectedZonesList(coordinate));
  };

  useEffect(() => {
    if (!map || isLoaded) return;
    map.getAllLayers().forEach((layer) => {
      if (layer.get('id') === 'SelectedZonesLayer') {
        const source = layer.getSource() as VectorSource;
        if (source) {
          const initialDrawer = new Draw({
            source,
            type: 'Circle',
            stopClick: true,
            geometryFunction: createBox(),
          });

          map.addInteraction(initialDrawer);
          setZonesDrawer(initialDrawer);
          isLoaded = true;
        }
      }
    });
  }, [map]);

  useEffect(() => {
    if (!zonesDrawer) return;
    zonesDrawer.on('drawend', drawNewZone);
    return () => {
      zonesDrawer.un('drawend', drawNewZone);
      map && map.removeInteraction(zonesDrawer);
    };
  }, [zonesDrawer]);

  return null;
};

export default SelectZonesInteraction;
