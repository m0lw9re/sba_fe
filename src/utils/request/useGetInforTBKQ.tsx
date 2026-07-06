import { FEE_LIST_DOCUMENT } from "constant/common";
import useSWR from "swr";

export const useGetInforTBKQ = (appraisalFileId: string, type: number) => {
  const genUri = () => {
    if (type === FEE_LIST_DOCUMENT.FILE_THONG_BAO)
      return "/bussiness/api/v1/email/manual/inform";
    else if (type === FEE_LIST_DOCUMENT.FILE_KET_QUA)
      return "/bussiness/api/v1/email/manual/result";
    else return "";
  };

  const uri = genUri();
  const { data, error, isLoading, mutate } = useSWR(
    appraisalFileId && uri ? `${uri}?appraisalFileId=${appraisalFileId}` : null,
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
