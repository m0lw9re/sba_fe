import React, { ButtonHTMLAttributes } from "react";
import { Tag } from "antd";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  status: number;
}

const StatusAppraisalFile: React.FC<Props> = ({ status, ...rest }) => {
  if (status === 1) {
    return (
      <Tag color="warning" {...rest} bordered>
        Hồ sơ chưa phân giao
      </Tag>
    );
  } else if (status === 2) {
    return (
      <Tag color="success" {...rest} bordered>
        Hồ sơ đã phân giao
      </Tag>
    );
  } else if (status === 3) {
    return (
      <Tag color="processing" {...rest} bordered>
        Hồ sơ đang xử lý
      </Tag>
    );
  } else if (status === 4) {
    return (
      <Tag color="blue" {...rest} bordered>
        Hồ sơ đã hoàn thành
      </Tag>
    );
  } else {
    return (
      <Tag color="magenta" {...rest} bordered>
        Hồ sơ hủy thẩm định giá
      </Tag>
    );
  }
};

export default StatusAppraisalFile;
