export const sliceIntoChunks = (array: any[], chunkSize: number) => {
  const res = [];

  for (let index = 0; index < array.length; index += chunkSize) {
    const chunk = array.slice(index, index + chunkSize);
    res.push(chunk);
  }
  return res;
};
