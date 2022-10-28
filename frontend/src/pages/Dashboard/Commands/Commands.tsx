import { Box } from '@mui/material';

import CleanState from '../../../components/CleanState/CleanState';
import EmptyDustBin from '../../../components/EmptyDustBin/EmptyDustBin';
import MopOptions from '../../../components/MopOptions/MopOptions';
import Relocate from '../../../components/Relocate/Relocate';
import { Schedules } from '../../../components/Schedules/Schedules';
import VacuumOptions from '../../../components/VacuumOptions/VacuumOptions';
import theme from '../../../theme';

const Commands = () => {
  return (
    <Box>
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
  );
};

export default Commands;
