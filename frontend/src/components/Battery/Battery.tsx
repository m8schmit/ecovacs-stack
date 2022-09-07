import { Box, CircularProgress, Typography } from '@mui/material';

import { getVacuumBattery } from '../../store/vacuum/vacuumSlice';

const Battery = () => {
  const { level, isLow } = getVacuumBattery();
  return (
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
  );
};

export default Battery;
