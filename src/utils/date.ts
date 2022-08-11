const nth = (date: number): string => {
  if (date > 3 && date < 21) return 'th';
  switch (date % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const convertDateToString = (date: Date): string => {
  const day = date.getDate();
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][date.getMonth()];

  return `${day}${nth(day)} ${month} ${date.getFullYear()}`;
};

export const formatLocalTime = (d: Date): string => {
  const yyyy = d.getFullYear().toString();
  const mm = (d.getMonth() + 1).toString();
  const dd = d.getDate().toString();

  return (
    yyyy +
    '-' +
    (mm[1] ? mm : '0' + mm[0]) +
    '-' +
    (dd[1] ? dd[1] : '0' + dd[0])
  );
};

export const isToday = (date: Date): boolean => {
  const today = new Date();

  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
};
