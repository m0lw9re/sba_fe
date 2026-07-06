import { Card, Space, Typography } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { FC } from "react";
import { numberUtils } from "utils";

type Props = {
  data: any;
};

export const TotalValue: FC<Props> = ({ data }) => {
  return (
    <div className="total-value-container">
      <Card size="small">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <CardTitleCustomUpdate title="Tổng giá trị" />
          <div style={{ flex: 1, display: "flex", gap: "8px" }}>
            <Typography style={{ opacity: 0.6 }}>
              Tổng giá trị định giá (đ):
            </Typography>
            <Typography.Text strong>
              {numberUtils.formatNumber(data || "")}
            </Typography.Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};
