import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { ChangeEvent, useContext } from 'react';

import { getVacuumingOption } from '../../../store/vacuum/vacuumSlice';
import { WebSocketContext } from '../../../utils/socket.utils';

const CleanCount = () => {
  const socket = useContext(WebSocketContext);

  const { count } = getVacuumingOption();
  const handleChange = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    console.log(value);
    socket.emit('setCleanCount', +value);
  };
  return (
    <FormControl>
      <FormLabel id="vac-CleanCount">CleanCount</FormLabel>
      <RadioGroup
        row
        aria-labelledby="vac-CleanCount-options"
        value={count}
        onChange={handleChange}
        name="vac-CleanCount-options"
      >
        <FormControlLabel value={1} control={<Radio />} label="Once" />
        <FormControlLabel value={2} control={<Radio />} label="Twice" />
      </RadioGroup>
    </FormControl>
  );
};

export default CleanCount;
