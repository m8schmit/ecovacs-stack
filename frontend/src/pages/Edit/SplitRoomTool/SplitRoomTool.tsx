import { Button, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';

import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import { useAppDispatch } from '../../../store/hooks';
import { getSplitLine, setActivetool, setSplitLine } from '../../../store/vacuum/editMapSlice';
import { getSelectedRoomsList, getVacuumMap, resetSelectedRoomsList } from '../../../store/vacuum/mapSlice';
import theme from '../../../theme';
import { WebSocketContext } from '../../../utils/socket.utils';

export const SplitRoomTool = () => {
  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const selectedRoomsList = getSelectedRoomsList();
  const splitLine = getSplitLine();
  const { id: mapId } = getVacuumMap();

  const getFormatedLineCoordinates = () =>
    `${[...splitLine].slice(0, 2).join(',')};${[...splitLine].splice(2, 4).join(',')}`;
  const desactivateSplit = () => dispatch(setActivetool('default'));

  const handleSplit = () => {
    console.log('splitRoom: ', selectedRoomsList);
    socket.emit('splitRoom', { mssid: `${selectedRoomsList[0]}`, mid: mapId, value: getFormatedLineCoordinates() });
  };

  const resetRoom = () => {
    dispatch(resetSelectedRoomsList());
    dispatch(setSplitLine([]));
  };

  useEffect(() => {
    console.log(splitLine);
  }, [splitLine]);

  return (
    <>
      <OptionsFrame>
        <Button variant="outlined" onClick={desactivateSplit} sx={{ margin: `0 ${theme.typography.pxToRem(5)}` }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={resetRoom}
          disabled={selectedRoomsList.length !== 1}
          sx={{ margin: `0 ${theme.typography.pxToRem(5)}` }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={handleSplit}
          disabled={splitLine.length === 0 || selectedRoomsList.length !== 1}
          sx={{ margin: `0 ${theme.typography.pxToRem(5)}` }}
        >
          Confirm Split
        </Button>
      </OptionsFrame>
    </>
  );
};

export default SplitRoomTool;
