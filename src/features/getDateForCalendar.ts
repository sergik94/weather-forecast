export const getDateForCalendar = (date: Date) => {
  return date.toJSON().split('T')[0];
};
