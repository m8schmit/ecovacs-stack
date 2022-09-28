import { Box } from '@mui/material';
import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';
import SweepPattern from './SweepPattern/SweepPattern';
import WaterFlow from './WaterFlow/WaterFlow';

const MopOptions = () => {
  return (
    <OptionsFrame>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <WaterFlow />
        <SweepPattern />
      </Box>
    </OptionsFrame>
  );
};

export default MopOptions;
