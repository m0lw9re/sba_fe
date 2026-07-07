import {
  Button,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Tabs,
  TabsProps,
  Typography,
  message,
} from "antd";
import { sendApprovalAPI } from "apis/sendApproval";
import InputFields from "components/InputFields";
import PdfViewer from "components/PdfViewer";
import TitleCustom from "components/TitleCustom";
import { ASSET_LV2, LOCAL_STORAGE_KEY, TYPE_FIELD } from "constant/enums";
import { AssetValuationType } from "constant/types/appraisalFile";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";
import {
  useAppraisalFileDetail,
  useAssetsValuation,
  useUploadStatus,
} from "utils/request";
import { useApproval } from "utils/request/useApproval";
import AdjustFileModal from "./component/AdjustFileModal/AdjustFileModal";
import AdjustSignerModal from "./component/AdjustSignerModal/AdjustSignerModal";
import "./style.scss";
import { RootState } from "configs/configureStore";
import { isNotAllowed } from "utils/permission";
import { BUTTON_CODES } from "constant/common";
import { sortBy } from "lodash";
import { UploadOutlined } from "@ant-design/icons";
export type SendingOtpStatus = "pending" | "sending" | "success" | "rejected";

const { LAND, APARTMENT, PROJECT, ESTIMATE, VEHICLE, WATER_VEHICLE, MACHINE } =
  ASSET_LV2;
const AppraisalResults = () => {
  const { id } = useParams<{ id: string }>();
  const { data: approvalInfo, mutate } = useApproval(id || null);
  const { data: appraisalDetail } = useAppraisalFileDetail(id!);
  const {
    data: valuationData,
  }: {
    data: AssetValuationType | undefined;
  } = useAssetsValuation(id!, appraisalDetail?.assetLevelTwoId || 0);
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice,
  );
  const totalAssetValue = valuationData?.tableTong?.totalValueApprovaled || 0;
  const companyBranchId = appraisalDetail?.appraisalUnit || 0;

  const userId = String(localStorage.getItem(LOCAL_STORAGE_KEY.USER_ID));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("1");
  const [isPdfTBLoading, setIsPdfTBLoading] = useState<boolean>(true);
  const [isPdfKQLoading, setIsPdfKQLoading] = useState<boolean>(true);
  const [pdfFileTB, setPdfFileTB] = useState<string>("");
  const [pdfFileKQ, setPdfFileKQ] = useState<string>("");
  const [isPdfBBLoading, setIsPdfBBLoading] = useState<boolean>(true);
  const [pdfFileBB, setPdfFileBB] = useState<string>("");
  const [isModalAdjustSignerOpen, setIsModalAdjustSignerOpen] =
    useState<boolean>(false);
  const [isModalAdjustFileOpen, setIsModalAdjustFileOpen] =
    useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  const [sendingOtpStatus, setSendingOtpStatus] =
    useState<SendingOtpStatus>("pending");
  const [isSigningLoading, setIsSigningLoading] = useState<boolean>(false);
  const [resultManualEmail, setResultManualEmail] = useState<string>("");
  const [isSendingResultManual, setIsSendingResultManual] =
    useState<boolean>(false);

  const [uploadModalTBKQ, setUploadModalTBKQ] = useState<boolean>(false);

  const { data: uploadStatus } = useUploadStatus(id || "");

  const getFiles = async (type?: "inform" | "result") => {
    if (sendingOtpStatus === "success" && pdfFileTB && pdfFileKQ) return;
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
  const handleCheckIsGreaterThreeBil = () => {
    if (totalAssetValue >= 300000000000) {
      return true;
    }
    return false;
  };

  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông báo kết quả thẩm định",
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
      key: "2",
      label: "Tư vấn thông báo giá",
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
    {
      key: "3",
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
  ];

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

  const handleTabData = (): TabsProps["items"] => {
    let tabData = tabs;

    if (!handleCheckIsGreaterThreeBil()) {
      tabData = tabData.filter((tab) => tab.key !== "3");
    }

    return tabData;
  };
  const handleSendingDigitalSignature = async (
    signId: string,
    type: "informSign" | "ResultSign",
  ) => {
    try {
      const res = await sendApprovalAPI.requestFileSign(signId, type);
      const blob = new Blob([res.data], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.log("error:", error);
      return "";
    }
  };

  const handleDigitalSign = async () => {
    if (!id) return;
    setIsSigningLoading(true);
    setSendingOtpStatus("sending");
    try {
      const pdfFileTBUrl = await handleSendingDigitalSignature(
        id,
        "informSign",
      );
      if (pdfFileTBUrl) setPdfFileTB(pdfFileTBUrl);

      const pdfFileKQUrl = await handleSendingDigitalSignature(
        id,
        "ResultSign",
      );
      if (pdfFileKQUrl) setPdfFileKQ(pdfFileKQUrl);

      if (!pdfFileTBUrl || !pdfFileKQUrl) {
        if (!pdfFileTBUrl && !pdfFileKQUrl) {
          throw new Error("Gửi ký số không thành công, Vui lòng thử lại!");
        } else if (!pdfFileTBUrl) {
          throw new Error(
            "Gửi ký số tài liệu thông báo không thành công, Vui lòng thử lại!",
          );
        } else {
          throw new Error(
            "Gửi ký số tài liệu kết quả không thành công, Vui lòng thử lại!",
          );
        }
      }

      setSendingOtpStatus("success");
      message.success("Ký số thành công");
    } catch (error: any) {
      setSendingOtpStatus("rejected");
      message.error(error.message || "Ký số thất bại, vui lòng thử lại!");
    } finally {
      setIsSigningLoading(false);
    }
  };
  const handleSendEmailResultManual = async () => {
    if (!id || !resultManualEmail) return;
    setIsSendingResultManual(true);
    try {
      await sendApprovalAPI.sendEmailResultManual(id, resultManualEmail);
      message.success("Gửi thông báo tư vấn giá thành công");
    } catch (error: any) {
      message.error("Gửi thông báo tư vấn giá thất bại, vui lòng thử lại!");
    } finally {
      setIsSendingResultManual(false);
    }
  };
  const handleOpenAdjustSignerModal = () => {
    setIsModalAdjustSignerOpen(true);
  };
  const handleCancelAdjustSignerModal = () => {
    setIsModalAdjustSignerOpen(false);
  };

  const handleOpenAdjustFileModal = () => {
    setIsModalAdjustFileOpen(true);
  };
  const handleCancelAdjustFileModal = () => {
    setIsModalAdjustFileOpen(false);
  };

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Thông tin hồ sơ",
        path: APPRAISAL_FILE_DETAIL.replace(":id", id!),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [id, appraisalDetail]);
  const [commentInput, setCommentInput] = useState<string>("");
  const [openCancelModal, setOpenCancelModal] = useState<boolean>(false);

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

  const handleCancelApproval = async () => {
    if (!commentInput) {
      message.error("Vui lòng nhập lý do từ chối");
      return;
    }
    try {
      const assetLevelTwoId = appraisalDetail?.assetLevelTwoId;
      const isAssetHaveTableKQDat =
        assetLevelTwoId === LAND ||
        assetLevelTwoId === PROJECT ||
        assetLevelTwoId === ESTIMATE ||
        assetLevelTwoId === VEHICLE ||
        assetLevelTwoId === WATER_VEHICLE;

      let tableKQ: any[] = [];
      if (isAssetHaveTableKQDat) {
        tableKQ = valuationData?.tableKQDat as any[];
      } else {
        tableKQ = valuationData?.tableKQ as any[];
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
          valuationData?.tableKQCTXD?.map((item) => {
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
      setOpenCancelModal(false);
      navigate(APPRAISAL_FILE_DETAIL.replace(":id", id!));
    } catch (error) {
      console.log("handleCancelApproval error:", error);
    }
  };

  useEffect(() => {
    return () => {
      setSendingOtpStatus("pending");
    };
  }, []);
  useEffect(() => {
    if (!appraisalDetail) return;
    // get file
    getFiles();

    if (appraisalDetail?.appraisalInformFileName) {
      setSendingOtpStatus("success");
    }
  }, [appraisalDetail]);

  useEffect(() => {
    const isGreaterThreeBil = handleCheckIsGreaterThreeBil();
    if (isGreaterThreeBil && id) {
      fetchApprovalFileBB(id);
    }
  }, [id, totalAssetValue]);

  return (
    <div className="page-container" style={{ position: "relative" }}>
      <Space
        className="title-wrapper"
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "8px",
        }}
      >
        <Typography className="title">
          Ký số Thông báo KQTĐ và Kết quả thẩm định
        </Typography>
        <Space className="action-wrapper" size="small" style={{ gap: "2px" }}>
          <>
            {!handleCheckIsEmployee() || sendingOtpStatus === "success" ? (
              <Space>
                {/* <Button
                  onClick={() => {
                    setUploadModalTBKQ(true);
                  }}
                  className="btn-action"
                  icon={<UploadOutlined />}
                >
                  Upload TB, KQ
                </Button> */}
                {sendingOtpStatus === "success" && (
                  <>
                    <Input
                      className="btn-action"
                      style={{ width: 220 }}
                      placeholder="Nhập email nhận thông báo"
                      value={resultManualEmail}
                      onChange={(e) => setResultManualEmail(e.target.value)}
                    />
                    <Button
                      className="btn-action"
                      loading={isSendingResultManual}
                      disabled={!resultManualEmail}
                      onClick={handleSendEmailResultManual}
                    >
                      Gửi thông báo tư vấn giá
                    </Button>
                  </>
                )}
                <Button
                  className="btn-action"
                  onClick={() =>
                    navigate(APPRAISAL_FILE_DETAIL.replace(":id", id!))
                  }
                >
                  Đóng
                </Button>
              </Space>
            ) : (
              <Space size={"small"} align="center">
                <Button
                  style={{ backgroundColor: "#F25B60" }}
                  className="btn-action"
                  onClick={() => setOpenCancelModal(true)}
                  disabled={isNotAllowed(
                    currentPagePermissions,
                    BUTTON_CODES.tt_tu_choi,
                  )}
                >
                  Từ chối
                </Button>
                <Button
                  onClick={handleOpenAdjustSignerModal}
                  className="btn-action"
                  disabled={isNotAllowed(
                    currentPagePermissions,
                    BUTTON_CODES.ks_dieu_chi_nks,
                  )}
                >
                  Điều chỉnh người ký số
                </Button>
                <Button
                  className="btn-action"
                  onClick={handleDigitalSign}
                  loading={isSigningLoading}
                  disabled={isNotAllowed(
                    currentPagePermissions,
                    BUTTON_CODES.ks_ky_so,
                  )}
                >
                  Ký số
                </Button>
                {/* {appraisalDetail?.assetLevelTwoId === 8 && (
                  <Button
                    className="btn-action"
                    onClick={handleOpenAdjustFileModal}
                  >
                    Điều chỉnh hồ sơ
                  </Button>
                )} */}
              </Space>
            )}
          </>
        </Space>
      </Space>
      {(uploadStatus?.data?.isHaveResult ||
        uploadStatus?.data?.isHaveInform) && (
        <div
          style={{
            margin: "0.25rem 0",
            color: "#696969",
            fontStyle: "italic",
          }}
        >
          Lưu ý: Hồ sơ đang sử dụng{" "}
          {[
            uploadStatus?.data?.isHaveInform ? "thông báo" : "",
            uploadStatus?.data?.isHaveResult ? "kết quả" : "",
          ]
            .map((el) => el)
            .join(", ")}{" "}
          upload ngoài.
        </div>
      )}
      <Space direction="vertical" size="small" style={{ display: "flex" }}>
        <Row style={{ width: "100%" }}>
          <Tabs
            items={handleTabData()}
            style={{ width: "100%" }}
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key as string);
            }}
          />
        </Row>
      </Space>
      <AdjustSignerModal
        isOpen={isModalAdjustSignerOpen}
        totalAssetValue={totalAssetValue}
        companyBranchId={companyBranchId}
        closeModal={handleCancelAdjustSignerModal}
        onOk={() => {
          handleCancelAdjustSignerModal();
          setTimeout(() => {
            navigate(APPRAISAL_FILE_DETAIL.replace(":id", id!));
          }, 1000);
        }}
        selectedStaff={selectedStaff}
        setSelectedStaff={setSelectedStaff}
      />
      <AdjustFileModal
        isOpen={isModalAdjustFileOpen}
        closeModal={handleCancelAdjustFileModal}
        onOk={() => {
          handleCancelAdjustFileModal();
          setTimeout(() => {
            navigate(APPRAISAL_FILE_DETAIL.replace(":id", id!));
          }, 1000);
        }}
      />
      <Modal
        title="Bạn có chắc chắn muốn từ chối duyệt hồ sơ này?"
        open={openCancelModal}
        onOk={handleCancelApproval}
        onCancel={() => {
          setOpenCancelModal(false);
          setCommentInput("");
        }}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        <InputFields
          data={[
            {
              key: "comment",
              label: "",
              name: "comment",
              value: commentInput,
              onChange: (e: any) => setCommentInput(e.target.value),
              placeholder: "Nhập lý do từ chối",
              type: TYPE_FIELD.TEXT_AREA,
              span: 24,
              maxLength: 255,
              wrapperCol: { span: 24 },
              labelCol: { span: 24 },
            },
          ]}
        />
      </Modal>
      {/* <UploadModalTBKQ
        open={uploadModalTBKQ}
        onClose={() => {
          setUploadModalTBKQ(false);
        }}
        onOk={() => {
          setUploadModalTBKQ(false);
          getFiles();
          // if (handleCheckIsGreaterThreeBil()) {
          //   fetchApprovalFileBB(id!);
          // }
        }}
        assetLevelTwoId={appraisalDetail?.assetLevelTwoId}
      /> */}
    </div>
  );
};

export default AppraisalResults;
