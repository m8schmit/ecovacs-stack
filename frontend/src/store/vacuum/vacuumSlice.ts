import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';

type CleanState = 'start' | 'pause' | 'charge';
interface VacuumState {
  map: {
    isLoading: boolean;
    isFetching: boolean;
    data: string | null;
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
    data: null,
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
  },
});

export const { setVacuumMap, setVacuumClean } = vacuumSlice.actions;

export const getVacuumMap = () => useAppSelector(({ vacuum }) => vacuum.map);
export const getVacuumClean = () => useAppSelector(({ vacuum }) => vacuum.clean);
