import { SurverSchedule } from "constants/types/surveySchedule";
import { SBAAxiosClient } from "./base";

export const surveyScheduleApi = {
  createSchedule: (data: SurverSchedule) => {
    return SBAAxiosClient("/bussiness/api/v1/surveySchedule", {
      method: "POST",
      data,
    });
  },
  getSchedules: (params: { appraisalId: string }) => {
    return SBAAxiosClient("/bussiness/api/v1/surveySchedules/" + params.appraisalId, {
      method: "GET",
    });
  },
  delete: (params: { surveyScheduleId: number }) => {
    return SBAAxiosClient("/bussiness/api/v1/surveySchedule/" + params.surveyScheduleId, {
      method: "DELETE",
    });
  },
};
