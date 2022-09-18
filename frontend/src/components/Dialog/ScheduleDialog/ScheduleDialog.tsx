import { Warning } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import { useContext, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { getDialogStatus, hideDialog } from '../../../store/dialog/dialogSlice';
import { useAppDispatch } from '../../../store/hooks';
import { getMapSubsetsList, getVacuumMap } from '../../../store/vacuum/vacuumSlice';
import theme from '../../../theme';
import { WebSocketContext } from '../../../utils/socket.utils';

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

interface DaysList {
  value: string;
  label: string;
}

interface ScheduleFormData {
  startAt: dayjs.Dayjs;
  once: boolean;
  days: string[];
  auto: boolean;
  rooms: string[];
}
export const ScheduleDialog = () => {
  const isVisible = getDialogStatus('ScheduleDialog');
  const roomsList = getMapSubsetsList().map((mapSubset) => mapSubset.mssid);
  const dispatch = useAppDispatch();

  const socket = useContext(WebSocketContext);
  const { id: mapId } = getVacuumMap();

  const defaultValues: ScheduleFormData = {
    startAt: dayjs(),
    once: true,
    days: [],
    auto: true,
    rooms: [],
  };

  const daysList: DaysList[] = [
    {
      value: 'sun',
      label: 'Sunday',
    },
    {
      value: 'mon',
      label: 'Monday',
    },
    {
      value: 'tue',
      label: 'Tuesday',
    },
    {
      value: 'wed',
      label: 'Wednesday',
    },
    {
      value: 'thu',
      label: 'Thurday',
    },
    {
      value: 'fri',
      label: 'friday',
    },
    {
      value: 'sat',
      label: 'Saturday',
    },
  ];

  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isValid },
  } = useForm<ScheduleFormData>({ defaultValues, mode: 'onChange' });

  const onSubmit = (data: ScheduleFormData) => {
    console.log(data);
    // socket.emit('addSched_V2', {} );
  };

  const handleClose = () => {
    reset();
    dispatch(hideDialog());
  };

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
      <DialogTitle>Add a new Schedule</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <FormControl sx={{ m: 1, width: 300 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name={'startAt'}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      <TimePicker
                        label="Start At"
                        value={value}
                        onChange={onChange}
                        renderInput={(params) => (
                          <TextField {...params} helperText={error ? error.message : null} error={!!error} />
                        )}
                      />
                      {dayjs().isAfter(startAt) && (
                        <FormHelperText sx={{ display: 'flex' }}>
                          <Warning sx={{ marginRight: theme.typography.pxToRem(5) }} />
                          Since the selected time has already passed today, this schedule will start tomorrow or the
                          next selected day.
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </LocalizationProvider>
            </FormControl>
          </Box>
          <Divider sx={{ margin: `${theme.typography.pxToRem(15)} ${theme.typography.pxToRem(10)}` }} />
          <Box>
            <FormGroup>
              <Controller
                name={'once'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    value={value}
                    onChange={onChange}
                    control={<Switch defaultChecked />}
                    label="Once"
                  />
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
          </Box>
          <Divider sx={{ margin: `${theme.typography.pxToRem(15)} ${theme.typography.pxToRem(10)}` }} />
          <Box>
            <Controller
              name={'auto'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormGroup>
                  <FormControlLabel
                    value={value}
                    onChange={onChange}
                    control={<Switch defaultChecked />}
                    label="Auto"
                  />
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
                    {roomsList.map((roomId) => (
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
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={!isDirty || !isValid} onClick={handleSubmit(onSubmit)}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
