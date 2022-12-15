import '../../../node_modules/ol/ol.css';

import Projection from 'ol/proj/Projection';

import Map from '../UI/Map/Map';
import MainLayer from './Layers/MainLayer';
import RoomsLayer from './Layers/RoomsLayer';
import { mapHeight, mapWidth } from './Map.utils';

const EditMap = () => {
  const projection = new Projection({
    code: 'custom-base64-image',
    units: 'pixels',
    extent: [0, 0, mapWidth, mapHeight],
  });

  return (
    <Map zoom={3} minZoom={3} maxZoom={4} projection={projection}>
      <RoomsLayer />
      <MainLayer />
    </Map>
  );
};

export default EditMap;
