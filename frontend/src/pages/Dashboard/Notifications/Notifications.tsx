import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';

import { WebSocketContext } from '../../../utils/socket.utils';
import LifeSpanDevices from './LifeSpanDevices/LifeSpanDevices';

export const Notifications = () => {
  const socket = useContext(WebSocketContext);

  useEffect(() => {
    console.log('getLifeSpan');
    socket.emit('getLifeSpan');
    return;
  }, []);
  return (
    <>
      <LifeSpanDevices />
      <Typography variant="h6">Errors and Events</Typography>
      todo
    </>
  );
};

export default Notifications;
