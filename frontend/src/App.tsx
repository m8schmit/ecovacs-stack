import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import MainFrame from './components/UI/OptionsFrame/MainFrame/MainFrame';
import Dashboard from './pages/Dashboard/Dashboard';
import Edit from './pages/Edit/Edit';
import websocketService from './services/websocket.service';
import { hideDialog } from './store/dialog/dialogSlice';
import { useAppDispatch } from './store/hooks';
import { setCachedMapInfo } from './store/vacuum/editMapSlice';
import {
  incrementMapTracesListUpdateIndex,
  onRelocateSuccess,
  setGoToCoordinates,
  setMapSubsetsList,
  setMapTracesList,
  setNoGoMapSubsetsList,
  setNoMopMapSubsetsList,
  setObstaclesList,
  setSelectedRoomsList,
  setSelectedZonesList,
  setVacuumMap,
  setVacuumPos,
} from './store/vacuum/mapSlice';
import { setEventsList, setLifeSpanAccessory, setLifeSpanDeviceList } from './store/vacuum/notificationSlice';
import {
  getVacuumClean,
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
import { sliceIntoChunks } from './utils/array.utils';
import { WebSocketContext } from './utils/socket.utils';
import { isString } from './utils/typeguard.utils';

const App = () => {
  const [socket, setSocket] = useState<Socket>();
  const dispatch = useAppDispatch();
  const status = getVacuumClean();

  useEffect(() => {
    console.log('start websocket Service.');
    const websocket = websocketService();
    setSocket(websocket);

    return () => {
      websocket.disconnect();
    };
  }, []);

  //WIP todo move to backend.
  useEffect(() => {
    if (!status) return;

    const type = status?.cleanState?.type;
    if (!type) return;
    if (type === 'customArea') {
      const content = status?.cleanState?.content;
      if (!content || !isString(content)) return;
      const coordinatesList = content.split(',').map((coordinate: string) => +coordinate >> 0);

      if (status?.cleanState && status?.cleanState?.donotclean && status?.cleanState?.donotclean === 1) {
        dispatch(setGoToCoordinates([coordinatesList[0], coordinatesList[1]]));
      } else {
        dispatch(setSelectedZonesList(sliceIntoChunks(coordinatesList, 4)));
      }
    } else if (type === 'mapPoint') {
      const content = status?.cleanState?.content;
      if (!content || !isString(content)) return;

      const coordinatesList = content.split(',').map((coordinate: string) => +coordinate >> 0);
      dispatch(setGoToCoordinates([coordinatesList[0], coordinatesList[1]]));
    } else if (type === 'spotArea') {
      const content = status?.cleanState?.content;
      if (!content || !isString(content)) return;

      const mssidList = content.split(',').map((coordinate: string) => +coordinate >> 0);
      dispatch(setSelectedRoomsList(mssidList));
    }
  }, [status]);

  useEffect(() => {
    console.log(socket?.connected);
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

    socket && socket.on('NoMopMapSubSet', (payload) => dispatch(setNoMopMapSubsetsList(payload)));

    socket && socket.on('NoGoMapSubSet', (payload) => dispatch(setNoGoMapSubsetsList(payload)));

    socket && socket.on('speed', (payload) => dispatch(setVacuumingOption(payload)));

    socket && socket.on('cleanCount', (payload) => dispatch(setVacuumingOption(payload)));

    socket && socket.on('autoEmpty', (payload) => dispatch(setAutoEmpty(payload)));

    socket && socket.on('schedulesList', (payload) => dispatch(setSchedulesList(payload)));

    socket && socket.on('waterInfo', (payload) => dispatch(setMoppingOption(payload)));

    socket && socket.on('doNotDisturb', (payload) => dispatch(setDoNotDisturb(payload)));

    socket && socket.on('relocateSuccess', () => dispatch(onRelocateSuccess()));

    socket && socket.on('lifeSpanInfo', (payload) => dispatch(setLifeSpanDeviceList(payload)));

    socket && socket.on('obstacleList', (payload) => dispatch(setObstaclesList(payload)));

    socket && socket.on('cachedMapInfo', (payload) => dispatch(setCachedMapInfo(payload)));

    socket && socket.on('lifeSpanReminder', (payload) => dispatch(setLifeSpanAccessory(payload)));

    socket && socket.on('mapActionFinished', () => dispatch(hideDialog()));

    socket &&
      socket.on('eventList', (payload) =>
        dispatch(setEventsList(payload.map((botEvent: any) => ({ ...botEvent, code: botEvent.evt_code })))),
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
      {socket?.connected && (
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
