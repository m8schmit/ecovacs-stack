const getRandomColor = (id: number) => {
  const colors = [
    'rgba(50, 168, 82, 1.0)',
    'rgba(50, 148, 168, 1.0)',
    'rgba(255, 215, 56, 1.0)',
    'rgba(255, 215, 56, 1.0)',
    'rgba(255, 144, 18, 1.0)',
    'rgba(255, 38, 64, 1.0)',
    'rgba(228, 77, 255, 1.0)',
    'rgba(43, 72, 255, 1.0)',
  ];

  return colors[id % colors.length];
};

export default getRandomColor;
