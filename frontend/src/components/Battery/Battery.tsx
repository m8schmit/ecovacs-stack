import { Bolt } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';

import { getChargeState, getVacuumBattery } from '../../store/vacuum/stateSlice';

const Battery = () => {
  const { level, isLow } = getVacuumBattery();
  const { isCharging } = getChargeState();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {isCharging && <Bolt color="success" />}
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress color={isLow ? 'error' : 'success'} variant="determinate" value={level} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(level)}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Battery;
