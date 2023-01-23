import { Add, Delete, Edit } from '@mui/icons-material';
import { Box, IconButton, Paper, Switch, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useContext, useEffect } from 'react';

import { showDialog, showEditDialog } from '../../store/dialog/dialogSlice';
import { useAppDispatch } from '../../store/hooks';
import { Schedules as SchedulesType } from '../../store/vacuum/commands.schedules.type';
import { getMapSubsetsList, getVacuumMap } from '../../store/vacuum/mapSlice';
import { geSchedulesList } from '../../store/vacuum/stateSlice';
import theme from '../../theme';
import { WebSocketContext } from '../../utils/socket.utils';
import { getSubsetName } from '../../utils/subset.utils';
import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';
import { daysList } from './ScheduleDialog/Schedule.utils';
import { ScheduleDialog } from './ScheduleDialog/ScheduleDialog';

export const Schedules = () => {
  const socket = useContext(WebSocketContext);
  const dispatch = useAppDispatch();
  const ScheduleList = geSchedulesList();
  const mapSubsetsList = getMapSubsetsList();
  const { id: mid } = getVacuumMap();

  useEffect(() => {
    console.log('shed');
    socket.emit('getSchedulesList');
  }, []);

  const showAddScheduleDialog = () => dispatch(showDialog('ScheduleDialog'));
  const showEditScheduleDialog = ({ sid }: SchedulesType) => dispatch(showEditDialog(sid));

  const getScheduleNextday = ({ repeat, hour, minute }: SchedulesType) => {
    const todayDay = dayjs().get('day');
    let nextScheduleDay = todayDay;

    if (repeat.search('1') >= 0) {
      while (+repeat[nextScheduleDay] !== 1) {
        // console.log('repeat in ', repeat[nextScheduleDay]);

        if (+repeat[nextScheduleDay] === 1) {
          break;
        }
        if (nextScheduleDay === repeat.length) {
          nextScheduleDay = 0;
        }
        nextScheduleDay++;
      }
    }

    if (todayDay === nextScheduleDay) {
      if (dayjs().get('hour') < hour) {
        if (dayjs().get('minute') < minute) return 'Today';
      } else {
        return 'Tomorrow';
      }
    } else if (todayDay + 1 === nextScheduleDay) {
      return 'Tomorrow';
    }
    return daysList[nextScheduleDay].label;
  };

  const toggleEnable = ({
    hour,
    minute,
    repeat,
    sid,
    enable,
    content: {
      jsonStr: {
        content: { type, value },
      },
    },
  }: SchedulesType) => socket.emit('editSched_V2', { hour, minute, repeat, mid, type, sid, enable: !enable, value });

  const delSchedule = ({ sid }: SchedulesType) => socket.emit('delSched_V2', { sid });

  return (
    <>
      <Typography variant="overline">Schedules</Typography>
      <OptionsFrame>
        <Box sx={{ display: 'flex', mb: 1, flexDirection: 'column' }}>
          {ScheduleList.map((currentSchedule) => (
            <Paper
              elevation={1}
              key={`schedule-${currentSchedule.sid}`}
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Switch checked={currentSchedule.enable} onClick={() => toggleEnable(currentSchedule)} />
                <Typography sx={{ opacity: currentSchedule.enable ? 1 : 0.5 }}>
                  Will {currentSchedule.content.jsonStr?.content?.type === 'auto' && 'clean everywhere'}
                  {currentSchedule.content.jsonStr?.content?.type === 'spotArea' &&
                    `clean ${currentSchedule.content.jsonStr?.content?.value
                      .split(',')
                      .map((curr: string) => getSubsetName(curr, mapSubsetsList))
                      .join(',')}`}{' '}
                  {getScheduleNextday(currentSchedule)} at{' '}
                  {dayjs().set('hour', currentSchedule.hour).set('minute', currentSchedule.minute).format('HH:mm')}.
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={() => showEditScheduleDialog(currentSchedule)}>
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
