import { Badge, Button } from "antd";
import { FC } from "react";
import Icons from "assets/icons";
import { useCountNotify } from "utils/request";

type Props = {
  onClick: () => void;
};

export const Bell: FC<Props> = ({ onClick }) => {
  const { data } = useCountNotify();

  return (
    <Badge
      count={data?.data || 0}
      offset={[2, 5]}
      className="badge-bell-container"
    >
      <Button
        shape="circle"
        size="middle"
        // className="beside-account"
        icon={<Icons.bell />}
        onClick={onClick}
      />
    </Badge>
  );
};
