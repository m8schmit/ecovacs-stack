import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { shallowEqual } from 'react-redux';

import { getformattedDNDDate } from '../../utils/dnd.utils';
import { useAppSelector } from '../hooks';
import { RawSchedules, Schedules } from './commands.schedules.type';
import {
  AutoEmptyState,
  BatteryState,
  ChargeState,
  CleanState,
  DoNotDisturbState,
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
  doNotDisturb: DoNotDisturbState;
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
    enable: false,
    amount: 1,
    sweepType: 1,
  },
  schedulesList: [],
  doNotDisturb: {
    enable: false,
    start: dayjs().format(),
    end: dayjs().format(),
  },
};

export const stateSlice = createSlice({
  name: 'state',
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
    setDoNotDisturb: (state, action: PayloadAction<DoNotDisturbState>) => ({
      ...state,
      doNotDisturb: {
        ...state.doNotDisturb,
        ...action.payload,
        start: getformattedDNDDate(action.payload.start).format(),
        end: getformattedDNDDate(action.payload.end, action.payload.start).format(),
      },
    }),
  },
});

export const {
  setVacuumState,
  setVacuumBattery,
  setChargeState,
  setAutoEmpty,
  setSchedulesList,
  setVacuumingOption,
  setMoppingOption,
  setDoNotDisturb,
} = stateSlice.actions;

export const getVacuumClean = () => useAppSelector(({ state }) => state.status, shallowEqual);
export const getVacuumBattery = () => useAppSelector(({ state }) => state.battery, shallowEqual);
export const getChargeState = () => useAppSelector(({ state }) => state.chargeState, shallowEqual);
export const getAutoEmptyState = () => useAppSelector(({ state }) => state.autoEmpty, shallowEqual);
export const getVacuumingOption = () => useAppSelector(({ state }) => state.vacuumingOption, shallowEqual);
export const getMoppingOption = () => useAppSelector(({ state }) => state.moppingOptions, shallowEqual);
export const geSchedulesList = () => useAppSelector(({ state }) => state.schedulesList, shallowEqual);
export const getDoNotDisturb = () => useAppSelector(({ state }) => state.doNotDisturb, shallowEqual);
