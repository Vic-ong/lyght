export const calcOutstanding = (data) => {
  const { revenue, distributions } = data;
  if (!distributions || distributions.length === 0) return 0;

  return distributions.reduce((acc, curr) => acc - curr.revenue, revenue);
};

export const calcTotalTax = (data) => {
  const { distributions } = data;
  if (!distributions || distributions.length === 0) return 0;

  return distributions.reduce((acc, curr) => acc + curr.tax, 0);
};
