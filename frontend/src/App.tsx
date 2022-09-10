import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import Dashboard from './pages/Dashboard/Dashboard';
import websocketService from './services/websocket.service';
import { useAppDispatch } from './store/hooks';
import {
  setAutoEmpty,
  setChargeState,
  setMapSubsetsList,
  setMapTracesList,
  setVacuumBattery,
  setVacuumingOption,
  setVacuumMap,
  setVacuumPos,
  setVacuumState,
} from './store/vacuum/vacuumSlice';
import { WebSocketContext } from './utils/socket.utils';

const App = () => {
  const [socket, setSocket] = useState<Socket>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setSocket(websocketService());
  }, []);

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

    socket &&
      socket.on('mapTrace', (payload) => {
        console.log('receive mapTraces ', payload);
        //TODO get the previous Traces on load during a cleaning
        dispatch(setMapTracesList(payload));
      });
  }, [socket]);

  return (
    <>
      {socket && (
        <WebSocketContext.Provider value={socket}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
          </BrowserRouter>
        </WebSocketContext.Provider>
      )}
      {!socket && <Typography>connection to websocket server in progress...</Typography>}
    </>
  );
};

export default App;
