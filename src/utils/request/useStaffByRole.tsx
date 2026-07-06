import { FilterStaffByRoleType } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useStaffByRole = (roleCode: string) => {
  try {
    const { data, error, isLoading, mutate } = useSWR(
      `/admin/api/v1/staffs/listByRole?${serialize({
        roleCode,
      })}`,
      { refreshInterval: 0 }
    );

    return {
      data,
      error,
      isLoading,
      mutate,
    };
  } catch (error) {
    throw error;
  }
};
