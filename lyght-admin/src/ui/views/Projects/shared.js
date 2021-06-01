import { formatDate, dateDiff, formatDuration } from '@/utils/date';
import { formatDisplayVal } from '@/utils/formats';

export const getProjectDuration = (start, end) => {
  const duration = dateDiff(start, end, 'all', true);
  return formatDuration(duration);
};

const projectScaleTitle = (data) => {
  const { capacity } = data;

  if (capacity < 190) return 'Small-scale project';
  if (capacity < 800) return 'Medium-scale project';
  if (capacity < 1600) return 'Large-scale project';
  return 'Massive-scale project';
};

const projectScaleDesc = (data) => {
  const { panelsTotal: panels, capacity } = data;
  const capacityFormatted = formatDisplayVal(capacity, { suffix: 'kW' });

  return `${panels} solar panels with an energy capacity of ${capacityFormatted}`;
};

const projectEstablishmentTitle = (data) => {
  const { ppaContractStartDate } = data;
  const diff = dateDiff({ date1: ppaContractStartDate, date2: new Date(), unit: 'year', precise: true });

  if (diff < 3) return 'New establishment';
  if (diff < 6) return 'Recent establishment';
  return 'Mature establishment';
};

const projectEstablishmentDesc = (data) => {
  const { ppaContractStartDate } = data;
  const date = formatDate(ppaContractStartDate, 'MMM YYYY');
  return `Established on ${date}`;
};

const projectLengthTitle = ({ start, end }) => {
  const { unit, value } = getProjectDuration(start, end);
  if (value < 10 || unit !== 'year') return 'Short-lived project';
  if (value < 20) return 'Long-term project';
  return 'Very long-term project';
};

const projectLengthDesc = ({ start, end }) => {
  const { value, unitDisplay } = getProjectDuration(start, end);
  const period = `${value} ${unitDisplay}`;
  return `${period}`;
};

export const projectScale = (data) => ({
  title: projectScaleTitle(data),
  desc: projectScaleDesc(data),
  icon: 'mdi-flash-circle',
});

export const projectEstablishment = (data) => ({
  title: projectEstablishmentTitle(data),
  desc: projectEstablishmentDesc(data),
  icon: 'mdi-layers',
});

export const projectLength = (data) => ({
  title: projectLengthTitle(data),
  desc: projectLengthDesc(data),
  icon: 'mdi-map-clock',
});
