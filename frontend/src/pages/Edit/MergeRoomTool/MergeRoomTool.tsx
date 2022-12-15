import { Button, Typography } from '@mui/material';
import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';

export const MergeRoomTool = () => {
  return (
    <>
      <Typography variant="overline">Select two or more adjoining rooms</Typography>
      <OptionsFrame>
        <Button variant="outlined" disabled>
          Merge
        </Button>
      </OptionsFrame>
    </>
  );
};

export default MergeRoomTool;
