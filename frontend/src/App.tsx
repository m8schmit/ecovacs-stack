import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import websocketService from './services/websocket.service';
import { useAppDispatch } from './store/hooks';
import { getVacuumClean, getVacuumMap, setVacuumMap } from './store/vacuum/vacuumSlice';

const App = () => {
  const [socket, setSocket] = useState<Socket>();
  const dispatch = useAppDispatch();

  const { data: mapData } = getVacuumMap();
  const { data: cleanData } = getVacuumClean();

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
        console.log('receive vacuumMap', payload);
        dispatch(setVacuumMap(payload));
      });
  }, [socket]);

  const switchCleanState = () => {
    console.log('switchCleanState', cleanData);
    cleanData === 'start' && socket && socket.emit('clean', 'pause');
    cleanData === 'pause' && socket && socket.emit('clean', 'start');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Box>
              <Typography>hello</Typography>
              <Button onClick={() => switchCleanState()}>{cleanData}</Button>
              <Box>
                <img src={`data:image/png;base64,${mapData}`} />
              </Box>
            </Box>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
