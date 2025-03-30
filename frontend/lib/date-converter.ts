export const convertDate = (date: Date): string => {
  const dateTime = new Date(date);

  let getDate = `${dateTime.getDate()}`;
  let getMonth = `${dateTime.getMonth() + 1}`;
  let getYear = dateTime.getFullYear();

  if (getDate.toString().length < 2) getMonth = `0${getMonth}`;
  if (getMonth.toString().length < 2) getMonth = `0${getMonth}`;

  return `${getDate}/${getMonth}/${getYear}`;
};
