import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import { useContext } from 'react';

import Battery from '../../components/Battery/Battery';
import VacuumMap from '../../components/VacuumMap/VacuumMap';
import { useAppDispatch } from '../../store/hooks';
import { getVacuumClean, setVacuumClean } from '../../store/vacuum/vacuumSlice';
import theme from '../../theme';
import { WebSocketContext } from '../../utils/socket.utils';

const Dashboard = () => {
  const { status } = getVacuumClean();
  const socket = useContext(WebSocketContext);
  const dispatch = useAppDispatch();

  const switchCleanState = () => {
    console.log('switchCleanState', status);
    status === 'idle' && socket && socket.emit('clean', 'start') && dispatch(setVacuumClean('start'));
    status === 'pause' && socket && socket.emit('clean', 'resume') && dispatch(setVacuumClean('resume'));
    status === 'working' && socket && socket.emit('clean', 'stop') && dispatch(setVacuumClean('stop'));
  };
  return (
    <Box sx={{ margin: theme.typography.pxToRem(15) }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.typography.pxToRem(15) }}>
            <Typography variant="h4">Ecovacs stack</Typography>
            <Battery />
          </Box>
          <Divider />
        </Grid>
        <Grid item xs={6}>
          <Typography>Controls</Typography>
          <Box>
            <Button variant="contained" onClick={() => switchCleanState()}>
              {status}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <VacuumMap />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
