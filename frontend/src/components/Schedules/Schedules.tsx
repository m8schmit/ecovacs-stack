import { Add } from '@mui/icons-material';
import { Box, FormControlLabel, IconButton, Switch, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useContext, useEffect } from 'react';

import { showDialog } from '../../store/dialog/dialogSlice';
import { useAppDispatch } from '../../store/hooks';
import { geSchedulesList } from '../../store/vacuum/vacuumSlice';
import { WebSocketContext } from '../../utils/socket.utils';
import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';

export const Schedules = () => {
  const socket = useContext(WebSocketContext);
  const ScheduleList = geSchedulesList();
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.emit('getSchedulesList');
  }, []);

  const showAddScheduleDialog = () => dispatch(showDialog('ScheduleDialog'));

  return (
    <OptionsFrame>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
          {(!ScheduleList || ScheduleList.length === 0) && <em>No Schedules yet.</em>}
          <IconButton size="large" color="primary" onClick={showAddScheduleDialog}>
            <Add />
          </IconButton>
        </Box>
      </LocalizationProvider>
      {/* <pre>{JSON.stringify(ScheduleList[0], null, 2)}</pre> */}
    </OptionsFrame>
  );
};
