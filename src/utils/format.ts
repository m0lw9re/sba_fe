import dayjs from "dayjs";
import {DATE_TIME_FORMAT} from "constant/enums";
const formatToCurrencyType = (currency: any) => {
  if (!currency) return "0";
  const parts = `${currency}`.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
};
const toNumber = (value: any) => {
  if (!isNaN(value)) {
    return Number(value);
  } else {
    return 0;
  }
};
const toRoundNumber = (value: any) => {
  if (!isNaN(value)) {
    return Math.round(value);
  } else {
    return 0;
  }
};
const hasValue = (value: any) => {
  if (value == null || value === undefined) {
    return false;
  } else {
    return true;
  }
};

const convertDateToString = (
  date: any,
  format: DATE_TIME_FORMAT | null = null
): any => {
  const validDate = dayjs(date?.toString()).isValid();
  return date && validDate
    ? dayjs(date?.toString()).format(format ? format : undefined)
    : null;
};
export {
  formatToCurrencyType,
  toNumber,
  convertDateToString,
  hasValue,
  toRoundNumber,
};
