import { Box } from '@mui/material';
import { Map as OlMap, View } from 'ol';
import { getCenter } from 'ol/extent';
import { Projection } from 'ol/proj';
import { Children, cloneElement, FC, isValidElement, ReactNode, useEffect, useRef, useState } from 'react';
import { MainLayerProps } from '../VacuumMap/Layers/MainLayer';

import { MapContext } from './MapContex';

interface MapProps {
  children?: ReactNode;
  zoom: number;
  projection: Projection;
}

const Map: FC<MapProps> = ({ children, zoom, projection }) => {
  const mapRef = useRef<HTMLDivElement>();
  const [map, setMap] = useState<OlMap>();

  useEffect(() => {
    const initialMap = new OlMap({
      layers: [],
      view: new View({
        projection,
        center: getCenter(projection.getExtent()),
        zoom,
      }),
    });

    initialMap.setTarget(mapRef.current);
    setMap(initialMap);
    initialMap.getView().fit(projection.getExtent(), {
      padding: [100, 100, 100, 100],
    });
    return () => initialMap.setTarget(undefined);
  }, []);

  return (
    <>
      <MapContext.Provider value={map}>
        <Box sx={{ height: '90vh' }} ref={mapRef}>
          {Children.map(children, (child) => {
            if (isValidElement<MainLayerProps>(child)) {
              return cloneElement<MainLayerProps>(child, { projection });
            }
          })}
        </Box>
      </MapContext.Provider>
    </>
  );
};

export default Map;
