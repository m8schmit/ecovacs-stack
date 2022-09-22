import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../hooks';
type DialogType = 'ScheduleDialog';
type Maybe<T> = null | T;

interface ScheduleDialog {
  isVisible: boolean;
  schedIndex: Maybe<number>;
}

interface DialogState {
  ScheduleDialog: ScheduleDialog;
}

const initialState: DialogState = {
  ScheduleDialog: {
    isVisible: false,
    schedIndex: null,
  },
};

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    showDialog: (state, action: PayloadAction<DialogType>) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      hideDialog();
      state[action.payload].isVisible = true;
    },
    showEditDialog: (state, action: PayloadAction<number>) => {
      state.ScheduleDialog.isVisible = true;
      state.ScheduleDialog.schedIndex = action.payload;
    },
    hideDialog: () => initialState,
  },
});

export const { showDialog, showEditDialog, hideDialog } = dialogSlice.actions;

export const getDialog = (dialogType: DialogType): ScheduleDialog =>
  useAppSelector((state) => state.dialog[dialogType], shallowEqual);
