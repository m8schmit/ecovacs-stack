import { Box, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';

import { getEventsList } from '../../../store/vacuum/notificationSlice';
import { WebSocketContext } from '../../../utils/socket.utils';
import LifespanAccessories from './LifespanAccessories/LifespanAccessories';
import LifeSpanDevices from './LifeSpanDevices/LifeSpanDevices';
import { NotificationsList } from './NotificationsList/NotificationsList';

export const Notifications = () => {
  const eventList = getEventsList();
  const socket = useContext(WebSocketContext);

  useEffect(() => {
    return () => console.log('dismiss event');
    // socket.emit('setAllBotEventsRead');
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <LifeSpanDevices />
      <LifespanAccessories />
      <Typography variant="h6">Events</Typography>
      <NotificationsList list={eventList} />
    </Box>
  );
};

export default Notifications;
