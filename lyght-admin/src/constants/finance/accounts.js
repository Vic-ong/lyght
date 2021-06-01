export default [
  { value: '1000', text: 'Sales' },
  { value: '1001', text: 'SPV Cash' },
  { value: '1100', text: 'Asset Management' },
  { value: '1101', text: 'Trust' },
  { value: '1102', text: 'Insurance' },
  { value: '1103', text: 'Premise Rent' },
  { value: '1104', text: 'Ops & Maintenance' },
  { value: '2000', text: 'Tax (VAT)' },
].sort((a, b) => a.value.localeCompare(b.value));
