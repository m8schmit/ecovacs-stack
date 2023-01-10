import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Extent } from 'ol/extent';

import { useAppSelector } from '../hooks';
import {
  AiMapObstacle,
  Devices,
  DevicesCoordinates,
  DevicesPayload,
  LocationState,
  MapSubSet,
  MapTracesList,
  SelectionType,
  ZoneMapSubset,
} from './mapSlice.type';

interface MapState {
  selectedRoomsList: number[];
  selectedZonesList: Extent[];
  goToCoordinates: Extent;
  selectionType: SelectionType;
  map: {
    isLoading: boolean;
    isFetching: boolean;
    data: string | null;
    id: string | null;
  };
  mapSubsetsList: MapSubSet[];
  noMopMapSubsetsList: ZoneMapSubset[];
  noGoMapSubsetsList: ZoneMapSubset[];
  mapTracesList: MapTracesList;
  obstaclesList: AiMapObstacle[];
  position: {
    dock: DevicesCoordinates;
    bot: DevicesCoordinates;
  };
  locationState: LocationState;
}

const initialState: MapState = {
  selectedRoomsList: [],
  selectedZonesList: [],
  goToCoordinates: [],
  selectionType: 'room',
  map: {
    isLoading: true,
    isFetching: false,
    data: null,
    id: null,
  },
  mapSubsetsList: [],
  noMopMapSubsetsList: [],
  noGoMapSubsetsList: [],
  mapTracesList: {
    updateIndex: 0,
    totalCount: 0,
    newEntriesList: [],
  },
  obstaclesList: [],
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

    setNoMopMapSubsetsList: (state, action: PayloadAction<ZoneMapSubset>) => ({
      ...state,
      noMopMapSubsetsList: [
        ...state.noMopMapSubsetsList.filter((mapSubset) => mapSubset.mssid !== action.payload.mssid),
        action.payload,
      ],
    }),
    setNoGoMapSubsetsList: (state, action: PayloadAction<ZoneMapSubset>) => ({
      ...state,
      noGoMapSubsetsList: [
        ...state.noGoMapSubsetsList.filter((mapSubset) => mapSubset.mssid !== action.payload.mssid),
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
    setSelectedRoomsList: (state, action: PayloadAction<number[]>) => ({
      ...state,
      selectedRoomsList: action.payload,
    }),
    setSelectedZonesList: (state, action: PayloadAction<Extent[]>) => ({
      ...state,
      selectedZonesList: action.payload,
    }),
    setGoToCoordinates: (state, action: PayloadAction<Extent>) => {
      return {
        ...state,
        goToCoordinates: action.payload,
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

    resetGoToCoordinates: (state) => {
      return {
        ...state,
        goToCoordinates: initialState.goToCoordinates,
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

    setObstaclesList: (state, action: PayloadAction<AiMapObstacle[]>) => ({
      ...state,
      obstaclesList: action.payload,
    }),
  },
});

export const {
  setVacuumMap,
  setVacuumPos,
  setMapSubsetsList,
  setNoMopMapSubsetsList,
  setNoGoMapSubsetsList,

  updateSelectedRoomsList,
  setSelectedRoomsList,
  resetSelectedRoomsList,

  updateSelectedZonesList,
  setSelectedZonesList,
  resetSelectedZonesList,

  setGoToCoordinates,
  resetGoToCoordinates,

  setSelectionType,
  setMapTracesList,
  incrementMapTracesListUpdateIndex,
  resetMapTracesList,
  resetMapTracesListUpdateIndex,

  setLocationState,
  onRelocateSuccess,

  setObstaclesList,
} = mapSlice.actions;

export const getVacuumMap = () => useAppSelector(({ map }) => map.map);

export const getLocationState = () => useAppSelector(({ map }) => map.locationState);
export const getMapTracesList = () => useAppSelector(({ map }) => map.mapTracesList);
export const getVacuumPos = (device: Devices) => useAppSelector(({ map }) => map.position[device]);

export const getMapSubsetsList = () => useAppSelector(({ map }) => map.mapSubsetsList);
export const getNoMopZoneMapSubsetsList = () =>
  useAppSelector(({ map }) => map.noMopMapSubsetsList.filter(({ value }) => value.length === 4));
export const getNoMopWallMapSubsetsList = () =>
  useAppSelector(({ map }) => map.noMopMapSubsetsList.filter(({ value }) => value.length === 2));
export const getNoGoMapSubsetsList = () => useAppSelector(({ map }) => map.noGoMapSubsetsList);

export const getSelectedRoomsList = () => useAppSelector(({ map }) => map.selectedRoomsList);
export const getSelectedZonesList = () => useAppSelector(({ map }) => map.selectedZonesList);
export const getGoToCoordinates = () => useAppSelector(({ map }) => map.goToCoordinates);
export const getSelectionType = () => useAppSelector(({ map }) => map.selectionType);

export const getObstaclesList = () => useAppSelector(({ map }) => map.obstaclesList);
