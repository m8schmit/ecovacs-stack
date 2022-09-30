import { Check, NotInterested } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { getMoppingOption } from '../../store/vacuum/stateSlice';
import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';
import SweepPattern from './SweepPattern/SweepPattern';
import WaterFlow from './WaterFlow/WaterFlow';

const MopOptions = () => {
  const { enable } = getMoppingOption();
  return (
    <>
      <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center' }}>
        Mopping Options
        {enable ? <Check fontSize="small" color="success" /> : <NotInterested fontSize="small" color="disabled" />}
      </Typography>
      <OptionsFrame>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <WaterFlow />
          <SweepPattern />
        </Box>
        <Typography component="em">
          ({enable ? 'Mop is currently plugged' : 'There parameters are only effective when the Mop is plugged'})
        </Typography>
      </OptionsFrame>
    </>
  );
};

export default MopOptions;
