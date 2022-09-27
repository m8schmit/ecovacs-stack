import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { useAppSelector } from '../hooks';
import { RawSchedules, Schedules } from './commands.schedules.type';
import {
  AutoEmptyState,
  BatteryState,
  ChargeState,
  CleanState,
  Devices,
  DevicesCoordinates,
  DevicesPayload,
  LocationState,
  MapSubSet,
  MapTracesList,
  VacuumingOptionState,
} from './vacuumSlice.type';

interface VacuumState {
  selectedRoomsList: number[];
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
  battery: BatteryState;
  status: CleanState;
  chargeState: ChargeState;
  autoEmpty: AutoEmptyState;
  vacuumingOption: VacuumingOptionState;
  schedulesList: Schedules[];
  locationState: LocationState;
}

const initialState: VacuumState = {
  selectedRoomsList: [],
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
  battery: {
    level: 0,
    isLow: false,
  },
  status: {
    state: 'idle',
    cleanState: {},
  },
  chargeState: {
    isCharging: false,
  },
  autoEmpty: {
    active: false,
    enable: false,
  },
  vacuumingOption: {
    speed: 0,
    count: 1,
  },
  schedulesList: [],
  locationState: {
    isLoading: false,
    isInvalid: false,
  },
};

export const vacuumSlice = createSlice({
  name: 'vacuum',
  initialState,
  reducers: {
    setVacuumMap: (state, action: PayloadAction<{ image: string; id: string }>) => ({
      ...state,
      map: { ...state.map, data: action.payload.image, id: action.payload.id },
    }),
    setVacuumState: (state, action: PayloadAction<CleanState>) => {
      return {
        ...state,
        status: action.payload,
        // cleanTask,
      };
    },
    setVacuumPos: (state, { payload: { device, devicesCoordinates } }: PayloadAction<DevicesPayload>) => ({
      ...state,
      position: { ...state.position, [device]: devicesCoordinates },
      locationState:
        device === 'bot'
          ? { ...state.locationState, isInvalid: !!devicesCoordinates.invalid }
          : { ...state.locationState },
    }),
    setVacuumBattery: (state, action: PayloadAction<BatteryState>) => ({
      ...state,
      battery: action.payload,
    }),
    setChargeState: (state, action: PayloadAction<ChargeState>) => ({
      ...state,
      chargeState: { ...action.payload, isCharging: !!+action.payload.isCharging },
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
    resetSelectedRoomsList: (state) => {
      return {
        ...state,
        selectedRoomsList: initialState.selectedRoomsList,
      };
    },
    setAutoEmpty: (state, action: PayloadAction<Partial<AutoEmptyState>>) => ({
      ...state,
      autoEmpty: {
        ...state.autoEmpty,
        ...action.payload,
      },
    }),
    setVacuumingOption: (state, action: PayloadAction<Partial<VacuumingOptionState>>) => ({
      ...state,
      vacuumingOption: {
        ...state.vacuumingOption,
        ...action.payload,
      },
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
    incrementMapTracesListUpdateIndex: (state) => ({
      ...state,
      mapTracesList: { ...state.mapTracesList, updateIndex: state.mapTracesList.updateIndex + 200 },
    }),
    resetMapTracesListUpdateIndex: (state) => ({
      ...state,
      mapTracesList: { ...state.mapTracesList, updateIndex: initialState.mapTracesList.updateIndex },
    }),
    setSchedulesList: (state, action: PayloadAction<RawSchedules[]>) => ({
      ...state,
      schedulesList: action.payload.map((current) => ({
        ...current,
        enable: !!+current.enable,
        content: { ...current.content, jsonStr: JSON.parse(current.content.jsonStr) },
      })),
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
  setVacuumState,
  setVacuumPos,
  setVacuumBattery,
  setChargeState,
  setMapSubsetsList,

  updateSelectedRoomsList,
  resetSelectedRoomsList,

  setAutoEmpty,
  setVacuumingOption,
  setMapTracesList,
  incrementMapTracesListUpdateIndex,
  resetMapTracesListUpdateIndex,
  setSchedulesList,
  setLocationState,
  onRelocateSuccess,
} = vacuumSlice.actions;

export const getVacuumMap = () => useAppSelector(({ vacuum }) => vacuum.map);
export const getVacuumClean = () => useAppSelector(({ vacuum }) => vacuum.status);
export const getVacuumPos = (device: Devices) => useAppSelector(({ vacuum }) => vacuum.position[device]);
export const getVacuumBattery = () => useAppSelector(({ vacuum }) => vacuum.battery);
export const getChargeState = () => useAppSelector(({ vacuum }) => vacuum.chargeState);
export const getMapSubsetsList = () => useAppSelector(({ vacuum }) => vacuum.mapSubsetsList);
export const getSelectedRoomsList = () => useAppSelector(({ vacuum }) => vacuum.selectedRoomsList);
export const getAutoEmptyState = () => useAppSelector(({ vacuum }) => vacuum.autoEmpty);
export const getVacuumingOption = () => useAppSelector(({ vacuum }) => vacuum.vacuumingOption);
export const getMapTracesList = () => useAppSelector(({ vacuum }) => vacuum.mapTracesList);
export const geSchedulesList = () => useAppSelector(({ vacuum }) => vacuum.schedulesList);
export const getLocationState = () => useAppSelector(({ vacuum }) => vacuum.locationState);
