import { Button, Tag } from "antd";
import React, { useState } from "react";
import "components/StatusAppraisalFileButton/style.scss";
import { useNavigate } from "react-router-dom";
import StateAppraisalFile from "components/StateAppraisalFile";

type Props = {
  status: number;
  stringNavigate: string;
  statusName: string;
};

const StatusAppraisalFileButton: React.FC<Props> = ({
  status,
  statusName,
  stringNavigate,
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const navigate = useNavigate();

  let statusColor;
  switch (status) {
    case 0:
      statusColor = "blue";
      break;
    case 1:
      statusColor = "warning";
      break;
    case 2:
      statusColor = "success";
      break;
    case 3:
      statusColor = "processing";
      break;
    case 4:
      statusColor = "blue";
      break;
    case 5:
      statusColor = "gold";
      break;
    default:
      statusColor = "magenta";
      break;
  }

  return (
    <div className="appraisal-file-button-container">
      {isHovering ? (
        <Tag
          color={statusColor}
          onMouseLeave={() => setIsHovering(false)}
          className="tag-status"
          onClick={() => navigate(stringNavigate)}
        >
          <Button type="text" className="button-detail">
            Chi tiết
          </Button>
        </Tag>
      ) : (
        <StateAppraisalFile
          statusName={statusName}
          status={status}
          onMouseEnter={() => setIsHovering(true)}
        />
      )}
    </div>
  );
};

export default StatusAppraisalFileButton;
