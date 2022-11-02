import { Power, PowerOff } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { getMoppingOption } from '../../store/vacuum/stateSlice';
import theme from '../../theme';
import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';
import SweepPattern from './SweepPattern/SweepPattern';
import WaterFlow from './WaterFlow/WaterFlow';

const MopOptions = () => {
  const { enable } = getMoppingOption();
  return (
    <>
      <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center' }}>
        Mopping Options
        {enable ? <Power fontSize="small" color="success" /> : <PowerOff fontSize="small" color="disabled" />}
      </Typography>
      <OptionsFrame>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <WaterFlow />
          <SweepPattern />
        </Box>
        {!enable && (
          <Typography
            component="em"
            variant="body2"
            sx={{
              color: theme.palette.action.disabled,
            }}
          >
            (These parameters are only effective when the Mop is plugged)
          </Typography>
        )}
      </OptionsFrame>
    </>
  );
};

export default MopOptions;
