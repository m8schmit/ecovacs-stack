import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useContext, ChangeEvent } from 'react';
import { getMoppingOption } from '../../../store/vacuum/stateSlice';
import { WebSocketContext } from '../../../utils/socket.utils';

const WaterFlow = () => {
  const socket = useContext(WebSocketContext);

  const { amount } = getMoppingOption();
  const handleChange = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    console.log(value);
    socket.emit('setWaterInfo', { amount: +value });
  };

  return (
    <FormControl>
      <FormLabel id="water-flow">Water Flow</FormLabel>
      <RadioGroup
        row
        aria-labelledby="vac-water-options"
        value={amount}
        onChange={handleChange}
        name="vac-power-options"
      >
        <FormControlLabel value={1} control={<Radio />} label="Low" />
        <FormControlLabel value={2} control={<Radio />} label="normal" />
        <FormControlLabel value={3} control={<Radio />} label="High" />
        <FormControlLabel value={4} control={<Radio />} label="Max" />
      </RadioGroup>
    </FormControl>
  );
};
export default WaterFlow;
