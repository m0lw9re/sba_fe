/* eslint-disable react-hooks/exhaustive-deps */
import { Row, Space, Spin, Typography } from "antd";

import { appraisalFilesApi } from "apis/appraisalFiles";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  APPRAISAL_FILE_DETAIL,
  VIEW_REPORT_PRINT_PAGE,
} from "routes/route.constant";
import PdfViewer from "components/PdfViewer";
import "./style.scss";

const ViewReportPrint = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { appraisalFileDetail } = state;
  const [fileUrl, setFileUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      try {
        const res = await appraisalFilesApi.exportReportPrint(
          appraisalFileDetail.appraisalFileId || ""
        );
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      } catch (error) {
        console.log("error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, []);
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Thông tin hồ sơ",
        path:
          APPRAISAL_FILE_DETAIL.replace(
            ":id",
            appraisalFileDetail.appraisalFileId || ""
          ) + "?tab=2",
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [VIEW_REPORT_PRINT_PAGE]);

  return (
    <div className="page-container">
      <Space
        className="title-wrapper"
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "8px",
        }}
      >
        <Typography className="title">Phiếu yêu cầu thẩm định</Typography>
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
      </Space>
    </div>
  );
};

export default ViewReportPrint;
