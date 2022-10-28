import { Box, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';

import { WebSocketContext } from '../../../utils/socket.utils';
import EventsList from './EventsList/EventsList';
import LifeSpanDevices from './LifeSpanDevices/LifeSpanDevices';

export const Notifications = () => {
  const socket = useContext(WebSocketContext);

  useEffect(() => {
    console.log('getLifeSpan');
    socket.emit('getLifeSpan');
    socket.emit('getEventsList');
    return;
  }, []);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <LifeSpanDevices />
      <Typography variant="h6">Errors and Events</Typography>
      <EventsList />
    </Box>
  );
};

export default Notifications;
