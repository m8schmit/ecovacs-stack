import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';

type CleanState = 'start' | 'pause' | 'charge';

type Devices = 'bot' | 'dock';
interface DevicesCoordinates {
  x: number;
  y: number;
  a: number;
  invalid: number /* boolean number*/;
}

interface DevicesPayload {
  device: Devices;
  devicesCoordinates: DevicesCoordinates;
}
interface VacuumState {
  map: {
    isLoading: boolean;
    isFetching: boolean;
    data: string | null;
  };
  position: {
    dock: DevicesCoordinates;
    bot: DevicesCoordinates;
  };
  clean: {
    isLoading: boolean;
    isFetching: boolean;
    data: CleanState;
  };
}

const initialState: VacuumState = {
  map: {
    isLoading: true,
    isFetching: false,
    data: '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',
  },
  position: {
    dock: {
      x: -500,
      y: 19,
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
  clean: {
    isLoading: false,
    isFetching: false,
    data: 'pause',
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
    setVacuumClean: (state, action: PayloadAction<CleanState>) => ({
      ...state,
      clean: { ...state.clean, data: action.payload },
    }),
    setVacuumPos: (state, { payload: { device, devicesCoordinates } }: PayloadAction<DevicesPayload>) => ({
      ...state,
      position: { ...state.position, [device]: devicesCoordinates },
    }),
  },
});

export const { setVacuumMap, setVacuumClean, setVacuumPos } = vacuumSlice.actions;

export const getVacuumMap = () => useAppSelector(({ vacuum }) => vacuum.map);
export const getVacuumClean = () => useAppSelector(({ vacuum }) => vacuum.clean);
export const getVacuumPos = (device: Devices) => useAppSelector(({ vacuum }) => vacuum.position[device]);
