import { Bolt, Close, Pause, PlayArrow, Stop } from '@mui/icons-material';
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import { useContext } from 'react';

import { useAppDispatch } from '../../store/hooks';
import { getSelectedRoomsList, resetMapTracesList, resetSelectedRoomsList } from '../../store/vacuum/mapSlice';
import { getAutoEmptyState, getChargeState, getVacuumClean } from '../../store/vacuum/stateSlice';
import { BotAct, CleanTask } from '../../store/vacuum/vacuumSlice.type';
import { WebSocketContext } from '../../utils/socket.utils';
import { isCleanStateContent, isString } from '../../utils/typeguard.utils';
import { OptionsFrame } from '../UI/OptionsFrame/OptionsFrame';

const CleanState = () => {
  const status = getVacuumClean();
  const selectedRoomsList = getSelectedRoomsList();
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
      type: !selectedRoomsList.length ? 'auto' : 'spotArea',
      value: selectedRoomsList.join(',') || null,
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
    const newTask = getCleanTask();
    console.log('[delete] emit clean with ', newTask);
    socket.emit('clean', getCleanTask('stop'));
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
        <Typography>currently: {getTextState()}</Typography>
        {status.state === 'idle' && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>
              start an <b>{selectedRoomsList.length <= 0 ? 'auto' : 'spotArea'}</b> cleaning
              {selectedRoomsList.length > 0 && ` on Rooms ${selectedRoomsList.join(', ')}.`}
            </Typography>
            {selectedRoomsList.length > 0 && (
              <Button size="small" variant="outlined" onClick={() => reset()} startIcon={<Close />}>
                reset
              </Button>
            )}
          </Box>
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
