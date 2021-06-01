const dayjs = require('@/services/dayjs');

const formatDate = (date, token = 'YYYY-MM-DD HH:mm') => dayjs(date).format(token);

const unixToDate = (timestamp) => dayjs.unix(timestamp);

const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  const dt = unixToDate(timestamp.seconds);
  return dt.toDate();
};

module.exports = {
  formatDate,
  timestampToDate,
};
