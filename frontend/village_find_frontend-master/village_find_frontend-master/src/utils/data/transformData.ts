export const formatNumber = (
  num: number,
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {},
) => {
  return num.toLocaleString(locale, options);
};

export const formatDate = (date: string | Date, deliminator: string = '-') => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join(deliminator);
};

export const formatUsDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
