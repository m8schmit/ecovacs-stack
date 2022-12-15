import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import MainFrame from './components/UI/OptionsFrame/MainFrame/MainFrame';
import Dashboard from './pages/Dashboard/Dashboard';
import Edit from './pages/Edit/Edit';
import websocketService from './services/websocket.service';
import { useAppDispatch } from './store/hooks';
import {
  incrementMapTracesListUpdateIndex,
  onRelocateSuccess,
  setMapSubsetsList,
  setMapTracesList,
  setObstaclesList,
  setVacuumMap,
  setVacuumPos,
} from './store/vacuum/mapSlice';
import {
  setErrorsList,
  setEventsList,
  setLifeSpanAccessory,
  setLifeSpanDeviceList,
} from './store/vacuum/notificationSlice';
import {
  setAutoEmpty,
  setChargeState,
  setDoNotDisturb,
  setMoppingOption,
  setSavedPatternList,
  setSchedulesList,
  setVacuumBattery,
  setVacuumingOption,
  setVacuumState,
} from './store/vacuum/stateSlice';
import { WebSocketContext } from './utils/socket.utils';

const App = () => {
  const [socket, setSocket] = useState<Socket>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('start websocket Service.');
    const websocket = websocketService();
    setSocket(websocket);

    return () => {
      websocket.disconnect();
    };
  }, [setSocket]);

  useEffect(() => {
    socket &&
      socket.on('connect', () => {
        console.log('connected! ', socket.id);
        socket.emit('getMajorMap');
      });

    socket &&
      socket.on('vacuumMap', (payload) => {
        dispatch(setVacuumMap(payload));
      });

    socket &&
      socket.on('chargePos', (payload) => {
        dispatch(
          setVacuumPos({
            device: 'dock',
            devicesCoordinates: payload[0],
          }),
        );
      });

    socket &&
      socket.on('botPos', (payload) => {
        dispatch(
          setVacuumPos({
            device: 'bot',
            devicesCoordinates: payload,
          }),
        );
      });

    socket &&
      socket.on('batteryLevel', (payload) =>
        dispatch(setVacuumBattery({ level: payload.value, isLow: !!+payload.isLow })),
      );

    socket && socket.on('status', (payload) => dispatch(setVacuumState(payload)));

    socket && socket.on('chargeState', (payload) => dispatch(setChargeState(payload)));

    socket && socket.on('mapSubSet', (payload) => dispatch(setMapSubsetsList(payload)));

    socket && socket.on('speed', (payload) => dispatch(setVacuumingOption(payload)));

    socket && socket.on('cleanCount', (payload) => dispatch(setVacuumingOption(payload)));

    socket && socket.on('autoEmpty', (payload) => dispatch(setAutoEmpty(payload)));

    socket && socket.on('schedulesList', (payload) => dispatch(setSchedulesList(payload)));

    socket && socket.on('waterInfo', (payload) => dispatch(setMoppingOption(payload)));

    socket && socket.on('doNotDisturb', (payload) => dispatch(setDoNotDisturb(payload)));

    socket && socket.on('relocateSuccess', () => dispatch(onRelocateSuccess()));

    socket && socket.on('lifeSpanInfo', (payload) => dispatch(setLifeSpanDeviceList(payload)));

    socket && socket.on('obstacleList', (payload) => dispatch(setObstaclesList(payload)));

    socket &&
      socket.on('lifeSpanReminder', (payload) => {
        console.log('LIFESPAN', payload);
        dispatch(setLifeSpanAccessory(payload));
      });

    socket &&
      socket.on('eventList', (payload) =>
        dispatch(setEventsList(payload.map((botEvent: any) => ({ ...botEvent, code: botEvent.evt_code })))),
      );
    socket &&
      socket.on('errorList', (payload) =>
        dispatch(setErrorsList(payload.map((botError: any) => ({ ...botError, code: botError.error_code })))),
      );

    socket && socket.on('savedPatternList', (payload) => dispatch(setSavedPatternList(payload)));

    socket &&
      socket.on('mapTrace', (payload) => {
        payload.isResponse && dispatch(incrementMapTracesListUpdateIndex());
        dispatch(setMapTracesList(payload));
      });
  }, [socket]);

  return (
    <>
      {socket && (
        <WebSocketContext.Provider value={socket}>
          <BrowserRouter>
            <Box sx={{ minHeight: '100vh', display: 'flex', width: '100%' }}>
              <MainFrame>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/edit" element={<Edit />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainFrame>
            </Box>
          </BrowserRouter>
        </WebSocketContext.Provider>
      )}
      {!socket && <Typography>connection to websocket server in progress...</Typography>}
    </>
  );
};

export default App;
