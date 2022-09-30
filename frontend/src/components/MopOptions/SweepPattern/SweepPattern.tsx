import { Repeat, Route } from '@mui/icons-material';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';
import { useContext, ChangeEvent } from 'react';
import { getMoppingOption } from '../../../store/vacuum/stateSlice';
import theme from '../../../theme';
import { WebSocketContext } from '../../../utils/socket.utils';

const SweepPattern = () => {
  const socket = useContext(WebSocketContext);

  const { sweepType } = getMoppingOption();
  const handleChange = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    console.log(value);
    socket.emit('setWaterInfo', { sweepType: +value });
  };
  return (
    <FormControl>
      <FormLabel id="sweeping-pattern">Sweeping Pattern</FormLabel>
      <RadioGroup
        row
        aria-labelledby="vac-sweep-options"
        value={sweepType}
        onChange={handleChange}
        name="vac-power-options"
      >
        <FormControlLabel
          value={1}
          control={<Radio />}
          label={
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              Classic 'S' pattern <Route sx={{ marginLeft: theme.typography.pxToRem(10) }} />
            </Typography>
          }
        />
        <FormControlLabel
          value={2}
          control={<Radio />}
          label={
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              'Back and Forth' pattern <Repeat sx={{ marginLeft: theme.typography.pxToRem(10) }} />
            </Typography>
          }
        />
      </RadioGroup>
    </FormControl>
  );
};

export default SweepPattern;
