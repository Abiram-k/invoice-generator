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
