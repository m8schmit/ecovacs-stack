const convertHexToRGBA = (hexCode: string, opacity: number) => {
  let hex = hexCode.replace('#', '');

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100;
  }

  return `rgba(${r},${g},${b},${opacity})`;
};

const getRandomColor = (id: number, opacity = 1, dark = false) => {
  const colors = ['#cbdc6c', '#cdb5cf', '#f4c2d5', '#fdae6a', '#9dc9c4', '#abda7a', '#f5e163', '#fdc662'];
  const darkColors = ['#67804c', '#796b7a', '#8e727d', '#936843', '#5f7773', '#67804c', '#8c813e', '#93753e'];

  const colorsArray = dark ? darkColors : colors;
  return convertHexToRGBA(colorsArray[id % colorsArray.length], opacity);
};

export default getRandomColor;
