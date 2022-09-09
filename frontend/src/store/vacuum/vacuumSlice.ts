import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { useAppSelector } from '../hooks';
import {
  BatteryState,
  ChargeState,
  CleanState,
  Devices,
  DevicesCoordinates,
  DevicesPayload,
  MapSubSet,
} from './vacuumSlice.type';

interface VacuumState {
  selectedRoomsList: number[];
  map: {
    isLoading: boolean;
    isFetching: boolean;
    data: string | null;
  };
  mapSubsetsList: MapSubSet[];
  position: {
    dock: DevicesCoordinates;
    bot: DevicesCoordinates;
  };
  battery: BatteryState;
  status: CleanState;
  chargeState: ChargeState;
}

const initialState: VacuumState = {
  selectedRoomsList: [],
  map: {
    isLoading: true,
    isFetching: false,
    data: null,
  },
  mapSubsetsList: [],
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
};

export const vacuumSlice = createSlice({
  name: 'vacuum',
  initialState,
  reducers: {
    setVacuumMap: (state, action: PayloadAction<string>) => ({
      ...state,
      map: { ...state.map, data: action.payload },
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
        ...state.mapSubsetsList.filter((mapSubset) => mapSubset.seqIndex === action.payload.seqIndex),
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
} = vacuumSlice.actions;

export const getVacuumMap = () => useAppSelector(({ vacuum }) => vacuum.map);
export const getVacuumClean = () => useAppSelector(({ vacuum }) => vacuum.status);
export const getVacuumPos = (device: Devices) => useAppSelector(({ vacuum }) => vacuum.position[device]);
export const getVacuumBattery = () => useAppSelector(({ vacuum }) => vacuum.battery);
export const getChargeState = () => useAppSelector(({ vacuum }) => vacuum.chargeState);
export const getMapSubsetsList = () => useAppSelector(({ vacuum }) => vacuum.mapSubsetsList);
export const getSelectedRoomsList = () => useAppSelector(({ vacuum }) => vacuum.selectedRoomsList);
