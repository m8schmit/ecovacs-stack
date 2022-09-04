import './App.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import MQTTService from './services/mqtt.service';
import { Box, Typography } from '@mui/material';

const App = () => {
  useEffect(() => {
    MQTTService();
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
