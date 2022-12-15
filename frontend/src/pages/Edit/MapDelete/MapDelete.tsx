import { Box, Button, Typography } from '@mui/material';
import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import theme from '../../../theme';

const MapDelete = () => {
  return (
    <Box sx={{ marginTop: 'auto', marginBottom: theme.typography.pxToRem(25) }}>
      <Typography variant="overline">Delete the map</Typography>
      <OptionsFrame>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          This action is irreversible
        </Typography>
        <Button variant="contained" color="error">
          Delete the map
        </Button>
      </OptionsFrame>
    </Box>
  );
};

export default MapDelete;
