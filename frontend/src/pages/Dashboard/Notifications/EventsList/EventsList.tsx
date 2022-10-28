import { Box, Button, List, ListItem, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { getEventsList } from '../../../../store/vacuum/notificationSlice';
import { EVENT_LABEL_LIST } from '../../../../store/vacuum/notificationSlice.type';
import theme from '../../../../theme';

export const EventsList = () => {
  const eventList = getEventsList();
  return (
    <List>
      {eventList.map(({ id, evt_code, timestamp }) => (
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
            <Typography variant="body1">{EVENT_LABEL_LIST[evt_code]}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                {dayjs(timestamp).format('YYYY/M/D - HH:mm')}
              </Typography>
              <Button disabled>Dismiss</Button>
            </Box>
          </ListItem>
        </Paper>
      ))}
      <ListItem>
        <Button disabled>Dismiss All</Button>
      </ListItem>
    </List>
  );
};

export default EventsList;
