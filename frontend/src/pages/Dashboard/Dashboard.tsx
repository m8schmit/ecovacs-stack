import { Box, Divider, Grid, Typography } from '@mui/material';
import { useContext } from 'react';

import Battery from '../../components/Battery/Battery';
import CleanState from '../../components/CleanState/CleanState';
import VacuumMap from '../../components/VacuumMap/VacuumMap';
import theme from '../../theme';

const Dashboard = () => {
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
          <CleanState />
        </Grid>
        <Grid item xs={6}>
          <VacuumMap />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

//wotrkinh status
// status: {
//   state: 'clean',
//   cleanState: {
//     cid: '122',
//     router: 'plan',
//     motionState: 'pause',
//     content: {
//       type: 'auto'
//     }
//   }
// }
//pause status
// status: {
//   state: 'clean',
//   cleanState: {
//     id: '122',
//     router: 'plan',
//     type: 'auto',
//     motionState: 'pause'
//   }
// }
