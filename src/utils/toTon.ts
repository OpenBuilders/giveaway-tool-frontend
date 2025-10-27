// convert nano ton to ton
export const toTon = (value: string | number) => {
  return Number(value) / 1e9;
};

// convert ton to nano ton
export const toNanoTon = (value: string | number) => {
  return Number(value) * 1e9;
};