import '../../../node_modules/ol/ol.css';

import Projection from 'ol/proj/Projection';

import { getSelectionType } from '../../store/vacuum/mapSlice';
import { getVacuumClean } from '../../store/vacuum/stateSlice';
import Map from '../UI/Map/Map';
import GoToInteraction from './Interactions/GoToInteraction';
import SelectNoMopZonesInteraction from './Interactions/SelectNoMopZonesInteraction';
import SelectRoomInteraction from './Interactions/SelectRoomInteraction';
import SelectZonesInteraction from './Interactions/SelectZonesInteraction';
import DockPosLayer from './Layers/DockPosLayer';
import LabelsLayer from './Layers/LabelsLayer';
import MainLayer from './Layers/MainLayer';
import ObstaclesLayer from './Layers/ObstaclesLayer';
import RobotPosLayer from './Layers/RobotPosLayer';
import RoomsLayer from './Layers/RoomsLayer';
import TraceLayer from './Layers/TraceLayer';
import { mapHeight, mapWidth } from './Map.utils';

const ControlMap = () => {
  const projection = new Projection({
    code: 'custom-base64-image',
    units: 'pixels',
    extent: [0, 0, mapWidth, mapHeight],
  });
  const selectionType = getSelectionType();
  const { state: botState } = getVacuumClean();

  return (
    <Map zoom={3} minZoom={3} maxZoom={4} projection={projection}>
      {selectionType === 'room' && <SelectRoomInteraction isInteractable={botState === 'idle'} />}
      {selectionType === 'zone' && <SelectZonesInteraction isInteractable={botState === 'idle'} />}
      {selectionType === 'point' && <GoToInteraction isInteractable={botState === 'idle'} />}
      <RobotPosLayer />
      <DockPosLayer />
      <ObstaclesLayer />
      <LabelsLayer />
      <TraceLayer />
      <SelectNoMopZonesInteraction isInteractable={false} />
      <RoomsLayer />
      <MainLayer />
    </Map>
  );
};

export default ControlMap;
