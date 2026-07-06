import useSWR from "swr";
import { serialize } from "utils/validate";

export const useFeeNotifications = (appraisalFileId?: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    appraisalFileId
      ? `/bussiness/api/v1/feeNotifications/${appraisalFileId}`
      : null,
    {
      refreshInterval: 0,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export const useGetAllFeeNotifications = (params: any) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/feeNotifications/search/get_all_notifications?${serialize(
      {
        ...params,
      }
    )}`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export const useGetAllFeeNotificationsInFollowList = (params: {
  page: number | undefined;
  limit: number | undefined;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/feeNotifications/get_all_notifications?${serialize({
      ...params,
    })}`,
    { refreshInterval: 0 }
  );

  return {
    data: data,
    error,
    isLoading,
    mutate,
  };
};

export const useGetFeeNotificationContent = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/content/get_all`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
