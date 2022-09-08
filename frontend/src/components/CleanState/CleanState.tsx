import { Bolt, Close, Pause, PlayArrow } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';

import { useAppDispatch } from '../../store/hooks';
import {
  getChargeState,
  getCleanTask,
  getVacuumClean,
  resetCleanTask,
  resetSelectedRoomsList,
  setCleanTask,
} from '../../store/vacuum/vacuumSlice';
import { BotAct, CleanState as CleanStateType } from '../../store/vacuum/vacuumSlice.type';
import theme from '../../theme';
import { WebSocketContext } from '../../utils/socket.utils';

const CleanState = () => {
  const status = getVacuumClean();
  const cleanTask = getCleanTask();
  const { isCharging } = getChargeState();
  const dispatch = useAppDispatch();

  const socket = useContext(WebSocketContext);

  const getNextAct = (status: CleanStateType): BotAct => {
    if (status?.cleanState?.motionState === 'working' || status?.state === 'goCharging') {
      return 'pause';
    } else if (status?.cleanState?.motionState === 'pause') {
      return 'resume';
    } else {
      console.log('status (should be idle or an unkown state): ', status);
      return 'start';
    }
  };
  const switchCleanState = () => {
    //TODO add a condition to resume charging
    console.log('switchCleanState', status);

    dispatch(setCleanTask({ act: getNextAct(status) }));
    socket.emit('clean', { ...cleanTask, act: getNextAct(status) });
  };

  const goCharging = () => {
    socket.emit('charge');
  };

  const reset = () => {
    dispatch(resetSelectedRoomsList());
    dispatch(resetCleanTask());
    socket.emit('clean', cleanTask);
  };
  return (
    <Box
      sx={{
        padding: theme.typography.pxToRem(10),
        border: `solid thin ${theme.palette.grey[300]}`,
        borderRadius: theme.typography.pxToRem(5),
      }}
    >
      <Typography>
        currently: {status?.cleanState?.type || status?.cleanState?.content?.type || status.state}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>
          start an <b>{cleanTask.type}</b> cleaning {cleanTask.type === 'spotArea' && `on Rooms ${cleanTask.value}`}
        </Typography>
        {cleanTask.value && (
          <Button size="small" variant="outlined" onClick={() => reset()} startIcon={<Close />}>
            reset
          </Button>
        )}
      </Box>
      <IconButton size="large" color="primary" onClick={() => switchCleanState()}>
        {(status?.cleanState?.motionState === 'working' ||
          (status.state === 'goCharging' && status?.cleanState?.motionState !== 'pause')) && <Pause />}
        {(status?.cleanState?.motionState === 'pause' || status.state === 'idle') && <PlayArrow />}
      </IconButton>
      <IconButton size="large" color="primary" disabled={isCharging} onClick={() => goCharging()}>
        <Bolt />
      </IconButton>
    </Box>
  );
};

export default CleanState;
