import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';

import {
  BackupDialog as BackupDialogType,
  BackupModeType,
  getDialog,
  hideDialog,
  setBackupDialogLoading,
} from '../../../../store/dialog/dialogSlice';
import { useAppDispatch } from '../../../../store/hooks';
import { getSelectedCachedMapInfo } from '../../../../store/vacuum/editMapSlice';
import { getVacuumMap } from '../../../../store/vacuum/mapSlice';
import { WebSocketContext } from '../../../../utils/socket.utils';
import { isDialog } from '../../../../utils/typeguard.utils';

export const BackupDialog = () => {
  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);

  const backupDialog = getDialog('BackupDialog');
  const [backupMode, setBackupMode] = useState<BackupModeType>('load');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id: mid } = getVacuumMap();
  const selectedCachedMapInfo = getSelectedCachedMapInfo();

  useEffect(() => {
    if (isDialog<BackupDialogType>(backupDialog, 'BackupDialog')) {
      setIsVisible(backupDialog.isVisible);
      setBackupMode(backupDialog.backupMode);
      setIsLoading(backupDialog.isLoading);
    }
  });

  const handleClose = () => {
    !isLoading && dispatch(hideDialog());
  };

  const handleConfirm = () => {
    console.log(backupMode, selectedCachedMapInfo);
    if (backupMode === 'load' && selectedCachedMapInfo && selectedCachedMapInfo.backupId) {
      socket.emit('restoreMap', { mid, reMid: selectedCachedMapInfo.backupId });
    } else if (backupMode === 'save') {
      socket.emit('saveMap', { mid });
    }
    dispatch(setBackupDialogLoading(true));
  };

  return (
    <Dialog open={isVisible} onClose={handleClose}>
      <DialogTitle sx={{ textTransform: 'capitalize' }}>{`${backupMode} a Backup`}</DialogTitle>
      <DialogContent>
        {isLoading && (
          <Typography sx={{ textTransform: 'capitalize' }}>{`${backupMode} in progress. Please Wait.`}</Typography>
        )}
        {!isLoading && (
          <Typography>{` You are about to ${backupMode} a map backup. This action is irreversible.`}</Typography>
        )}
        {backupMode === 'load' && !isLoading && (
          <Typography>You will loose some informations like the Schedules.</Typography>
        )}
        TODO map preview
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={isLoading}>
          <>
            {isLoading && <CircularProgress size={24.5} />} {!isLoading && <>{backupMode}</>}
          </>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BackupDialog;
