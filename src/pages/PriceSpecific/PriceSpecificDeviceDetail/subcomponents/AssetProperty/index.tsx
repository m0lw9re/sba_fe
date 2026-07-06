import React, { useEffect, useState } from "react";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { Card, Col, Form, Row, Space } from "antd";
import AddressTable from "pages/PriceSpecific/PriceSpecificDeviceDetail/subcomponents/AssetProperty/AddressTable";
import "pages/PriceSpecific/PriceSpecificDeviceDetail/subcomponents/AssetProperty/style.scss";
import { ASSET_LV3 } from "constant/enums";
import { numberUtils } from "utils";
import { DISPUTE_INFORMATION_OPTIONS } from "constant/common";

type Props = {
  data: any;
};

type Filed = {
  key: number;
  label: string;
  value: string;
};

const AssetProperty: React.FC<Props> = ({ data }) => {
  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const labelCol = { xs: 12, md: 12, lg: 12, xl: 12 };
  const wrapperCol = { xs: 12, md: 12, lg: 12, xl: 12 };

  const isDCSX = data?.assetLevelThreeId === ASSET_LV3.PRODUCTION_LINE;

  const mainInfo = [
    {
      key: 1,
      label: "Tên MMTB",
      value: data?.name ? data?.name : "-",
    },
    {
      key: 3,
      label: "Thông số kỹ thuật",
      value: data?.specs ? data?.specs : "-",
    },
    {
      key: 4,
      label: "Nhãn hiệu",
      value: data?.brand ? data?.brand : "-",
    },
    {
      key: 5,
      label: "Số máy",
      value: data?.engineNo ? data?.engineNo : "-",
    },
    {
      key: 6,
      label: "Động cơ điện (kW)",
      value: numberUtils.formatNumber(data?.electricEngine) ?? "-",
    },
    {
      key: 7,
      label: "Số loại/Model",
      value: data?.model ? data?.model : "-",
    },
    {
      key: 8,
      label: "Động cơ chính (kW)",
      value: numberUtils.formatNumber(data?.mainEngine) ?? "-",
    },
    {
      key: 9,
      label: "Năm sản xuất",
      value: data?.yearMfg ? data?.yearMfg : "-",
    },
    {
      key: 10,
      label: "Hệ thống thiết bị điện",
      value: data?.engineSystem ? data?.engineSystem : "-",
    },
    {
      key: 11,
      label: "Nước sản xuất",
      value: data?.countryMfgId ? data?.countryMfgId : "-",
    },
    {
      key: 12,
      label: "Nhà sản xuất",
      value: data?.manufacturer ? data?.manufacturer : "-",
    },
    {
      key: 13,
      label: "Nội dung khác",
      value: data?.additionalContent ? data?.additionalContent : "-",
    },
    {
      key: 14,
      label: "Công suất (kW)",
      value: numberUtils.formatNumber(data?.power) ?? "-",
    },
    {
      key: 15,
      label: "Giá giao dịch/ rao bán (đồng)",
      value: numberUtils.formatNumber(data?.transactionPrice) ?? "-",
    },
    {
      key: 16,
      label: "Chế độ điều khiển",
      value: data?.controlType ? data?.controlType : "-",
    },
    {
      key: 17,
      label: "Tỷ lệ ước tính (%)",
      value: data?.estimatedRate ? data?.estimatedRate : "-",
    },
    {
      key: 18,
      label: "Kích thước (mm)",
      value: numberUtils.formatNumber(data?.size) ?? "-",
    },
    {
      key: 19,
      label: "Giá ước tính giao dịch thành công (đồng)",
      value: numberUtils.formatNumber(data?.estimatePrice) ?? "-",
    },
  ];
  const otherInfor = [
    {
      key: 1,
      label: "Nguồn góc sử dụng",
      value: data?.usingOrigin ? data?.usingOrigin : "-",
    },
    {
      key: 2,
      label: "Nguyên lý",
      value: data?.workingPrinciple ? data?.workingPrinciple : "-",
    },
    {
      key: 3,
      label: "Chất lượng còn lại (%)",
      value: data?.remainQuality ? Math.round(data?.remainQuality * 100) : "-",
    },
    {
      key: 4,
      label: "Hiện trạng sử dụng",
      value: data?.currentUseSituation ? data?.currentUseSituation : "-",
    },
    {
      key: 5,
      label: "Khả nại/Thanh khoản",
      value: data?.liquidity ? data?.liquidity : "-",
    },
    {
      key: 6,
      label: "Thông tin tranh chấp",
      value: data?.disputeInfor ? 
        DISPUTE_INFORMATION_OPTIONS?.find(item => item.value === data?.disputeInfor)?.label ?? data?.disputeInfor 
      : "-",
    },
    {
      key: 7,
      label: "Người liên hệ - sđt",
      value: data?.contact ? data?.contact : "-",
    },
  ];

  useEffect(() => {
    if (!data?.assetLevelThreeId) {
      return;
    }
    if (isDCSX) {
      mainInfo.push({
        key: 2,
        label: "Tên dây chuyền sản xuất",
        value: data?.productionLineName ? data?.productionLineName : "-",
      });
    }
  }, [data?.assetLevelThreeId]);

  return (
    <div className="asset-valuation-container">
      <Card size="small" className="card-container">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <CardTitleCustomUpdate title="Đặc điểm tài sản" />
          <Form labelAlign="left" labelWrap size="small">
            <Row gutter={[8, 4]}>
              <AddressTable data={data} />
              {mainInfo.map((item, index) => {
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

export default AssetProperty;
