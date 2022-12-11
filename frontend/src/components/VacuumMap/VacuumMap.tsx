import '../../../node_modules/ol/ol.css';

import Projection from 'ol/proj/Projection';

import { getSelectionType } from '../../store/vacuum/mapSlice';
import GoToInteraction from './Interactions/GoToInteraction';
import SelectRoomInteraction from './Interactions/SelectRoomInteraction';
import SelectZonesInteraction from './Interactions/SelectZonesInteraction';
import DockPosLayer from './Layers/DockPosLayer';
import MainLayer from './Layers/MainLayer';
import ObstaclesLayer from './Layers/ObstaclesLayer';
import RobotPosLayer from './Layers/RobotPosLayer';
import RoomsLayer from './Layers/RoomsLayer';
import TraceLayer from './Layers/TraceLayer';
import { mapHeight, mapWidth } from './Map.utils';
import Map from './Map/Map';

const VacuumMap = () => {
  const projection = new Projection({
    code: 'custom-base64-image',
    units: 'pixels',
    extent: [0, 0, mapWidth, mapHeight],
  });
  const selectionType = getSelectionType();

  return (
    <Map zoom={3} minZoom={3} maxZoom={4} projection={projection}>
      {selectionType === 'room' && <SelectRoomInteraction />}
      {selectionType === 'zone' && <SelectZonesInteraction />}
      {selectionType === 'point' && <GoToInteraction />}
      <RobotPosLayer />
      <DockPosLayer />
      <ObstaclesLayer />
      <TraceLayer />
      <RoomsLayer />
      <MainLayer />
    </Map>
  );
};

export default VacuumMap;
