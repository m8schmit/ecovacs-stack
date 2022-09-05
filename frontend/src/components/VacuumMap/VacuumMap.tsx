import '../../../node_modules/ol/ol.css';

import { Box } from '@mui/system';
import { Feature, Map, View } from 'ol';
import { getCenter } from 'ol/extent';
import ImageLayer from 'ol/layer/Image';
import { Projection } from 'ol/proj';
import ImageSource from 'ol/source/Image';
import Static from 'ol/source/ImageStatic';
import { useEffect, useRef, useState } from 'react';

import { getVacuumMap } from '../../store/vacuum/vacuumSlice';
import { Typography } from '@mui/material';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Vector from 'ol/source/Vector';
import { Point } from 'ol/geom';
const botIcon =
  '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';

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

  const iconFeature = new Feature({
    geometry: new Point([0.5, 9]),
    name: 'Somewhere near Nottingham',
  });

  useEffect(() => {
    if (!initialized) {
      initialized = true;
      const initialMap = new Map({
        target: mapElement.current as HTMLDivElement,
        layers: [
          mainLayer,
          new VectorLayer({
            source: new Vector({
              features: [iconFeature],
            }),
            style: new Style({
              image: new Icon({
                anchor: [0, 0],
                scale: 0.5,
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: `data:image/png;base64,${botIcon}`,
              }),
            }),
          }),
        ],
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
