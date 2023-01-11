import '../../../node_modules/ol/ol.css';

import { Select } from '@mui/material';
import Projection from 'ol/proj/Projection';

import { getActiveTool } from '../../store/vacuum/editMapSlice';
import { getSelectedRoomsList } from '../../store/vacuum/mapSlice';
import Map from '../UI/Map/Map';
import CreateNoGoWallsInteraction from './Interactions/CreateNoGoWallsInteraction';
import CreateNoGoZonesInteraction from './Interactions/CreateNoGoZonesInteraction';
import CreateNoMopWallsInteraction from './Interactions/CreateNoMopWallsInteraction';
import CreateNoMopZonesInteraction from './Interactions/CreateNoMopZonesInteraction';
import SelectRoomInteraction from './Interactions/SelectRoomInteraction';
import SplitRoomInteraction from './Interactions/SplitRoomInteraction';
import LabelsLayer from './Layers/LabelsLayer';
import MainLayer from './Layers/MainLayer';
import NoGoWallsLayer from './Layers/NoGoWallsLayer';
import NoGoZonesLayer from './Layers/NoGoZonesLayer';
import NoMopWallsLayer from './Layers/NoMopWallsLayer';
import NoMopZonesLayer from './Layers/NoMopZonesLayer';
import RoomsLayer from './Layers/RoomsLayer';
import { mapHeight, mapWidth } from './Map.utils';
import SelectNoGoInteraction from './Interactions/SelectNoGoInteraction';

const EditMap = () => {
  const projection = new Projection({
    code: 'custom-base64-image',
    units: 'pixels',
    extent: [0, 0, mapWidth, mapHeight],
  });
  const selectionType = getActiveTool();
  const isSingleRoomselected = getSelectedRoomsList().length === 1;

  return (
    <>
      room selected: {(selectionType === 'split' && !isSingleRoomselected).toString()}
      <Map zoom={3} minZoom={3} maxZoom={4} projection={projection}>
        {selectionType === 'merge' && <SelectRoomInteraction />}
        {selectionType === 'default' && <SelectRoomInteraction selectMulti={false} />}
        {selectionType === 'split' && <SelectRoomInteraction selectMulti={false} />}
        {selectionType === 'split' && isSingleRoomselected && <SplitRoomInteraction />}
        {selectionType === 'noGoZone' && <CreateNoGoZonesInteraction />}
        {selectionType === 'noMopZone' && <CreateNoMopZonesInteraction />}
        {selectionType === 'noGoWall' && <CreateNoGoWallsInteraction />}
        {selectionType === 'noMopWall' && <CreateNoMopWallsInteraction />}
        {selectionType === 'deleteNoGoZone' && <SelectNoGoInteraction />}

        <LabelsLayer />
        <NoGoWallsLayer />
        <NoMopZonesLayer />
        <NoGoZonesLayer />
        <NoMopWallsLayer />
        <RoomsLayer />
        <MainLayer />
      </Map>
    </>
  );
};

export default EditMap;
