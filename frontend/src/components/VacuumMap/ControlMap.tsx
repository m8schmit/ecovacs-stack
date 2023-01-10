import '../../../node_modules/ol/ol.css';

import Projection from 'ol/proj/Projection';

import { getSelectionType } from '../../store/vacuum/mapSlice';
import { getVacuumClean } from '../../store/vacuum/stateSlice';
import Map from '../UI/Map/Map';
import GoToInteraction from './Interactions/GoToInteraction';
import SelectRoomInteraction from './Interactions/SelectRoomInteraction';
import SelectZonesInteraction from './Interactions/SelectZonesInteraction';
import DockPosLayer from './Layers/DockPosLayer';
import LabelsLayer from './Layers/LabelsLayer';
import MainLayer from './Layers/MainLayer';
import NoGoZonesLayer from './Layers/NoGoZonesLayer';
import NoMopZonesLayer from './Layers/NoMopZonesLayer';
import ObstaclesLayer from './Layers/ObstaclesLayer';
import RobotPosLayer from './Layers/RobotPosLayer';
import RoomsLayer from './Layers/RoomsLayer';
import TraceLayer from './Layers/TraceLayer';
import { mapHeight, mapWidth } from './Map.utils';
import SelectedZonesLayer from './Layers/SelectedZonesLayer';
import GoToLayer from './Layers/GoToLayer';
import NoGoWallsLayer from './Layers/NoGoWallsLayer';

const ControlMap = () => {
  const projection = new Projection({
    code: 'custom-base64-image',
    units: 'pixels',
    extent: [0, 0, mapWidth, mapHeight],
  });
  const selectionType = getSelectionType();
  const { state: botState } = getVacuumClean();

  return (
    <>
      <Map zoom={3} minZoom={3} maxZoom={4} projection={projection}>
        {botState === 'idle' && selectionType === 'room' && <SelectRoomInteraction />}
        {botState === 'idle' && selectionType === 'zone' && <SelectZonesInteraction />}
        {botState === 'idle' && selectionType === 'point' && <GoToInteraction />}

        <RobotPosLayer />
        <DockPosLayer />
        <ObstaclesLayer />
        <LabelsLayer />
        <TraceLayer />
        <GoToLayer />
        <SelectedZonesLayer />
        <NoMopZonesLayer />
        {/* <NoMopWallsLayer /> */}
        <NoGoWallsLayer />
        <NoGoZonesLayer />
        <RoomsLayer />
        <MainLayer />
      </Map>
    </>
  );
};

export default ControlMap;
