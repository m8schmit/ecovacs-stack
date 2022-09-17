import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../hooks';
type DialogType = 'ScheduleDialog';
interface DialogState {
  ScheduleDialog: {
    isVisible: boolean;
  };
}

const initialState: DialogState = {
  ScheduleDialog: {
    isVisible: false,
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
    hideDialog: () => initialState,
  },
});

export const { showDialog, hideDialog } = dialogSlice.actions;

export const getDialogStatus = (dialogType: DialogType): boolean =>
  useAppSelector((state) => state.dialog[dialogType].isVisible, shallowEqual);
