import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { ChangeEvent, useContext } from 'react';

import { getVacuumingOption } from '../../../store/vacuum/vacuumSlice';
import { WebSocketContext } from '../../../utils/socket.utils';

export const VacuumSpeed = () => {
  const socket = useContext(WebSocketContext);

  const { speed } = getVacuumingOption();
  const handleChange = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    console.log(value);
    socket.emit('setSpeed', +value);
  };

  return (
    <FormControl>
      <FormLabel id="vac-power">Speed</FormLabel>
      <RadioGroup
        row
        aria-labelledby="vac-power-options"
        value={speed}
        onChange={handleChange}
        name="vac-power-options"
      >
        <FormControlLabel value={1000} control={<Radio />} label="Quiet" />
        <FormControlLabel value={0} control={<Radio />} label="Standard" />
        <FormControlLabel value={1} control={<Radio />} label="High" />
        <FormControlLabel value={2} control={<Radio />} label="Max" />
      </RadioGroup>
    </FormControl>
  );
};
