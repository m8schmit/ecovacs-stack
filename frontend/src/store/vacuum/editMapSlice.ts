import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';

export type ActiveToolType =
  | 'none'
  | 'split'
  | 'merge'
  | 'noGoZone'
  | 'noGoWall'
  | 'noMopZone'
  | 'noMopWall'
  | 'deleteNoGoZone';

interface EditMapState {
  activeTool: ActiveToolType;
  splitLine: number[];
}

const initialState: EditMapState = {
  activeTool: 'none',
  splitLine: [],
};

export const editMapSlice = createSlice({
  name: 'editMap',
  initialState,
  reducers: {
    setActivetool: (state, action: PayloadAction<ActiveToolType>) => ({
      ...state,
      activeTool: action.payload,
    }),
    setSplitLine: (state, action: PayloadAction<number[]>) => ({
      ...state,
      splitLine: action.payload,
    }),
  },
});

export const { setActivetool, setSplitLine } = editMapSlice.actions;

export const getActiveTool = () => useAppSelector(({ editMap }) => editMap.activeTool);
export const getSplitLine = () => useAppSelector(({ editMap }) => editMap.splitLine);
