import { FC, useEffect, useState } from "react";

import "./index.scss";
import { Card, Col, Form, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import {
  BUSINESS_ADVANTAGE_OPTIONS,
  DISPUTE_PROJECT_INFORMATION_OPTIONS,
  LIQUIDITY_ADVANTAGE_OPTIONS,
} from "constant/common";
import { OptionType } from "constant/types/common";

type Props = {
  data: any;
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const labelCol = { xs: 12, md: 12, lg: 12, xl: 12 };
const wrapperCol = { xs: 12, md: 12, lg: 12, xl: 12 };

export const OtherInfo: FC<Props> = ({ data }) => {
  const [businessAdvantage, setBusinessAdvantage] = useState<string>("");
  const [disputeInfor, setDisputeInfor] = useState<string>("");
  const [liquidity, setLiquidity] = useState<string>("");

  const handleConvertDataLabel = (
    options: OptionType[],
    value: number | string | undefined,
    setter: (label: string) => void
  ) => {
    if (value !== undefined) {
      const _foundIndex = options.findIndex(
        (item) =>
          item.value ===
          (typeof item.value === "number" ? Number(value) : value)
      );
      if (_foundIndex !== -1) {
        setter(options[_foundIndex].label);
      }
    }
  };

  useEffect(() => {
    handleConvertDataLabel(
      BUSINESS_ADVANTAGE_OPTIONS,
      data.businessAdvantage,
      setBusinessAdvantage
    );
    handleConvertDataLabel(
      DISPUTE_PROJECT_INFORMATION_OPTIONS,
      data.disputeInfor,
      setDisputeInfor
    );
    handleConvertDataLabel(
      LIQUIDITY_ADVANTAGE_OPTIONS,
      data.liquidity,
      setLiquidity
    );
  }, [data?.businessAdvantage, data?.liquidity, data?.disputeInfor]);

  const otherInfor = [
    {
      key: 1,
      label: "Lợi thế kinh doanh",
      value: businessAdvantage || "-",
    },

    {
      key: 2,
      label: "Thông tin tranh chấp",
      value: disputeInfor || "-",
    },
    {
      key: 3,
      label: "Khả mại/ Thanh khoản",
      value: liquidity || "-",
    },
    {
      key: 4,
      label: "Thông tin quy hoạch",
      value: data?.planningInfor ? data?.planningInfor : "-",
    },
    {
      key: 5,
      label: "Hiện trạng sử dụng",
      value: data?.currentUseSituation ? data?.currentUseSituation : "-",
    },
    {
      key: 6,
      label: "Ghi chú",
      value: data?.note ? data?.note : "-",
    },
  ];

  return (
    <div className="other-info-container">
      <Card size="small" className="card-container">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <Form labelAlign="left" labelWrap size="small">
            <Row gutter={[8, 4]}>
              <Col span={24}>
                <CardTitleCustomUpdate title="Thông tin khác" />
              </Col>
              {otherInfor.map((item, index) => {
                return (
                  <Col
                    xs={css.xs}
                    sm={css.sm}
                    md={css.md}
                    lg={css.lg}
                    xl={css.xl}
                    key={index}
                    className={!(index % 2 === 0) ? "border-left" : ""}
                  >
                    <Form.Item
                      colon={false}
                      labelCol={labelCol}
                      wrapperCol={wrapperCol}
                      label={item.label}
                    >
                      {item.value}
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
          </Form>
        </Space>
      </Card>
    </div>
  );
};
