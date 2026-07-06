import { Dayjs } from "dayjs";

type dayOffVacation = {
  month: string;
  year: string;
};

type getDayOffVacation = {
  id: number;
  day: string;
  type?: string;
};

type editDayOffVacation = {
  id?: number;
  month: number;
  year: number;
  day: number;
  note: string;
  type: string;
  fullDay: Dayjs;
};

export type { dayOffVacation, editDayOffVacation, getDayOffVacation };
