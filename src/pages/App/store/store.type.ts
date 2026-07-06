import { NotifyType } from "constant/types/notity";

export type NotifyState = {
  notifyList: Array<NotifyType> | [];
  totalPages: number;
  currentPage: number;
  error: unknown;
  isNotifyLoading: boolean;
};

export type GetNotifySuccessPayload = {
  notifyList: Array<NotifyType> | [];
  totalPages: number;
  currentPage: number;
};

export type GetNotifyAllSeenPayload = {
  notifyList: Array<NotifyType> | [];
};
