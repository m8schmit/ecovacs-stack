import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { OptionsFrame } from '../../../../components/UI/OptionsFrame/OptionsFrame';
import { getVacuumClean } from '../../../../store/vacuum/stateSlice';

const EditMapOption = () => {
  const { state } = getVacuumClean();
  return (
    <>
      <Typography variant="overline">Edit the map</Typography>
      <OptionsFrame>
        <Box>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Delete map, rename, split or merge rooms, add no go zone.
          </Typography>
          <Link to="/edit">
            <Button variant="contained" color="warning" disabled={state !== 'idle'}>
              Link
            </Button>
          </Link>
        </Box>
      </OptionsFrame>
    </>
  );
};

export default EditMapOption;
