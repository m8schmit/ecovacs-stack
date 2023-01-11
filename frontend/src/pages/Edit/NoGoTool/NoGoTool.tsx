import { Button, Typography } from '@mui/material';

import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import { useAppDispatch } from '../../../store/hooks';
import { ActiveToolType, getActiveTool, getNoGoSubset, setActivetool } from '../../../store/vacuum/editMapSlice';
import { getVacuumMap } from '../../../store/vacuum/mapSlice';

export const NoGoGoTool = () => {
  const dispatch = useAppDispatch();
  const activetool = getActiveTool();
  const nogoSubset = getNoGoSubset();
  const { id: mapId } = getVacuumMap();

  const handleToolChangeClick = (value: ActiveToolType) => dispatch(setActivetool(value));

  const handleApplyAddNoGo = () => {
    if (activetool === 'noGoZone' || activetool === 'noGoWall') {
      console.log('apply nogo', nogoSubset, mapId);
    } else {
      console.log('apply no mop', nogoSubset, mapId);
    }
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
            <Button variant="contained" onClick={handleApplyAddNoGo} disabled={!nogoSubset.length}>
              Update
            </Button>
          </>
        )}
        {activetool === 'deleteNoGoZone' && (
          <>
            <Button variant="outlined" onClick={() => handleToolChangeClick('noGoTool')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => console.log('todo')} disabled>
              confirm delete
            </Button>
          </>
        )}
      </OptionsFrame>
    </>
  );
};

export default NoGoGoTool;
