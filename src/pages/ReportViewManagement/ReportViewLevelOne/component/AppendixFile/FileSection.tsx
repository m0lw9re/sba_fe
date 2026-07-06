import { Button, message, Row, Space } from "antd";
import { ecmFileApi } from "apis/ecmFile";
import { PdfFileType } from "constant/types/appraisalFile";
import { saveAs } from "file-saver";
import "pages/AppraisalFileDetail/component/PositonAndImg/component/ImagePanelTab/components/ImageAddendum/style.scss";
import { FC, Fragment, memo } from "react";
import { randomId } from "utils";
import "./style.scss";
import { CloudDownloadOutlined } from "@ant-design/icons";

type Props = {
  data: Array<PdfFileType>;
  // type: number;
};

const FileSection: FC<Props> = ({ data }) => {
  const onDownload = async (file: PdfFileType) => {
    if (file?.ecmId && file?.filename) {
      try {
        const res = await ecmFileApi.downloadECMFile("appendix", file?.ecmId);
        saveAs(res.data, file?.filename);
      } catch {
        message.error("Tải file thất bại");
      }
    }
  };

  const onViewPdf = async (file: PdfFileType) => {
    if (file?.ecmId && file?.filename) {
      try {
        const res = await ecmFileApi.downloadECMFile("appendix", file?.ecmId);
        const url = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.click();
        a.remove();
      } catch {
        message.error("File xảy ra lỗi, không xem được file.");
      }
    }
  };

  return (
    <Fragment>
      {data.map((file: PdfFileType) => (
        <Row key={file.ecmId}>
          <Space>
            {file?.mediaType === "application/pdf" && (
              <Button
                type="text"
                size="small"
                style={{ paddingLeft: 0 }}
                onClick={() => onViewPdf(file)}
              >
                {file.filename}
              </Button>
            )}
            <Button
              size="small"
              type="dashed"
              icon={<CloudDownloadOutlined />}
              onClick={() => onDownload(file)}
            />
          </Space>
        </Row>
      ))}
    </Fragment>
  );
};

export default memo(FileSection);
