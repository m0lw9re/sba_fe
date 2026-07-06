import { Card, Space, Typography } from "antd";
import UploadFileSection from "./UploadFile";
import "./style.scss";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import { APPENDIX_FILE_TYPE } from "constant/enums";

type Props = {
  data: any[];
};

type RefProps = {
  uploadFile: () => void;
};

const UploadAppendixFile = forwardRef<RefProps, Props>(({ data }, ref) => {
  const btnRefUploadLOS = useRef<{
    uploadFile: () => void;
  }>(null);

  const btnRefUploadLocal = useRef<{
    uploadFile: () => void;
  }>(null);

  useImperativeHandle(ref, () => ({
    uploadFile: async () => {
      const [fileLosData, fileLocalData] = await Promise.all([
        btnRefUploadLOS.current?.uploadFile() || [],
        btnRefUploadLocal.current?.uploadFile() || [],
      ]);

      const fileLos = Array.isArray(fileLosData) ? fileLosData : [];
      const fileLocal = Array.isArray(fileLocalData) ? fileLocalData : [];

      return [
        ...fileLos.map((item: any) => ({
          ...item,
          type: APPENDIX_FILE_TYPE.LOS,
        })),
        ...fileLocal.map((item: any) => ({
          ...item,
          type: APPENDIX_FILE_TYPE.LOCAL,
        })),
      ];
    },
  }));

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Card size="small" className="commant-wrapper" style={{ flex: 1 }}>
        <Space
          size={"small"}
          direction="vertical"
          className="commant-wrapper-content"
        >
          <Typography.Title level={5} className="commant-header">
            Upload file tạo phụ lục (gửi LOS)
          </Typography.Title>
          <UploadFileSection
            key="los"
            typeSection="los"
            maxCount={1}
            ref={btnRefUploadLOS}
            data={data.filter(
              (item) => item.type === APPENDIX_FILE_TYPE.LOS || !item.type // type = null mặc định là vào los
            )}
          />
        </Space>
      </Card>
      <Card size="small" className="commant-wrapper" style={{ flex: 1 }}>
        <Space
          size={"small"}
          direction="vertical"
          className="commant-wrapper-content"
        >
          <Typography.Title level={5} className="commant-header">
            Upload biên bản họp ban/phụ lục khác (nội bộ)
          </Typography.Title>
          <UploadFileSection
            key="local"
            typeSection="local"
            ref={btnRefUploadLocal}
            data={data.filter((item) => item.type === APPENDIX_FILE_TYPE.LOCAL)}
          />
        </Space>
      </Card>
    </div>
  );
});
export default memo(UploadAppendixFile);
