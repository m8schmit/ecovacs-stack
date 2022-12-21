import { MapBrowserEvent } from 'ol';
import { FC, useContext, useEffect } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { resetSelectedRoomsList, updateSelectedRoomsList } from '../../../store/vacuum/mapSlice';
import { MapContext } from '../../UI/Map/MapContex';
import { InteractionProps } from '../Layers/Layer.type';

const SelectRoomInteraction: FC<InteractionProps> = ({ isInteractable }) => {
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

    isInteractable ? map.on('click', selectRoom) : map.un('click', selectRoom);
    return () => {
      map.un('click', selectRoom);
      dispatch(resetSelectedRoomsList());
    };
  }, [map, isInteractable]);
  return null;
};

export default SelectRoomInteraction;
