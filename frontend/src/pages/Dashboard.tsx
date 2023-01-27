import { Navigate, Route, Routes } from 'react-router-dom';

import MainDrawer from '../components/UI/Drawer/MainDrawer';
import Main from '../components/UI/Main/Main';
import MainFrame from '../components/UI/OptionsFrame/MainFrame/MainFrame';
import ControlMap from '../components/VacuumMap/ControlMap';
import EditMap from '../components/VacuumMap/EditMap';
import ControlDrawerContent from './Control/ControlDrawerContent/ControlDrawerContent';
import EditDrawerContent from './Edit/EditDrawerContent/EditDrawerContent';

const Dashboard = () => {
  return (
    <>
      <MainFrame>
        <MainDrawer>
          <Routes>
            <Route path="/" element={<ControlDrawerContent />} />
            <Route path="/edit" element={<EditDrawerContent />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainDrawer>
        <Main>
          <Routes>
            <Route path="/" element={<ControlMap />} />
            <Route path="/edit" element={<EditMap />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Main>
      </MainFrame>
    </>
  );
};

export default Dashboard;
