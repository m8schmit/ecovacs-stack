import { Button, Typography } from '@mui/material';
import { useContext } from 'react';

import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import { useAppDispatch } from '../../../store/hooks';
import { getActiveTool, getSplitLine, setActivetool } from '../../../store/vacuum/editMapSlice';
import { getSelectedRoomsList, getVacuumMap } from '../../../store/vacuum/mapSlice';
import { WebSocketContext } from '../../../utils/socket.utils';

export const SplitRoomTool = () => {
  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const selectedRoomsList = getSelectedRoomsList();
  const activetool = getActiveTool();
  const splitLine = getSplitLine();
  const { id: mapId } = getVacuumMap();

  const getFormatedLineCoordinates = () =>
    `${[...splitLine].slice(0, 2).join(',')};${[...splitLine].splice(2, 4).join(',')}`;
  const activateSplit = () => dispatch(setActivetool('split'));
  const desactivateSplit = () => dispatch(setActivetool('none'));

  const handleSplit = () => {
    console.log('splitRoom: ', selectedRoomsList);
    socket.emit('splitRoom', { mssid: `${selectedRoomsList[0]}`, mid: mapId, value: getFormatedLineCoordinates() });
  };

  return (
    <>
      <Typography variant="overline">Split a selected room</Typography>
      <OptionsFrame>
        {activetool !== 'split' && (
          <Button variant="outlined" disabled={selectedRoomsList.length !== 1} onClick={() => activateSplit()}>
            Split
          </Button>
        )}
        {activetool === 'split' && (
          <>
            <Button variant="outlined" onClick={() => desactivateSplit()}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => handleSplit()} disabled={!splitLine}>
              Confirm Split
            </Button>
          </>
        )}
      </OptionsFrame>
    </>
  );
};

export default SplitRoomTool;
