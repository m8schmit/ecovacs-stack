import { ScreenRotation } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { Map as OlMap, View } from 'ol';
import { getCenter } from 'ol/extent';
import { Projection } from 'ol/proj';
import { Children, cloneElement, FC, isValidElement, ReactNode, useEffect, useRef, useState } from 'react';

import { getNotificationDrawer } from '../../../store/menu/menuSlice';
import theme from '../../../theme';
import { LayerProps } from '../../VacuumMap/Layers/Layer.type';
import { getAngle } from '../../VacuumMap/Map.utils';
import { MapContext } from './MapContex';

interface MapProps {
  children?: ReactNode;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  projection: Projection;
}

const Map: FC<MapProps> = ({ children, zoom, minZoom, maxZoom, projection }) => {
  const mapRef = useRef<HTMLDivElement>();
  const [map, setMap] = useState<OlMap>();
  const [mapAngle, setMapAngle] = useState<number>(0);

  const { isOpen } = getNotificationDrawer();

  const getZIndex = (index: number) => Children.count(children) - 1 - index;

  useEffect(() => {
    if (!map) return;

    setTimeout(() => {
      console.log('refresh map');
      map.updateSize();
    }, 400);
  }, [isOpen, map]);

  useEffect(() => {
    if (!map) return;

    map.getView()?.setRotation(getAngle(mapAngle));
  }, [mapAngle]);

  useEffect(() => {
    const initialMap = new OlMap({
      layers: [],
      view: new View({
        projection,
        center: getCenter(projection.getExtent()),
        zoom,
        minZoom,
        maxZoom,
        rotation: getAngle(mapAngle),
        extent: projection.getExtent(),
      }),
    });

    initialMap.setTarget(mapRef.current);
    setMap(initialMap);
    initialMap.getView().fit(projection.getExtent());
    return () => initialMap.setTarget(undefined);
  }, []);

  return (
    <>
      <MapContext.Provider value={map}>
        <Box
          sx={{ top: 0, left: 0, width: '100%', height: '100%', position: 'absolute', overflow: 'hidden' }}
          ref={mapRef}
        >
          {Children.map(children, (child, index) => {
            if (isValidElement<LayerProps>(child)) {
              return cloneElement<LayerProps>(child, {
                projection,
                ZIndex: getZIndex(index),
              });
            }
          })}
        </Box>
        <IconButton
          sx={{
            backgroundColor: theme.palette.common.white,
            borderRadius: theme.typography.pxToRem(5),
            border: `solid thin lightgray`,
            position: 'absolute',
            top: theme.typography.pxToRem(8),
            left: theme.typography.pxToRem(40),
            padding: theme.typography.pxToRem(5),
            [`&:hover`]: { borderColor: 'gray', backgroundColor: theme.palette.common.white },
          }}
          onClick={() => setMapAngle((prev) => (prev === 0 ? 90 : 0))}
        >
          <ScreenRotation sx={{ fontSize: theme.typography.pxToRem(15), color: 'gray' }} />
        </IconButton>
      </MapContext.Provider>
    </>
  );
};

export default Map;
