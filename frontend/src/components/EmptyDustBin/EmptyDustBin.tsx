import { Theme } from '@emotion/react';
import { Air } from '@mui/icons-material';
import { Button, CircularProgress, SxProps } from '@mui/material';
import { FC } from 'react';
import { useContext } from 'react';

import { getAutoEmptyState, getChargeState } from '../../store/vacuum/stateSlice';
import { WebSocketContext } from '../../utils/socket.utils';
import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';

interface EmptyDustBinProps {
  sx?: SxProps<Theme> | undefined;
}
const EmptyDustBin: FC<EmptyDustBinProps> = ({ sx }) => {
  const { isCharging } = getChargeState();
  const { active: autoEmptyActive } = getAutoEmptyState();
  const socket = useContext(WebSocketContext);

  const emptyDustBin = () => {
    socket.emit('emptyDustBin');
  };

  return (
    <OptionsFrame sx={{ ...sx, display: 'flex' }}>
      <Button
        sx={{ marginTop: 'auto' }}
        variant="outlined"
        endIcon={<Air />}
        onClick={() => emptyDustBin()}
        disabled={!isCharging || autoEmptyActive}
      >
        {autoEmptyActive ? <CircularProgress color="primary" size={15} /> : 'Empty Dust Bin'}
      </Button>
    </OptionsFrame>
  );
};

export default EmptyDustBin;
