import React from "react";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { Card, Col, Form, Row, Space } from "antd";
import AddressTable from "./AddressTable";
import "./style.scss";
import { numberUtils } from "utils";
import { DISPUTE_INFORMATION_OPTIONS } from "constant/common";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  data: any;
};

const AssetProperty: React.FC<Props> = ({ data }) => {
  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const labelCol = { xs: 12, md: 12, lg: 12, xl: 12 };
  const wrapperCol = { xs: 12, md: 12, lg: 12, xl: 12 };
  const {liquitiesData} = useSelector((state: RootState) => state.globalSlice);

  const mainInfor = [
    {
      key: 1,
      label: "Tên phương tiện",
      value: data?.name ? data?.name : "-",
    },
    {
      key: 2,
      label: "Chiều rộng thiết kế (m)",
      value: numberUtils.formatNumber(data?.designWidth) ?? "-",
    },
    {
      key: 3,
      label: "Số đăng ký",
      value: data?.registerNumber ? data?.registerNumber : "-",
    },
    {
      key: 4,
      label: "Chiều dài lớn nhất (m)",
      value: numberUtils.formatNumber(data?.maxLength) ?? "-",
    },
    {
      key: 5,
      label: "Số loại/Model",
      value: data?.model ? data?.model : "-",
    },
    {
      key: 6,
      label: "Chiều cao mạn (m)",
      value: numberUtils.formatNumber(data?.boardHeight) ?? "-",
    },
    {
      key: 7,
      label: "Số nhận dạng tàu/Số IMO",
      value: data?.imoNumber ? data?.imoNumber : "-",
    },
    {
      key: 8,
      label: "Chiều chìm (m)",
      value: numberUtils.formatNumber(data?.sink) ?? "-",
    },
    {
      key: 9,
      label: "Nhãn hiệu",
      value: data?.brandName ? data?.brandName : "-",
    },
    {
      key: 10,
      label: "Mạn khô (m)",
      value: numberUtils.formatNumber(data?.freeBoard) ?? "-",
    },
    {
      key: 11,
      label: "Năm sản xuất",
      value: data?.yearMfg ? data?.yearMfg : "-",
    },
    {
      key: 12,
      label: "Số lượng máy chính",
      value: numberUtils.formatNumber(data?.machineNum) ?? "-",
    },
    {
      key: 13,
      label: "Năm hoán cải",
      value: data?.yearReconstructed ? data?.yearReconstructed : "-",
    },
    {
      key: 14,
      label: "Công suất máy chính (kW)",
      value: numberUtils.formatNumber(data?.machinePower) ?? "-",
    },
    {
      key: 15,
      label: "Nước sản xuất",
      value: data?.countryMfg ? data?.countryMfg : "-",
    },
    {
      key: 16,
      label: "Trọng tải toàn phần (MT)",
      value: numberUtils.formatNumber(data?.deadWeight) ?? "-",
    },
    {
      key: 18,
      label: "Tổng dung tích (GT)",
      value: numberUtils.formatNumber(data?.grossTonnage) ?? "-",
    },
    {
      key: 19,
      label: "Nơi đóng tàu",
      value: data?.manufacturingLocationName
        ? data?.manufacturingLocationName
        : "-",
    },
    {
      key: 20,
      label: "Dung tích thực dụng (NT)",
      value: numberUtils.formatNumber(data?.useTonnage) ?? "-",
    },
    {
      key: 21,
      label: "Hãng đóng tàu",
      value: data?.shipbuildingBrand ? data?.shipbuildingBrand : "-",
    },
    {
      key: 22,
      label: "Tốc độ tàu (HL)",
      value: data?.speed ? data?.speed : "-",
    },
    {
      key: 23,
      label: "Quốc gia đăng ký",
      value: data?.registerCountryName ? data?.registerCountryName : "-",
    },
    {
      key: 24,
      label: "Nội dung khác",
      value: data?.additionalContent ? data?.additionalContent : "-",
    },
    {
      key: 25,
      label: "Công năng sử dụng",
      value: data?.shipUtilities ? data?.shipUtilities : "-",
    },
    {
      key: 26,
      label: "Giá giao dịch/ rao bán (đồng)",
      value: numberUtils.formatNumber(data?.transactionPrice) ?? "-",
    },
    {
      key: 27,
      label: "Số người được phép chở",
      value: data?.personCarry ? data?.personCarry : "-",
    },
    {
      key: 28,
      label: "Tỷ lệ ước tính (%)",
      value: data?.estimatedRate ? data?.estimatedRate : "-",
    },
    {
      key: 29,
      label: "Chiều dài thiết kế (m)",
      value: numberUtils.formatNumber(data?.designLength) ?? "-",
    },
    {
      key: 30,
      label: "Giá ước tính giao dịch thành công (đồng)",
      value: numberUtils.formatNumber(data?.estimatePrice) ?? "-",
    },
  ];

  const otherInfor = [
    {
      key: 2,
      label: "Nguồn gốc sử dụng",
      value: data?.usingOrigin ? data?.usingOrigin : "-",
    },
    {
      key: 13,
      label: "Số thời gian đã qua sử dụng (ngày)",
      value: data?.numberOfDaysUsed ? data?.numberOfDaysUsed : "-",
    },
    {
      key: 14,
      label: "Chất lượng còn lại (%)",
      value: data?.remainQuality ? Math.round(data?.remainQuality * 100) : "-",
    },
    {
      key: 3,
      label: "Hiện trạng sử dụng",
      value: data?.currentUseSituation ? data?.currentUseSituation : "-",
    },
    {
      key: 4,
      label: "Khả mại/Thanh khoản",
      value: data?.liquidity ? liquitiesData.find(item => item.id.toString() === data?.liquidity)?.name ?? '-' : '-',
    },
    {
      key: 5,
      label: "Thông tin tranh chấp",
      value: data?.disputeInfor ? 
        DISPUTE_INFORMATION_OPTIONS?.find(item => item.value == data?.disputeInfor)?.label ?? data?.disputeInfor 
      : "-",
    },
    {
      key: 16,
      label: "Người liên hệ - sđt",
      value: data?.contact ? data?.contact : "-",
    },
  ];

  return (
    <div className="asset-valuation-container">
      <Card size="small" className="card-container">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <CardTitleCustomUpdate title="Đặc điểm tài sản" />
          <Form labelAlign="left" labelWrap size="small">
            <Row gutter={[8, 4]}>
              <AddressTable data={data} />
              {mainInfor.map((item, index) => {
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
