import '../../../node_modules/ol/ol.css';

import { Box } from '@mui/system';
import { Feature, Map, MapBrowserEvent, View } from 'ol';
import { getCenter } from 'ol/extent';
import { LineString, Point, Polygon } from 'ol/geom';
import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import { Projection } from 'ol/proj';
import ImageSource from 'ol/source/Image';
import Static from 'ol/source/ImageStatic';
import Vector from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import { useEffect, useRef, useState } from 'react';

import { useAppDispatch } from '../../store/hooks';
import {
  getMapSubsetsList,
  getMapTracesList,
  getSelectedRoomsList,
  getVacuumMap,
  getVacuumPos,
  updateSelectedRoomsList,
} from '../../store/vacuum/vacuumSlice';
import getRandomColor from '../../utils/colors.utils';
import { getAngle } from './Map.utils';
import VectorSource from 'ol/source/Vector';

const botIcon =
  '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';
const chargingDockIcon =
  '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';
// TODO get all this from backend
const mapWidth = 1600;
const mapHeight = 1600;
const pixelWidth = 50;
const PixelRatio = 2;

const VacuumMap = () => {
  const [map, setMap] = useState<Map>();
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>();
  const dispatch = useAppDispatch();

  const { data: mapData } = getVacuumMap();
  const dockPosition = getVacuumPos('dock');
  const botPosition = getVacuumPos('bot');
  const mapSubsetsList = getMapSubsetsList();
  const selectedRoomsList = getSelectedRoomsList();
  const { newEntriesList } = getMapTracesList();
  const [mainLayer] = useState<ImageLayer<ImageSource>>(new ImageLayer());
  const extent = [0, 0, mapWidth, mapHeight];

  const getCoordinates = (value: number, axis: 'x' | 'y') =>
    (value / pixelWidth) * PixelRatio + (axis === 'x' ? mapWidth : mapHeight) / 2;

  const [traceLayer] = useState<VectorLayer<VectorSource<LineString>>>(
    new VectorLayer({
      style: new Style({
        stroke: new Stroke({
          color: 'white',
          width: 3,
        }),
      }),
    }),
  );
  const [roomsLayer] = useState<VectorLayer<VectorSource<Polygon>>>(new VectorLayer());

  const [botLayerStyle] = useState<Style>(
    new Style({
      image: new Icon({
        anchor: [0, 0],
        scale: 0.5,
        rotation: getAngle(botPosition.a),
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: `data:image/png;base64,${botIcon}`,
      }),
    }),
  );

  const [botLayer] = useState<VectorLayer<VectorSource<Point>>>(
    new VectorLayer({
      extent,
      source: new Vector({
        features: [
          new Feature({
            geometry: new Point([getCoordinates(botPosition.x, 'x'), getCoordinates(botPosition.y, 'y')]),
            name: 'Vacuum Bot',
          }),
        ],
      }),
      style: botLayerStyle,
    }),
  );

  const [dockLayer] = useState(
    new VectorLayer({
      extent,
      source: new Vector({
        features: [
          new Feature({
            geometry: new Point([getCoordinates(dockPosition.x, 'x'), getCoordinates(dockPosition.y, 'y')]),
            finished: false,
            name: 'Charging dock',
          }),
        ],
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          scale: 0.5,
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: `data:image/png;base64,${chargingDockIcon}`,
        }),
      }),
    }),
  );

  let initialized = false;
  const projection = new Projection({
    code: 'custom-base64-image',
    units: 'pixels',
    extent: [0, 0, mapWidth, mapHeight],
  });

  const isRoomSelected = (roomName: string) => {
    const mssid = +roomName.split(' ')[1];
    return selectedRoomsList?.find((current) => current === mssid) !== undefined;
  };

  useEffect(() => {
    console.log('init', botLayer.getSource());
    if (!initialized) {
      initialized = true;
      const initialMap = new Map({
        target: mapElement.current as HTMLDivElement,
        layers: [mainLayer, roomsLayer, traceLayer, dockLayer, botLayer],
        view: new View({
          projection: projection,
          center: getCenter(projection.getExtent()),
          zoom: 3,
          minZoom: 3,
          maxZoom: 4,
        }),
      });
      setMap(initialMap);
      mapRef.current = initialMap;
    }
  }, []);

  useEffect(() => {
    roomsLayer
      .getSource()
      ?.getFeatures()
      .forEach((feature, index) =>
        feature.setStyle(
          new Style({
            stroke: new Stroke({
              color: getRandomColor(index, isRoomSelected(feature.get('name')) ? 0.8 : 0.5),
              width: 2,
            }),
            fill: new Fill({
              color: getRandomColor(index, isRoomSelected(feature.get('name')) ? 0.8 : 0.5),
            }),
            text: new Text({ text: feature.get('name') }),
          }),
        ),
      );
  }, [selectedRoomsList, roomsLayer?.getSource()]);

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
    console.log('register event ', map);
    if (!map) return;
    map.on('click', (event: MapBrowserEvent<any>) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      // TODO find a better way to get mssid
      const featureName = feature?.get('name');
      if (featureName) {
        const mssid = +featureName.split(' ')[1];
        dispatch(updateSelectedRoomsList(mssid));
      }
    });
  }, [map]);

  useEffect(() => {
    botLayer
      .getSource()
      ?.getFeatures()[0]
      .setGeometry(new Point([getCoordinates(botPosition.x, 'x'), getCoordinates(botPosition.y, 'y')]));
    botLayerStyle.getImage()?.setRotation(getAngle(botPosition.a));
  }, [botPosition]);

  useEffect(() => {
    dockLayer
      .getSource()
      ?.getFeatures()[0]
      .setGeometry(new Point([getCoordinates(dockPosition.x, 'x'), getCoordinates(dockPosition.y, 'y')]));
  }, [dockPosition]);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  useEffect(() => {
    roomsLayer.setSource(
      new Vector({
        features: mapSubsetsList.map(({ value, mssid }) => {
          return new Feature({
            //TODO there an offset, some polygon are overlaping
            geometry: new Polygon([
              value.map((current) => [getCoordinates(+current[0], 'x'), getCoordinates(+current[1], 'y')]),
            ]),
            name: `Room ${mssid}`,
          });
        }),
      }),
    );
  }, [mapSubsetsList]);

  useEffect(() => {
    traceLayer.setSource(
      new Vector({
        features: [
          new Feature({
            geometry: new LineString(
              newEntriesList.map(({ mapTracePointsList }) => [
                getCoordinates(mapTracePointsList.x, 'x'),
                getCoordinates(mapTracePointsList.y, 'y'),
              ]),
            ),
          }),
        ],
      }),
    );
  }, [newEntriesList]);

  return (
    <>
      <Box sx={{ height: '90vh' }} ref={mapElement} />
    </>
  );
};

export default VacuumMap;
