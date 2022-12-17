import { Button, Typography } from '@mui/material';
import { useEffect } from 'react';
import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import { useAppDispatch } from '../../../store/hooks';
import { getActiveTool, setActivetool } from '../../../store/vacuum/editMapSlice';
import { getSelectedRoomsList } from '../../../store/vacuum/mapSlice';

export const SplitRoomTool = () => {
  const selectedRoom = getSelectedRoomsList();
  const activetool = getActiveTool();
  const dispatch = useAppDispatch();

  const activateSplit = () => dispatch(setActivetool('split'));
  const desactivateSplit = () => dispatch(setActivetool('none'));

  const handleSplit = () => {
    console.log('todo: loading, dispatch, wait answer');
  };

  useEffect(() => {
    console.log(selectedRoom);
  }, [selectedRoom]);

  return (
    <>
      <Typography variant="overline">Split a selected room</Typography>
      <OptionsFrame>
        {activetool !== 'split' && (
          <Button variant="outlined" disabled={selectedRoom.length !== 1} onClick={() => activateSplit()}>
            Split
          </Button>
        )}
        {activetool === 'split' && (
          <>
            <Button variant="outlined" onClick={() => desactivateSplit()}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => handleSplit()}>
              Confirm Split
            </Button>
          </>
        )}
      </OptionsFrame>
    </>
  );
};

export default SplitRoomTool;
