import { SyntheticEvent, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import MainDrawer from '../../components/UI/Drawer/MainDrawer';
import Main from '../../components/UI/Main/Main';
import MainFrame from '../../components/UI/OptionsFrame/MainFrame/MainFrame';
import ControlMap from '../../components/VacuumMap/ControlMap';
import EditMap from '../../components/VacuumMap/EditMap';
import ControlDrawerContent from './ControlDrawerContent/ControlDrawerContent';
import EditDrawerContent from './EditDrawerContent/EditDrawerContent';

const Dashboard = () => {
  return (
    <>
      <MainFrame>
        <MainDrawer>
          <Routes>
            <Route path="/" element={<ControlDrawerContent />} />
            <Route path="/edit" element={<EditDrawerContent />} />
          </Routes>
        </MainDrawer>
        <Main>
          <Routes>
            <Route path="/" element={<ControlMap />} />
            <Route path="/edit" element={<EditMap />} />
          </Routes>
        </Main>
      </MainFrame>
    </>
  );
};

export default Dashboard;
