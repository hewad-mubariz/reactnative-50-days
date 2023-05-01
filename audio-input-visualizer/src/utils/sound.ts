const dBToLinear = (dBValue: number) => {
  const minDb = -60;
  const maxDb = -10;
  const linearValue = (dBValue - minDb) / (maxDb - minDb);
  return Math.max(0, Math.min(1, linearValue));
};

export { dBToLinear };
