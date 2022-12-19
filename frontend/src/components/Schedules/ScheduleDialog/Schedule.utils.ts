import { MapSubSet } from '../../../store/vacuum/mapSlice.type';
import { DaysList } from '../Schedule.type';

export const daysList: DaysList[] = [
  {
    value: 'sun',
    label: 'Sunday',
  },
  {
    value: 'mon',
    label: 'Monday',
  },
  {
    value: 'tue',
    label: 'Tuesday',
  },
  {
    value: 'wed',
    label: 'Wednesday',
  },
  {
    value: 'thu',
    label: 'Thurday',
  },
  {
    value: 'fri',
    label: 'friday',
  },
  {
    value: 'sat',
    label: 'Saturday',
  },
];

const getMapSubsetbyId = (mssid: string, mapSubsetsList: MapSubSet[]) =>
  mapSubsetsList.find(({ mssid: currentMssid }) => currentMssid === mssid);

export const getSubsetName = (mssid: string, mapSubsetsList: MapSubSet[]) => {
  const subset = getMapSubsetbyId(mssid, mapSubsetsList);
  if (!subset || !subset.name) {
    return `Room ${mssid}`;
  }
  return subset.name;
};
