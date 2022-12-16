import { Button, Typography } from '@mui/material';

import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';

const MapDelete = () => {
  return (
    <>
      <Typography variant="overline">Delete the map</Typography>
      <OptionsFrame>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          This action is irreversible
        </Typography>
        <Button variant="contained" color="error">
          Delete the map
        </Button>
      </OptionsFrame>
    </>
  );
};

export default MapDelete;
