import { Button, Typography } from '@mui/material';
import { useContext } from 'react';
import { OptionsFrame } from '../../../../components/UI/OptionsFrame/OptionsFrame';
import { useAppDispatch } from '../../../../store/hooks';
import {
  getActiveTool,
  getNoGoSubset,
  getNoMopSubset,
  getSelectedNoGoList,
  ActiveToolType,
  setActivetool,
} from '../../../../store/vacuum/editMapSlice';
import { getVacuumMap } from '../../../../store/vacuum/mapSlice';
import { WebSocketContext } from '../../../../utils/socket.utils';

export const NoGoGoTool = () => {
  const dispatch = useAppDispatch();
  const activetool = getActiveTool();
  const nogoSubset = getNoGoSubset();
  const noMopSubset = getNoMopSubset();
  const toDelNoGo = getSelectedNoGoList()[0];
  const { id: mapId } = getVacuumMap();
  const socket = useContext(WebSocketContext);

  const handleToolChangeClick = (value: ActiveToolType) => dispatch(setActivetool(value));

  const handleApplyAddNoGo = () => {
    if (activetool === 'noGoZone' || activetool === 'noGoWall') {
      socket.emit('addNoGoSubset', { value: `[${nogoSubset.join(',')}]`, mid: mapId });
    } else {
      socket.emit('addNoMopSubset', { value: `[${noMopSubset.join(',')}]`, mid: mapId });
    }
    handleToolChangeClick('noGoTool');
  };

  const handleApplyDelNoGo = () => {
    if (toDelNoGo.type === 'mw') {
      socket.emit('delNoMopSubset', { mssid: `${toDelNoGo.mssid}`, mid: mapId });
    } else {
      socket.emit('delNoGoSubset', { mssid: `${toDelNoGo.mssid}`, mid: mapId });
    }
    handleToolChangeClick('noGoTool');
  };
  return (
    <>
      <Typography variant="overline">Select a tool to define or delete a no go zone.</Typography>
      <OptionsFrame sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {activetool === 'noGoTool' && (
          <>
            <Button variant="outlined" onClick={() => handleToolChangeClick('noGoZone')}>
              No Go Zone
            </Button>
            <Button variant="outlined" onClick={() => handleToolChangeClick('noMopZone')}>
              No Mop Zone
            </Button>
            <Button variant="outlined" onClick={() => handleToolChangeClick('noGoWall')}>
              Virtual Wall
            </Button>
            <Button variant="outlined" onClick={() => handleToolChangeClick('noMopWall')}>
              Virtual Mop Wall
            </Button>
            <Button variant="outlined" color="warning" onClick={() => handleToolChangeClick('deleteNoGoZone')}>
              Delete
            </Button>
          </>
        )}
        {(activetool === 'noGoWall' ||
          activetool === 'noMopWall' ||
          activetool === 'noGoZone' ||
          activetool === 'noMopZone') && (
          <>
            <Button variant="outlined" onClick={() => handleToolChangeClick('noGoTool')}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleApplyAddNoGo}
              disabled={!nogoSubset.length && !noMopSubset.length}
            >
              Update
            </Button>
          </>
        )}
        {activetool === 'deleteNoGoZone' && (
          <>
            <Button variant="outlined" onClick={() => handleToolChangeClick('noGoTool')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleApplyDelNoGo} disabled={!toDelNoGo}>
              confirm delete
            </Button>
          </>
        )}
      </OptionsFrame>
    </>
  );
};

export default NoGoGoTool;
