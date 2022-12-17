import '../../../node_modules/ol/ol.css';

import Projection from 'ol/proj/Projection';

import { getActiveTool } from '../../store/vacuum/editMapSlice';
import Map from '../UI/Map/Map';
import SelectRoomInteraction from './Interactions/SelectRoomInteraction';
import SplitRoomInteraction from './Interactions/SplitRoomInteraction';
import MainLayer from './Layers/MainLayer';
import RoomsLayer from './Layers/RoomsLayer';
import { mapHeight, mapWidth } from './Map.utils';

const EditMap = () => {
  const projection = new Projection({
    code: 'custom-base64-image',
    units: 'pixels',
    extent: [0, 0, mapWidth, mapHeight],
  });
  const selectionType = getActiveTool();

  return (
    <Map zoom={3} minZoom={3} maxZoom={4} projection={projection}>
      {selectionType === 'split' && <SplitRoomInteraction />}
      <SelectRoomInteraction />
      <RoomsLayer />
      <MainLayer />
    </Map>
  );
};

export default EditMap;
