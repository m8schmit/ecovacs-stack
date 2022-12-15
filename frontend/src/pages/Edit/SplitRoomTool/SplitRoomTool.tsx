import { Button, Typography } from '@mui/material';
import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';

export const SplitRoomTool = () => {
  return (
    <>
      <Typography variant="overline">Split a selected room</Typography>
      <OptionsFrame>
        <Button variant="outlined" disabled>
          Split
        </Button>
      </OptionsFrame>
    </>
  );
};

export default SplitRoomTool;
