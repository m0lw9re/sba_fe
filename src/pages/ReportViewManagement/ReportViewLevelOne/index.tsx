import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Row,
  Space,
  Spin,
  Tabs,
  TabsProps,
  Typography,
  message,
} from "antd";
import { sendApprovalAPI } from "apis/sendApproval";
import PdfViewer from "components/PdfViewer";
import TitleCustom from "components/TitleCustom";
import { APPROVAL_STATUS, BUTTON_CODES } from "constant/common";
import { ASSET_LV2, LOCAL_STORAGE_KEY } from "constant/enums";
import {
  ApprovalHistoryConstructionDtos,
  ApprovalHistoryValues,
  AssetValuationType,
} from "constant/types/appraisalFile";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import Comment from "pages/ReportViewManagement/ReportViewLevelOne/component/Commant";
import "pages/ReportViewManagement/ReportViewLevelOne/style.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  APPRAISAL_FILES,
  APPRAISAL_FILE_DETAIL,
  APPRAISAL_RESULTS,
} from "routes/route.constant";
import {
  useAccounts,
  useAppraisalFileDetail,
  useAssetsValuation,
  useUploadStatus,
} from "utils/request";
import { useApproval } from "utils/request/useApproval";
import StaffsApprovalModal from "./component/StaffsApprovalModal";
import useAppraisalFileFunction from "hooks/useAppraisalFileFunction";
import { sortBy } from "lodash";
import AppendixFile from "./component/AppendixFile";
import { isNotAllowed } from "utils/permission";
import { RootState } from "configs/configureStore";
import { SendingOtpStatus } from "pages/AppraisalResults";

const { LAND, APARTMENT, PROJECT, ESTIMATE, VEHICLE, WATER_VEHICLE, MACHINE } =
  ASSET_LV2;

export type UpdateInfoProps = {
  approvalHistoryValues: ApprovalHistoryValues[];
  approvalHistoryConstructionDtos: ApprovalHistoryConstructionDtos[];
};
const initUpdateInfo: UpdateInfoProps = {
  approvalHistoryValues: [],
  approvalHistoryConstructionDtos: [],
};
const ReportViewLevelOne = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewOnly, setViewOnly] = useState(
    location.search.includes("viewOnly"),
  );
  const userId = String(localStorage.getItem(LOCAL_STORAGE_KEY.USER_ID));
  const { data: approvalInfo, mutate } = useApproval(id || null);
  const { data: appraisalDetail } = useAppraisalFileDetail(id || "");
  const {
    data: assetsValuationData,
    mutate: mutateAssetsValuation,
  }: {
    data: AssetValuationType;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useAssetsValuation(id!, appraisalDetail?.assetLevelTwoId);
  const { isCurrentAssigner } = useAppraisalFileFunction({
    appraisalId: id!,
  });
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice,
  );

  const { data: staffs } = useAccounts({
    page: 1,
    limit: 9000,
  });

  const [uploadModal, setUploadModal] = useState<boolean>(false);

  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);
  const [isPdfTBLoading, setIsPdfTBLoading] = useState<boolean>(true);
  const [isPdfKQLoading, setIsPdfKQLoading] = useState<boolean>(true);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(true);
  const [isPdfBBLoading, setIsPdfBBLoading] = useState<boolean>(true);
  const [pdfFileTB, setPdfFileTB] = useState<string>("");
  const [pdfFileKQ, setPdfFileKQ] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<string>();
  const [pdfFileBB, setPdfFileBB] = useState<string>("");
  const [totalPrfValue, setTotalPrfvalue] = useState<number>();
  const [activeTabs, setActiveTabs] = useState<string>("1");
  const [staffsApproval, setStaffsApproval] = useState<any[]>([]);
  const [staffsApprovalModal, setStaffsApprovalModal] =
    useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<any>();
  const [commentInput, setCommentInput] = useState<string>("");
  const [updateFormValue, setUpdateFormValue] =
    useState<UpdateInfoProps>(initUpdateInfo);
  const [constructionFutureValue, setConstructionFutureValue] = useState<
    number | null
  >(null);

  const { data: uploadStatus } = useUploadStatus(id || "");

  const fetchApprovalStaffs = async () => {
    try {
      const res = await sendApprovalAPI.getApprovalStaff(id!);
      if (res.data.code === 200) {
        setStaffsApproval(res.data.data || []);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  const fetchApprovalFile = async (id: string) => {
    setIsPdfLoading(true);
    try {
      const res = await sendApprovalAPI.getReport(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfFile(url);
    } catch (error) {
      console.log("error:", error);
      message.error("Không tải được file, Vui lòng thử lại.");
    }
    setIsPdfLoading(false);
  };

  const fetchApprovalFileBB = async (id: string) => {
    setIsPdfBBLoading(true);
    try {
      const res = await sendApprovalAPI.getMeetingReport(id);
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfFileBB(url);
        setIsPdfBBLoading(false);
      }
    } catch (error) {
      console.log("error:", error);
      message.error("Không tải được file, Vui lòng thử lại.");
    }
    setIsPdfBBLoading(false);
  };

  const handleCancelApproval = async () => {
    if (!commentInput) {
      message.error("Vui lòng nhập lý do từ chối");
      return;
    }
    try {
      setIsBtnLoading(true);
      const assetLevelTwoId = appraisalDetail?.assetLevelTwoId;
      const isAssetHaveTableKQDat =
        assetLevelTwoId === LAND ||
        assetLevelTwoId === PROJECT ||
        assetLevelTwoId === ESTIMATE ||
        assetLevelTwoId === VEHICLE ||
        assetLevelTwoId === WATER_VEHICLE;

      // transform data
      let tableKQ: any[] = [];
      if (isAssetHaveTableKQDat) {
        tableKQ = assetsValuationData?.tableKQDat as any[];
      } else {
        tableKQ = assetsValuationData?.tableKQ as any[];
      }

      const data = {
        approvalSubmissionId: approvalInfo?.approvalSubmissionId,
        approvalComment: commentInput,
        approvalEmployeeId: userId,
        approvalHistoryValues: sortBy(
          tableKQ?.map((item) => {
            return {
              ...item,
              approvalHistoryValueId: null,
              approvalHistoryId: 0,
              assetChildId: item.assetChildId || 0,
              assetGrandChildId: item.assetGrandChildId || 0,
              valuationResultLandEstateId: handleGetValuationResultId(item),
              name: item.name,
              type: Number(item.type),
              totalArea: Number(item?.totalAreaApprovaled) || 0,
              unitPrice: item?.unitPriceApprovaled || 0,
              totalValue: item?.totalValueApprovaled || 0,
            };
          }) || [],
          ["orderBy"],
        ),
        approvalHistoryConstructionDtos:
          assetsValuationData?.tableKQCTXD?.map((item) => {
            return {
              approvalHistoryConstructionId: null,
              approvalHistoryId: 0,
              constructionId: item.constructionId,
              assetLandInforId: item.assetLandInforId,
              orderBy: item.orderBy,

              constructionTypeName: item.constructionType.constructionTypeName,
              constructionName: item?.constructionName?.constructionName || "",

              constructionArea: item?.constructionArea || null,
              remainingQuality: item?.remainingQuality || null,
              mdht: item.mdht,
              unitPrice: item?.unitPriceApprovaled || 0,
              totalValue: item?.totalValueApprovaled || 0,
            };
          }) || [],
      };
      const res = await sendApprovalAPI.cancelApproval(data);
      if (res.data.code === 200) {
        message.success("Từ chối phê duyệt thành công");
      } else {
        message.error("Từ chối phê duyệt thất bại");
      }
      mutate();
      setCommentInput("");
      setIsBtnLoading(false);
    } catch (error) {
      console.log("handleCancelApproval error:", error);
      setIsBtnLoading(false);
    }
  };
  const handleSendApproval = async () => {
    if (!selectedStaff) {
      message.error("Vui lòng chọn người phê duyệt tiếp theo");
      return;
    }
    if (!commentInput) {
      message.error("Vui lòng nhập ý kiến");
      return;
    }
    setIsBtnLoading(true);
    try {
      const data = {
        approvalSubmissionId: approvalInfo?.approvalSubmissionId,
        approvalEmployeeId: userId,
        approvalNextEmployeeId: selectedStaff,
        approvalComment: commentInput,
        constructionFutureValue: constructionFutureValue,
        ...updateFormValue,
      };
      const res = await sendApprovalAPI.sendApproval(data);
      if (res.data.code === 200) {
        message.success("Gửi duyệt thành công");
      } else {
        message.error("Gửi duyệt thất bại");
      }
      mutate();
      setStaffsApprovalModal(false);
      setCommentInput("");
      setSelectedStaff("");
      setIsBtnLoading(false);
    } catch (error) {
      console.log("handleSendApproval error:", error);
      setIsBtnLoading(false);
    } finally {
      setIsBtnLoading(false);
    }
  };
  const handleAcceptApproval = async () => {
    if (
      !selectedStaff &&
      approvalInfo?.level + 1 < (approvalInfo?.totalLevel || 2)
    ) {
      message.error("Vui lòng chọn người phê duyệt tiếp theo");
      return;
    }
    if (!commentInput) {
      message.error("Vui lòng nhập ý kiến");
      return;
    }
    try {
      setIsBtnLoading(true);
      const data = {
        approvalSubmissionId: approvalInfo?.approvalSubmissionId,
        approvalEmployeeId: userId,
        approvalNextEmployeeId: selectedStaff,
        approvalComment: commentInput,
        constructionFutureValue: constructionFutureValue,
        ...updateFormValue,
      };
      const res = await sendApprovalAPI.acceptApproval(data);
      if (res.data.code === 200) {
        message.success("Phê duyệt thành công");
        if (res.data?.data?.level === res.data?.data?.totalLevel) {
          navigate(APPRAISAL_RESULTS.replace(":id", id!), {
            replace: true,
          });
        } else {
          navigate(APPRAISAL_FILE_DETAIL.replace(":id", id!));
        }
      } else {
        message.error(res.data.message || "Phê duyệt thất bại");
      }
      mutate();
      mutateAssetsValuation();
      setStaffsApprovalModal(false);
      setCommentInput("");
      setSelectedStaff("");
      setIsBtnLoading(false);
    } catch (error) {
      console.log("handleAcceptApproval error:", error);
      setIsBtnLoading(false);
    } finally {
      setIsBtnLoading(false);
    }
  };
  const handleCheckIsNextEmployee = () => {
    if (approvalInfo?.level === -1) return false;
    if (
      approvalInfo?.approvalHistoryDtos[
        approvalInfo?.approvalHistoryDtos.length - 1
      ].approvalNextEmployeeId === userId
    ) {
      return true;
    }
    return false;
  };
  const handleSendByApprovalStatus = async () => {
    setStaffsApprovalModal(false);
    if (approvalInfo?.level < 0) {
      // gửi duyệt
      handleSendApproval();
    } else {
      // phê duyệt
      handleAcceptApproval();
    }
  };
  const handleCheckIsCanceledEmployee = () => {
    try {
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
    } catch (error) {
      console.log("error: ", error);
      return false;
    }
  };

  const handleCheckIsGreaterThreeBil = () => {
    if (
      assetsValuationData?.tableTong?.totalValue! >= 300000000000 ||
      assetsValuationData?.tableTong?.totalValueApprovaled! >= 300000000000
    ) {
      return true;
    }
    return false;
  };

  const handleGetValuationResultId = (item: any) => {
    if (
      appraisalDetail?.assetLevelTwoId === LAND ||
      appraisalDetail?.assetLevelTwoId === PROJECT ||
      appraisalDetail?.assetLevelTwoId === ESTIMATE
    ) {
      return item.valuationResultLandEstateId || 0;
    } else if (appraisalDetail?.assetLevelTwoId === VEHICLE) {
      return item.valuationResultRoadVehicleId || 0;
    } else if (appraisalDetail?.assetLevelTwoId === WATER_VEHICLE) {
      return item.valuationResultWaterwayVehicleId || 0;
    } else {
      return item.valuationResultLandEstateId || 0;
    }
  };

  useEffect(() => {
    if (updateFormValue) {
      const totalHistoryValues = updateFormValue.approvalHistoryValues.reduce(
        (arr, curr) => {
          return arr + (curr.totalValue || 0);
        },
        0,
      );
      const totalConstructionValues =
        updateFormValue.approvalHistoryConstructionDtos.reduce((arr, curr) => {
          return arr + (curr.totalValue || 0);
        }, 0);
      setTotalPrfvalue(totalHistoryValues + totalConstructionValues);
    }
  }, [updateFormValue]);

  useEffect(() => {
    // phê duyệt cấp cuối => navigate to ký số
    if (
      approvalInfo &&
      appraisalDetail?.fileStatus === 16 &&
      approvalInfo?.status === APPROVAL_STATUS.APPROVED &&
      !viewOnly
    ) {
      navigate(APPRAISAL_RESULTS.replace(":id", id!), {
        replace: true,
      });
    }
    // đã hoàn thành => viewOnly
    if (approvalInfo && approvalInfo?.status === APPROVAL_STATUS.APPROVED) {
      setViewOnly(true);
    }
    if (!location.search.includes("viewOnly")) {
      if (
        (!handleCheckIsCanceledEmployee() &&
          approvalInfo?.level === -1 &&
          approvalInfo?.status === 2) ||
        (!handleCheckIsNextEmployee() && approvalInfo?.level !== -1) ||
        isCurrentAssigner()
      ) {
        setViewOnly(true);
      } else {
        setViewOnly(false);
      }
    }
  }, [approvalInfo, id, appraisalDetail]);
  useEffect(() => {
    Promise.all([fetchApprovalFile(id!), fetchApprovalStaffs()]);
  }, [id]);

  useEffect(() => {
    const isGreaterThreeBil = handleCheckIsGreaterThreeBil();
    if (isGreaterThreeBil && id) {
      fetchApprovalFileBB(id);
    }
  }, [id, totalPrfValue]);

  useEffect(() => {
    if (!id) {
      navigate(APPRAISAL_FILES);
    }
    let breadCrumb = [
      {
        label: "Thông tin hồ sơ",
        path: APPRAISAL_FILE_DETAIL.replace(":id", id!),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    if (!assetsValuationData && viewOnly) return;
    const assetLevelTwoId = appraisalDetail?.assetLevelTwoId;
    const isAssetHaveTableKQDat =
      assetLevelTwoId === LAND ||
      assetLevelTwoId === PROJECT ||
      assetLevelTwoId === ESTIMATE ||
      assetLevelTwoId === VEHICLE ||
      assetLevelTwoId === WATER_VEHICLE;

    // transform data
    let tableKQ: any[] = [];
    if (isAssetHaveTableKQDat) {
      tableKQ = assetsValuationData?.tableKQDat as any[];
    } else {
      tableKQ = assetsValuationData?.tableKQ as any[];
    }
    let historyValuesData: ApprovalHistoryValues[] = [];
    let historyConstructionData: ApprovalHistoryConstructionDtos[] = [];

    // ts có sd trường Approvaled
    if (isAssetHaveTableKQDat) {
      historyValuesData =
        tableKQ?.map((item) => {
          return {
            ...item,
            approvalHistoryValueId: null,
            approvalHistoryId: 0,
            assetChildId: item.assetChildId || 0,
            assetGrandChildId: item.assetGrandChildId || 0,
            valuationResultLandEstateId: handleGetValuationResultId(item),
            name: item.name,
            type: Number(item.type),
            totalArea: Number(item?.totalAreaApprovaled) || 0,
            unitPrice: item?.unitPriceApprovaled || 0,
            totalValue: item?.totalValueApprovaled || 0,
          };
        }) || [];
      historyConstructionData =
        assetsValuationData?.tableKQCTXD?.map((item) => {
          return {
            approvalHistoryConstructionId: null,
            approvalHistoryId: 0,
            constructionId: item.constructionId,
            assetLandInforId: item.assetLandInforId,
            orderBy: item.orderBy,

            constructionTypeName: item.constructionType.constructionTypeName,
            constructionName: item?.constructionName?.constructionName || "",

            constructionArea: item?.constructionAreaApprovaled || null,
            remainingQuality: item?.remainingQualityApprovaled || null,
            mdht: item?.mdhtApprovaled || null,
            unitPrice: item?.unitPriceApprovaled || 0,
            totalValue: item?.totalValueApprovaled || 0,
          };
        }) || [];
    } else {
      historyValuesData =
        tableKQ?.map((item) => {
          return {
            ...item,
            approvalHistoryValueId: null,
            approvalHistoryId: 0,
            assetChildId: item.assetChildId || 0,
            assetGrandChildId: item.assetGrandChildId || 0,
            valuationResultLandEstateId: handleGetValuationResultId(item),
            name: item.name,
            type: Number(item.type),
            totalArea: Number(item?.totalAreaApprovaled) || 0,
            unitPrice: item?.unitPriceApprovaled || 0,
            totalValue: item?.totalValueApprovaled || 0,
          };
        }) || [];
      historyConstructionData =
        assetsValuationData?.tableKQCTXD?.map((item) => {
          return {
            approvalHistoryConstructionId: null,
            approvalHistoryId: 0,
            constructionId: item.constructionId,
            assetLandInforId: item.assetLandInforId,
            orderBy: item.orderBy,

            constructionTypeName: item.constructionType.constructionTypeName,
            constructionName: item?.constructionName?.constructionName || "",

            constructionArea: item?.constructionArea || null,
            remainingQuality: item?.remainingQuality || null,
            mdht: item.mdht,
            unitPrice: item?.unitPriceApprovaled || 0,
            totalValue: item?.totalValueApprovaled || 0,
          };
        }) || [];
    }
    setUpdateFormValue({
      approvalHistoryValues: sortBy(historyValuesData, ["orderBy"]),
      approvalHistoryConstructionDtos: historyConstructionData,
    });
    setConstructionFutureValue(
      assetsValuationData?.tableTong?.constructionFutureValueApprovaled ||
        assetsValuationData?.tableTong?.constructionFutureValue ||
        null,
    );
  }, [assetsValuationData]);

  const handleGetFile = async (id: string, type: "inform" | "result") => {
    if (!appraisalDetail) return "";
    try {
      let res: any;
      if (appraisalDetail?.appraisalInformFileName) {
        res = await sendApprovalAPI.getFileWithSign(id, type);
      } else {
        res = await sendApprovalAPI.getFileWithoutSign(id, type);
      }

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      if (url) {
        if (type === "inform") {
          setIsPdfTBLoading(false);
        } else {
          setIsPdfKQLoading(false);
        }
      }
      return url;
    } catch (error) {
      console.log("error:", error);
      console.log("get file failed");
      return "";
    } finally {
      if (type === "inform") {
        setIsPdfTBLoading(false);
      } else {
        setIsPdfKQLoading(false);
      }
    }
  };

  const getFiles = async (type?: "inform" | "result") => {
    if (pdfFileTB && pdfFileKQ) return;
    let fileTb: string = "";
    let fileKq: string = "";

    if (type !== "result") {
      setIsPdfTBLoading(true);
      fileTb = await handleGetFile(id!, "inform");
      setPdfFileTB(fileTb);
    }
    if ((type !== "inform" && fileTb) || type === "result") {
      setIsPdfKQLoading(true);
      fileKq = await handleGetFile(id!, "result");
      setPdfFileKQ(fileKq);
    }
    if (!fileTb) {
      setIsPdfKQLoading(false);
    }
  };

  useEffect(() => {
    if (!pdfFileKQ) {
      getFiles("result");
    }
    if (!pdfFileTB) {
      getFiles("inform");
    }
  }, [pdfFileKQ, pdfFileTB, appraisalDetail]);

  const renderPdfFileViewer = () => {
    return isPdfLoading ? (
      <div
        style={{
          height: "80vh",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin />
      </div>
    ) : (
      <div style={{ width: "100%" }}>
        {pdfFile ? (
          <PdfViewer src={pdfFile || ""} />
        ) : (
          <>
            <div
              style={{
                height: "80vh",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <TitleCustom
                size="big"
                title="Không tải được file, Vui lòng thử lại."
              ></TitleCustom>
              <Button
                style={{ marginTop: "10px" }}
                onClick={() => fetchApprovalFile(id!)}
                type="primary"
                size="middle"
              >
                Thử lại
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Báo cáo thẩm định giá",
      forceRender: true,
      children: isPdfLoading ? (
        <div
          style={{
            height: "80vh",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin />
        </div>
      ) : (
        <div>
          {pdfFile ? (
            <PdfViewer src={pdfFile || ""} />
          ) : (
            <>
              <div
                style={{
                  height: "80vh",
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TitleCustom
                  size="big"
                  title="Không tải được file, Vui lòng thử lại."
                ></TitleCustom>
                <Button
                  style={{ marginTop: "10px" }}
                  onClick={() => fetchApprovalFile(id!)}
                  type="primary"
                  size="middle"
                >
                  Thử lại
                </Button>
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Biên bản họp ban",
      forceRender: true,
      children: isPdfBBLoading ? (
        <div
          style={{
            height: "80vh",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin />
        </div>
      ) : (
        <div>
          {pdfFileBB ? (
            <PdfViewer src={pdfFileBB || ""} />
          ) : (
            <>
              <div
                style={{
                  height: "80vh",
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TitleCustom
                  size="big"
                  title="Không tải được file, Vui lòng thử lại."
                ></TitleCustom>
                <Button
                  style={{ marginTop: "10px" }}
                  onClick={() => fetchApprovalFileBB(id!)}
                  type="primary"
                  size="middle"
                >
                  Thử lại
                </Button>
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: "Thông báo kết quả thẩm định sơ bộ",
      forceRender: true,
      children: isPdfTBLoading ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          {pdfFileTB ? (
            <PdfViewer src={pdfFileTB} />
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                flexDirection: "column",
                minHeight: "70vh",
              }}
            >
              <TitleCustom
                size="big"
                title="Không tải được file, Vui lòng thử lại."
              ></TitleCustom>
              <Button
                style={{ marginTop: "10px" }}
                onClick={() => getFiles("inform")}
                type="primary"
                size="middle"
              >
                Thử lại
              </Button>
            </div>
          )}
        </>
      ),
    },
    {
      key: "4",
      label: "Thông báo tư vấn giá",
      forceRender: true,
      children: isPdfKQLoading ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          {pdfFileKQ ? (
            <PdfViewer src={pdfFileKQ} />
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                flexDirection: "column",
                minHeight: "70vh",
              }}
            >
              <TitleCustom
                size="big"
                title="Không tải được file, Vui lòng thử lại."
              ></TitleCustom>
              <Button
                style={{ marginTop: "10px" }}
                onClick={() => getFiles("result")}
                type="primary"
                size="middle"
              >
                Thử lại
              </Button>
            </div>
          )}
        </>
      ),
    },
  ];

  const handleTabData = (): TabsProps["items"] => {
    if (!handleCheckIsGreaterThreeBil()) {
      return tabs.filter((tab) => tab.key !== "2");
    }
    if (approvalInfo?.level + 1 === approvalInfo?.totalLevel) {
      const filteredTabs = tabs.filter((tab) => {
        const condition1 = tab.key !== "3";
        const condition2 = tab.key !== "4";

        return condition1 && condition2;
      });
      return filteredTabs;
    }
    return tabs;
  };
  return (
    <div className="page-container report-view-level-one-container">
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        {/* heading & action */}
        <Row justify={"space-between"}>
          <Typography className="title">Xem báo cáo</Typography>

          <Space className="action-wrapper" size="small">
            {!viewOnly ? (
              <>
                {approvalInfo?.level === -1 ? (
                  <>
                    {
                      <Button
                        style={{ backgroundColor: "#2A81D0" }}
                        className="btn-action"
                        onClick={() => {
                          setStaffsApprovalModal(true);
                        }}
                        disabled={
                          !pdfFile ||
                          isNotAllowed(
                            currentPagePermissions,
                            BUTTON_CODES.tt_gui_duyet,
                          )
                        }
                        loading={isBtnLoading}
                      >
                        Gửi duyệt
                      </Button>
                    }
                    {/* <Button
                      onClick={() => {
                        setUploadModal(true);
                      }}
                      className="btn-action"
                      icon={<UploadOutlined />}
                    >
                      Upload
                    </Button> */}
                  </>
                ) : (
                  <>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn từ chối phê duyệt?"
                      onConfirm={handleCancelApproval}
                      okText="Đồng ý"
                      cancelText="Hủy"
                      placement="bottomLeft"
                    >
                      <Button
                        style={{ backgroundColor: "#F25B60" }}
                        className="btn-action"
                        disabled={isNotAllowed(
                          currentPagePermissions,
                          BUTTON_CODES.tt_tu_choi,
                        )}
                        loading={isBtnLoading}
                      >
                        Từ chối
                      </Button>
                    </Popconfirm>

                    {/* button phê duyệt cấp cuối */}
                    {/* phê duyệt cấp cuối => ko cần chọn người phê duyệt */}
                    {approvalInfo?.level + 1 ===
                    (approvalInfo?.totalLevel || 2) ? (
                      <Popconfirm
                        title="Bạn có chắc chắn muốn phê duyệt hồ sơ này?"
                        onConfirm={handleAcceptApproval}
                        okText="Đồng ý"
                        cancelText="Hủy"
                        placement="bottomLeft"
                        disabled={isBtnLoading}
                      >
                        <Button
                          style={{ backgroundColor: "#2A81D0" }}
                          className="btn-action"
                          disabled={isNotAllowed(
                            currentPagePermissions,
                            BUTTON_CODES.tt_phe_duyet,
                          )}
                          loading={isBtnLoading}
                        >
                          Phê duyệt cấp {approvalInfo?.level + 1}
                        </Button>
                      </Popconfirm>
                    ) : (
                      // button phê duyệt cấp 1, 2, 3,...
                      <Button
                        style={{ backgroundColor: "#2A81D0" }}
                        className="btn-action"
                        disabled={
                          !pdfFile ||
                          isNotAllowed(
                            currentPagePermissions,
                            BUTTON_CODES.tt_phe_duyet,
                          )
                        }
                        onClick={() => {
                          setStaffsApprovalModal(true);
                        }}
                        loading={isBtnLoading}
                      >
                        Phê duyệt cấp {approvalInfo?.level + 1}
                      </Button>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Button
                  onClick={() =>
                    navigate(APPRAISAL_FILE_DETAIL.replace(":id", id!))
                  }
                  type="default"
                  style={{ height: "36px" }}
                >
                  Quay lại
                </Button>
              </>
            )}
          </Space>
        </Row>
        {uploadStatus?.data?.isHaveReport && (
          <div
            style={{
              margin: "0.25rem 0",
              color: "#696969",
              fontStyle: "italic",
            }}
          >
            Lưu ý: Hồ sơ đang sử dụng tờ trình upload ngoài.
          </div>
        )}
        {/* pdf view */}
        {/* Tài sản dự án + Tổng TS trên 300 tỷ */}

        <>
          <Row style={{ width: "100%" }}>
            {viewOnly ? (
              renderPdfFileViewer()
            ) : (
              <Tabs
                items={handleTabData()}
                style={{ width: "100%" }}
                activeKey={activeTabs}
                onChange={(key) => {
                  setActiveTabs(key as string);
                }}
              />
            )}
          </Row>
        </>

        <Comment
          updateFormValue={updateFormValue}
          setUpdateFormValue={setUpdateFormValue}
          showUpdateForm={approvalInfo?.level >= 0}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          staffs={staffs?.data || []}
          historyApproval={approvalInfo?.approvalHistoryDtos || []}
          viewOnly={viewOnly}
          assetLevelTwoId={appraisalDetail?.assetLevelTwoId || 0}
          constructionFutureValue={constructionFutureValue}
          setConstructionFutureValue={setConstructionFutureValue}
          signatureDate={appraisalDetail?.signatureDate}
        />
        <AppendixFile data={assetsValuationData?.appendices || []} />
        <StaffsApprovalModal
          isOpen={staffsApprovalModal}
          closeModal={() => setStaffsApprovalModal(false)}
          onOk={handleSendByApprovalStatus}
          staffsApproval={staffsApproval}
          setStaffsApproval={setStaffsApproval}
          setSelectedStaff={setSelectedStaff}
          selectedStaff={selectedStaff}
          isSendApproval={approvalInfo?.level < 0}
        />
        {/* <UploadModal
          open={uploadModal}
          onClose={() => {
            setUploadModal(false);
          }}
          onOk={() => {
            setUploadModal(false);
            fetchApprovalFile(id!);
            if (handleCheckIsGreaterThreeBil()) {
              fetchApprovalFileBB(id!);
            }
          }}
          assetLevelTwoId={appraisalDetail?.assetLevelTwoId}
        /> */}
        {/* inputs */}
      </Space>
    </div>
  );
};

export default ReportViewLevelOne;
