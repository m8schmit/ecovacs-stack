import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Tab, Toolbar } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import Drawer from '../../components/UI/Drawer/Drawer';

import ControlMap from '../../components/VacuumMap/ControlMap';
import Commands from './Commands/Commands';
import Notifications from './Notifications/Notifications';
import Options from './Options/Options';

const Dashboard = () => {
  const [value, setValue] = useState('2');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Drawer>
        <Box sx={{ width: '100%', typography: 'body1', overflow: 'hidden' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Notifications" value="1" />
                <Tab label="Commands" value="2" />
                <Tab label="Options" value="3" />
                <Tab label="Reports" value="4" disabled />
              </TabList>
            </Box>
            <TabPanel
              value="1"
              sx={value === '1' ? { display: 'flex', height: 'calc(100vh)', overflow: 'scroll' } : {}}
            >
              <Notifications />
            </TabPanel>
            <TabPanel
              value="2"
              sx={value === '2' ? { display: 'flex', height: 'calc(100vh)', overflow: 'scroll' } : {}}
            >
              <Commands />
            </TabPanel>
            <TabPanel
              value="3"
              sx={value === '3' ? { display: 'flex', height: 'calc(100vh)', overflow: 'scroll' } : {}}
            >
              <Options />
            </TabPanel>
            <TabPanel
              value="4"
              sx={value === '4' ? { display: 'flex', height: 'calc(100vh)', overflow: 'scroll' } : {}}
            ></TabPanel>
          </TabContext>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, height: '100vh', paddingTop: '64px', position: 'relative' }}>
        <Toolbar />
        <ControlMap />
      </Box>
    </>
  );
};

export default Dashboard;
