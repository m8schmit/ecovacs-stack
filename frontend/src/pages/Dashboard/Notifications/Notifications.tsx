import { Box, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';

import { getErrorsList, getEventsList } from '../../../store/vacuum/notificationSlice';
import {
  BotErrorType,
  BotEventType,
  ERROR_LABEL_LIST,
  EVENT_LABEL_LIST,
} from '../../../store/vacuum/notificationSlice.type';
import { WebSocketContext } from '../../../utils/socket.utils';
import LifespanAccessories from './LifespanAccessories/LifespanAccessories';
import LifeSpanDevices from './LifeSpanDevices/LifeSpanDevices';
import { NotificationsList } from './NotificationsList/NotificationsList';

export const Notifications = () => {
  const socket = useContext(WebSocketContext);
  const eventList = getEventsList();
  const errorList = getErrorsList();

  useEffect(() => {
    socket.emit('getLifeSpanDevice');
    socket.emit('getLifeSpanAccessory');
    socket.emit('getEventsList');
    socket.emit('getErrorsList');

    return;
  }, []);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <LifeSpanDevices />
      <LifespanAccessories />
      <Typography variant="h6">Events</Typography>
      <NotificationsList<BotEventType> list={eventList} socketEvent={'dismissEvent'} labelList={EVENT_LABEL_LIST} />
      <Typography variant="h6">Errors</Typography>
      <NotificationsList<BotErrorType> list={errorList} socketEvent={'dismissError'} labelList={ERROR_LABEL_LIST} />
    </Box>
  );
};

export default Notifications;
