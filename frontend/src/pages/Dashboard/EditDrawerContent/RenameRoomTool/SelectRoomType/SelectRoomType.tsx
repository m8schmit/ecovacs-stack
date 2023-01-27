import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { FC, useContext, useEffect, useState } from 'react';
import { ROOM_TYPE_LABEL, ROOM_TYPE_V2 } from '../../../../../components/VacuumMap/Map.utils';
import { getSelectedRoomsList, getMapSubsetsList, getVacuumMap } from '../../../../../store/vacuum/mapSlice';
import { RoomType } from '../../../../../store/vacuum/mapSlice.type';
import theme from '../../../../../theme';
import { WebSocketContext } from '../../../../../utils/socket.utils';

interface SelectRoomTypeProps {
  subtype: string;
}
const SelectRoomType: FC<SelectRoomTypeProps> = ({ subtype }) => {
  const socket = useContext(WebSocketContext);
  const selectedRoomsList = getSelectedRoomsList();
  const mapSubsetsList = getMapSubsetsList();
  const { id: mapId } = getVacuumMap();
  const [value, setValue] = useState<string>('');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    setValue(subtype);
  }, [subtype]);

  const handleChange = ({ target: { value } }: SelectChangeEvent) =>
    socket.emit('renameRoom', { mssid: `${selectedRoomsList[0]}`, mid: mapId, subtype: value, name });

  const getMapSubsetbyId = () =>
    mapSubsetsList.find(({ mssid: currentMssid }) => currentMssid === `${selectedRoomsList[0]}`);

  useEffect(() => {
    if (selectedRoomsList.length !== 1 || (!selectedRoomsList[0] && selectedRoomsList[0] !== 0)) {
      setName('');
      return;
    }

    const currentSelectRoomSubset = getMapSubsetbyId();
    if (currentSelectRoomSubset) {
      if (currentSelectRoomSubset.name) {
        setName(currentSelectRoomSubset.name);
      } else {
        setName(`Room ${selectedRoomsList[0]}`);
      }
    }
  }, [selectedRoomsList]);

  return (
    <>
      <FormControl sx={{ minWidth: 180 }} variant="filled">
        <InputLabel id="demo-simple-select-label">Room Type</InputLabel>
        <Select
          labelId="room-type"
          id="room-type-select"
          value={value}
          label="Room Type"
          autoWidth
          onChange={handleChange}
          disabled={selectedRoomsList.length !== 1}
        >
          {ROOM_TYPE_LABEL.map((label, index) => (
            <MenuItem key={`room-type-${index}`} value={`${index}`}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="img"
                  sx={{ height: theme.typography.pxToRem(25), marginRight: theme.typography.pxToRem(10) }}
                  src={`data:image/png;base64,${ROOM_TYPE_V2[index as RoomType]}`}
                />
                {label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default SelectRoomType;
