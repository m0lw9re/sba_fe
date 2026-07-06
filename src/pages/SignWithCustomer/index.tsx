import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Popconfirm,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import Upload, { RcFile, UploadFile, UploadProps } from "antd/es/upload";

import { appraisalFilesApi } from "apis/appraisalFiles";
import { CollapseCustom } from "components/CollapseCustom";
import PdfViewer from "components/PdfViewer";
import {
  APPRAISAL_FILE_STATUS,
  APPRAISAL_IMAGE_UPLOAD_TYPE,
} from "constant/common";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { createContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  APPRAISAL_FILES,
  APPRAISAL_FILE_DETAIL,
  SIGN_WITH_CUSTOMER,
} from "routes/route.constant";
import { blobToBase64 } from "utils/fileReader";
import ImageSignature from "./component/ImageSignature";
import "./style.scss";
import { useAppraisalFileDetail } from "utils/request";
import { AppraisalFileType } from "constant/types";

export type SignaturesProps = {
  appraisalFileId: string;
  employee: string;
  instructor: string;
};
export type SignaturesContextProps = {
  signatures: SignaturesProps;
  handleChangeSignature: (
    type: "employee" | "instructor",
    file: RcFile | null
  ) => void;
};
export const SignaturesContext = createContext<SignaturesContextProps>({
  signatures: {
    appraisalFileId: "",
    employee: "",
    instructor: "",
  },
  handleChangeSignature: () => {},
});

const SignWithCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  if (!state?.appraisalFileId) {
    navigate(APPRAISAL_FILES);
  }
  const appraisalFileId = state?.appraisalFileId;
  const typeExport = state?.typeExport;
  const assetArray = state?.assetArray;

  const [fileUrl, setFileUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowSign, setIsShowSign] = useState<boolean>(true);
  const [loadingCompleteSurvey, setLoadingCompleteSurvey] =
    useState<boolean>(false);
  const [signatures, setSignatures] = useState<SignaturesProps>({
    appraisalFileId: "",
    employee: "",
    instructor: "",
  });

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadConfirm, setUploadConfirm] = useState<boolean>(false);
  const uploadRef = useRef<HTMLDivElement>(null);

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
  } = useAppraisalFileDetail(appraisalFileId || "");

  const handleUpload = async () => {
    if (fileList.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", fileList[0] as RcFile);
    formData.append("appraisalFileId", appraisalFileDetail.appraisalFileId);
    try {
      const res = await appraisalFilesApi.uploadBBKS(formData);
      if (res.status === 200) {
        setFileList([]);
        fetchFile();
        message.success("Upload BBKS thành công");
      } else {
        message.error("Upload BBKS thất bại");
      }
    } catch (error) {
      console.log("error upload bbks:", error);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    fileList,
    maxCount: 1,
    accept: ".pdf",
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
    onChange(info) {
      if (info.fileList.length === 1) {
        setFileList(info.fileList);
        handleUpload();
      }
    },
  };

  useEffect(() => {
    if (appraisalFileDetail?.surveyReportFileName) {
      setIsShowSign(false);
    }
  }, [appraisalFileDetail]);

  const handleCheckIsHaveAssetImages = () => {
    const locationImage = appraisalFileDetail?.assetImages?.some(
      (item: any) => item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.LOCATION_IMAGE || item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.LOCATION_IMAGES
    );

    const planImage = appraisalFileDetail?.assetImages?.some(
      (item: any) => item.type === APPRAISAL_IMAGE_UPLOAD_TYPE.PLAN_IMAGE
    );
    return locationImage || planImage;
  };
  const handleGetSignatures = () => {
    const signaturesData = JSON.parse(
      localStorage.getItem("signatures") || "[]"
    ) as SignaturesProps[];
    const currentSignatures = signaturesData.find(
      (item) => item.appraisalFileId === appraisalFileDetail?.appraisalFileId
    );
    setSignatures(
      currentSignatures || {
        appraisalFileId: appraisalFileDetail?.appraisalFileId,
        employee: "",
        instructor: "",
      }
    );
  };
  const handleChangeSignature = (
    type: "employee" | "instructor",
    file: File | null
  ) => {
    if (!file) {
      setSignatures({
        ...signatures,
        [type]: "",
      });
      return;
    }
    const signaturesData = JSON.parse(
      localStorage.getItem("signatures") || "[]"
    ) as SignaturesProps[];
    const findIndex = signaturesData.findIndex(
      (item) => item.appraisalFileId === signatures.appraisalFileId
    );
    const base64 = URL.createObjectURL(file);
    if (findIndex !== -1) {
      signaturesData[findIndex] = {
        ...signaturesData[findIndex],
        [type]: base64,
      };
    } else {
      signaturesData.push({
        ...signatures,
        [type]: base64,
      });
    }
    localStorage.setItem("signatures", JSON.stringify(signaturesData));
    setSignatures({
      ...signatures,
      [type]: base64,
    });
  };

  const handleCompleteSurveyReport = async () => {
    setLoadingCompleteSurvey(true);
    try {
      if (signatures.employee === "" || signatures.instructor === "") {
        message.error("Vui lòng ký đầy đủ chữ ký");
        return;
      }
      if (!handleCheckIsHaveAssetImages()) {
        message.error("Vui lòng upload ảnh tài sản");
        return;
      }

      // convert blob to base64
      const imageStaffSignB64 = await blobToBase64(signatures.employee);
      const imagesurveyGuideSignB64 = await blobToBase64(signatures.instructor);

      const imageStaffSign = imageStaffSignB64.split(",").slice(1)[0];
      const imagesurveyGuideSign = imagesurveyGuideSignB64
        .split(",")
        .slice(1)[0];

      const res = await appraisalFilesApi.completeSurveyReport({
        appraisalFileId: signatures.appraisalFileId || "",
        imageStaffSign,
        imagesurveyGuideSign,
        typeExport,
      });

      if (res.status === 200) {
        message.success("Hoàn thành ký hồ sơ thành công");
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
        setIsShowSign(false);
        mutate();
      } else {
        message.error("Hoàn thành ký hồ sơ thất bại");
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoadingCompleteSurvey(false);
    }
  };

  const handleCompleteSurvey = async () => {
    try {
      const res_appraisalFile = await appraisalFilesApi.completeSurvey(
        appraisalFileDetail.appraisalFileId || "",
        assetArray
      );

      if (res_appraisalFile?.data?.body?.code === 200) {
        setIsShowSign(false);
        message.success("Hoàn thành khảo sát thành công");
        mutate();
      } else {
        message.error(
          "Hoàn thành khảo sát thất bại " +
            res_appraisalFile?.data?.body?.message
        );
      }
    } catch (error: any) {
      console.log(error);
      message.error("Hoàn thành khảo sát thất bại.");
    }
  };

  const fetchFile = async () => {
    setLoading(true);
    try {
      const res = await appraisalFilesApi.exportSurveyReport({
        appraisalFileId: appraisalFileDetail?.appraisalFileId || "",
        typeExport,
      });
      const blob = new Blob([res.data], {
        type: "application/pdf",
        //suffixes: "pdf",
        //description: "",
      });
      const url = URL.createObjectURL(blob);

      setFileUrl(url);
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFile();
    // get signaltures from local storage
    handleGetSignatures();
  }, [appraisalFileDetail?.appraisalFileId]);

  useEffect(() => {
    if (fileList.length > 0) {
      handleUpload();
    }
  }, [fileList]);

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Thông tin hồ sơ",
        path:
          APPRAISAL_FILE_DETAIL.replace(":id", appraisalFileId || "") +
          "?tab=2",
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [SIGN_WITH_CUSTOMER]);

  if (!appraisalFileDetail && isLoading) return <div></div>;
  if (error) return <div>Lỗi khi lấy thông tin hồ sơ</div>;

  return (
    <SignaturesContext.Provider
      value={{
        signatures,
        handleChangeSignature,
      }}
    >
      <div className="page-container">
        <Space
          className="title-wrapper"
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "8px",
          }}
        >
          <Typography className="title">Ký với khách hàng</Typography>
          <Space className="action-wrapper" size="small" style={{ gap: "2px" }}>
            {isShowSign && (
              <Button
                onClick={handleCompleteSurveyReport}
                loading={loadingCompleteSurvey}
                className="btn-action"
              >
                Ký vào biên bản
              </Button>
            )}

            {appraisalFileDetail?.fileStatus < APPRAISAL_FILE_STATUS.TWELVE ? (
              <Button
                onClick={handleCompleteSurvey}
                loading={loadingCompleteSurvey}
                className="btn-action"
                disabled={isShowSign ? true : false}
              >
                Hoàn thành KS
              </Button>
            ) : (
              <>
                <Popconfirm
                  title="Upload BBKS"
                  description="Bạn có chắc chắn muốn upload BBKS?"
                  placement="bottomLeft"
                  open={uploadConfirm}
                  onConfirm={() => {
                    setUploadConfirm(false);
                    uploadRef.current?.click();
                  }}
                  okButtonProps={{ loading: uploading }}
                  onCancel={() => {
                    setUploadConfirm(false);
                    setFileList([]);
                  }}
                >
                  <Button
                    loading={uploading}
                    onClick={() => {
                      setUploadConfirm(true);
                    }}
                    className="btn-action"
                    icon={<UploadOutlined />}
                  >
                    Upload
                  </Button>
                  <Upload {...uploadProps}>
                    <div ref={uploadRef}></div>
                  </Upload>
                </Popconfirm>
              </>
            )}
          </Space>
        </Space>
        <Space direction="vertical" size="small" style={{ display: "flex" }}>
          <Row style={{ width: "100%" }}>
            {loading ? (
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
              <PdfViewer src={fileUrl} />
            )}
          </Row>
          {isShowSign && (
            <CollapseCustom
              itemList={[
                {
                  label: "Chữ ký",
                  children: (
                    <>
                      <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                        size={"small"}
                      >
                        <Row gutter={[8, 4]}>
                          <Col span={12}>
                            <ImageSignature
                              type="instructor"
                              label="Người hướng dẫn/Đại diện chủ sở hữu"
                            />
                          </Col>
                          <Col span={12}>
                            <ImageSignature
                              type="employee"
                              label="Nhân viên/Chuyên viên thẩm định giá"
                            />
                          </Col>
                        </Row>
                      </Space>
                    </>
                  ),
                },
              ]}
            />
          )}
        </Space>
      </div>
    </SignaturesContext.Provider>
  );
};

export default SignWithCustomer;
