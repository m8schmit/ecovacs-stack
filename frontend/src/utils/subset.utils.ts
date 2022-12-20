import { MapSubSet } from '../store/vacuum/mapSlice.type';

const getMapSubsetbyId = (mssid: string, mapSubsetsList: MapSubSet[]) =>
  mapSubsetsList.find(({ mssid: currentMssid }) => currentMssid === mssid);

export const getSubsetName = (mssid: string, mapSubsetsList: MapSubSet[]) => {
  const subset = getMapSubsetbyId(mssid, mapSubsetsList);
  if (!subset || !subset.name) {
    return `Room ${mssid}`;
  }
  return subset.name;
};
