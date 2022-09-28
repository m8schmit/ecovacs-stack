import { StaticDatePicker } from '@mui/x-date-pickers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { useAppSelector } from '../hooks';
import { RawSchedules, Schedules } from './commands.schedules.type';
import {
  AutoEmptyState,
  BatteryState,
  ChargeState,
  CleanState,
  MoppingOptionsState,
  VacuumingOptionState,
} from './vacuumSlice.type';

interface VacuumState {
  battery: BatteryState;
  status: CleanState;
  chargeState: ChargeState;
  autoEmpty: AutoEmptyState;
  vacuumingOption: VacuumingOptionState;
  schedulesList: Schedules[];
  moppingOptions: MoppingOptionsState;
}

const initialState: VacuumState = {
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
  moppingOptions: {
    amount: 1,
    sweepType: 1,
  },
  schedulesList: [],
};

export const vacuumSlice = createSlice({
  name: 'vacuum',
  initialState,
  reducers: {
    setVacuumState: (state, action: PayloadAction<CleanState>) => {
      return {
        ...state,
        status: action.payload,
      };
    },
    setVacuumBattery: (state, action: PayloadAction<BatteryState>) => ({
      ...state,
      battery: action.payload,
    }),
    setChargeState: (state, action: PayloadAction<ChargeState>) => ({
      ...state,
      chargeState: { ...action.payload, isCharging: !!+action.payload.isCharging },
    }),
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
    setMoppingOption: (state, action: PayloadAction<Partial<MoppingOptionsState>>) => ({
      ...state,
      moppingOptions: {
        ...state.moppingOptions,
        ...action.payload,
      },
    }),
    setSchedulesList: (state, action: PayloadAction<RawSchedules[]>) => ({
      ...state,
      schedulesList: action.payload.map((current) => ({
        ...current,
        enable: !!+current.enable,
        content: { ...current.content, jsonStr: JSON.parse(current.content.jsonStr) },
      })),
    }),
  },
});

export const { setVacuumState, setVacuumBattery, setChargeState, setAutoEmpty, setSchedulesList, setVacuumingOption } =
  vacuumSlice.actions;

export const getVacuumClean = () => useAppSelector(({ vacuum }) => vacuum.status);
export const getVacuumBattery = () => useAppSelector(({ vacuum }) => vacuum.battery);
export const getChargeState = () => useAppSelector(({ vacuum }) => vacuum.chargeState);
export const getAutoEmptyState = () => useAppSelector(({ vacuum }) => vacuum.autoEmpty);
export const getVacuumingOption = () => useAppSelector(({ vacuum }) => vacuum.vacuumingOption);
export const getMoppingOption = () => useAppSelector(({ vacuum }) => vacuum.moppingOptions);
export const geSchedulesList = () => useAppSelector(({ vacuum }) => vacuum.schedulesList);
