import { Box, Divider, Grid, Typography } from '@mui/material';

import Battery from '../../components/Battery/Battery';
import CleanState from '../../components/CleanState/CleanState';
import { ScheduleDialog } from '../../components/Dialog/ScheduleDialog/ScheduleDialog';
import Relocate from '../../components/Relocate/Relocate';
import { Schedules } from '../../components/Schedules/Schedules';
import VacuumMap from '../../components/VacuumMap/VacuumMap';
import VacuumOptions from '../../components/VacuumOptions/VacuumOptions';
import theme from '../../theme';

const Dashboard = () => {
  return (
    <Box sx={{ margin: `0 ${theme.typography.pxToRem(15)}` }}>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: `${theme.typography.pxToRem(15)} 0` }}>
            <Typography variant="h4">Ecovacs stack</Typography>
            <Battery />
          </Box>
          <Divider />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ overflow: 'auto', maxHeight: `calc(100vh - 72px)` }}>
            <Typography variant="overline">Controls</Typography>
            <CleanState />
            <Relocate />
            <Typography variant="overline">Vacuuming Options</Typography>
            <VacuumOptions />
            <Box>
              <Typography variant="overline">Mopping Options</Typography>
              TODO
            </Box>
            <Typography variant="overline">Schedules</Typography>
            <Schedules />
            <ScheduleDialog />
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
