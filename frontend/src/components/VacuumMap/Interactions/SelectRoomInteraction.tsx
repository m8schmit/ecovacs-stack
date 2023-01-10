import { MapBrowserEvent } from 'ol';
import { FC, useContext, useEffect } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { resetSelectedRoomsList, updateSelectedRoomsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
interface SelectRoomInteractionProps {
  selectMulti?: boolean;
}
const SelectRoomInteraction: FC<SelectRoomInteractionProps> = ({ selectMulti = true }) => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();

  const selectRoom = (event: MapBrowserEvent<any>) => {
    if (!map) return;

    map.forEachFeatureAtPixel(event.pixel, (feature) => {
      const mssid = feature.get('mssid');
      if (mssid) {
        if (!selectMulti) {
          dispatch(resetSelectedRoomsList());
        }
        dispatch(updateSelectedRoomsList(+mssid));
      }
    });
  };

  useEffect(() => {
    if (!map) return;

    map.on('click', selectRoom);
    return () => {
      map.un('click', selectRoom);
      dispatch(resetSelectedRoomsList());
    };
  }, [map]);
  return null;
};

export default SelectRoomInteraction;
