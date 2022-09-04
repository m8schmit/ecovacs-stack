import './App.css';

import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import websocketService from './services/websocket.service';

const App = () => {
  useEffect(() => {
    websocketService();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Box>
              <Typography>hello</Typography>
            </Box>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
