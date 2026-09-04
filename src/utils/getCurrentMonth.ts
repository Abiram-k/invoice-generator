import { Month } from "../types/month";

export const monthNames: Month[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getCurrentMonth = (currentMonth?: Month): Month => {
  const date = new Date();
  return currentMonth || monthNames[date.getMonth()];
};

// The month before the current one, used as the default billing month.
export const getPreviousMonth = (): Month => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return monthNames[date.getMonth()];
};
