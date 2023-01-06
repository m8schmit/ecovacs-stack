import { Button, Typography } from '@mui/material';

import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import { useAppDispatch } from '../../../store/hooks';
import { ActiveToolType, getActiveTool, setActivetool } from '../../../store/vacuum/editMapSlice';

export const NoGoZoneTool = () => {
  const dispatch = useAppDispatch();
  const activetool = getActiveTool();

  const handleClick = (value: ActiveToolType) => dispatch(setActivetool(value));
  return (
    <>
      <Typography variant="overline">Select a tool to define or delete a no go zone.</Typography>
      <OptionsFrame sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {(activetool === 'merge' || activetool === 'split' || activetool === 'none') && (
          <>
            <Button variant="outlined" onClick={() => handleClick('noGoZone')}>
              No Go Zone
            </Button>
            <Button variant="outlined" onClick={() => handleClick('noMopZone')}>
              No Mop Zone
            </Button>
            <Button variant="outlined" onClick={() => handleClick('noGoWall')}>
              Virtual Wall
            </Button>
            <Button variant="outlined" onClick={() => handleClick('noMopWall')}>
              Virtual Mop Wall
            </Button>
            <Button variant="outlined" color="warning" onClick={() => handleClick('deleteNoGoZone')}>
              Delete
            </Button>
          </>
        )}
        {(activetool === 'noGoWall' ||
          activetool === 'noMopWall' ||
          activetool === 'noGoZone' ||
          activetool === 'noMopZone') && (
          <>
            <Button variant="outlined" onClick={() => handleClick('none')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => console.log('todo')} disabled>
              Update
            </Button>
          </>
        )}
        {activetool === 'deleteNoGoZone' && (
          <>
            <Button variant="outlined" onClick={() => handleClick('none')}>
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

export default NoGoZoneTool;
