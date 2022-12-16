import { Download, Upload } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';

export const MapSaveTool = () => {
  return (
    <>
      <Typography variant="overline">Load or save a map backup</Typography>
      <OptionsFrame>
        <IconButton size="large" color="primary">
          <Download />
        </IconButton>
        <IconButton size="large" color="primary">
          <Upload />
        </IconButton>
      </OptionsFrame>
    </>
  );
};

export default MapSaveTool;
