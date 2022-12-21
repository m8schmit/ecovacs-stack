export const formatStringSubset = (subset: string, chunkSize: number = 2) => {
  const formattedSubset = [];
  const numberSubset = JSON.parse(subset);
  for (let index = 0; index < numberSubset.length; index += chunkSize) {
    formattedSubset.push(numberSubset.slice(index, index + chunkSize));
  }
  return formattedSubset;
};
