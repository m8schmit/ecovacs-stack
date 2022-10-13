import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { useAppSelector } from '../hooks';
import {
  Devices,
  DevicesCoordinates,
  DevicesPayload,
  LocationState,
  MapSubSet,
  MapTracesList,
  SelectionType,
} from './mapSlice.type';
import { Extent } from 'ol/extent';

interface MapState {
  selectedRoomsList: number[];
  selectedZonesList: Extent[];
  selectionType: SelectionType;
  map: {
    isLoading: boolean;
    isFetching: boolean;
    data: string | null;
    id: string | null;
  };
  mapSubsetsList: MapSubSet[];
  mapTracesList: MapTracesList;
  position: {
    dock: DevicesCoordinates;
    bot: DevicesCoordinates;
  };
  locationState: LocationState;
}

const initialState: MapState = {
  selectedRoomsList: [],
  selectedZonesList: [],
  selectionType: 'room',
  map: {
    isLoading: true,
    isFetching: false,
    data: null,
    id: null,
  },
  mapSubsetsList: [],
  mapTracesList: {
    updateIndex: 0,
    totalCount: 0,
    newEntriesList: [],
  },
  position: {
    dock: {
      x: 0,
      y: 0,
      a: 0,
      invalid: 0,
    },
    bot: {
      x: 0,
      y: 0,
      a: 0,
      invalid: 0,
    },
  },
  locationState: {
    isLoading: false,
    isInvalid: false,
  },
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setVacuumMap: (state, action: PayloadAction<{ image: string; id: string }>) => ({
      ...state,
      map: { ...state.map, data: action.payload.image, id: action.payload.id },
    }),
    setVacuumPos: (state, { payload: { device, devicesCoordinates } }: PayloadAction<DevicesPayload>) => ({
      ...state,
      position: { ...state.position, [device]: devicesCoordinates },
      locationState:
        device === 'bot'
          ? { ...state.locationState, isInvalid: !!devicesCoordinates.invalid }
          : { ...state.locationState },
    }),
    setMapSubsetsList: (state, action: PayloadAction<MapSubSet>) => ({
      ...state,
      mapSubsetsList: [
        ...state.mapSubsetsList.filter((mapSubset) => mapSubset.mssid !== action.payload.mssid),
        action.payload,
      ],
    }),
    updateSelectedRoomsList: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        selectedRoomsList: [
          ...(state.selectedRoomsList?.find((current) => current === action.payload) !== undefined
            ? [...state.selectedRoomsList.filter((current) => current !== action.payload)]
            : [...state.selectedRoomsList, action.payload]),
        ],
      };
    },
    updateSelectedZonesList: (state, action: PayloadAction<Extent>) => {
      return {
        ...state,
        selectedZonesList: [...state.selectedZonesList, action.payload],
      };
    },

    resetSelectedZonesList: (state) => {
      return {
        ...state,
        selectedZonesList: initialState.selectedZonesList,
      };
    },

    resetSelectedRoomsList: (state) => {
      return {
        ...state,
        selectedRoomsList: initialState.selectedRoomsList,
      };
    },

    setSelectionType: (state, action: PayloadAction<SelectionType>) => ({
      ...state,
      selectionType: action.payload,
    }),

    setMapTracesList: (state, action: PayloadAction<MapTracesList>) => ({
      ...state,
      mapTracesList: {
        updateIndex: state.mapTracesList.updateIndex,
        totalCount: action.payload.totalCount,
        newEntriesList: [
          ...state.mapTracesList.newEntriesList.filter(
            (current) =>
              !action.payload.newEntriesList?.map((payloadEntry) => payloadEntry.index).includes(current.index),
          ),
          ...action.payload.newEntriesList,
        ],
      },
    }),
    resetMapTracesList: (state) => ({ ...state, mapTracesList: initialState.mapTracesList }),
    incrementMapTracesListUpdateIndex: (state) => ({
      ...state,
      mapTracesList: { ...state.mapTracesList, updateIndex: state.mapTracesList.updateIndex + 200 },
    }),
    resetMapTracesListUpdateIndex: (state) => ({
      ...state,
      mapTracesList: { ...state.mapTracesList, updateIndex: initialState.mapTracesList.updateIndex },
    }),

    setLocationState: (state, action: PayloadAction<Partial<LocationState>>) => ({
      ...state,
      locationState: { ...state.locationState, ...action.payload },
    }),
    onRelocateSuccess: (state) => ({ ...state, locationState: { isLoading: false, isInvalid: false } }),
  },
});

export const {
  setVacuumMap,
  setVacuumPos,
  setMapSubsetsList,

  updateSelectedRoomsList,
  resetSelectedRoomsList,

  updateSelectedZonesList,
  resetSelectedZonesList,

  setSelectionType,
  setMapTracesList,
  incrementMapTracesListUpdateIndex,
  resetMapTracesList,
  resetMapTracesListUpdateIndex,

  setLocationState,
  onRelocateSuccess,
} = mapSlice.actions;

export const getVacuumMap = () => useAppSelector(({ map }) => map.map);

export const getLocationState = () => useAppSelector(({ map }) => map.locationState);
export const getMapTracesList = () => useAppSelector(({ map }) => map.mapTracesList);
export const getVacuumPos = (device: Devices) => useAppSelector(({ map }) => map.position[device]);

export const getMapSubsetsList = () => useAppSelector(({ map }) => map.mapSubsetsList);
export const getSelectedRoomsList = () => useAppSelector(({ map }) => map.selectedRoomsList);
export const getSelectedZonesList = () => useAppSelector(({ map }) => map.selectedZonesList);
export const getSelectionType = () => useAppSelector(({ map }) => map.selectionType);
