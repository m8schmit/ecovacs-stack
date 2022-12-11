// import '../../../node_modules/ol/ol.css';

// import { Box } from '@mui/system';
// import { Feature, Map as OlMap, MapBrowserEvent, View } from 'ol';
// import { Extent, getCenter } from 'ol/extent';
// import { LineString, MultiPoint, Point, Polygon } from 'ol/geom';
// import Draw, { createBox, DrawEvent, Options } from 'ol/interaction/Draw';
// import ImageLayer from 'ol/layer/Image';
// import VectorLayer from 'ol/layer/Vector';
// import { Projection } from 'ol/proj';
// import ImageSource from 'ol/source/Image';
// import Static from 'ol/source/ImageStatic';
// import Vector from 'ol/source/Vector';
// import Fill from 'ol/style/Fill';
// import Icon from 'ol/style/Icon';
// import Stroke from 'ol/style/Stroke';
// import Style from 'ol/style/Style';
// import Text from 'ol/style/Text';
// import { FC, ReactNode, useContext, useEffect, useRef, useState } from 'react';

// import { useAppDispatch } from '../../store/hooks';
// import {
//   getMapSubsetsList,
//   getMapTracesList,
//   getObstaclesList,
//   getSelectedRoomsList,
//   getSelectedZonesList,
//   getSelectionType,
//   getVacuumMap,
//   getVacuumPos,
//   resetMapTracesListUpdateIndex,
//   updateSelectedRoomsList,
//   updateSelectedZonesList,
// } from '../../store/vacuum/mapSlice';
// import { AiMapObstacle } from '../../store/vacuum/mapSlice.type';
// import getRandomColor from '../../utils/colors.utils';
// import { WebSocketContext } from '../../utils/socket.utils';
// import { BOT_ICON, CHARGING_DOCK_ICON, getAngle, RECONIZED_OBJECTS_ICON_LIST } from './Map.utils';
// import VectorSource from 'ol/source/Vector';
// import { Type } from 'ol/geom/Geometry';
// import { MapContext } from './MapContex';
// import Map from '../Map/Map';

// // TODO get all this from backend
// const mapWidth = 1600;
// const mapHeight = 1600;
// const pixelWidth = 50;
// const PixelRatio = 2;

// interface VaccumMapProps {
//   children?: ReactNode;
// }

// const VacuumMap: FC<VaccumMapProps> = ({ children }) => {
//   const [map, setMap] = useState<OlMap>();
//   const [draw, setDraw] = useState<Draw>();
//   const [prevTraceStart, setPrevTraceStart] = useState<number>(-1);
//   // const mapElement = useRef<HTMLDivElement>(null);
//   const mapRef = useRef();
//   const dispatch = useAppDispatch();

//   const socket = useContext(WebSocketContext);

//   const { data: mapData } = getVacuumMap();
//   const dockPosition = getVacuumPos('dock');
//   const botPosition = getVacuumPos('bot');
//   const mapSubsetsList = getMapSubsetsList();
//   const selectedRoomsList = getSelectedRoomsList();
//   const selectedZonesList = getSelectedZonesList();
//   const obstaclesList = getObstaclesList();
//   const mapTraceList = getMapTracesList();
//   const [mainLayer] = useState<ImageLayer<ImageSource>>(new ImageLayer());
//   const extent = [0, 0, mapWidth, mapHeight];
//   const selectionType = getSelectionType();

//   /*
//    ** convert Bot coordinate to OpenLayer Coordinates
//    */
//   const getCoordinates = (value: number, axis: 'x' | 'y') =>
//     ((value / pixelWidth) * PixelRatio + (axis === 'x' ? mapWidth : mapHeight) / 2) >> 0;

//   /*
//    ** convert OL coordinate to Bot Coordinates
//    ** `[minx, miny, maxx, maxy]`.
//    */
//   const setCoordinates = (extend: Extent) =>
//     extend.map(
//       (value, index) =>
//         (((value - (index === 0 || index === 2 ? mapWidth : mapHeight) / 2) * pixelWidth) / PixelRatio) >> 0,
//     );

//   const [traceLayer] = useState<VectorLayer<VectorSource<LineString>>>(
//     new VectorLayer({
//       style: [
//         new Style({
//           stroke: new Stroke({
//             color: 'white',
//             width: 3,
//           }),
//         }),
//         new Style({
//           stroke: new Stroke({
//             color: 'rgba(255,255,255,0.5)',
//             width: 25,
//           }),
//         }),
//       ],
//     }),
//   );
//   const [roomsLayer] = useState<VectorLayer<VectorSource<Polygon>>>(new VectorLayer());

//   const [botLayerStyle] = useState<Style>(
//     new Style({
//       image: new Icon({
//         anchor: [0.5, 0.5],
//         scale: 0.5,
//         rotation: getAngle(botPosition.a),
//         anchorXUnits: 'fraction',
//         anchorYUnits: 'fraction',
//         src: `data:image/png;base64,${BOT_ICON}`,
//       }),
//     }),
//   );

//   const [botLayer] = useState<VectorLayer<VectorSource<Point>>>(
//     new VectorLayer({
//       extent,
//       source: new Vector({
//         features: [
//           new Feature({
//             geometry: new Point([getCoordinates(botPosition.x, 'x'), getCoordinates(botPosition.y, 'y')]),
//             name: 'Vacuum Bot',
//           }),
//         ],
//       }),
//       style: botLayerStyle,
//     }),
//   );

//   const [dockLayer] = useState<VectorLayer<VectorSource<Point>>>(
//     new VectorLayer({
//       extent,
//       source: new Vector({
//         features: [
//           new Feature({
//             geometry: new Point([getCoordinates(dockPosition.x, 'x'), getCoordinates(dockPosition.y, 'y')]),
//             finished: false,
//             name: 'Charging dock',
//           }),
//         ],
//       }),
//       style: new Style({
//         image: new Icon({
//           anchor: [0.5, 1],
//           scale: 0.5,
//           anchorXUnits: 'fraction',
//           anchorYUnits: 'fraction',
//           src: `data:image/png;base64,${CHARGING_DOCK_ICON}`,
//         }),
//       }),
//     }),
//   );

//   const [obstacleLayer] = useState<VectorLayer<VectorSource<MultiPoint>>>(
//     new VectorLayer({
//       extent,
//       source: new Vector({
//         features: [
//           new Feature({
//             geometry: new MultiPoint(
//               obstaclesList.map((obstacle: AiMapObstacle) => [
//                 getCoordinates(obstacle.x, 'x'),
//                 getCoordinates(obstacle.y, 'y'),
//               ]),
//             ),
//           }),
//         ],
//       }),
//     }),
//   );

//   const initialized = false;
//   const projection = new Projection({
//     code: 'custom-base64-image',
//     units: 'pixels',
//     extent: [0, 0, mapWidth, mapHeight],
//   });

//   const isRoomSelected = (roomName: string) => {
//     const mssid = +roomName.split(' ')[1];
//     return selectedRoomsList?.find((current) => current === mssid) !== undefined;
//   };

//   const source = new VectorSource({ wrapX: false });

//   const [customZonesLayer] = useState(
//     new VectorLayer({
//       source,
//     }),
//   );

//   useEffect(() => {
//     // if (!initialized) {
//     // initialized = true;
//     console.log(mapRef.current);
//     if (!mapRef.current) return;
//     const initialMap = new OlMap({
//       layers: [mainLayer, roomsLayer, customZonesLayer, traceLayer, obstacleLayer, dockLayer, botLayer],
//       view: new View({
//         projection: projection,
//         center: getCenter(projection.getExtent()),
//         zoom: 3,
//         minZoom: 3,
//         maxZoom: 4,
//       }),
//     });

//     // const newDraw = new Draw({
//     //   source,
//     //   type: 'Circle',
//     //   stopClick: true,
//     //   geometryFunction: createBox(),
//     // });

//     // initialMap.addInteraction(newDraw);

//     // setDraw(newDraw);
//     initialMap.setTarget(mapRef.current);
//     setMap(initialMap);
//     // console.log();
//     return () => initialMap.setTarget(undefined);
//     // }
//   }, [mapRef.current]);

//   const updateInteraction = (type: Type) => {
//     let drawParamList: Options = {
//       source,
//       type,
//       stopClick: true,
//     };
//     if (type === 'Circle') {
//       drawParamList = { ...drawParamList, geometryFunction: createBox() };
//     }
//     const newDraw = new Draw(drawParamList);
//     draw && map?.removeInteraction(draw);
//     setDraw(newDraw);
//     console.log('add ', newDraw, ' on ', map);
//     map?.addInteraction(newDraw);
//   };

//   useEffect(() => {
//     if (!map) return;
//     console.log('reset draw ', selectionType);
//     if (selectionType === 'zone') {
//       updateInteraction('Circle');
//     } else if (selectionType === 'point') {
//       updateInteraction('Point');
//     }
//     draw && map?.removeInteraction(draw);
//   }, [selectionType]);

//   useEffect(() => {
//     roomsLayer
//       .getSource()
//       ?.getFeatures()
//       .forEach((feature, index) =>
//         feature.setStyle(
//           new Style({
//             stroke: new Stroke({
//               color: getRandomColor(index, isRoomSelected(feature.get('name')) ? 0.8 : 0.6),
//               width: 2,
//             }),
//             fill: new Fill({
//               color: getRandomColor(index, isRoomSelected(feature.get('name')) ? 0.8 : 0.6),
//             }),
//             text: new Text({ text: feature.get('name') }),
//           }),
//         ),
//       );
//   }, [selectedRoomsList, roomsLayer?.getSource()]);

//   useEffect(() => {
//     if (map && mapData && mainLayer) {
//       mainLayer.setSource(
//         new Static({
//           url: `data:image/png;base64,${mapData}`,
//           projection: projection,
//           imageExtent: extent,
//         }),
//       );
//       map.getView().fit(extent, {
//         padding: [100, 100, 100, 100],
//       });
//     }
//   }, [mapData, map]);

//   useEffect(() => {
//     if (!map) return;
//     map.getInteractions().forEach((interaction) => interaction instanceof Draw && interaction.setActive(false));

//     map.on('click', (event: MapBrowserEvent<any>) => {
//       const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
//       if (selectionType === 'room') {
//         // TODO find a better way to get mssid
//         const featureName = feature?.get('name');
//         if (featureName) {
//           const mssid = +featureName.split(' ')[1];
//           dispatch(updateSelectedRoomsList(mssid));
//           console.log('event: ', event);
//         }
//       }
//     });
//   }, [map]);

//   useEffect(() => {
//     if (!map) return;
//     if (selectionType === 'zone' || selectionType === 'point') {
//       console.log('register draw feature');
//       map.getInteractions().forEach((interaction) => interaction instanceof Draw && interaction.setActive(true));
//     } else {
//       map.getInteractions().forEach((interaction) => interaction instanceof Draw && interaction.setActive(false));
//     }
//   }, [selectionType, map]);

//   useEffect(() => {
//     if (!draw) return;
//     draw.on('drawend' as any, (event: DrawEvent) => {
//       const extend = event.feature.getGeometry()?.getExtent();
//       const coordinate = extend !== undefined ? setCoordinates(extend) : [];
//       console.log('draw: ', (event.feature.getGeometry() as Point).getExtent());

//       if (coordinate.length) {
//         dispatch(updateSelectedZonesList(coordinate));
//       } else {
//         console.error('coordinates null');
//       }
//     });
//   }, [draw]);

//   useEffect(() => {
//     botLayer
//       .getSource()
//       ?.getFeatures()[0]
//       .setGeometry(new Point([getCoordinates(botPosition.x, 'x'), getCoordinates(botPosition.y, 'y')]));
//     botLayerStyle.getImage()?.setRotation(getAngle(botPosition.a));
//   }, [botPosition]);

//   useEffect(() => {
//     dockLayer
//       .getSource()
//       ?.getFeatures()[0]
//       .setGeometry(new Point([getCoordinates(dockPosition.x, 'x'), getCoordinates(dockPosition.y, 'y')]));
//   }, [dockPosition]);

//   useEffect(() => {
//     roomsLayer.setSource(
//       new Vector({
//         features: mapSubsetsList.map(({ value, mssid }) => {
//           return new Feature({
//             geometry: new Polygon([
//               // need to add the PixelRatio as an offset to Y
//               value.map((current) => [getCoordinates(+current[0], 'x'), getCoordinates(+current[1], 'y') + PixelRatio]),
//             ]),
//             name: `Room ${mssid}`,
//           });
//         }),
//       }),
//     );
//   }, [mapSubsetsList]);

//   useEffect(() => {
//     traceLayer.setSource(
//       new Vector({
//         features: [
//           new Feature({
//             geometry: new LineString(
//               mapTraceList.newEntriesList.map(({ mapTracePointsList }) => [
//                 getCoordinates(mapTracePointsList.x, 'x'),
//                 getCoordinates(mapTracePointsList.y, 'y'),
//               ]),
//             ),
//           }),
//         ],
//       }),
//     );
//   }, [mapTraceList.newEntriesList]);

//   useEffect(() => {
//     obstacleLayer
//       .getSource()
//       ?.getFeatures()[0]
//       .setGeometry(
//         new MultiPoint(
//           obstaclesList.map((obstacle: AiMapObstacle) => [
//             getCoordinates(obstacle.x, 'x'),
//             getCoordinates(obstacle.y, 'y'),
//           ]),
//         ),
//       );

//     obstacleLayer.setStyle(
//       obstaclesList.map((obstacle: AiMapObstacle) => {
//         console.log('type: ', obstacle.type, ' found? ', !!RECONIZED_OBJECTS_ICON_LIST[obstacle.type]);
//         return new Style({
//           image: new Icon({
//             anchor: [0.5, 0.5],
//             scale: 0.5,
//             rotation: getAngle(botPosition.a),
//             anchorXUnits: 'fraction',
//             anchorYUnits: 'fraction',
//             src: `data:image/png;base64,${RECONIZED_OBJECTS_ICON_LIST[obstacle.type]}`,
//           }),
//           geometry: new Point([getCoordinates(obstacle.x, 'x'), getCoordinates(obstacle.y, 'y')]),
//         });
//       }),
//     );
//   }, [obstaclesList]);

//   useEffect(() => {
//     if (mapTraceList.updateIndex > prevTraceStart) {
//       if (mapTraceList.totalCount > mapTraceList.newEntriesList.length) {
//         console.log('some traces are missing');
//         setPrevTraceStart(mapTraceList.updateIndex);
//         socket.emit('getMapTrace', mapTraceList.updateIndex);
//       } else {
//         console.log('trace is up to Date!');
//         setPrevTraceStart(0);
//         dispatch(resetMapTracesListUpdateIndex());
//       }
//     }
//   }, [mapTraceList.totalCount, mapTraceList.newEntriesList]);

//   useEffect(() => {
//     if (!selectedZonesList.length) {
//       customZonesLayer.getSource()?.clear();
//     }
//   }, [selectedZonesList]);

//   return (
//     <>
//       {/* {map && (
//         <MapContext.Provider value={{ map }}>
//           <Box sx={{ height: '90vh' }} ref={mapRef}>
//             {children}
//           </Box>
//         </MapContext.Provider>
//       )} */}
//       <Map zoom={0} projection={projection}></Map>
//     </>
//   );
// };

import Projection from 'ol/proj/Projection';

import Map from '../Map/Map';
import MainLayer from './Layers/MainLayer';

const VacuumMap = () => {
  const mapWidth = 1600;
  const mapHeight = 1600;

  const projection = new Projection({
    code: 'custom-base64-image',
    units: 'pixels',
    extent: [0, 0, mapWidth, mapHeight],
  });

  return (
    <Map zoom={3} projection={projection}>
      <MainLayer></MainLayer>
    </Map>
  );
};

export default VacuumMap;
