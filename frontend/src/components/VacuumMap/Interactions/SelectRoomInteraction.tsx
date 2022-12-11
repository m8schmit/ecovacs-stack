import { MapBrowserEvent } from 'ol';
import { useContext, useEffect } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { updateSelectedRoomsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../Map/MapContex';

const SelectRoomInteraction = () => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();

  const selectRoom = (event: MapBrowserEvent<any>) => {
    if (!map) return;

    const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
    // TODO find a better way to get mssid
    const featureName = feature?.get('name');
    console.log('clicked on ', feature, feature?.get('name'), event);
    if (featureName) {
      const mssid = +featureName.split(' ')[1];
      dispatch(updateSelectedRoomsList(mssid));
    }
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
