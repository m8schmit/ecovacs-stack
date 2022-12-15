import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { OptionsFrame } from '../../../../components/UI/OptionsFrame/OptionsFrame';

const EditMap = () => {
  return (
    <>
      <Typography variant="overline">Edit the map</Typography>
      <OptionsFrame>
        <Box>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Delete map, rename, split or merge rooms, add no go zone.
          </Typography>
          <Button href="/edit" variant="contained" color="warning">
            Edit
          </Button>
        </Box>
      </OptionsFrame>
    </>
  );
};

export default EditMap;
