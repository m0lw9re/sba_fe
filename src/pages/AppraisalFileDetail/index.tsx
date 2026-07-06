import { Button, Empty, message, Space, Spin, Typography, Tooltip } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import Icons from "assets/icons";
import Loading from "components/common/Loading";
import { TabsCustom } from "components/TabsCustom";
import { RootState } from "configs/configureStore";
import {
  APPRAISAL_FILE_STATUS,
  APPRAISAL_IMAGE_UPLOAD_TYPE,
  APPROVAL_STATUS,
  BUTTON_CODES,
  ROLES,
} from "constant/common";
import { ASSET_LV1, ASSET_LV2, LOCAL_STORAGE_KEY } from "constant/enums";
import { AppraisalFileType } from "constant/types";
import useAppraisalFileFunction from "hooks/useAppraisalFileFunction";
import { isEqual } from "lodash";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import AdditionalRequiredModal from "pages/AppraisalFileDetail/component/AdditionalRequiredModal";
import AssetsInfo from "pages/AppraisalFileDetail/component/AssetsInfo";
import AssignmentModal from "pages/AppraisalFileDetail/component/AssignmentModal";
import FeeModal from "pages/AppraisalFileDetail/component/FeeModal";
import GeneralInfo from "pages/AppraisalFileDetail/component/GeneralInfo";
import PositionAndImg from "pages/AppraisalFileDetail/component/PositonAndImg";
import PropertyValue from "pages/AppraisalFileDetail/component/PropertyValue";
import RefuseToPriceModal from "pages/AppraisalFileDetail/component/RefuseToPriceModal";
import CancelModal from "pages/AppraisalFileDetail/component/CancelModal";
import {
  setAddressByLos,
  setIsCompleteSurvey,
  setListDocumentOfParentAppraisalFile,
  setStartProcessReportDate,
  setTypeCreated,
} from "pages/AppraisalFileDetail/store/appraisalFileDetailSlice";
import ComponentsError from "pages/ComponentsError";
import {
  createContext,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  APPRAISAL_FILE_DETAIL,
  APPRAISAL_FILES_RECEIVE,
  APPRAISAL_RESULTS,
  REPORT_VIEW_LEVEL_ONE,
  SIGN_WITH_CUSTOMER,
  VIEW_REPORT_PRINT_PAGE,
} from "routes/route.constant";
import { getRoleAccount, isContainRole, isLiveEnv } from "utils/common";
import {
  useAppraisalFileDetail,
  useAssetsValuation,
  useFeeNotifications,
} from "utils/request";
import { useAppraisalFileImages } from "utils/request/useAppraisalFileDetail";
import { useApproval } from "utils/request/useApproval";
import BlockUser from "../BlockUser";
import "./style.scss";
import useScreenSize from "hooks/useScreenSize";
import { handleCheckImagesSaved } from "utils/asset";
import { usePermission } from "hooks/usePermission";
import { isNotAllowed } from "utils/permission";
import { UploadOutlined } from "@ant-design/icons";
import UploadExternalModal from "./component/UploadExternalModal/UploadExternalModal";
import ButtonCustom from "components/ButtonCustom";

type ModalState = {
  isFeeModalShow: boolean;
  isAssignmentModalShow: boolean;
  isAdditionalRequiredModalShow: boolean;
  isRefuseToPriceModalShow: boolean;
  isCancelModalShow: boolean;
  isUploadExternalShow: boolean;
};

export const FeeModalContext = createContext<ModalState | undefined>(undefined);

const AppraisalFileDetail = () => {
  const navigate = useNavigate();
  let { id }: { id?: string } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const currentUser = String(localStorage.getItem(LOCAL_STORAGE_KEY.USERNAME));
  const screenSize = useScreenSize();
  const roles = getRoleAccount() || [];
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice,
  );

  const [appraisalFileId, setAppraisalFileId] = useState<string>("");

  const [disableSave, setDisableSave] = useState(false);
  const actionsContainerRef = useRef<HTMLDivElement>(null);
  const { isLoading: isGlobalLoading, imagesAndLocationLoaded } = useSelector(
    (state: RootState) => state.globalSlice,
  );
  const {
    isUserCanNotUpdate,
    isUserCanNotCompleteAppraisal,
    isUserCanNotCompleteFileFromLos,
    isCurrentAssigner,
    assignmentIsStartSurveyStep,
    isReceivedFromLos,
    isAcceptLockEditFeature,
    isDisableFncBtnWithLockEditFeature,
  } = useAppraisalFileFunction({
    appraisalId: id!,
  });

  const {
    data: appraisalFileDetail,
    isLoading,
    error,
    mutate,
  }: {
    data: AppraisalFileType;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useAppraisalFileDetail(id || "");
  const {
    mutate: mutateValuation,
  }: {
    mutate: () => void;
  } = useAssetsValuation(
    appraisalFileDetail?.fileStatus >= 12 ? id! : null,
    appraisalFileDetail?.assetLevelTwoId || 0,
  );

  const [tabIndex, setTabIndex] = useState<string>(
    searchParams.get("tab") || "1",
  );

  const { data } = useFeeNotifications(appraisalFileId);

  const [showModal, setShowModal] = useState<ModalState>({
    isFeeModalShow: false,
    isAssignmentModalShow: false,
    isAdditionalRequiredModalShow: false,
    isRefuseToPriceModalShow: false,
    isCancelModalShow: false,
    isUploadExternalShow: false,
  });

  // const { data: dataFeeNotifications, mutate: mutateFeeNotifications } =
  //   useFeeNotifications(appraisalFileDetail?.appraisalFileId);
  const isMworkConfirmed: boolean = true;
  //   isContainRole(ROLES.CBTH) || isContainRole(ROLES.CBTM)
  //     ? dataFeeNotifications && dataFeeNotifications.status === 3
  //       ? true
  //       : false
  //     : true;

  useEffect(() => {
    let breadCrumb = [
      // {
      //   label: location?.state?.label || "Hồ sơ đến",
      //   path: location?.state?.path || APPRAISAL_FILES_RECEIVE,
      // },
      {
        label: "Thông tin hồ sơ",
        path: APPRAISAL_FILE_DETAIL.replace(":id", id || ""),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!appraisalFileDetail) return;
    if (appraisalFileDetail && appraisalFileDetail.code === undefined) {
      dispatch(setTypeCreated(appraisalFileDetail.typeCreated));
      const filterRes = appraisalFileDetail.assignments
        ? appraisalFileDetail.assignments.filter(
            (item) => item.jobAssigner === currentUser,
          )
        : [];
      if (
        filterRes.length > 0 &&
        appraisalFileDetail.fileStatus !== APPRAISAL_FILE_STATUS.SEVENTEEN
      ) {
        setDisableSave(true);
      }
    }
    if (appraisalFileDetail && appraisalFileDetail.parentLegalDocuments) {
      dispatch(
        setListDocumentOfParentAppraisalFile(
          appraisalFileDetail.parentLegalDocuments.map((item) => item.ecmId),
        ),
      );
    }
    if (
      appraisalFileDetail &&
      appraisalFileDetail.reportSignDate &&
      appraisalFileDetail.fileStatus >= 12 &&
      appraisalFileDetail.fileStatus <= 20
    ) {
      dispatch(
        setIsCompleteSurvey(appraisalFileDetail.reportSignDate ? true : false),
      );
    }
  }, [appraisalFileDetail, dispatch, currentUser]);

  const { data: approvalInfo } = useApproval(id || null);
  const { data: listImage = [] } = useAppraisalFileImages(id || "");
  const userId = String(localStorage.getItem(LOCAL_STORAGE_KEY.USER_ID));

  const btnRef = useRef<{
    updateGeneralInfo: () => void;
    completeFileFromLOS: () => void;
    isSaved: () => void;
  }>(null);
  const btnRefAssetInfo = useRef<{
    updateAssetInfo: () => void;
    getAssetInfo: () => void;
  }>(null);
  const btnRefPositionImage = useRef<{
    updatePositionImage: () => void;
    updateImages: () => any;
  }>(null);
  const btnRefPropertyValue = useRef<{ updatePropertyValue: () => void }>(null);
  const isRoleCBTH = isContainRole(ROLES.CBTH);
  const isRoleCBTM = isContainRole(ROLES.CBTM);
  const isRoleCVTD = isContainRole(ROLES.CVTD);

  const [isBtnLoading, setisBtnLoading] = useState<{
    saveBtn: boolean;
    exportSurvey: boolean;
    completeSurvey: boolean;
    completeFileFromLOS: boolean;
    lockBtn: boolean; // lock (Bắt đầu làm) => khoá hồ sơ lại không cho người khác có thể chỉnh sửa
    unlockBtn: boolean; // unlock (Chuyển) => mở khoá hồ sơ (kết thúc quá trình làm) và cho người khác có thể chỉnh sửa
  }>({
    saveBtn: false,
    exportSurvey: false,
    completeSurvey: false,
    completeFileFromLOS: false,
    lockBtn: false,
    unlockBtn: false,
  });

  const closeModalAdditionalRequired = () => {
    setShowModal({ ...showModal, isAdditionalRequiredModalShow: false });
  };
  const closeModalRefuseToPriceRequired = () => {
    setShowModal({ ...showModal, isRefuseToPriceModalShow: false });
  };
  const closeModalAssignment = () => {
    setShowModal({ ...showModal, isAssignmentModalShow: false });
  };
  const closeModalFee = () => {
    setShowModal({ ...showModal, isFeeModalShow: false });
  };
  const closeModalCancel = () => {
    setShowModal({ ...showModal, isCancelModalShow: false });
  };
  const closeModalUploadExternal = () => {
    setShowModal({ ...showModal, isUploadExternalShow: false });
  };

  const updateAppraisalFile = useCallback(async () => {
    try {
      setisBtnLoading({ ...isBtnLoading, saveBtn: true });
      if (tabIndex === "4") {
        // Call api update tab giá trị tài sản
        await btnRefPropertyValue.current?.updatePropertyValue();
      } else if (tabIndex === "1") {
        // gọi update của tab kiểm tra hồ sơ
        const generalInfData: any = await btnRef.current?.updateGeneralInfo();
        if (!generalInfData) return;

        const dataUpdate: AppraisalFileType = {
          ...appraisalFileDetail,
          ...generalInfData,
        };

        const isAssetLevelThreeChanged = isEqual(
          appraisalFileDetail?.assetCommons.map(
            (item) => item.assetLevelThreeId,
          ),
          dataUpdate?.assetCommons.map((item) => item.assetLevelThreeId),
        );

        const res = await appraisalFilesApi.update(dataUpdate);
        if (res.data.code === 200) {
          message.success("Cập nhật thông tin hồ sơ thành công!");
          mutate();
          // mutate valuation when change asset level three
          if (
            appraisalFileDetail.fileStatus >= 12 &&
            !isAssetLevelThreeChanged
          ) {
            setTimeout(async () => {
              try {
                const res = await appraisalFilesApi.getAllAssetsDetail(
                  appraisalFileDetail.assetLevelTwoId,
                  generalInfData.assetCommons?.map((item: any) => ({
                    assetCode: item.assetCode,
                    assetLevelThreeId: item.assetLevelThreeId,
                  })),
                );
                const resTab2 = await appraisalFilesApi.updateAssetsEntire(
                  appraisalFileDetail.assetLevelTwoId,
                  id!,
                  res.data,
                );
                if (
                  resTab2.data?.body?.code === 200 ||
                  resTab2.data?.code === 200
                ) {
                  mutateValuation();
                }
              } catch (error) {
                console.log(error);
              }
            }, 200);
          }
        } else {
          message.error(res.data.message);
        }
      } else if (tabIndex === "2") {
        // gọi update của tab thông tin tài sản
        const assetInfoData = await btnRefAssetInfo.current?.updateAssetInfo();
        if (appraisalFileDetail.fileStatus >= 12 && assetInfoData) {
          mutateValuation();
        }
      } else if (tabIndex === "3") {
        // gọi update tab định vị và hình ảnh
        await btnRefPositionImage.current?.updatePositionImage();
      }
    } catch (error) {
      message.error("Cập nhật thông tin hồ sơ thất bại!");
    } finally {
      setisBtnLoading({ ...isBtnLoading, saveBtn: false });
    }
  }, [appraisalFileDetail, tabIndex]);

  const handleCompleteAppraisalFile = async () => {
    try {
      if (appraisalFileDetail.fileStatus !== APPRAISAL_FILE_STATUS.EIGHT) {
        message.error("Hồ sơ phải có lịch KS mới được hoàn thành");
        return;
      }
      setisBtnLoading({ ...isBtnLoading, completeSurvey: true });

      // validate before save and navigate to complete survey page
      const assetArrayData: any = await btnRefAssetInfo.current?.getAssetInfo();
      let isNotHaveAreaLand = false;
      if (
        appraisalFileDetail.assetLevelTwoId === ASSET_LV2.LAND ||
        appraisalFileDetail.assetLevelTwoId === ASSET_LV2.ESTIMATE
      ) {
        assetArrayData.forEach((element: any) => {
          const temp = element?.assetObject?.assetLandInfors.some(
            (item: any) => {
              return typeof item.realAreaWidth !== "number";
            },
          );
          if (temp) {
            isNotHaveAreaLand = true;
          }
        });
        if (isNotHaveAreaLand) {
          message.error(
            "Vui lòng nhập diện tích thực tế trước khi hoàn thành khảo sát.",
          );
          return;
        }
      }

      const assetArray: any = await btnRefAssetInfo.current?.updateAssetInfo();
      if (!assetArray) {
        return;
      }

      const typeExport: number[] | null = await handleGetExportFileType();
      navigate(SIGN_WITH_CUSTOMER, {
        state: {
          appraisalFileId: appraisalFileDetail.appraisalFileId,
          typeExport,
          assetArray,
        },
      });
    } catch (error: any) {
      console.log(error);
    } finally {
      setisBtnLoading({ ...isBtnLoading, completeSurvey: false });
    }
  };
  const handleCompleteFileFromLOS = async () => {
    try {
      setisBtnLoading({ ...isBtnLoading, completeFileFromLOS: true });

      // gọi update của tab kiểm tra hồ sơ
      const generalInfData: any = await btnRef.current?.updateGeneralInfo();

      if (!generalInfData) {
        setTabIndex("1");
        return;
      }
      const dataUpdate: AppraisalFileType = {
        ...appraisalFileDetail,
        ...generalInfData,
      };

      const pushUpdateBylos = async () => {
        try {
          // call tiep nhan ho so api
          const resUpdateByLos = await appraisalFilesApi.updateByLos({
            appraisalFileId: appraisalFileDetail.appraisalFileId,
            appraisalPurposeId: generalInfData.appraisalPurposeId,
            assetLevelOneId: generalInfData.assetLevelOneId,
            assetLevelTwoId: generalInfData.assetLevelTwoId,
            assetCommons: generalInfData.assetCommons,
            legalDocuments: generalInfData.legalDocuments,
            // ...generalInfData
          });

          // call update appraisal file api
          const res = await appraisalFilesApi.update(dataUpdate);

          if (resUpdateByLos.data.code === 200) {
            message.success("Hoàn thành tiếp nhận hồ sơ thành công!");
          } else {
            message.error(resUpdateByLos.data.message);
          }
          mutate();
        } catch (error: any) {
          message.error("Hoàn thành tiếp nhận hồ sơ không thành công!");
        } finally {
          setisBtnLoading({ ...isBtnLoading, completeFileFromLOS: false });
        }
      };

      // Loại hình tài sản: 1 BĐS căn hộ - 2 Căn hộ chung cư - 8 Dự án
      if (
        appraisalFileDetail.assetLevelTwo.assetLevelTwoId === ASSET_LV2.LAND ||
        appraisalFileDetail.assetLevelTwo.assetLevelTwoId ===
          ASSET_LV2.PROJECT ||
        appraisalFileDetail.assetLevelTwo.assetLevelTwoId === ASSET_LV2.ESTIMATE
      ) {
        if (generalInfData.assetLevelTwoId === 2) {
          message.error("Chuyển đổi sai loại hình tài sản.");
        } else {
          pushUpdateBylos();
        }
      } else {
        pushUpdateBylos();
      }
    } catch (error: any) {
      message.error("Hoàn thành tiếp nhận hồ sơ không thành công!");
    } finally {
      setisBtnLoading({ ...isBtnLoading, completeFileFromLOS: false });
    }
  };

  const handleGetExportFileType = async () => {
    const assetArray: any = await btnRefAssetInfo.current?.getAssetInfo();
    if (!assetArray) return null;
    const typeExport: number[] = [];
    assetArray?.forEach((el: any) => {
      typeExport.push(el.assetObject?.exportType || 0);
    });
    return typeExport;
  };
  const exportSurveyReport = async () => {
    try {
      setisBtnLoading({ ...isBtnLoading, exportSurvey: true });

      const typeExport: number[] | null = await handleGetExportFileType();
      if (!typeExport) {
        return;
      }
      navigate(SIGN_WITH_CUSTOMER, {
        state: {
          appraisalFileId: appraisalFileDetail.appraisalFileId,
          appraisalFileDetail,
          typeExport,
        },
      });
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi xuất BBKS");
    } finally {
      setisBtnLoading({ ...isBtnLoading, exportSurvey: false });
    }
  };

  const handleCheckIsUploadedAppendixTwoImage = () => {
    const imageUploaded = listImage.some(
      (item: any) =>
        item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.MAP_TSTD_AND_TSSS ||
        item.type ===
          APPRAISAL_IMAGE_UPLOAD_TYPE.UPLOAD_IMAGES_MAP_TSTD_AND_TSSS,
    );
    if (!imageUploaded) {
      message.error("Vui lòng chụp Sơ đồ vị trí tại tab Giá trị TS");
    }
    return imageUploaded;
  };

  const handleCheckAppraisalType = () => {
    // Kiểm tra trường Định giá qua SBA trước khi gửi duyệt
    if (!appraisalFileDetail?.assetCommons) return false;
    const assetCommons = [...appraisalFileDetail.assetCommons];
    for (let i = 0; i < assetCommons.length; i++) {
      if (!assetCommons[i]?.appraisalTypeId) return false;
    }
    return true;
  };

  const handleSendApproval = async (viewOnly: boolean) => {
    // check upload ảnh sơ đồ trước khi gửi duyệt
    if (
      appraisalFileDetail.fileStatus === 12 ||
      appraisalFileDetail.fileStatus === 17
    ) {
      if (!handleCheckIsUploadedAppendixTwoImage()) return;
      if (!handleCheckAppraisalType()) {
        message.error(
          "Vui lòng xác định Hồ sơ Thẩm định mới / Tái cấp ở tab Kiểm tra hồ sơ",
        );

        return;
      }
    }
    navigate(
      `${REPORT_VIEW_LEVEL_ONE.replace(":id", id!)}${
        viewOnly ? "?viewOnly" : ""
      }`,
    );
  };
  const handleCheckIsNextEmployee = () => {
    if (
      approvalInfo?.approvalHistoryDtos[
        approvalInfo?.approvalHistoryDtos?.length - 1
      ]?.approvalNextEmployeeId === userId
    ) {
      return true;
    }
    return false;
  };
  const handleCheckIsEmployee = () => {
    if (
      approvalInfo?.approvalHistoryDtos[
        approvalInfo?.approvalHistoryDtos?.length - 1
      ]?.approvalEmployeeId === userId
    ) {
      return true;
    }
    return false;
  };
  const handleCheckIsCanceledEmployee = () => {
    const lastCancel = approvalInfo?.approvalHistoryDtos?.findLastIndex(
      (item: any) => item.level === 0,
    );
    if (lastCancel === -1) return false;
    const result =
      approvalInfo?.approvalHistoryDtos[lastCancel]?.approvalEmployeeId ===
      userId;

    if (result) {
      return true;
    }
    return false;
  };

  const handleExportReportPrint = async () => {
    navigate(VIEW_REPORT_PRINT_PAGE, {
      state: {
        appraisalFileDetail,
      },
    });
  };

  const handleCheckCanSendApproval = () => {
    // fileStatus: 12 gửi duyệt
    // fileStatus: 13, 14, 15 đang duyệt
    // fileStatus: 16 đã phê duyệt chuyển sang ký số
    // fileStatus: 17 đã từ chối

    if (appraisalFileDetail.fileStatus === 16) {
      return !handleCheckIsEmployee();
    } else if (appraisalFileDetail.fileStatus === 17) {
      return !handleCheckIsCanceledEmployee();
    } else {
      return (
        appraisalFileDetail.fileStatus >= 14 &&
        appraisalFileDetail.fileStatus <= 15 &&
        !handleCheckIsNextEmployee()
      );
    }
  };

  const handleCheckIsSaveChanged = async (callback: any) => {
    // user chưa mở tab ảnh và định vị => bỏ qua check change images
    if (!imagesAndLocationLoaded) {
      callback();
      return;
    }
    const updateImages = await btnRefPositionImage.current?.updateImages();
    if (!updateImages) return;
    const { images } = updateImages;

    const isSavedImagesChange = await handleCheckImagesSaved(listImage, images);
    if (!isSavedImagesChange) {
      message.error("Ảnh có thay đổi mà chưa được lưu, vui lòng kiểm tra lại!");
    } else {
      callback();
    }
  };

  const handleLockEditAppraisal = async () => {
    try {
      setisBtnLoading({
        ...isBtnLoading,
        lockBtn: !Boolean(appraisalFileDetail.isLocked),
        unlockBtn: Boolean(appraisalFileDetail.isLocked),
      });
      const res = await appraisalFilesApi.lockEdit({
        appraisalFileId: appraisalFileDetail.appraisalFileId,
        isLocked: !appraisalFileDetail.isLocked,
      });
      if (res.data.code === 200) {
        mutate();
      } else {
        message.error(res.data.message);
      }
      setisBtnLoading({ ...isBtnLoading, lockBtn: false, unlockBtn: false });
    } catch (error: any) {
      console.log(error);
      setisBtnLoading({ ...isBtnLoading, lockBtn: false, unlockBtn: false });
    }
  };

  useEffect(() => {
    if (appraisalFileDetail?.assetCommons) {
      const addressByLos =
        appraisalFileDetail.assetCommons.reduce((acc, curr, index) => {
          if (curr.addressByLos) {
            if (appraisalFileDetail.assetCommons.length === 1) {
              return acc + `${curr.addressByLos || ""}\n`;
            } else {
              return acc + `Tài sản ${index + 1}: ${curr.addressByLos || ""}\n`;
            }
          } else {
            return acc;
          }
        }, "") || "";
      dispatch(setAddressByLos(addressByLos));
    }
  }, [appraisalFileDetail?.assetCommons?.length]);

  const handleSetTimeSLA = async () => {
    try {
      const res = await appraisalFilesApi.update({
        ...appraisalFileDetail,
        startProcessReportDate: new Date().toISOString(),
      });
      if (res.data.code === 200) {
        message.success("Thao tác thành công!");
        mutate();
        // mutate valuation when change asset level three
      } else {
        message.error(res?.data?.message || "Thao tác thất bại");
      }
    } catch (error) {
      message.error("Lỗi không xác định! Thao tác thất bại");
    }
  };

  useEffect(() => {
    dispatch(
      setStartProcessReportDate(
        appraisalFileDetail?.startProcessReportDate || null,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appraisalFileDetail]);

  if (error) return <ComponentsError />;
  if (appraisalFileDetail?.code === 403)
    return (
      <BlockUser
        message="Bạn không có quyền xem hồ sơ này."
        redirectUrl={APPRAISAL_FILES_RECEIVE}
      />
    );
  if (!appraisalFileDetail || isLoading) return <Loading />;
  return (
    <FeeModalContext.Provider value={showModal}>
      <Fragment>
        <Spin
          spinning={isGlobalLoading}
          wrapperClassName="page-container-spin-wrapper"
        >
          <div
            className="page-container"
            style={{ padding: 0, paddingBottom: "8px" }}
          >
            <div
              className="header-wrapper-AppraisalFileDetail"
              ref={actionsContainerRef}
            >
              <Space
                className="title-wrapper-AppraisalFileDetail"
                style={{ display: "flex" }}
              >
                <Typography className="title">Thông tin hồ sơ</Typography>
              </Space>
              <Space
                className="actions-wrapper"
                style={{ display: "flex", justifyContent: "end" }}
                size={4}
              >
                {isAcceptLockEditFeature() ? (
                  <Fragment>
                    <Tooltip
                      title={
                        Boolean(appraisalFileDetail.isLocked)
                          ? `Hồ sơ đang bị giữ bởi ${appraisalFileDetail.currentUserLocked}`
                          : null
                      }
                    >
                      <Button
                        className="btn"
                        icon={<Icons.caretRightOutlined />}
                        onClick={handleLockEditAppraisal}
                        disabled={Boolean(appraisalFileDetail.isLocked)}
                        loading={isBtnLoading.lockBtn}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "transparent",
                          height: "36px",
                          borderRadius: "4px",
                          paddingLeft: "6px",
                          paddingRight: "6px",
                        }}
                      >
                        Bắt đầu làm
                      </Button>
                    </Tooltip>
                    <Button
                      className="btn"
                      icon={<Icons.sendOutlined />}
                      onClick={handleLockEditAppraisal}
                      disabled={
                        !(appraisalFileDetail.isLocked || false) ||
                        appraisalFileDetail.currentUserLocked !== currentUser
                      }
                      loading={isBtnLoading.unlockBtn}
                    >
                      Chuyển
                    </Button>
                  </Fragment>
                ) : null}

                <Button
                  className="btn"
                  icon={<Icons.money />}
                  onClick={() =>
                    setShowModal({
                      ...showModal,
                      isFeeModalShow: true,
                    })
                  }
                  disabled={isNotAllowed(
                    currentPagePermissions,
                    BUTTON_CODES.cths_bao_phi,
                  )}
                >
                  Phí
                </Button>
                {/* // tính năng chưa đẩy live */}
                {isLiveEnv ? (
                  <Button
                    className="btn"
                    icon={<Icons.reload />}
                    onClick={() =>
                      setShowModal({
                        ...showModal,
                        isAssignmentModalShow: true,
                      })
                    }
                    disabled={isNotAllowed(
                      currentPagePermissions,
                      BUTTON_CODES.cths_phan_giao,
                    )}
                    onError={error}
                  >
                    Phân giao
                  </Button>
                ) : (
                  <Tooltip
                    title={
                      isMworkConfirmed ? "" : "Hồ sơ này chưa được xác nhận phí"
                    }
                    className={
                      !isMworkConfirmed ? "custom-appraisal-tooltip-btn" : ""
                    }
                  >
                    <Button
                      className="btn"
                      icon={<Icons.reload />}
                      onClick={() =>
                        setShowModal({
                          ...showModal,
                          isAssignmentModalShow: true,
                        })
                      }
                      onError={error}
                      disabled={
                        // !isMworkConfirmed ||

                        isNotAllowed(
                          currentPagePermissions,
                          BUTTON_CODES.cths_phan_giao,
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "transparent",
                        height: "36px",
                        borderRadius: "4px",
                        paddingLeft: "6px",
                        paddingRight: "6px",
                      }}
                    >
                      Phân giao
                    </Button>
                  </Tooltip>
                )}
                <Button
                  className="btn"
                  icon={<Icons.closeCircle />}
                  onClick={() =>
                    setShowModal({
                      ...showModal,
                      isRefuseToPriceModalShow: true,
                    })
                  }
                  disabled={isNotAllowed(
                    currentPagePermissions,
                    BUTTON_CODES.cths_tu_choi,
                  )}
                >
                  Từ chối định giá
                </Button>
                <Button
                  className="btn"
                  icon={<Icons.file />}
                  onClick={() =>
                    setShowModal({
                      ...showModal,
                      isCancelModalShow: true,
                    })
                  }
                  disabled={isNotAllowed(
                    currentPagePermissions,
                    BUTTON_CODES.cths_thay_the,
                  )}
                >
                  HS được thay thế
                </Button>
                <Button
                  className="btn"
                  icon={<Icons.fileDone />}
                  onClick={() =>
                    setShowModal({
                      ...showModal,
                      isAdditionalRequiredModalShow: true,
                    })
                  }
                  disabled={isNotAllowed(
                    currentPagePermissions,
                    BUTTON_CODES.cths_ycbshs,
                  )}
                >
                  Y/C bổ sung hồ sơ
                </Button>
                <Button
                  className="btn"
                  //icon={<Icons.calender />}
                  icon={<Icons.download />}
                  onClick={() => {
                    handleCheckIsSaveChanged(handleExportReportPrint);
                  }}
                  disabled={
                    appraisalFileDetail.fileStatus === -1 ||
                    isNotAllowed(currentPagePermissions, BUTTON_CODES.cths_pyc)
                  }
                >
                  Xuất phiếu YC
                </Button>
                <Button
                  loading={isBtnLoading.exportSurvey}
                  className="btn"
                  icon={<Icons.download />}
                  onClick={() => {
                    handleCheckIsSaveChanged(exportSurveyReport);
                  }}
                  disabled={
                    (!appraisalFileDetail.appraisalDate &&
                      appraisalFileDetail.fileStatus < 12) ||
                    isNotAllowed(
                      currentPagePermissions,
                      BUTTON_CODES.cths_xuat_BBKS,
                    )
                  }
                >
                  Xuất BBKS
                </Button>
                <Button
                  className="btn"
                  icon={<Icons.download />}
                  disabled={
                    (!appraisalFileDetail.appraisalDate &&
                      appraisalFileDetail.fileStatus < 12) ||
                    isNotAllowed(
                      currentPagePermissions,
                      BUTTON_CODES.cths_xuat_TT,
                    )
                  }
                  onClick={() =>
                    handleCheckIsSaveChanged(() => handleSendApproval(true))
                  }
                >
                  Xuất tờ trình
                </Button>
                <Button
                  className="btn"
                  icon={<Icons.download />}
                  disabled={
                    appraisalFileDetail.fileStatus < 16 ||
                    approvalInfo?.status !== APPROVAL_STATUS.APPROVED ||
                    isNotAllowed(
                      currentPagePermissions,
                      BUTTON_CODES.cths_xuat_TB_KQ,
                    )
                  }
                  onClick={() =>
                    navigate(`${APPRAISAL_RESULTS.replace(":id", id!)}`)
                  }
                >
                  Xuất TB + KQTĐG
                </Button>
                <Button
                  loading={isBtnLoading.saveBtn}
                  className="btn-save"
                  onClick={
                    !isBtnLoading.saveBtn ? updateAppraisalFile : undefined
                  }
                  disabled={
                    isDisableFncBtnWithLockEditFeature() ||
                    isUserCanNotUpdate() ||
                    ((isRoleCBTH || isRoleCBTM) &&
                      (tabIndex === "3" || tabIndex === "4") &&
                      !isRoleCVTD) ||
                    isNotAllowed(currentPagePermissions, BUTTON_CODES.cths_luu)
                  }
                >
                  Lưu
                </Button>

                {appraisalFileDetail.fileStatus < 12 && (
                  <>
                    {isRoleCBTH &&
                      appraisalFileDetail.fileStatus === 1 &&
                      !appraisalFileDetail.receivedLos && (
                        // HS từ LOS
                        <Button
                          className="btn-save"
                          onClick={handleCompleteFileFromLOS}
                          loading={isBtnLoading.completeFileFromLOS}
                          disabled={
                            isUserCanNotCompleteFileFromLos() ||
                            isNotAllowed(
                              currentPagePermissions,
                              BUTTON_CODES.cths_tiep_nhan,
                            )
                          }
                        >
                          Tiếp nhận
                        </Button>
                      )}
                    {isRoleCVTD && assignmentIsStartSurveyStep() && (
                      <Button
                        loading={isBtnLoading.completeSurvey}
                        className="btn-save"
                        onClick={handleCompleteAppraisalFile}
                        disabled={
                          appraisalFileDetail.fileStatus === -1 ||
                          isDisableFncBtnWithLockEditFeature() ||
                          isUserCanNotCompleteAppraisal()
                        }
                      >
                        Hoàn thành KS
                      </Button>
                    )}
                  </>
                )}
                {appraisalFileDetail.fileStatus >= 12 &&
                  !appraisalFileDetail?.startProcessReportDate &&
                  appraisalFileDetail.fileStatus !== -1 &&
                  isRoleCVTD && (
                    <Button className="btn" onClick={handleSetTimeSLA}>
                      Lập tờ trình
                    </Button>
                  )}

                {appraisalFileDetail.fileStatus >= 12 &&
                  appraisalFileDetail.fileStatus !== 19 &&
                  !isCurrentAssigner() &&
                  !handleCheckCanSendApproval() && (
                    <Button
                      className="btn-save"
                      onClick={() => handleSendApproval(false)}
                      disabled={
                        ((appraisalFileDetail.fileStatus === 12 ||
                          appraisalFileDetail.fileStatus === 17) &&
                          !appraisalFileDetail?.startProcessReportDate) ||
                        (appraisalFileDetail.fileStatus === 12 ||
                        appraisalFileDetail.fileStatus === 17 ||
                        !appraisalFileDetail?.startProcessReportDate
                          ? isNotAllowed(
                              currentPagePermissions,
                              BUTTON_CODES.cths_gui_duyet,
                            )
                          : isNotAllowed(
                              currentPagePermissions,
                              BUTTON_CODES.cths_phe_duyet,
                            ))
                      }
                    >
                      {appraisalFileDetail.fileStatus === 12 ||
                      appraisalFileDetail.fileStatus === 17
                        ? "Gửi duyệt"
                        : "Phê duyệt"}
                    </Button>
                  )}
                {appraisalFileDetail.fileStatus === 12 && (
                  <ButtonCustom
                    label="Upload ngoài"
                    className="btn"
                    onClick={() => {
                      setShowModal({
                        ...showModal,
                        isUploadExternalShow: true,
                      });
                    }}
                    icon={<UploadOutlined />}
                    code={BUTTON_CODES.cths_upload_ngoai}
                  />
                )}
              </Space>
            </div>
            <TabsCustom
              activeKey={tabIndex}
              onChange={(value: string) => setTabIndex(value)}
              style={{ padding: "0 8px" }}
              aboveHeight={actionsContainerRef?.current?.offsetHeight || 52}
              items={[
                {
                  label: "Kiểm tra hồ sơ",
                  key: "1",
                  forceRender: true,
                  children: (
                    <GeneralInfo
                      ref={btnRef}
                      isReceivedFromLos={isReceivedFromLos}
                      dataGeneralInfo={{
                        appraisalPurposeId:
                          appraisalFileDetail.appraisalPurposeId,
                        proposalCode: appraisalFileDetail.proposalCode,
                        fileStatus: appraisalFileDetail.fileStatus,
                        assetLevelOneId: appraisalFileDetail.assetLevelOneId,
                        assetLevelTwoId: appraisalFileDetail.assetLevelTwoId,
                        branchData: {
                          rmName: appraisalFileDetail.rmName,
                          rmPhone: appraisalFileDetail.rmPhone,
                          resultEmail: appraisalFileDetail.resultEmail,
                          invoiceEmail: appraisalFileDetail.invoiceEmail,
                          branch: appraisalFileDetail.branch,
                          transOffice: appraisalFileDetail.transOffice,
                        },
                        customerData: appraisalFileDetail.customer,
                        assetCommons: appraisalFileDetail.assetCommons,
                        legalDocuments: appraisalFileDetail.legalDocuments,
                        surveyData: {
                          surveyGuide: appraisalFileDetail.surveyGuide,
                          surveyGuidePhone:
                            appraisalFileDetail.surveyGuidePhone,
                          surveyTime: appraisalFileDetail.surveyTime,
                          surveySchedules: appraisalFileDetail.surveySchedules,
                          appraisalDate:
                            appraisalFileDetail.appraisalDate || null,
                          surveyGuidePosition:
                            appraisalFileDetail.surveyGuidePosition || null,
                        },
                        customerNameByLos:
                          appraisalFileDetail.customerNameByLos,
                        addressCustomerByLos:
                          appraisalFileDetail.addressCustomerByLos,
                        typeCustomerByLos:
                          appraisalFileDetail.typeCustomerByLos,
                        cccdCustomerByLos:
                          appraisalFileDetail.cccdCustomerByLos,
                        checkClimsLos: appraisalFileDetail.checkClimsLos,
                        addressCustomDetail:
                          appraisalFileDetail.addressCustomDetail,
                        rePricingNumber: appraisalFileDetail.rePricingNumber,
                      }}
                    />
                  ),
                },
                {
                  label: "Thông tin tài sản",
                  key: "2",
                  forceRender: true,
                  children: (
                    <AssetsInfo
                      ref={btnRefAssetInfo}
                      dataAssetsInfo={{
                        appraisalInfo: {
                          customerName:
                            appraisalFileDetail.customer?.customerName || "",
                          personIdentification:
                            appraisalFileDetail.customer
                              ?.personIdentification || null,
                          assetName: appraisalFileDetail.assetName,
                          address: appraisalFileDetail.address,
                          appraisalPurposeId:
                            appraisalFileDetail.appraisalPurposeId,
                        },
                        assetCommons: appraisalFileDetail.assetCommons,
                        assetLevelTwoId: appraisalFileDetail.assetLevelTwoId,
                      }}
                    />
                  ),
                },
                {
                  label: "Định vị và hình ảnh",
                  key: "3",
                  children: (
                    <PositionAndImg
                      ref={btnRefPositionImage}
                      appraisalFileId={id || ""}
                      reportCode={appraisalFileDetail.reportCode}
                      proposalCode={appraisalFileDetail.proposalCode}
                      isMovableEstate={
                        appraisalFileDetail.assetLevelOneId ===
                        ASSET_LV1.MOVABLE_ESTATE
                      }
                      isRoadWater={
                        appraisalFileDetail.assetLevelTwoId ===
                          ASSET_LV2.VEHICLE ||
                        appraisalFileDetail.assetLevelTwoId ===
                          ASSET_LV2.WATER_VEHICLE
                      }
                      currentCoordinate={{
                        latitude: appraisalFileDetail.latitude,
                        longitude: appraisalFileDetail.longitude,
                      }}
                    />
                  ),
                },
                {
                  label: "Giá trị tài sản",
                  key: "4",
                  // disabled: true,
                  children:
                    appraisalFileDetail.fileStatus < 12 ? (
                      <div>
                        <Empty
                          style={{ height: "100%", paddingTop: "30vh" }}
                          description={
                            <Typography.Text
                              style={{ fontWeight: 500, fontSize: "16px" }}
                            >
                              Hồ sơ chưa hoàn thành khảo sát
                            </Typography.Text>
                          }
                        />
                      </div>
                    ) : (
                      <PropertyValue
                        ref={btnRefPropertyValue}
                        appraisalFileId={id || ""}
                        assetLevelTwoId={appraisalFileDetail.assetLevelTwoId}
                        fileStatus={appraisalFileDetail.fileStatus}
                      />
                    ),
                },
              ]}
            />
          </div>
        </Spin>

        <AdditionalRequiredModal
          isOpenModal={showModal.isAdditionalRequiredModalShow}
          closeModal={closeModalAdditionalRequired}
          customerTypeId={appraisalFileDetail.customer?.customerTypeId || null}
          assetLevelTwoId={appraisalFileDetail.assetLevelTwoId}
          appraisalFileId={id || ""}
          fileStatus={appraisalFileDetail.fileStatus}
          disableBtnSave={disableSave}
          // roles=
        />
        <RefuseToPriceModal
          isOpenModal={showModal.isRefuseToPriceModalShow}
          closeModal={closeModalRefuseToPriceRequired}
          assetLevelTwoId={appraisalFileDetail.assetLevelTwoId}
          appraisalFileId={id || ""}
          disableBtnSave={disableSave}
        />
        <AssignmentModal
          isOpenModal={showModal.isAssignmentModalShow}
          closeModal={closeModalAssignment}
          appraisalFileId={id || ""}
          appraisalUnit={appraisalFileDetail.appraisalUnit}
          fileStatus={appraisalFileDetail.fileStatus}
        />
        <FeeModal
          isOpenModal={showModal.isFeeModalShow}
          closeModal={closeModalFee}
          {...(showModal.isFeeModalShow && { appraisalFileId: id || "" })}
          fileStatus={appraisalFileDetail}
          disableBtnSave={disableSave}
          dataAll={data ? data : {}}
          assetLevelTwoName={
            appraisalFileDetail?.assetLevelTwo?.assetLevelTwoName
          }
        />
        <CancelModal
          isOpenModal={showModal.isCancelModalShow}
          closeModal={closeModalCancel}
          appraisalFileData={appraisalFileDetail}
          mutateAppraisalFileDetail={mutate}
        />
        <UploadExternalModal
          open={showModal.isUploadExternalShow}
          onClose={closeModalUploadExternal}
          onOk={() => {
            mutate();
            // setTimeout(() => {
            //   window.location.reload();
            // }, 1000);
          }}
          assetLevelTwoId={appraisalFileDetail.assetLevelTwoId}
        />
      </Fragment>
    </FeeModalContext.Provider>
  );
};

export default AppraisalFileDetail;
