import { TextField, Typography } from '@mui/material';

import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';

export const RenameRoomTool = () => {
  return (
    <>
      <Typography variant="overline">Rename a selected room</Typography>
      <OptionsFrame>
        <TextField sx={{ width: '100%' }} label="Select a room to rename it" variant="filled" />
      </OptionsFrame>
    </>
  );
};

export default RenameRoomTool;
