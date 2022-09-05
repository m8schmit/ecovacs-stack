import '../../../node_modules/ol/ol.css';

import { Box } from '@mui/system';
import { Map, View } from 'ol';
import { getCenter } from 'ol/extent';
import ImageLayer from 'ol/layer/Image';
import { Projection } from 'ol/proj';
import ImageSource from 'ol/source/Image';
import Static from 'ol/source/ImageStatic';
import { useEffect, useRef, useState } from 'react';

import { getVacuumMap } from '../../store/vacuum/vacuumSlice';
import { Typography } from '@mui/material';

const VacuumMap = () => {
  const [map, setMap] = useState<Map>();
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>();
  const { data: mapData } = getVacuumMap();
  const [mainLayer] = useState<ImageLayer<ImageSource>>(new ImageLayer());
  let initialized = false;

  const extent = [0, 0, 10, 20];
  const projection = new Projection({
    code: 'custom-base64-image',
    units: 'pixels',
    extent: extent,
  });

  useEffect(() => {
    if (!initialized) {
      initialized = true;
      const initialMap = new Map({
        target: mapElement.current as HTMLDivElement,
        layers: [mainLayer],
        view: new View({
          projection: projection,
          center: getCenter(extent),
          zoom: 2,
          maxZoom: 8,
        }),
      });
      setMap(initialMap);
      mapRef.current = initialMap;
    }
  }, []);

  useEffect(() => {
    if (map && mapData && mainLayer) {
      mainLayer.setSource(
        new Static({
          url: `data:image/png;base64,${mapData}`,
          projection: projection,
          imageExtent: extent,
        }),
      );
      map.getView().fit(extent, {
        padding: [100, 100, 100, 100],
      });
    }
  }, [mapData, map]);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  return (
    <>
      {!mapData && <Typography>no map data</Typography>}
      {mapData && <Box sx={{ height: '100vh' }} ref={mapElement} />}
    </>
  );
};

export default VacuumMap;
