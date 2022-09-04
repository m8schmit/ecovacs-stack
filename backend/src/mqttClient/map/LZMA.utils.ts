import { decompress } from 'lzma-native';

declare module 'lzma-native' {
  export function decompress(
    buf: Buffer | string,
    options?: LzmaOptions | Preset,
    on_finish?: (result: Buffer) => void,
  ): Promise<Buffer>;
}

const decodeB64 = (str: string) => Buffer.from(str, 'base64');

const toBigIndian = (buffer: Buffer) => {
  const fourBytesBuffer = Buffer.allocUnsafe(4);
  fourBytesBuffer.writeUintLE(0, 0, 4);
  const start = buffer.subarray(0, 9);
  const end = buffer.subarray(9);
  const mergedBuffer = Buffer.concat([start, fourBytesBuffer, end]);
  return mergedBuffer;
};

export const decompressLZMA = async (data: string) =>
  await decompress(toBigIndian(decodeB64(data)), undefined, undefined);
