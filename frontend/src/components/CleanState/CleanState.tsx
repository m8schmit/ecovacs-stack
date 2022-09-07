import { Bolt, Pause, PlayArrow } from '@mui/icons-material';
import { Box, Typography, IconButton } from '@mui/material';
import { useContext } from 'react';
import { getChargeState, getVacuumClean } from '../../store/vacuum/vacuumSlice';
import theme from '../../theme';
import { WebSocketContext } from '../../utils/socket.utils';

const CleanState = () => {
  const status = getVacuumClean();
  const { isCharging } = getChargeState();

  const socket = useContext(WebSocketContext);

  const switchCleanState = () => {
    //TODO add a condition to resume charging
    console.log('switchCleanState', status);
    const act =
      ((status?.cleanState?.motionState === 'working' || status?.state === 'goCharging') && 'pause') ||
      (status?.cleanState?.motionState === 'pause' && 'resume') ||
      (status.state === 'idle' && 'start');
    socket.emit('clean', act);
  };

  const goCharging = () => {
    socket.emit('charge');
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
        current mode: {status?.cleanState?.type || status?.cleanState?.content?.type || status.state}
      </Typography>
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
