import { Box, Button, List, ListItem, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useContext } from 'react';

import {
  BotErrorType,
  BotEventType,
  BotNotification,
  BotNotificationLabel,
} from '../../../../store/vacuum/notificationSlice.type';
import theme from '../../../../theme';
import { WebSocketContext } from '../../../../utils/socket.utils';

interface NotificationsListProps<T extends BotEventType | BotErrorType> {
  list: BotNotification<T>[];
  socketEvent: string;
  labelList: BotNotificationLabel<T>;
}

export const NotificationsList = <T extends BotEventType | BotErrorType>({
  list,
  socketEvent,
  labelList,
}: NotificationsListProps<T>) => {
  const socket = useContext(WebSocketContext);

  const handleDismiss = (id: number | null) => socket.emit(socketEvent, id);

  return (
    <List>
      {list.map(({ id, code, timestamp }) => (
        <Paper
          key={`event-${id}`}
          elevation={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            mb: 1,
            borderRadius: theme.typography.pxToRem(5),
            width: '100%',
          }}
        >
          <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">{labelList[code] || code}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                {dayjs(timestamp).format('YYYY/M/D - HH:mm')}
              </Typography>
              <Button onClick={() => handleDismiss(id)}>Dismiss</Button>
            </Box>
          </ListItem>
        </Paper>
      ))}
      {!list.length && (
        <Typography
          component="em"
          variant="body2"
          sx={{
            ml: 0.5,
            color: theme.palette.action.disabled,
          }}
        >
          Log is empty!
        </Typography>
      )}
      <ListItem>
        <Button color={'warning'} onClick={() => handleDismiss(null)}>
          Dismiss All
        </Button>
      </ListItem>
    </List>
  );
};

export default NotificationsList;
