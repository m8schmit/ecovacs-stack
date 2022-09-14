import { Box, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useContext, useEffect } from 'react';

import { geSchedulesList } from '../../store/vacuum/vacuumSlice';
import { WebSocketContext } from '../../utils/socket.utils';
import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';

export const Schedules = () => {
  const socket = useContext(WebSocketContext);
  const ScheduleList = geSchedulesList();

  useEffect(() => {
    socket.emit('getSchedulesList');
  }, []);

  return (
    <OptionsFrame>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {ScheduleList.map((currentSchedule) => (
          <Box
            key={`schedule-${currentSchedule.index}`}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <FormControlLabel control={<Switch checked={currentSchedule.enable} />} label="enabled" />

            <Typography>
              {currentSchedule.content.jsonStr?.content?.type === 'auto' && 'Clean everywhere'}
              {currentSchedule.content.jsonStr?.content?.type === 'spotArea' &&
                `Clean ${currentSchedule.content.jsonStr?.content?.value
                  .split(',')
                  .map((curr: string) => `room ${curr}`)
                  .join(',')}`}
            </Typography>
            <TimePicker
              label="Time"
              value={dayjs().set('hour', currentSchedule.hour).set('minute', currentSchedule.minute)}
              onChange={console.log}
              // disabled
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        ))}
      </LocalizationProvider>
      {/* <pre>{JSON.stringify(ScheduleList[0], null, 2)}</pre> */}
    </OptionsFrame>
  );
};
