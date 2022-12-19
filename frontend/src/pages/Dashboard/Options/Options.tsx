import { Box } from '@mui/material';
import EditMapOption from './EditMapOption/EditMapOption';

const Options = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <EditMapOption />
    </Box>
  );
};

export default Options;
