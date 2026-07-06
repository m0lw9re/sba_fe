import {
  CreateAssignmentType,
  UpdateAssignmentType,
} from "constant/types/assignment";
import { SBAAxiosClient } from "./base";

export const assignmentApi = {
  create: (data: CreateAssignmentType) => {
    return SBAAxiosClient(`/bussiness/api/v1/assignment`, {
      method: "POST",
      data: data,
    });
  },
  multiCreate: (data: CreateAssignmentType) => {
    return SBAAxiosClient(`/bussiness/api/v1/assignment/multi`, {
      method: "POST",
      data: data,
    });
  },
  update: (data: UpdateAssignmentType) => {
    return SBAAxiosClient(`/bussiness/api/v1/assignment`, {
      method: "PUT",
      data: data,
    });
  },
  delete: (assignmentId: number) => {
    return SBAAxiosClient(`/bussiness/api/v1/assignment/${assignmentId}`, {
      method: "DELETE",
    });
  },
};
