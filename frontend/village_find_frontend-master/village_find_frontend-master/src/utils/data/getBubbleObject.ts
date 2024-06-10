export const getBubbleObject = (
  key: string,
  object: any,
  value: string,
): any => {
  if (!key.includes('.')) {
    return typeof object === 'object'
      ? { ...object, [key]: value }
      : { [key]: value };
  }
  const primaryKey = key.slice(0, key.indexOf('.'));
  const extraKey = key.slice(key.indexOf('.') + 1);
  return {
    ...object,
    [primaryKey]: getBubbleObject(extraKey, object[primaryKey], value),
  };
};
