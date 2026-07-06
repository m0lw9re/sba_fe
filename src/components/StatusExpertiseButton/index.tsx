import { Button, Space } from "antd";
import React, { useState } from "react";
import StatusWorking from "components/StatusWorking";

type Props ={
    status: number;
    stringNavigate: string;
}

const StatusExpertiseButton: React.FC<Props> = ({status, stringNavigate}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <div
      onMouseLeave={() => setIsHovering(false)}
      style={{ lineHeight: "0" }}
    >
        {isHovering? (
            <Space className="tb-expertise-action-wrapper" align="center" style={{lineHeight : "0px"}}>
                <Button></Button>
            </Space>
        ):(<StatusWorking status={status} />)}
    </div>
  );
};

export default StatusExpertiseButton;
