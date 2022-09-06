import { Box, Button, Grid, Typography } from '@mui/material';
import { useContext } from 'react';

import VacuumMap from '../../components/VacuumMap/VacuumMap';
import { useAppDispatch } from '../../store/hooks';
import { getVacuumClean, setVacuumClean } from '../../store/vacuum/vacuumSlice';
import { WebSocketContext } from '../../utils/socket.utils';

const Dashboard = () => {
  const { data: cleanData } = getVacuumClean();
  const socket = useContext(WebSocketContext);
  const dispatch = useAppDispatch();

  const switchCleanState = () => {
    console.log('switchCleanState', cleanData);
    cleanData === 'start' && socket && socket.emit('clean', 'pause') && dispatch(setVacuumClean('pause'));
    cleanData === 'pause' && socket && socket.emit('clean', 'start') && dispatch(setVacuumClean('start'));
  };
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4">Ecovacs stack</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Controls</Typography>
        <Box>
          <Button variant="contained" onClick={() => switchCleanState()}>
            {cleanData}
          </Button>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <VacuumMap />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
