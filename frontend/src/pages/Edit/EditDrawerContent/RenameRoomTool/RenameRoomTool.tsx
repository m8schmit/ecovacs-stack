import { TextField } from '@mui/material';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { OptionsFrame } from '../../../../components/UI/OptionsFrame/OptionsFrame';
import { getMapSubsetsList, getSelectedRoomsList, getVacuumMap } from '../../../../store/vacuum/mapSlice';
import theme from '../../../../theme';
import { WebSocketContext } from '../../../../utils/socket.utils';
import SelectRoomType from './SelectRoomType/SelectRoomType';

export const RenameRoomTool = () => {
  const socket = useContext(WebSocketContext);
  const selectedRoomsList = getSelectedRoomsList();
  const mapSubsetsList = getMapSubsetsList();
  const { id: mapId } = getVacuumMap();
  const [value, setValue] = useState<string>('');

  const handleRename = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(event.target.value);

  const getMapSubsetbyId = () =>
    mapSubsetsList.find(({ mssid: currentMssid }) => currentMssid === `${selectedRoomsList[0]}`);

  const getMapSubType = () => getMapSubsetbyId()?.subtype || '0';

  const saveRename = () =>
    socket.emit('renameRoom', { mssid: `${selectedRoomsList[0]}`, mid: mapId, subtype: getMapSubType(), name: value });

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
      <OptionsFrame sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SelectRoomType subtype={getMapSubType()} />
        <TextField
          sx={{ width: '100%', marginLeft: theme.typography.pxToRem(10) }}
          size="medium"
          label="Room Name"
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
