import { MapBrowserEvent } from 'ol';
import { useContext, useEffect } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { updateSelectedRoomsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';

const SelectRoomInteraction = () => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();

  const selectRoom = (event: MapBrowserEvent<any>) => {
    if (!map) return;

    map.forEachFeatureAtPixel(event.pixel, (feature) => {
      const mssid = feature.get('mssid');
      mssid && dispatch(updateSelectedRoomsList(+mssid));
    });
  };

  useEffect(() => {
    if (!map) return;

    map.on('click', selectRoom);
    return () => {
      map.un('click', selectRoom);
    };
  }, [map]);
  return null;
};

export default SelectRoomInteraction;
