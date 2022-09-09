import { Box, Divider, Grid, Typography } from '@mui/material';

import Battery from '../../components/Battery/Battery';
import CleanState from '../../components/CleanState/CleanState';
import VacuumMap from '../../components/VacuumMap/VacuumMap';
import VacuumOptions from '../../components/VacuumOptions/VacuumOptions';
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
        <Grid item xs={12} md={6}>
          <Typography variant="overline">Controls</Typography>
          <CleanState />
          <Typography variant="overline">Vacuuming Options</Typography>
          <VacuumOptions />
          <Typography variant="overline">Mopping Options</Typography>
          TODO
        </Grid>
        <Grid item xs={12} md={6}>
          <VacuumMap />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
