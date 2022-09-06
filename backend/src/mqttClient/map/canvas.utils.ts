import { Canvas, createCanvas } from 'canvas';
import { Axis } from './map.model';

export const trimCanvas = (source: Canvas) => {
  let ctx = source.getContext('2d');
  let result = createCanvas(source.width, source.height);
  let resultCtx = result.getContext('2d');
  let pixels = ctx.getImageData(0, 0, source.width, source.height);
  let pixelsLength = pixels.data.length;
  let bound = {
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
  };
  let x = 0;
  let y = 0;

  for (let index = 0; index < pixelsLength; index += 4) {
    if (pixels.data[index + 3] !== 0) {
      x = (index / 4) % source.width;
      y = (index / 4 / source.width) >> 0;

      if (bound.top === -1) {
        bound.top = y;
      }

      if (bound.left === -1 || x < bound.left) {
        bound.left = x;
      }

      if (bound.right === -1 || bound.right < x) {
        bound.right = x;
      }

      if (bound.bottom === -1 || bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }

  let trimHeight = bound.bottom - bound.top;
  let trimWidth = bound.right - bound.left;
  let trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

  result.width = trimWidth;
  result.height = trimHeight;

  resultCtx.putImageData(trimmed, 0, 0);

  return result;
};

export const translateCanvas = (source: Canvas, axis: Axis) => {
  let ctx = source.getContext('2d');
  let result = createCanvas(source.width, source.height);
  let resultCtx = result.getContext('2d');

  ctx.save();
  ctx.translate(source.width, 0);
  ctx.scale(-1, 1);
  return source;
};
