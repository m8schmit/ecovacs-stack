import { Add, Delete, Edit } from '@mui/icons-material';
import { Box, IconButton, Paper, Switch, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useContext, useEffect } from 'react';

import { showDialog } from '../../store/dialog/dialogSlice';
import { useAppDispatch } from '../../store/hooks';
import { Schedules as SchedulesType } from '../../store/vacuum/commands.schedules.type';
import { geSchedulesList, getVacuumMap } from '../../store/vacuum/vacuumSlice';
import theme from '../../theme';
import { WebSocketContext } from '../../utils/socket.utils';
import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';
import { daysList } from './ScheduleDialog/Schedule.utils';
import { ScheduleDialog } from './ScheduleDialog/ScheduleDialog';

export const Schedules = () => {
  const socket = useContext(WebSocketContext);
  const ScheduleList = geSchedulesList();
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.emit('getSchedulesList');
  }, []);

  const showAddScheduleDialog = () => dispatch(showDialog('ScheduleDialog'));

  const getScheduleNextday = (repeat: string) => {
    const todayDay = dayjs().day();
    const nextScheduleDay = repeat.indexOf('1');
    if (nextScheduleDay < 0) {
      // todo
      return;
    }
    if (todayDay === nextScheduleDay) {
      return 'Today';
    } else if (todayDay + 1 === nextScheduleDay) {
      return 'Tomorrow';
    }
    return daysList[nextScheduleDay].label;
  };

  const delSchedule = ({ sid }: SchedulesType) => socket.emit('delSched_V2', { sid });

  return (
    <>
      <OptionsFrame>
        <Box sx={{ display: 'flex', mb: 1 }}>
          {ScheduleList.map((currentSchedule) => (
            <Paper
              elevation={1}
              key={`schedule-${currentSchedule.index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1,
                borderRadius: theme.typography.pxToRem(5),
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Switch checked={currentSchedule.enable} />
                <Typography sx={{ opacity: currentSchedule.enable ? 1 : 0.5 }}>
                  Will {currentSchedule.content.jsonStr?.content?.type === 'auto' && 'clean everywhere'}
                  {currentSchedule.content.jsonStr?.content?.type === 'spotArea' &&
                    `clean ${currentSchedule.content.jsonStr?.content?.value
                      .split(',')
                      .map((curr: string) => `room ${curr}`)
                      .join(',')}`}{' '}
                  {getScheduleNextday(currentSchedule.repeat)} at{' '}
                  {dayjs().set('hour', currentSchedule.hour).set('minute', currentSchedule.minute).format('HH:mm')}.
                </Typography>
              </Box>
              <Box>
                <IconButton disabled>
                  <Edit />
                </IconButton>
                {/* TODO confirm dialog */}
                <IconButton onClick={() => delSchedule(currentSchedule)}>
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
          {(!ScheduleList || ScheduleList.length === 0) && <em>No Schedules yet.</em>}
        </Box>
        <IconButton size="large" color="primary" onClick={showAddScheduleDialog}>
          <Add />
        </IconButton>
      </OptionsFrame>
      <ScheduleDialog />
    </>
  );
};
