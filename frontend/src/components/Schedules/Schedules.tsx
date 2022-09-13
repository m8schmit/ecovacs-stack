import { Box, FormControlLabel, Switch, TextField } from '@mui/material';
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
      <Box sx={{ display: 'flex' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {ScheduleList.map((currentSchedule) => (
            <Box key={`schedule-${currentSchedule.index}`}>
              <FormControlLabel control={<Switch checked={!!+currentSchedule.enable} />} label="enabled" />
              <TimePicker
                label="Time"
                value={dayjs().set('hour', currentSchedule.hour).set('minute', currentSchedule.minute)}
                onChange={console.log}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          ))}
        </LocalizationProvider>
      </Box>
      <pre>{JSON.stringify(ScheduleList[0], null, 2)}</pre>
    </OptionsFrame>
  );
};
