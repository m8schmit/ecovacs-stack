import { TextField, Typography } from '@mui/material';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { OptionsFrame } from '../../../components/UI/OptionsFrame/OptionsFrame';
import { getMapSubsetsList, getSelectedRoomsList, getVacuumMap } from '../../../store/vacuum/mapSlice';
import { WebSocketContext } from '../../../utils/socket.utils';

export const RenameRoomTool = () => {
  const socket = useContext(WebSocketContext);
  const selectedRoomsList = getSelectedRoomsList();
  const mapSubsetsList = getMapSubsetsList();
  const { id: mapId } = getVacuumMap();
  const [value, setValue] = useState<string>('');

  const handleRename = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(event.target.value);

  const saveRename = () =>
    socket.emit('renameRoom', { mssid: `${selectedRoomsList[0]}`, mid: mapId, subset: 0, name: value });

  const getMapSubsetbyId = () =>
    mapSubsetsList.find(({ mssid: currentMssid }) => currentMssid === `${selectedRoomsList[0]}`);

  useEffect(() => {
    if (selectedRoomsList.length !== 1 || (!selectedRoomsList[0] && selectedRoomsList[0] !== 0)) {
      setValue('');
      return;
    }

    const currentSelectRoomSubset = getMapSubsetbyId();
    if (currentSelectRoomSubset) {
      if (currentSelectRoomSubset.name) {
        setValue(currentSelectRoomSubset.name);
      } else {
        setValue(`Room ${selectedRoomsList[0]}`);
      }
    }
  }, [selectedRoomsList]);

  return (
    <>
      <Typography variant="overline">Rename a selected room</Typography>
      <OptionsFrame>
        TODO subtype
        <TextField
          sx={{ width: '100%' }}
          label="Select a room to rename it"
          variant="filled"
          onChange={handleRename}
          onBlur={saveRename}
          disabled={selectedRoomsList.length !== 1}
          value={value}
        />
      </OptionsFrame>
    </>
  );
};

export default RenameRoomTool;
