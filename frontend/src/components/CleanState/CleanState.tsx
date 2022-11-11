import { Bolt, Close, Pause, PlayArrow, Save, Stop } from '@mui/icons-material';
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import { useContext } from 'react';

import { useAppDispatch } from '../../store/hooks';
import {
  getSelectedRoomsList,
  getSelectedZonesList,
  getSelectionType,
  resetMapTracesList,
  resetSelectedRoomsList,
  resetSelectedZonesList,
} from '../../store/vacuum/mapSlice';
import { getAutoEmptyState, getChargeState, getVacuumClean } from '../../store/vacuum/stateSlice';
import { BotAct, CleanTask } from '../../store/vacuum/vacuumSlice.type';
import { WebSocketContext } from '../../utils/socket.utils';
import { isCleanStateContent, isString } from '../../utils/typeguard.utils';
import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';
import SavedPatternSelect from './SavedPattern/SavedPatternSelect/SavedPatternSelect';
import SelectTypeSwitch from './SelectTypeSwitch/SelectTypeSwitch';

const CleanState = () => {
  const status = getVacuumClean();
  const selectedRoomsList = getSelectedRoomsList();
  const selectedZonesList = getSelectedZonesList();
  const selectionType = getSelectionType();
  const { isCharging } = getChargeState();
  const { active: autoEmptyActive } = getAutoEmptyState();

  const dispatch = useAppDispatch();

  const socket = useContext(WebSocketContext);

  const getNextAct = (): BotAct => {
    if (status?.cleanState?.motionState === 'working' || status?.state === 'goCharging') {
      return 'pause';
    } else if (status?.cleanState?.motionState === 'pause') {
      return 'resume';
    } else {
      console.log('status (should be idle or an unkown state): ', status);
      return 'start';
    }
  };

  const getCleanTask = (act: BotAct | null = null): CleanTask => {
    return {
      act: act ? act : getNextAct(),
      type: selectedRoomsList.length ? 'spotArea' : selectedZonesList.length ? 'customArea' : 'auto',
      value: selectedRoomsList.join(',') || `${selectedZonesList.join(';')};` || null,
    };
  };
  const switchCleanState = () => {
    //TODO add a condition to resume charging
    console.log('switchCleanState', status);
    const newTask = getCleanTask();
    console.log('[switch] emit clean with ', newTask);
    newTask.act === 'start' && dispatch(resetMapTracesList());
    socket.emit('clean', newTask);
  };

  const goCharging = () => {
    socket.emit('charge');
  };

  const reset = () => {
    dispatch(resetSelectedRoomsList());
    dispatch(resetSelectedZonesList());
    socket.emit('clean', getCleanTask('stop'));
  };

  const save = () => {
    socket.emit('savePattern', {
      selected: JSON.stringify(selectedRoomsList.length ? selectedRoomsList : selectedZonesList),
      type: selectedRoomsList.length ? 'spotArea' : 'customArea',
      name: 'todo',
    });
  };

  const getTextState = () => {
    if (autoEmptyActive) {
      return (
        <>
          Currently emptying the dustbox <CircularProgress color="info" size={15} />
        </>
      );
    }
    return (
      <>
        {/* TODO fix this `status?.cleanState?.content` can be string|null|{} */}
        {/* TODO handle the 'continue cleaning' state */}
        {status?.cleanState?.type ||
          (isCleanStateContent(status?.cleanState?.content) && status?.cleanState?.content.type) ||
          status.state}{' '}
        {status?.cleanState?.content &&
          `on Rooms ${
            (isCleanStateContent(status?.cleanState?.content) && status?.cleanState?.content?.value) ||
            (isString(status?.cleanState?.content) && status?.cleanState?.content)
          }`}
      </>
    );
  };

  return (
    <>
      <Typography variant="overline">Controls</Typography>

      <OptionsFrame>
        <SelectTypeSwitch />
        <SavedPatternSelect />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>currently: {getTextState()}</Typography>
          {(selectedRoomsList.length > 0 || selectedZonesList.length > 0) && (
            <Box>
              <Button size="small" variant="outlined" onClick={() => save()} startIcon={<Save />}>
                save
              </Button>
              <Button size="small" variant="outlined" onClick={() => reset()} startIcon={<Close />}>
                reset
              </Button>
            </Box>
          )}
        </Box>

        {status.state === 'idle' && (
          <Typography>
            start an <b>{selectedRoomsList.length ? 'spotArea' : selectedZonesList.length ? 'customArea' : 'auto'}</b>{' '}
            cleaning
            {selectedRoomsList.length > 0 && ` on Rooms ${selectedRoomsList.join(', ')}.`}
            {selectedZonesList.length > 0 && ` on Zones [${selectedZonesList.join('], [')}].`}
          </Typography>
        )}
        <IconButton
          size="large"
          color="primary"
          disabled={status.state === 'idle' || autoEmptyActive}
          onClick={() => reset()}
        >
          <Stop />
        </IconButton>
        <IconButton size="large" color="primary" onClick={() => switchCleanState()} disabled={autoEmptyActive}>
          {(status?.cleanState?.motionState === 'working' ||
            (status.state === 'goCharging' && status?.cleanState?.motionState !== 'pause')) && <Pause />}
          {(status?.cleanState?.motionState === 'pause' || status.state === 'idle') && <PlayArrow />}
        </IconButton>
        <IconButton size="large" color="primary" disabled={isCharging || autoEmptyActive} onClick={() => goCharging()}>
          <Bolt />
        </IconButton>
      </OptionsFrame>
    </>
  );
};

export default CleanState;
