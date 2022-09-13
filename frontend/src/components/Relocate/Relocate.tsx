import { GpsFixed } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { WebSocketContext } from '../../utils/socket.utils';

import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';

export const Relocate = () => {
  const socket = useContext(WebSocketContext);

  return (
    <OptionsFrame>
      <Button variant="contained" color="info" endIcon={<GpsFixed />} onClick={() => socket.emit('setRelocationState')}>
        Relocate
      </Button>
    </OptionsFrame>
  );
};

export default Relocate;
