import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useContext, useEffect } from 'react';

import { useAppDispatch } from '../../../../store/hooks';
import {
  resetGoToCoordinates,
  resetSelectedRoomsList,
  resetSelectedZonesList,
  setSelectedRoomsList,
  setSelectedZonesList,
  setSelectionType,
} from '../../../../store/vacuum/mapSlice';
import {
  getSavedPattern,
  getSelectedSavedPatternId,
  getVacuumClean,
  setSelectedSavedPatternId,
} from '../../../../store/vacuum/stateSlice';
import { WebSocketContext } from '../../../../utils/socket.utils';

const SavedPatternSelect = () => {
  const socket = useContext(WebSocketContext);
  const savedPatternList = getSavedPattern();
  const selectedSavedPatternId = getSelectedSavedPatternId();
  const dispatch = useAppDispatch();
  const { state } = getVacuumClean();

  const handleChange = ({ target: { value } }: SelectChangeEvent) => {
    console.log(value);
    const selectedPattern = savedPatternList.find((pattern) => pattern.id === +value);

    if (!selectedPattern) {
      console.error('selected saved pattern is empty!');
      return;
    }
    const { type, selected } = selectedPattern.pattern;

    dispatch(setSelectedSavedPatternId(value));

    if (type === 'spotArea') {
      dispatch(setSelectionType('room'));
      dispatch(resetSelectedZonesList());
      dispatch(resetGoToCoordinates());
      dispatch(setSelectedRoomsList(JSON.parse(selected)));
    } else if (type === 'customArea') {
      dispatch(setSelectionType('zone'));
      dispatch(resetSelectedRoomsList());
      dispatch(resetGoToCoordinates());
      dispatch(setSelectedZonesList(JSON.parse(selected)));
    } else {
      console.log('todo saved pattern for points.');
    }
  };

  useEffect(() => {
    socket.emit('getSavedPattern');
  }, []);

  return (
    <FormControl sx={{ mb: 1, minWidth: 180 }} size="small" disabled={state !== 'idle'}>
      <InputLabel id="demo-simple-select-label">Saved pattern</InputLabel>
      <Select
        labelId="saved-pattern"
        id="saved-pattern-select"
        value={selectedSavedPatternId}
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
