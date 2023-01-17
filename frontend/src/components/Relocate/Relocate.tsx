import { Check, GpsFixed, QuestionMark, Warning } from '@mui/icons-material';
import { Button, CircularProgress, SxProps, Theme, Typography } from '@mui/material';
import { FC, useContext, useEffect } from 'react';

import { useAppDispatch } from '../../store/hooks';
import { getLocationState, setLocationState } from '../../store/vacuum/mapSlice';
import { WebSocketContext } from '../../utils/socket.utils';
import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';

interface RelocateProps {
  sx?: SxProps<Theme> | undefined;
}
export const Relocate: FC<RelocateProps> = ({ sx }) => {
  const socket = useContext(WebSocketContext);
  const { isLoading, isInvalid } = getLocationState();
  const dispatch = useAppDispatch();
  let RelocateTimeOut: number;

  const triggerRelocate = () => {
    socket.emit('setRelocationState');
    dispatch(setLocationState({ isLoading: true }));
    RelocateTimeOut = window.setTimeout(() => dispatch(setLocationState({ isLoading: false, isInvalid: true })), 30000);
  };

  useEffect(() => {
    if (isLoading === false && isInvalid === false) {
      console.log('relocate success !!');
      clearTimeout(RelocateTimeOut);
    }
  }, [isInvalid]);

  return (
    <OptionsFrame sx={sx}>
      <Typography sx={{ display: 'flex', alignItems: 'center' }}>
        Current position :
        {isLoading ? <QuestionMark /> : isInvalid ? <Warning color="warning" /> : <Check color="success" />}
      </Typography>
      <Button
        variant="outlined"
        color="info"
        endIcon={<GpsFixed />}
        disabled={isLoading}
        onClick={() => triggerRelocate()}
      >
        {isLoading ? <CircularProgress color="primary" size={15} /> : 'Relocate'}
      </Button>
    </OptionsFrame>
  );
};

export default Relocate;
