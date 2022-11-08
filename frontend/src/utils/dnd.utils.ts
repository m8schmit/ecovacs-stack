import dayjs, { Dayjs } from 'dayjs';
//Do Not Disturb
// the received string should looks like 8:0 or 20:0
export const getformattedDNDDate = (hour: string, start?: string): Dayjs => {
  const splittedHour = hour.split(':');

  let formattedDate = dayjs()
    .set('hour', +splittedHour[0])
    .set('minute', +splittedHour[1])
    .set('second', 0);

  /* if the start hour is bigger than thend, then the end is towmoro */
  if (start && +start.split(':')[0] > +splittedHour[0]) {
    formattedDate = formattedDate.add(1, 'day');
  }
  return formattedDate;
};
