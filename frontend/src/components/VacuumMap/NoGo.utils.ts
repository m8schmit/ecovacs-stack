import Fill from 'ol/style/Fill';
import RegularShape from 'ol/style/RegularShape';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

import { ZoneMapSubset } from '../../store/vacuum/mapSlice.type';
import { setCoordinates } from './Map.utils';

const linePattern = (color: string) => {
  const patternSize = 15;
  const lineWidth = 1.5;
  const patternCanvas = document.createElement('canvas');
  const patternContext = patternCanvas.getContext('2d');

  patternCanvas.width = patternSize;
  patternCanvas.height = patternSize;

  if (!patternContext) return color;

  patternContext.strokeStyle = color;
  patternContext.lineWidth = lineWidth;
  patternContext.lineCap = 'square';

  patternContext.beginPath();
  patternContext.moveTo(0, 0);
  patternContext.lineTo(patternSize, patternSize);

  patternContext.moveTo(patternSize - 0.1, 0);
  patternContext.lineTo(patternSize, 0);
  patternContext.lineTo(patternSize, 0.1);
  patternContext.closePath();

  patternContext.moveTo(0, patternSize - 0.1);
  patternContext.lineTo(0, patternSize);
  patternContext.lineTo(0.1, patternSize);
  patternContext.closePath();

  patternContext.stroke();

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const pattern = ctx?.createPattern(patternCanvas, 'repeat');
  return pattern ? pattern : color;
};

export const mopZoneStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(255, 125, 0, 1)',
    width: 2,
  }),
  fill: new Fill({
    color: linePattern('rgba(255, 125, 0, 0.5)'),
  }),
  image: new RegularShape({
    fill: new Fill({
      color: 'rgba(255, 125, 0, 1)',
    }),
    points: 5,
    radius1: 5,
    radius2: 5,
  }),
});

export const nogoZonesStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(255, 0, 0, 1)',
    width: 2,
  }),
  fill: new Fill({
    color: linePattern('rgba(255, 0, 0, 0.5)'),
  }),
  image: new RegularShape({
    fill: new Fill({
      color: 'rgba(255, 0, 0, 1)',
    }),
    points: 5,
    radius1: 5,
    radius2: 5,
  }),
});

export const selectedNoGoStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(179,32, 21, 1)',
    width: 2,
  }),
  fill: new Fill({
    color: linePattern('rgba(179,32, 21, 1)'),
  }),
});

export const formatNoGoSubset = (selectedNoGoZonesList: ZoneMapSubset[], nogoSubset: number[][]) => [
  ...selectedNoGoZonesList.map(({ value, mssid, type }) => ({ value, mssid, type })),
  { value: nogoSubset.map((value: number[]) => setCoordinates(value)), mssid: null, type: null },
];
