import { Box, Divider, Grid, Typography } from '@mui/material';

import Battery from '../../components/Battery/Battery';
import CleanState from '../../components/CleanState/CleanState';
import EmptyDustBin from '../../components/EmptyDustBin/EmptyDustBin';
import MopOptions from '../../components/MopOptions/MopOptions';
import Relocate from '../../components/Relocate/Relocate';
import { Schedules } from '../../components/Schedules/Schedules';
import VacuumMap from '../../components/VacuumMap/VacuumMap';
import VacuumOptions from '../../components/VacuumOptions/VacuumOptions';
import theme from '../../theme';

const Dashboard = () => {
  return (
    <Box sx={{ margin: `0 ${theme.typography.pxToRem(15)}` }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: `${theme.typography.pxToRem(15)} 0` }}>
            <Typography variant="h4">Ecovacs stack</Typography>
            <Battery />
          </Box>
          <Divider />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ overflow: 'auto', maxHeight: `calc(100vh - 72px)` }}>
            <CleanState />
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Relocate
                sx={{
                  flex: 1,
                  marginRight: theme.typography.pxToRem(10),
                }}
              />
              <EmptyDustBin sx={{ flex: 1 }} />
            </Box>
            <VacuumOptions />
            <MopOptions />
            <Schedules />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <VacuumMap />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
