import { Button } from '@mui/material';
import { useContext } from 'react';

import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import { useAppDispatch } from '../../../store/hooks';
import { setActivetool } from '../../../store/vacuum/editMapSlice';
import { getSelectedRoomsList, getVacuumMap } from '../../../store/vacuum/mapSlice';
import theme from '../../../theme';
import { WebSocketContext } from '../../../utils/socket.utils';

export const MergeRoomTool = () => {
  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const selectedRoomsList = getSelectedRoomsList();
  const { id: mapId } = getVacuumMap();
  const desactivateMerge = () => dispatch(setActivetool('default'));

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
      <OptionsFrame>
        <Button
          variant="outlined"
          onClick={() => desactivateMerge()}
          sx={{ margin: `0 ${theme.typography.pxToRem(5)}` }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => handleMerge()}
          disabled={selectedRoomsList.length < 2}
          sx={{ margin: `0 ${theme.typography.pxToRem(5)}` }}
        >
          Confirm Merge
        </Button>
      </OptionsFrame>
    </>
  );
};

export default MergeRoomTool;
