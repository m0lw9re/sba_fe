import { Radio, Space } from "antd";
import { useState } from "react";

export const AdvantageTrade = () => {
  const [isAdvantageTrade, setIsAdvantageTrade] = useState(false);
  return (
    <div>
      <Space size="middle">
        <Radio.Group
          onChange={(e) => setIsAdvantageTrade(e.target.value)}
          value={isAdvantageTrade}
        >
          <Radio value={true}>Có</Radio>
          <Radio value={false}>Không</Radio>
        </Radio.Group>
      </Space>
    </div>
  );
};
