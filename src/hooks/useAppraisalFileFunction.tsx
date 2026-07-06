import { AppraisalFileType } from "constant/types";
import { useState } from "react";
import { useAppraisalFileDetail, useAssignments } from "utils/request";
import { APPRAISAL_FILE_STATUS } from "../constant/common";
import { getNumberAssignee, isContainRole } from "utils/common";
import { ROLES } from "constant/common";

type Props = {
  appraisalId: string;
};
const useAppraisalFileFunction = ({ appraisalId }: Props) => {
  const userName = localStorage.getItem("username");
  const { data: dataAssignments } = useAssignments(appraisalId!);
  const [isHaveExport, setIsHaveExport] = useState<boolean>(true);

  const {
    data: appraisalFileDetail,
    error,
  }: {
    data: AppraisalFileType;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useAppraisalFileDetail(appraisalId || "");
  // const {
  //   data: assetsValuationData,
  // }: {
  //   data: AssetValuationType;
  // } = useAssetsValuation(
  //   (appraisalFileDetail?.fileStatus && appraisalFileDetail?.fileStatus >= 12) ? appraisalId! : '',
  //   appraisalFileDetail?.assetLevelTwoId,
  // );

  // 11/01/2024 - haipham - check đã thực hiện tiếp nhận từ LOS hay chưa
  const handleCheckIsReceivedFromLos = () => {
    if (
      appraisalFileDetail != null &&
      appraisalFileDetail.fileStatus == APPRAISAL_FILE_STATUS.ONE &&
      appraisalFileDetail.receivedLos !== true
    ) {
      return true;
    }
    return false;
  };
  // end

  // check phải có assetLevelThreeId mới được phép update
  const handleCheckAssetThreeId = () => {
    return appraisalFileDetail?.assetCommons.some((item) => {
      if (!item.assetLevelThreeId) {
        return true;
      }
      return false;
    });
  };
  const handleCheckIsAssigner = () => {
    const assigner = !dataAssignments?.[0]?.staffs?.includes(userName);
    // case tiếp nhận phân giao tự động

    // case khởi tạo nằm trước tiếp nhận
    let usersCanEdit: any[] = [];
    if (dataAssignments?.[0]?.jobTypeId === 0) {
      dataAssignments.forEach((item: any, index: number) => {
        if (index > 0 && item?.jobTypeId === 1) {
          usersCanEdit.push(item?.staffs);
        }
      });
      usersCanEdit = [...usersCanEdit.flat()] || [];
    }
    // case tiếp nhận nằm trước khởi tạo
    if (dataAssignments?.[0]?.jobTypeId === 1) {
      dataAssignments.forEach((item: any, index: number) => {
        if (item?.jobTypeId === 1) {
          usersCanEdit.push(item?.staffs);
        }
        if (item?.jobTypeId === 0) {
          return false;
        }
      });
      usersCanEdit = [...usersCanEdit.flat()] || [];
    }
    // end logic check case tiếp nhận phân giao tự động
    return assigner && !usersCanEdit.includes(userName);
  };
  const handleCheckAssignmentIsStartSurveyStep = () => {
    // check bước phân giao là khảo sát
    if (dataAssignments?.[0]?.jobTypeId === 3) {
      return true;
    }
    return false;
  };
  const handleCheckUserCanNotUpdate = () => {
    if (!appraisalFileDetail) return false;

    const result =
      appraisalFileDetail.fileStatus === -1 ||
      appraisalFileDetail.fileStatus === 14 ||
      appraisalFileDetail.fileStatus === 15 ||
      appraisalFileDetail.fileStatus === 16 ||
      appraisalFileDetail.fileStatus === 19 ||
      appraisalFileDetail.fileStatus === 20 ||
      handleCheckIsAssigner() ||
      handleCheckAssetThreeId() ||
      handleCheckIsReceivedFromLos();
    return result;
  };
  const handleCheckUserCanNotCompleteAppraisal = () => {
    if (!appraisalFileDetail) return false;

    const result = handleCheckIsAssigner() || handleCheckAssetThreeId();
    return result;
  };
  const handleCheckUserCanNotCompleteFileFromLos = () => {
    if (!appraisalFileDetail) return false;
    const result = handleCheckIsAssigner();
    return result;
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await Promise.all(
  //         assetsValuationData.tablePP.map(async (item: any) => {
  //           const res = await appraisalFilesApi.getAssetsValuationDetail({
  //             appraisalFileId: item.appraisalFileId,
  //             assetLevelTwoId: item.assetLevelTwoId,
  //             assetId: item.assetId,
  //             assetChildId: item.assetChildId,
  //             assetGrandChildId: item.assetGrandChildId,
  //             valuationMethodDetailId:
  //               item.valuationMethodDetails.find((el: any) => el.isCurrent)
  //                 ?.valuationMethodDetailId || null,
  //             valuationMethodId:
  //               item.valuationMethodDetails.find((el: any) => el.isCurrent)
  //                 ?.valuationMethodId || null,
  //           });
  //           return res?.data?.prices?.isExportToReport || false;
  //         }),
  //       );
  //       const isExport = data?.some((item: boolean) => item);
  //       setIsHaveExport(isExport);
  //     } catch (error) {
  //       console.log('error:', error);
  //     }
  //   };
  //   if (assetsValuationData?.tablePP) {
  //     fetchData();
  //   }
  // }, [JSON.stringify(assetsValuationData?.tablePP)]);

  const isAcceptLockEditFeature = () => {
    //Check xem hồ sơ có đủ kiểu kiện để áp dụng tính năng khoá - mở hồ sơ hay không
    // (CVTD và phân giao > 1 người)
    const isLockEditAble: boolean =
      isContainRole(ROLES.CVTD) &&
      getNumberAssignee(appraisalFileDetail?.assignments || []) > 1;

    return isLockEditAble;
  };

  const isDisableFncBtnWithLockEditFeature = () => {
    // để disable các nút lưu, hoàn thành KS, lưu trong phụ lục của các hồ sở đủ kiều kiện áp dụng tính năng khoá - mở hồ sơ
    const check =
      isAcceptLockEditFeature() &&
      (!appraisalFileDetail.isLocked ||
        appraisalFileDetail.currentUserLocked !== userName);
    return check;
  };

  if (error) {
    return {
      isUserCanNotUpdate: () => false,
      isHaveExport: () => false,
      isUserCanNotCompleteAppraisal: () => false,
      isUserCanNotCompleteFileFromLos: () => false,
      isCompletedAppraisalFromLos: () => false,
      isReceivedFromLos: () => false,
      isCurrentAssigner: () => false,
      assignmentIsStartSurveyStep: () => false,
      isAcceptLockEditFeature: () => false,
      isDisableFncBtnWithLockEditFeature: () => false,
    };
  }

  return {
    isUserCanNotUpdate: handleCheckUserCanNotUpdate,
    isHaveExportToReport: isHaveExport,
    isUserCanNotCompleteAppraisal: handleCheckUserCanNotCompleteAppraisal,
    isUserCanNotCompleteFileFromLos: handleCheckUserCanNotCompleteFileFromLos,
    isCompletedAppraisalFromLos: handleCheckAssetThreeId,
    isReceivedFromLos: handleCheckIsReceivedFromLos,
    isCurrentAssigner: handleCheckIsAssigner,
    assignmentIsStartSurveyStep: handleCheckAssignmentIsStartSurveyStep,
    isAcceptLockEditFeature: isAcceptLockEditFeature,
    isDisableFncBtnWithLockEditFeature: isDisableFncBtnWithLockEditFeature,
  };
};

export default useAppraisalFileFunction;
