export const capitalizeFirstLetter = (givenStr: string) => {
  if (!givenStr || givenStr.length === 0) return '';
  return givenStr.slice(0, 1).toUpperCase() + givenStr.slice(1);
};
