import { Button, Typography } from '@mui/material';
import { useContext } from 'react';

import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import { useAppDispatch } from '../../../store/hooks';
import { getActiveTool, setActivetool } from '../../../store/vacuum/editMapSlice';
import { getSelectedRoomsList, getVacuumMap } from '../../../store/vacuum/mapSlice';
import { WebSocketContext } from '../../../utils/socket.utils';

export const MergeRoomTool = () => {
  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const selectedRoomsList = getSelectedRoomsList();
  const activetool = getActiveTool();
  const { id: mapId } = getVacuumMap();
  const activateMerge = () => dispatch(setActivetool('merge'));
  const desactivateMerge = () => dispatch(setActivetool('none'));

  const handleMerge = () => {
    console.log('merge rooms: ', selectedRoomsList);

    socket.emit('mergeRooms', {
      mid: mapId,
      subsets: selectedRoomsList.map((mssid) => ({
        mssid: `${mssid}`,
      })),
    });
  };

  return (
    <>
      <Typography variant="overline">Select two or more adjoining rooms</Typography>
      <OptionsFrame>
        {activetool !== 'merge' && (
          <Button variant="outlined" onClick={activateMerge}>
            Merge
          </Button>
        )}
        {activetool === 'merge' && (
          <>
            <Button variant="outlined" onClick={() => desactivateMerge()}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => handleMerge()} disabled={selectedRoomsList.length < 2}>
              Confirm Split
            </Button>
          </>
        )}
      </OptionsFrame>
    </>
  );
};

export default MergeRoomTool;
