import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import VectorSource from 'ol/source/Vector';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { FC, useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { getMapTracesList, resetMapTracesListUpdateIndex } from '../../../store/vacuum/mapSlice';
import { WebSocketContext } from '../../../utils/socket.utils';
import { getCoordinates } from '../Map.utils';
import { MapContext } from '../../UI/Map/MapContex';
import { LayerProps } from './Layer.type';

const TraceLayer: FC<LayerProps> = ({ ZIndex }) => {
  const map = useContext(MapContext);
  const socket = useContext(WebSocketContext);
  const dispatch = useAppDispatch();

  const mapTraceList = getMapTracesList();
  const [prevTraceStart, setPrevTraceStart] = useState<number>(-1);

  const [traceLayer] = useState<VectorLayer<VectorSource<LineString>>>(
    new VectorLayer({
      style: [
        new Style({
          stroke: new Stroke({
            color: 'white',
            width: 3,
          }),
        }),
        new Style({
          stroke: new Stroke({
            color: 'rgba(255,255,255,0.5)',
            width: 25,
          }),
        }),
      ],
    }),
  );

  useEffect(() => {
    if (!map) return;

    map.addLayer(traceLayer);
    traceLayer.setZIndex(ZIndex || 0);
    return () => {
      map && map.removeLayer(traceLayer);
    };
  }, [map]);

  useEffect(() => {
    traceLayer.setSource(
      new Vector({
        features: [
          new Feature({
            geometry: new LineString(
              mapTraceList.newEntriesList.map(({ mapTracePointsList }) => [
                getCoordinates(mapTracePointsList.x, 'x'),
                getCoordinates(mapTracePointsList.y, 'y'),
              ]),
            ),
          }),
        ],
      }),
    );
  }, [mapTraceList.newEntriesList]);

  useEffect(() => {
    if (mapTraceList.updateIndex > prevTraceStart) {
      if (mapTraceList.totalCount > mapTraceList.newEntriesList.length) {
        setPrevTraceStart(mapTraceList.updateIndex);
        socket.emit('getMapTrace', mapTraceList.updateIndex);
      } else {
        setPrevTraceStart(0);
        dispatch(resetMapTracesListUpdateIndex());
      }
    }
  }, [mapTraceList.totalCount, mapTraceList.newEntriesList]);

  return null;
};

export default TraceLayer;
