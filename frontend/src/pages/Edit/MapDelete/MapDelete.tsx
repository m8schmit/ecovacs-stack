import { Button, Typography } from '@mui/material';

import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import { showDialog } from '../../../store/dialog/dialogSlice';
import { useAppDispatch } from '../../../store/hooks';
import MapDeleteDialog from './MapDeleteDialog/MapDeleteDialog';

const MapDelete = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => dispatch(showDialog('DeleteMapDialog'));
  return (
    <>
      <Typography variant="overline">Delete the map</Typography>
      <OptionsFrame>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          This action is irreversible
        </Typography>
        <Button variant="contained" color="error" onClick={handleClick}>
          Delete the map
        </Button>
      </OptionsFrame>
      <MapDeleteDialog />
    </>
  );
};

export default MapDelete;
