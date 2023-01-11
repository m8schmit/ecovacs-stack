import { MapBrowserEvent } from 'ol';
import { FC, useContext, useEffect } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { resetSelectedNoGoList, updateSelectedNoGoList } from '../../../store/vacuum/editMapSlice';
import { MapContext } from '../../UI/Map/MapContex';

interface SelectNoGoInteractionProps {
  selectMulti?: boolean;
}
const SelectNoGoInteraction: FC<SelectNoGoInteractionProps> = ({ selectMulti = false }) => {
  const map = useContext(MapContext);
  const dispatch = useAppDispatch();

  const selectNoGo = (event: MapBrowserEvent<any>) => {
    if (!map) return;

    map.forEachFeatureAtPixel(event.pixel, (feature) => {
      const mssid = feature.get('mssid');
      const type = feature.get('type');
      const shape = (feature.getGeometry() as any)?.getCoordinates()[0].length === 4 ? 'zone' : 'wall';

      if (mssid && type) {
        if (!selectMulti) {
          dispatch(resetSelectedNoGoList());
        }
        dispatch(updateSelectedNoGoList({ mssid: +mssid, type, shape }));
      }
    });
  };

  useEffect(() => {
    if (!map) return;

    map.on('click', selectNoGo);
    return () => {
      map.un('click', selectNoGo);
      dispatch(resetSelectedNoGoList());
    };
  }, [map]);
  return null;
};

export default SelectNoGoInteraction;
