import { Card, Space, Typography } from "antd";
import FileSection from "./FileSection";
import "./style.scss";
import { FC, memo } from "react";
import { APPENDIX_FILE_TYPE } from "constant/enums";

type Props = {
  data: any[];
};

const AppendixFile: FC<Props> = ({ data }) => {
  return (
    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
      <Card size="small" className="commant-wrapper" style={{ flex: 1 }}>
        <Space
          size={"small"}
          direction="vertical"
          className="commant-wrapper-content"
        >
          <Typography.Title level={5} className="commant-header">
            File tạo phụ lục (gửi LOS)
          </Typography.Title>
          <FileSection
            key="los"
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
            Biên bản họp ban/phụ lục khác (nội bộ)
          </Typography.Title>
          <FileSection
            key="local"
            data={data.filter((item) => item.type === APPENDIX_FILE_TYPE.LOCAL)}
          />
        </Space>
      </Card>
    </div>
  );
};
export default memo(AppendixFile);
