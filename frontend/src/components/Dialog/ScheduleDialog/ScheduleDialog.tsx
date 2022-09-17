import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  FormControl,
  FormLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { getDialogStatus, hideDialog } from '../../../store/dialog/dialogSlice';
import { useAppDispatch } from '../../../store/hooks';
import { getMapSubsetsList } from '../../../store/vacuum/vacuumSlice';

export const ScheduleDialog = () => {
  const isVisible = getDialogStatus('ScheduleDialog');
  const roomsList = getMapSubsetsList().map((mapSubset) => mapSubset.mssid);
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(hideDialog());

  const handleSubmit = () => {
    handleClose();
  };

  return (
    <Dialog open={isVisible} onClose={handleClose}>
      <DialogTitle>Add a new Schedule</DialogTitle>
      <DialogContent>
        <DialogContentText>form will goes here</DialogContentText>
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Time"
              value={dayjs()}
              onChange={console.log}
              // disabled
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <FormControl component="fieldset">
            <FormLabel component="legend">Repeat</FormLabel>
            <FormControlLabel value="sun" control={<Checkbox />} label="Sunday" />
            <FormControlLabel value="mon" control={<Checkbox />} label="Monday" />
            <FormControlLabel value="tue" control={<Checkbox />} label="Tuesday" />
            <FormControlLabel value="wed" control={<Checkbox />} label="Wednesday" />
            <FormControlLabel value="thu" control={<Checkbox />} label="Thursday" />
            <FormControlLabel value="fri" control={<Checkbox />} label="Friday" />
            <FormControlLabel value="sat" control={<Checkbox />} label="Saturday" />
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel component="legend">Rooms</FormLabel>
            <FormControlLabel value="auto" control={<Checkbox />} label="Auto" />

            {roomsList.map((roomId) => (
              <FormControlLabel value={roomId} control={<Checkbox />} label={`Room ${roomId}`} />
            ))}
          </FormControl>
        </>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleClose}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
