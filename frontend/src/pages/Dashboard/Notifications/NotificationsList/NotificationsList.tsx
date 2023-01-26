import { Box, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FC, useContext } from 'react';

import GlowingDot from '../../../../components/UI/GlowingDot/GlowingDot';
import {
  BotErrorId,
  BotEventId,
  BotNotification,
  ERROR_LABEL_LIST,
  EVENT_LABEL_LIST,
} from '../../../../store/vacuum/notificationSlice.type';
import theme from '../../../../theme';
import { WebSocketContext } from '../../../../utils/socket.utils';

interface NotificationsListProps {
  list: BotNotification[];
}

export const NotificationsList: FC<NotificationsListProps> = ({ list }) => {
  const socket = useContext(WebSocketContext);

  const handleDismiss = (id: number | null) => socket.emit('dismissEvent', id);

  const getEventLabel = (eventCode: BotErrorId | BotEventId) => {
    if (ERROR_LABEL_LIST[eventCode as BotErrorId]) {
      return ERROR_LABEL_LIST[eventCode as BotErrorId];
    } else if (EVENT_LABEL_LIST[eventCode as BotEventId]) {
      return EVENT_LABEL_LIST[eventCode as BotEventId];
    }
    return `unkown: [${eventCode}]`;
  };

  return (
    <List>
      {list.map(({ id, code, type, read, timestamp }) => (
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
            <Box sx={{ marginRight: theme.typography.pxToRem(5) }}>{!read && <GlowingDot />}</Box>
            <ListItemText
              primary={getEventLabel(code)}
              secondary={`${type.toLowerCase()} - ${dayjs(timestamp).format('YYYY/M/D - HH:mm')}`}
            />
            <Button sx={{ ml: 1 }} onClick={() => handleDismiss(id)}>
              Dismiss
            </Button>
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
