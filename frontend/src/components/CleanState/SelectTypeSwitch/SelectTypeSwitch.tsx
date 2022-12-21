import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { ChangeEvent } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import {
  getSelectionType,
  resetGoToCoordinates,
  resetSelectedRoomsList,
  resetSelectedZonesList,
  setSelectionType,
} from '../../../store/vacuum/mapSlice';
import { getVacuumClean, resetSelectedSavedPatternId } from '../../../store/vacuum/stateSlice';

const SelectTypeSwitch = () => {
  const selectionType = getSelectionType();
  const dispatch = useAppDispatch();
  const { state } = getVacuumClean();

  const handleChange = (_: ChangeEvent<HTMLInputElement>, value: any) => {
    console.log(value);
    dispatch(resetSelectedRoomsList());
    dispatch(resetSelectedZonesList());
    dispatch(resetGoToCoordinates());
    dispatch(resetSelectedSavedPatternId());
    dispatch(setSelectionType(value));
  };

  return (
    <FormControl disabled={state !== 'idle'}>
      <RadioGroup
        row
        aria-labelledby="vac-power-options"
        value={selectionType}
        onChange={handleChange}
        name="vac-power-options"
      >
        <FormControlLabel value={'room'} control={<Radio />} label="Select rooms" />
        <FormControlLabel value={'zone'} control={<Radio />} label="Define zones" />
        <FormControlLabel value={'point'} control={<Radio />} label="Click to go" />
      </RadioGroup>
    </FormControl>
  );
};

export default SelectTypeSwitch;
