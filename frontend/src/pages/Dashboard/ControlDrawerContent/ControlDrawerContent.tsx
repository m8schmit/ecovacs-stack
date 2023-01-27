import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { useState, SyntheticEvent } from 'react';
import Commands from '../Commands/Commands';
import Options from '../Options/Options';

const ControlDrawerContent = () => {
  const [value, setValue] = useState('2');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', typography: 'body1', overflow: 'hidden' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            sx={{ width: '100%' }}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="lab API tabs example"
          >
            <Tab label="Commands" value="2" />
            <Tab label="Options" value="3" />
            <Tab label="Reports" value="4" disabled />
          </TabList>
        </Box>
        <TabPanel
          value="2"
          sx={value === '2' ? { display: 'flex', height: 'calc(100% - 48px)', overflow: 'scroll' } : {}}
        >
          <Commands />
        </TabPanel>
        <TabPanel
          value="3"
          sx={value === '3' ? { display: 'flex', height: 'calc(100% - 48px)', overflow: 'scroll' } : {}}
        >
          <Options />
        </TabPanel>
        <TabPanel
          value="4"
          sx={value === '4' ? { display: 'flex', height: 'calc(100% - 48px)', overflow: 'scroll' } : {}}
        ></TabPanel>
      </TabContext>
    </Box>
  );
};

export default ControlDrawerContent;
