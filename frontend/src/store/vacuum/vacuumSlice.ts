import { createSlice } from '@reduxjs/toolkit';

interface VacuumState {
  todo: string;
}

const initialState: VacuumState = {
  todo: 'bar',
};

export const VacuumSlice = createSlice({
  name: 'vacuum',
  initialState,
  reducers: {},
});
