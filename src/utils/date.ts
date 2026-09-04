const pad = (value: number): string => String(value).padStart(2, "0");

// Today's date in the yyyy-mm-dd format a date input expects, in local time.
export const getTodayInputDate = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
};
