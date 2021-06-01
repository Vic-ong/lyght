import dayjs from 'dayjs';

export const unixToDate = (timestamp) => dayjs.unix(timestamp);

export const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  const dt = unixToDate(timestamp.seconds);
  return dt.toDate();
};

export const formatTimestamp = (timestamp, format = 'YYYY-MM-DD HH:mm') => {
  const dt = unixToDate(timestamp.seconds);
  return dt.format(format);
};

export const timeToSimpleDateTime = (timestamp) => {
  return formatTimestamp(timestamp, 'D MMM YYYY, hh:mm a');
};

export const formatDate = (date, token = 'YYYY-MM-DD HH:mm') => dayjs(date).format(token);

export const dateDiff = ({ date1, date2, unit = 'day', precise = false } = {}) => {
  const start = dayjs(date1);
  const end = dayjs(date2);
  if (unit === 'all') {
    return {
      day: end.diff(start, 'day', precise),
      month: end.diff(start, 'month', precise),
      year: end.diff(start, 'year', precise),
      hour: end.diff(start, 'hour', precise),
      minute: end.diff(start, 'minute', precise),
    };
  }
  return end.diff(start, unit, precise);
};

export const formatDuration = (duration) => {
  const formats = [
    { unit: 'minute', unitDisplayKey: 'Datetime-Minutes-Display', threshold: 60 },
    { unit: 'hour', unitDisplayKey: 'Datetime-Hours-Display', threshold: 24 },
    { unit: 'day', unitDisplayKey: 'Datetime-Days-Display', threshold: 30 },
    { unit: 'month', unitDisplayKey: 'Datetime-Months-Display', threshold: 12 },
    { unit: 'year', unitDisplayKey: 'Datetime-Years-Display', threshold: 100 },
  ];

  let result;

  formats.forEach(({ unit, unitDisplayKey, threshold }) => {
    if (duration[unit] <= threshold && duration[unit] > 0) {
      result = { unit, unitDisplayKey, value: Math.ceil(duration[unit]) };
    }
  });
  return result;
};
