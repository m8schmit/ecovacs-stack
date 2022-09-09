import { Box } from '@mui/material';

import theme from '../../theme';
import CleanCount from './CleanCount/CleanCount';
import { VacuumSpeed } from './VacuumSpeed/VacuumSpeed';

export const VacuumOptions = () => {
  return (
    <Box
      sx={{
        padding: theme.typography.pxToRem(10),
        border: `solid thin ${theme.palette.grey[300]}`,
        borderRadius: theme.typography.pxToRem(5),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <VacuumSpeed />
      <CleanCount />
    </Box>
  );
};

export default VacuumOptions;
