import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';

import {
  DeleteMapDialog,
  getDialog,
  hideDialog,
  setDeleteMapDialogLoading,
} from '../../../../store/dialog/dialogSlice';
import { useAppDispatch } from '../../../../store/hooks';
import { getVacuumMap } from '../../../../store/vacuum/mapSlice';
import { WebSocketContext } from '../../../../utils/socket.utils';
import { isDialog } from '../../../../utils/typeguard.utils';

const MapDeleteDialog = () => {
  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);

  const { id: mid } = getVacuumMap();
  const deleteMapDialog = getDialog('DeleteMapDialog');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isDialog<DeleteMapDialog>(deleteMapDialog, 'DeleteMapDialog')) {
      setIsVisible(deleteMapDialog.isVisible);
      setIsLoading(deleteMapDialog.isLoading);
    }
  }, [deleteMapDialog]);

  const handleClose = () => {
    !isLoading && dispatch(hideDialog());
  };

  const handleConfirm = () => {
    console.log('close');
    socket.emit('deleteMap', { mid });
    dispatch(setDeleteMapDialogLoading(true));
  };

  return (
    <Dialog open={isVisible} onClose={handleClose}>
      <DialogTitle sx={{ textTransform: 'capitalize' }}>{`Delete Map`}</DialogTitle>
      <DialogContent>
        <Typography>
          You are about to completely delete your current Map. If you press 'delete', you will have to recreate your map
          from scratch.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={handleConfirm} disabled={isLoading}>
          <>
            {isLoading && <CircularProgress size={24.5} />} {!isLoading && <>Delete</>}
          </>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default MapDeleteDialog;
