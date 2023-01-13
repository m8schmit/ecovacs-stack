import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { useAppSelector } from '../hooks';
import { CachedMapInfo, NoGo } from './editMap.type';

export type ActiveToolType =
  | 'none'
  | 'default'
  | 'split'
  | 'merge'
  | 'noGoZone'
  | 'noGoWall'
  | 'noMopZone'
  | 'noMopWall'
  | 'noGoTool'
  | 'deleteNoGoZone';

interface EditMapState {
  activeTool: ActiveToolType;
  splitLine: number[];
  noGoSubset: number[][];
  noMopSubset: number[][];
  selectedNoGoList: NoGo[];
  cachedMapInfo: CachedMapInfo;
}

const initialState: EditMapState = {
  activeTool: 'default',
  splitLine: [],
  noGoSubset: [],
  noMopSubset: [],
  selectedNoGoList: [],
  cachedMapInfo: { enable: 0, info: [] },
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
    setNoGoSubset: (state, action: PayloadAction<number[][]>) => ({
      ...state,
      noGoSubset: action.payload,
    }),
    setNoMopSubset: (state, action: PayloadAction<number[][]>) => ({
      ...state,
      noMopSubset: action.payload,
    }),
    updateSelectedNoGoList: (state, action: PayloadAction<NoGo>) => {
      return {
        ...state,
        selectedNoGoList: [
          ...(state.selectedNoGoList?.find((current) => current === action.payload) !== undefined
            ? [...state.selectedNoGoList.filter((current) => current !== action.payload)]
            : [...state.selectedNoGoList, action.payload]),
        ],
      };
    },
    setSelectedNoGoList: (state, action: PayloadAction<NoGo[]>) => ({
      ...state,
      selectedNoGoList: action.payload,
    }),
    resetSelectedNoGoList: (state) => {
      return {
        ...state,
        selectedNoGoList: initialState.selectedNoGoList,
      };
    },
    setCachedMapInfo: (state, action: PayloadAction<CachedMapInfo>) => ({
      ...state,
      cachedMapInfo: action.payload,
    }),
  },
});

export const {
  setActivetool,
  setSplitLine,
  setNoGoSubset,
  setNoMopSubset,
  updateSelectedNoGoList,
  setSelectedNoGoList,
  resetSelectedNoGoList,
  setCachedMapInfo,
} = editMapSlice.actions;

export const getActiveTool = () => useAppSelector(({ editMap }) => editMap.activeTool);
export const getSplitLine = () => useAppSelector(({ editMap }) => editMap.splitLine);
export const getNoGoSubset = () => useAppSelector(({ editMap }) => editMap.noGoSubset);
export const getNoMopSubset = () => useAppSelector(({ editMap }) => editMap.noMopSubset);
export const getSelectedNoGoList = () => useAppSelector(({ editMap }) => editMap.selectedNoGoList);
export const getCachedMapInfo = () => useAppSelector(({ editMap }) => editMap.cachedMapInfo);
export const getSelectedCachedMapInfo = () =>
  useAppSelector(({ editMap }) => editMap.cachedMapInfo.info.find((current) => current.using === 1));
