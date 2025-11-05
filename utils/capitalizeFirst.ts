export const capitalizeFirst = (t: string) => {
  t = t.toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};
