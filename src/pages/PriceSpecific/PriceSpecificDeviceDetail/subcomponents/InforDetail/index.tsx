import { Card, Col, Form, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import "pages/PriceSpecific/PriceSpecificDeviceDetail/subcomponents/InforDetail/style.scss";
import React from "react";
import { formatDate, addMonthsToDate } from "utils";

type Props = {
  data: any;
};

const InforDetail: React.FC<Props> = ({ data }) => {
  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
  const labelCol = { xs: 10, md: 10, lg: 10, xl: 12 };
  const wrapperCol = { xs: 14, md: 14, lg: 14, xl: 12 };

  const inforDetails = [
    {
      key: 1,
      label: "Phân loại tài sản",
      value: data?.assetLevelThreeName ? data?.assetLevelThreeName : "-",
    },
    {
      key: 2,
      label: "Phân loại kho",
      value: data?.storedType ? data?.storedType : "-",
    },
    {
      key: 3,
      label: "Mã Clims",
      value: data?.climsCode ? data?.climsCode : "-",
    },
    {
      key: 4,
      label: "Mã tài sản",
      value: data?.assetCode ? data?.assetCode : "-",
    },
    {
      key: 5,
      label: "Thời điểm hiệu lực",
      value: data?.appraisalTime ? formatDate(data?.appraisalTime) : "-",
    },
    {
      key: 6,
      label: "Thời điểm hết hiệu lực",
      value: data?.expirationTime ? formatDate(data?.expirationTime) : "-",
    },
    {
      key: 7,
      label: "Nguồn dữ liệu",
      value: data?.dataSourceName ? data?.dataSourceName : "-",
    },
    {
      key: 8,
      label: "Nguồn thông tin",
      value: data?.infoSourceName ? data?.infoSourceName : "-",
    },
    {
      key: 9,
      label: "Tình trạng giao dịch",
      value: data?.transactionStatus ? data?.transactionStatus : "-",
    },
  ];

  return (
    <div className="asset-property-container">
      <Card size="small" className="card-container">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <CardTitleCustomUpdate title="Thông tin chi tiết" />
          <Form labelAlign="left" labelWrap size="small">
            <Row gutter={[8, 4]}>
              {inforDetails.map((item, index: number) => {
                return (
                  <Col
                    xs={css.xs}
                    sm={css.sm}
                    md={css.md}
                    lg={css.lg}
                    xl={css.xl}
                    key={index}
                    className={!(index % 3 === 0) ? "border-left" : ""}
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

export default InforDetail;
