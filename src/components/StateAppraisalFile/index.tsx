import React, { ButtonHTMLAttributes } from "react";
import { Tag } from "antd";
import "components/StatusAppraisalFile/style.scss";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  status: number;
  statusName?: string;
}

const StateAppraisalFile: React.FC<Props> = ({ status, statusName, ...rest }) => {
  if (status === 0) {
    return (
      <Tag color="blue" {...rest} bordered>
        {statusName || 'Chưa cập nhật'}
      </Tag>
    );
  } else if (status === 1) {
    return (
      <Tag color="warning" {...rest} bordered>
        {statusName || 'Đã tiếp nhận'}
      </Tag>
    );
  } else if (status === 2) {
    return (
      <Tag color="success" {...rest} bordered>
        {statusName || 'Chờ khảo sát'}
      </Tag>
    );
  } else if (status === 3) {
    return (
      <Tag color="processing" {...rest} bordered>
        {statusName || 'Đã khảo sát'}
      </Tag>
    );
  } else if (status === 4) {
    return (
      <Tag color="blue" {...rest} bordered>
        {statusName || 'Lập báo cáo và chờ duyệt'}
      </Tag>
    );
  } else if (status === 5) {
    return (
      <Tag color="gold" {...rest} bordered>
        {statusName || 'Đã duyệt báo cáo'}
      </Tag>
    );
  } else {
    return (
      <Tag color="magenta" {...rest} bordered>
        {statusName || 'Hoàn thành'}
      </Tag>
    );
  }
};

export default StateAppraisalFile;
