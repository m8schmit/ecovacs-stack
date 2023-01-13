import { Download, Upload } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';

import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import { BackupModeType, showBackupDialog } from '../../../store/dialog/dialogSlice';
import { useAppDispatch } from '../../../store/hooks';
import BackupDialog from './BackupDialog/BackupDialog';

export const MapSaveTool = () => {
  const dispatch = useAppDispatch();

  const handleClick = (backupMode: BackupModeType) => dispatch(showBackupDialog(backupMode));
  return (
    <>
      <Typography variant="overline">Load or save a map backup</Typography>
      <OptionsFrame>
        <IconButton size="large" color="primary" onClick={() => handleClick('load')}>
          <Download />
          <Typography>load a backup</Typography>
        </IconButton>
        <IconButton size="large" color="primary" onClick={() => handleClick('save')}>
          <Upload />
          <Typography>save a backup</Typography>
        </IconButton>
      </OptionsFrame>
      <BackupDialog />
    </>
  );
};

export default MapSaveTool;
