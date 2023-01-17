import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { shallowEqual } from 'react-redux';

import { Maybe } from '../../utils/typeguard.utils';
import { useAppSelector } from '../hooks';

export type DialogType = 'ScheduleDialog' | 'BackupDialog' | 'DeleteMapDialog';

export type BackupModeType = 'save' | 'load';

interface AppDialog {
  type: DialogType;
  isVisible: boolean;
}
export interface ScheduleDialog extends AppDialog {
  schedId: Maybe<number>;
}

export interface BackupDialog extends AppDialog {
  backupMode: BackupModeType;
  isLoading: boolean;
}

export interface DeleteMapDialog extends AppDialog {
  isLoading: boolean;
}

interface DialogState {
  ScheduleDialog: ScheduleDialog;
  BackupDialog: BackupDialog;
  DeleteMapDialog: DeleteMapDialog;
}

const initialState: DialogState = {
  ScheduleDialog: {
    type: 'ScheduleDialog',
    isVisible: false,
    schedId: null,
  },
  BackupDialog: {
    type: 'BackupDialog',
    isVisible: false,
    backupMode: 'save',
    isLoading: false,
  },
  DeleteMapDialog: {
    type: 'DeleteMapDialog',
    isVisible: false,
    isLoading: false,
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
      state.ScheduleDialog.schedId = action.payload;
    },
    showBackupDialog: (state, action: PayloadAction<BackupModeType>) => {
      state.BackupDialog.isVisible = true;
      state.BackupDialog.backupMode = action.payload;
    },
    setBackupDialogLoading: (state, action: PayloadAction<boolean>) => {
      state.BackupDialog.isLoading = action.payload;
    },
    setDeleteMapDialogLoading: (state, action: PayloadAction<boolean>) => {
      state.DeleteMapDialog.isLoading = action.payload;
    },
    hideDialog: () => initialState,
  },
});

export const {
  showDialog,
  showEditDialog,
  showBackupDialog,
  setBackupDialogLoading,
  setDeleteMapDialogLoading,
  hideDialog,
} = dialogSlice.actions;

export const getDialog = (dialogType: DialogType) => useAppSelector((state) => state.dialog[dialogType], shallowEqual);
