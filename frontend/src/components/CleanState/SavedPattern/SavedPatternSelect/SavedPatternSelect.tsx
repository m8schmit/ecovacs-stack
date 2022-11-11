import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ChangeEvent, ReactNode, useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../../store/hooks';
import {
  resetSelectedRoomsList,
  resetSelectedZonesList,
  setSelectedRoomsList,
  setSelectedZonesList,
  updateSelectedRoomsList,
  updateSelectedZonesList,
} from '../../../../store/vacuum/mapSlice';
import { getSavedPattern } from '../../../../store/vacuum/stateSlice';
import { WebSocketContext } from '../../../../utils/socket.utils';

const SavedPatternSelect = () => {
  const socket = useContext(WebSocketContext);
  const savedPatternList = getSavedPattern();
  const dispatch = useAppDispatch();
  const [selectedPatternId, setSelectedPatternId] = useState('');

  const handleChange = ({ target: { value } }: SelectChangeEvent) => {
    console.log(value);
    setSelectedPatternId(value);
    const selectedPattern = savedPatternList.find((pattern) => pattern.id === +value);

    if (!selectedPattern) {
      console.error('selected saved pattern is empty!');
      return;
    }
    console.log(selectedPattern);
    const { type, selected } = selectedPattern.pattern;

    if (type === 'spotArea') {
      dispatch(resetSelectedZonesList());
      dispatch(setSelectedRoomsList(JSON.parse(selected)));
    } else {
      dispatch(resetSelectedRoomsList());
      dispatch(setSelectedZonesList(JSON.parse(selected)));
    }
  };

  useEffect(() => {
    socket.emit('getSavedPattern');
  }, []);

  return (
    <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
      <InputLabel id="demo-simple-select-label">Saved pattern</InputLabel>
      <Select
        labelId="saved-pattern"
        id="saved-pattern-select"
        value={selectedPatternId}
        label="Saved pattern"
        autoWidth
        onChange={handleChange}
      >
        {savedPatternList.map(({ pattern: { name }, id }) => (
          <MenuItem key={`saved-pattern-${id}`} value={id}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SavedPatternSelect;
