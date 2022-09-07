import { Pause, PlayArrow } from '@mui/icons-material';
import { Box, Typography, IconButton } from '@mui/material';
import { useContext } from 'react';
import { getVacuumClean } from '../../store/vacuum/vacuumSlice';
import theme from '../../theme';
import { WebSocketContext } from '../../utils/socket.utils';

const CleanState = () => {
  const status = getVacuumClean();
  const socket = useContext(WebSocketContext);

  const switchCleanState = () => {
    console.log('switchCleanState', status);
    const act =
      (status?.cleanState?.motionState === 'working' && 'pause') ||
      (status?.cleanState?.motionState === 'pause' && 'resume') ||
      (status.state === 'idle' && 'start');
    socket.emit('clean', act);
  };
  return (
    <Box
      sx={{
        padding: theme.typography.pxToRem(10),
        border: `solid thin ${theme.palette.grey[300]}`,
        borderRadius: theme.typography.pxToRem(5),
      }}
    >
      <Typography>current mode: {status.cleanState.type || status.cleanState?.content?.type}</Typography>
      <IconButton size="large" color="primary" onClick={() => switchCleanState()}>
        {status?.cleanState?.motionState === 'working' && <Pause />}
        {(status?.cleanState?.motionState === 'pause' || status.state === 'idle') && <PlayArrow />}
      </IconButton>
    </Box>
  );
};

export default CleanState;
