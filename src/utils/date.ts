import dayjs, { Dayjs } from "dayjs";
import { DATE_TIME_FORMAT } from "constant/enums";
import { DatePickerProps } from "antd";

const formatDate = (date: any, format?: string) => {
  if (format) {
    return dayjs(date).format(format);
  }
  return dayjs(date).format("DD/MM/YYYY");
};

const addMonthsToDate = (dateCreate: any, monthsToAdd: number) => {
  // Convert the dateCreate string to a Date object
  const originalDate = new Date(dateCreate);

  // Check if the originalDate is a valid date
  if (isNaN(originalDate.getTime())) {
    return "Invalid Date"; // Handle invalid input
  }

  // Add months to the date
  originalDate.setMonth(originalDate.getMonth() + monthsToAdd);

  // Format the result back into the desired string format
  const formattedDate = originalDate.toISOString(); // This assumes you want a YYYY-MM-DD format

  return dayjs(formattedDate).format("DD/MM/YYYY");
};

const formatDateWithHour = (date: any) => {
  return dayjs(date).format("DD/MM/YYYY - HH:mm:ss");
};

const formatDateFollowType = (date: any, format: string) => {
  return dayjs(date).format(format);
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
const validateDateGreaterThanNow = (rule: any, value: any, callback: any) => {
  const selectedDate = dayjs(value);
  const now = dayjs();
  if (selectedDate.isAfter(now)) {
    callback(); // Validation passed
  } else {
    callback("Chọn ngày lớn hơn ngày hiện tại!");
  }
};
const convertISODate = (date: any) => {
  const validDate = date ? dayjs(date?.toString()).isValid() : null;
  return validDate ? date.replace("Z", "+00:00") : null;
};
const weekFormat = "YYYY-MM-DD";

const customWeekStartEndFormat: DatePickerProps["format"] = (value) =>
  `${dayjs(value).startOf("week").format(weekFormat)} ~ ${dayjs(value)
    .endOf("week")
    .format(weekFormat)}`;

const disabledStartDate = (current: any, endDate: string) => {
  const startDateCompare = new Date(endDate);
  return current && current > startDateCompare;
};
const disabledEndDate = (current: Dayjs | null, endDate: string) => {
  if (!current || !current.isValid()) {
    return false;
  }
  const endDateCompare = new Date(endDate);
  // current add 1 day
  return current && current.add(1, "day").toDate() <= endDateCompare;
};

const second2hourString = (totalSeconds: number | null): string => {
  if (!totalSeconds && totalSeconds !== 0) return "--/--";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

const calculateExecutionTime = (
  start: string | null,
  end: string,
  step: number = 1
): number | null => {
  if (!start) return null;

  const startTime = dayjs(start);
  const endTime = dayjs(end);

  if (!startTime.isValid() || !endTime.isValid()) return null;

  // Xác định thời gian kết thúc làm việc dựa vào step
  const workEndHour = step === 0 ? 16 : 17;

  const isWorkingDay = (time: dayjs.Dayjs): boolean => {
    const day = time.day();
    return day >= 1 && day <= 5; // T2-T6
  };

  const adjustStart = (time: dayjs.Dayjs): dayjs.Dayjs => {
    let t = time;
    while (!isWorkingDay(t)) {
      t = t.add(1, "day").hour(7).minute(30).second(0);
    }
    const minutes = t.hour() * 60 + t.minute();
    const morningStart = 7 * 60 + 30;
    const morningEnd = 11 * 60 + 30;
    const afternoonStart = 13 * 60;
    const workEnd = workEndHour * 60;

    if (minutes < morningStart) {
      t = t.hour(7).minute(30).second(0);
    } else if (minutes > workEnd) {
      t = t.add(1, "day").hour(7).minute(30).second(0);
      while (!isWorkingDay(t)) {
        t = t.add(1, "day").hour(7).minute(30).second(0);
      }
    } else if (minutes > morningEnd && minutes < afternoonStart) {
      t = t.hour(13).minute(0).second(0);
    }
    return t;
  };

  const adjustEnd = (time: dayjs.Dayjs): dayjs.Dayjs => {
    let t = time;
    while (!isWorkingDay(t)) {
      t = t.subtract(1, "day").hour(workEndHour).minute(0).second(0);
    }
    const minutes = t.hour() * 60 + t.minute();
    const morningStart = 7 * 60 + 30;
    const morningEnd = 11 * 60 + 30;
    const afternoonStart = 13 * 60;
    const workEnd = workEndHour * 60;

    if (minutes < morningStart) {
      t = t.hour(7).minute(30).second(0);
    } else if (minutes > workEnd) {
      t = t.hour(workEndHour).minute(0).second(0);
    } else if (minutes > morningEnd && minutes < afternoonStart) {
      t = t.hour(11).minute(30).second(0);
    }
    return t;
  };

  // Tính toán thủ công cho trường hợp tổng quát
  const adjustedStart = adjustStart(startTime);
  const adjustedEnd = adjustEnd(endTime);

  if (adjustedEnd.isBefore(adjustedStart)) return 0;

  let totalSeconds = 0;

  // Ngày đầu tiên
  const firstDay = adjustedStart.clone();
  const firstDayEnd = firstDay.clone().hour(workEndHour).minute(0).second(0);
  const firstDayMorningEnd = firstDay.clone().hour(11).minute(30).second(0);
  const firstDayAfternoonStart = firstDay.clone().hour(13).minute(0).second(0);

  if (adjustedStart.isBefore(firstDayMorningEnd)) {
    // Nếu bắt đầu trong buổi sáng
    if (
      adjustedEnd.isSame(firstDay, "day") &&
      adjustedEnd.isBefore(firstDayMorningEnd)
    ) {
      // Kết thúc cùng ngày trong buổi sáng
      totalSeconds += adjustedEnd.diff(adjustedStart, "second");
    } else {
      // Kết thúc sau buổi sáng
      totalSeconds += firstDayMorningEnd.diff(adjustedStart, "second");

      if (
        adjustedEnd.isSame(firstDay, "day") &&
        adjustedEnd.isBefore(firstDayAfternoonStart)
      ) {
        // Không có thời gian trong buổi chiều
      } else if (adjustedEnd.isSame(firstDay, "day")) {
        // Kết thúc cùng ngày trong buổi chiều
        totalSeconds += adjustedEnd.diff(firstDayAfternoonStart, "second");
      } else {
        // Kết thúc sau ngày đầu tiên
        totalSeconds += firstDayEnd.diff(firstDayAfternoonStart, "second");
      }
    }
  } else if (adjustedStart.isBefore(firstDayEnd)) {
    // Bắt đầu trong buổi chiều
    if (adjustedEnd.isSame(firstDay, "day")) {
      // Kết thúc cùng ngày
      totalSeconds += adjustedEnd.diff(adjustedStart, "second");
    } else {
      // Kết thúc sau ngày đầu tiên
      totalSeconds += firstDayEnd.diff(adjustedStart, "second");
    }
  }

  // Các ngày giữa (nếu có)
  let currentDay = firstDay.add(1, "day").startOf("day");
  const lastDay = adjustedEnd.startOf("day");

  while (currentDay.isBefore(lastDay)) {
    if (isWorkingDay(currentDay)) {
      // Tính tổng thời gian làm việc trong một ngày
      const workingHours = 4 + (workEndHour - 13); // 4 giờ buổi sáng + số giờ buổi chiều
      totalSeconds += workingHours * 3600;
    }
    currentDay = currentDay.add(1, "day");
  }

  // Ngày cuối cùng (nếu khác ngày đầu tiên)
  if (!adjustedEnd.isSame(firstDay, "day")) {
    const lastDayStart = lastDay.clone().hour(7).minute(30).second(0);
    const lastDayMorningEnd = lastDay.clone().hour(11).minute(30).second(0);
    const lastDayAfternoonStart = lastDay.clone().hour(13).minute(0).second(0);

    if (adjustedEnd.isBefore(lastDayMorningEnd)) {
      // Kết thúc trong buổi sáng
      totalSeconds += adjustedEnd.diff(lastDayStart, "second");
    } else {
      // Kết thúc sau buổi sáng
      totalSeconds += lastDayMorningEnd.diff(lastDayStart, "second");

      if (adjustedEnd.isAfter(lastDayAfternoonStart)) {
        // Kết thúc trong buổi chiều
        totalSeconds += adjustedEnd.diff(lastDayAfternoonStart, "second");
      }
    }
  }

  return totalSeconds;
};

export {
  formatDate,
  addMonthsToDate,
  formatDateWithHour,
  validateDateGreaterThanNow,
  convertDateToString,
  formatDateFollowType,
  convertISODate,
  customWeekStartEndFormat,
  disabledStartDate,
  disabledEndDate,
  second2hourString,
  calculateExecutionTime,
};
