import { Button, Typography } from '@mui/material';
import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import { useAppDispatch } from '../../../store/hooks';
import { ActiveToolType, setActivetool } from '../../../store/vacuum/editMapSlice';

export const NoGoZoneTool = () => {
  const dispatch = useAppDispatch();

  const handleClick = (value: ActiveToolType) => dispatch(setActivetool(value));
  return (
    <>
      <Typography variant="overline">Select a tool to define or delete a no go zone.</Typography>
      <OptionsFrame sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
        <Button variant="outlined" color="warning" disabled>
          Delete
        </Button>
      </OptionsFrame>
    </>
  );
};

export default NoGoZoneTool;
