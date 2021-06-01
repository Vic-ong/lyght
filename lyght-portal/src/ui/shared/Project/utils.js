import get from 'lodash/get';
import { dateDiff, formatDuration } from '@/utils/date';

export const getProjectDuration = (data) => {
  const start = get(data, 'fundingEndDate');
  const end = get(data, 'projectGroup.ppaContractEndDate');
  if (!start || !end) return undefined;

  const duration = dateDiff({
    date1: start,
    date2: end,
    unit: 'all',
    precise: true,
  });
  return formatDuration(duration);
};

export const getProjectDurationText = (data, t) => {
  const duration = getProjectDuration(data);
  if (!duration) return 'N/A';

  return `${duration.value} ${t(duration.unitDisplayKey)}`;
};
