import { Warning } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { getDialog, hideDialog } from '../../../store/dialog/dialogSlice';
import { useAppDispatch } from '../../../store/hooks';
import { Schedules } from '../../../store/vacuum/commands.schedules.type';
import { getMapSubsetsList, getVacuumMap } from '../../../store/vacuum/mapSlice';
import { geSchedulesList } from '../../../store/vacuum/vacuumSlice';
import theme from '../../../theme';
import { WebSocketContext } from '../../../utils/socket.utils';
import { ScheduleFormData } from '../Schedule.type';
import { daysList } from './Schedule.utils';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const ScheduleDialog = () => {
  const dispatch = useAppDispatch();
  const { isVisible, schedId } = getDialog('ScheduleDialog');
  const schedulesList = geSchedulesList();
  const [currentSchedule, setCurrentSchedule] = useState<Schedules>();
  const scheduleLength = schedulesList.length;
  const roomsList = getMapSubsetsList().map((mapSubset) => mapSubset.mssid);

  const socket = useContext(WebSocketContext);
  const { id: mid } = getVacuumMap();

  const defaultValues = {
    startAt: dayjs().add(1, 'minute'),
    once: true,
    days: [],
    auto: true,
    rooms: [],
  };

  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isValid },
  } = useForm<ScheduleFormData>({ defaultValues, mode: 'onChange' });

  const getRepeat = (days: string[]) =>
    daysList.reduce((acc: string[], { value }) => (days.includes(value) ? [...acc, '1'] : [...acc, '0']), []).join('');

  const handleClose = () => {
    reset();
    dispatch(hideDialog());
  };

  const onSubmit = ({ startAt, once, days, auto, rooms }: ScheduleFormData) => {
    console.log('scheduleLength', scheduleLength);
    let payload: any = {
      hour: startAt.hour(),
      minute: startAt.minute(),
      repeat: once ? '0000000' : getRepeat(days),
      mid,
      type: auto ? 'auto' : 'spotArea',
      value: rooms.join(',') || null,
    };

    if (currentSchedule) {
      payload = { ...payload, sid: currentSchedule.sid, enable: currentSchedule.enable };
    }
    const command = currentSchedule ? 'editSched_V2' : 'addSched_V2';
    socket.emit(command, payload);
    handleClose();
  };

  useEffect(() => {
    if (isVisible) {
      if (schedId !== null) {
        const schedule = schedulesList.find((schedule) => schedule.sid === schedId);
        if (schedule) {
          setCurrentSchedule(schedule);
          reset({
            startAt: dayjs().set('hour', schedule.hour).set('minute', schedule.minute),
            once: schedule.repeat === '0000000',
            days: schedule.repeat.split('').map((isActive, index) => (+isActive ? daysList[index].value : undefined)),
            auto: schedule.content.jsonStr.content?.type === 'auto',
            rooms: schedule.content.jsonStr?.content?.value ? schedule.content.jsonStr?.content?.value.split(',') : [],
          });
        }
        console.log('reset');
      } else {
        reset({ ...defaultValues, startAt: dayjs() });
      }
      console.log(defaultValues);
    }
  }, [isVisible, schedId]);

  const auto = useWatch({
    control,
    name: 'auto',
    defaultValue: true,
  });

  const once = useWatch({
    control,
    name: 'once',
    defaultValue: true,
  });

  const startAt = useWatch({
    control,
    name: 'startAt',
    defaultValue: dayjs(),
  });

  return (
    <Dialog open={isVisible} onClose={handleClose}>
      <DialogTitle>{`${schedId === null ? 'Add a new' : 'Edit this'} Schedule`}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name={'startAt'}
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl sx={{ m: 1, width: 300 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Start At"
                    value={value}
                    onChange={onChange}
                    renderInput={(params) => (
                      <TextField {...params} helperText={error ? error.message : null} error={!!error} />
                    )}
                  />
                  {dayjs().isAfter(startAt) && isDirty && (
                    <FormHelperText sx={{ display: 'flex' }}>
                      <Warning sx={{ marginRight: theme.typography.pxToRem(5) }} />
                      Since the selected time has already passed today, this schedule will start tomorrow or the next
                      selected day.
                    </FormHelperText>
                  )}
                </LocalizationProvider>
              </FormControl>
            )}
          />
          <Divider sx={{ margin: `${theme.typography.pxToRem(15)} ${theme.typography.pxToRem(10)}` }} />
          <FormGroup>
            <Controller
              name={'once'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel control={<Switch checked={value} onChange={onChange} />} label="Once" />
              )}
            />
          </FormGroup>
          <Controller
            name={'days'}
            control={control}
            rules={{ required: once ? false : "selected at least one day or switch on 'once'." }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl sx={{ m: 1, width: 300 }} error={!!error}>
                <InputLabel id="repeat">Repeat</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  disabled={once}
                  error={!!error}
                  value={value}
                  onChange={onChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {daysList
                        .filter(({ value }) => selected.includes(value))
                        .map(({ value, label }) => (
                          <Chip key={value} label={label} />
                        ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {daysList.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
                {error && (
                  <FormHelperText sx={{ display: 'flex' }}>
                    <Warning sx={{ marginRight: theme.typography.pxToRem(5) }} />
                    {error.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
          <Divider sx={{ margin: `${theme.typography.pxToRem(15)} ${theme.typography.pxToRem(10)}` }} />
          <Controller
            name={'auto'}
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormGroup>
                <FormControlLabel control={<Switch checked={value} onChange={onChange} />} label="Auto" />
              </FormGroup>
            )}
          />

          <Controller
            name={'rooms'}
            control={control}
            rules={{ required: auto ? false : "selected at least one room or switch on 'auto'." }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl sx={{ m: 1, width: 300 }} error={!!error}>
                <InputLabel id="rooms">Rooms</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  error={!!error}
                  value={value}
                  onChange={onChange}
                  disabled={auto}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((roomId) => (
                        <Chip key={`room-${roomId}`} label={`Room ${roomId}`} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {roomsList
                    .sort((a, b) => +a - +b)
                    .map((roomId) => (
                      <MenuItem key={`room-${roomId}`} value={roomId}>
                        {`Room ${roomId}`}
                      </MenuItem>
                    ))}
                </Select>
                {error && (
                  <FormHelperText sx={{ display: 'flex' }}>
                    <Warning sx={{ marginRight: theme.typography.pxToRem(5) }} />
                    {error.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={!isDirty || !isValid} onClick={handleSubmit(onSubmit)}>
          {schedId === null ? 'Add' : 'Edit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
