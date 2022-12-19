import { Button, Typography } from '@mui/material';
import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';

export const NoGoZoneTool = () => {
  return (
    <>
      <Typography variant="overline">Select a tool to define or delete a no go zone.</Typography>
      <OptionsFrame sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined">No Go Zone</Button>
        <Button variant="outlined">No Mop Zone</Button>
        <Button variant="outlined">Virtual Wall</Button>
        <Button variant="outlined">Virtual Mop Wall</Button>
        <Button variant="outlined" color="warning" disabled>
          Delete
        </Button>
      </OptionsFrame>
    </>
  );
};

export default NoGoZoneTool;
