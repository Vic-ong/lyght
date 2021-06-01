import dayjs from '@/services/dayjs';

export const unixToDate = (timestamp) => dayjs.unix(timestamp);

export const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  const dt = unixToDate(timestamp.seconds);
  return dt.toDate();
};

export const formatTimestamp = (timestamp, format = 'YYYY-MM-DD HH:mm') => {
  if (!timestamp) return '-';
  const dt = unixToDate(timestamp.seconds);
  return dt.format(format);
};

export const timestampDiff = (time1, time2, unit = 'day', precise = true) => {
  const start = unixToDate(time1.seconds);
  const end = unixToDate(time2.seconds);
  return end.diff(start, unit, precise);
};

export const formatDate = (date, token = 'YYYY-MM-DD HH:mm') => dayjs(date).format(token);

export const dateDiff = (date1, date2, unit = 'day', precise = true) => {
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
    { unit: 'minute', unitDisplay: 'minutes', threshold: 60 },
    { unit: 'hour', unitDisplay: 'hours', threshold: 24 },
    { unit: 'day', unitDisplay: 'days', threshold: 30 },
    { unit: 'month', unitDisplay: 'months', threshold: 12 },
    { unit: 'year', unitDisplay: 'years', threshold: 100 },
  ];

  let result = { unit: 'day', unitDisplay: 'days', value: 0 };

  formats.forEach(({ unit, unitDisplay, threshold }) => {
    if (duration[unit] <= threshold && duration[unit] > 0) {
      result = { unit, unitDisplay, value: Math.ceil(duration[unit]) };
    }
  });
  return result;
};
