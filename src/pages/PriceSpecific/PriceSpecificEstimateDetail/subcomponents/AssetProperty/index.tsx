import { Card, Col, Form, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { RootState } from "configs/configureStore";
import { InputFiledParams } from "constants/types/Form_Field_type";
import AddressTable from "pages/PriceSpecific/PriceSpecificEstimateDetail/subcomponents/AssetProperty/AddressTable";
import "pages/PriceSpecific/PriceSpecificEstimateDetail/subcomponents/AssetProperty/style.scss";
import LocationCoordinateCell from "pages/PriceSpecific/subcomponents/map";
import React from "react";
import { useSelector } from "react-redux";
import { numberUtils } from "utils";
import { renderBusinessAdvantageLabel } from "utils/string";
type Props = {
  data: any;
};
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const labelCol = { xs: 12, md: 12, lg: 12, xl: 12 };
const wrapperCol = { xs: 12, md: 12, lg: 12, xl: 12 };

const AssetProperty: React.FC<Props> = ({ data }) => {
  const { liquitiesOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const inforBasic = [
    {
      key: 1,
      label: "Số thửa",
      value: data?.landPlotNumber ? data?.landPlotNumber : "-",
    },
    {
      key: 2,
      label: "Số tờ bản đồ",
      value: data?.mapSheetNumber ? data?.mapSheetNumber : "-",
    },
  ];

  const mainInfor = [
    {
      key: 1,
      label: "Đoạn đường trong khung giá",
      value: data?.roadInPriceRange ? data?.roadInPriceRange : "-",
    },
    {
      key: 2,
      label: "Khoảng cách đến đường chính (m)",
      value: data?.distanceToMainRoad ? data?.distanceToMainRoad : "-",
    },
    {
      key: 3,
      label: "Loại đường tiếp giáp",
      value: data?.roadContiguousTypeName ? data?.roadContiguousTypeName : "-",
    },
    {
      key: 4,
      label: "Khoảng cách tới STB gần nhất (km)",
      value: "-",
    },
    {
      key: 5,
      label: "Vị trí",
      value: data?.positionName ? data?.positionName : "-",
    },
    {
      key: 6,
      label: "Độ rộng đường/hẻm chính/hẻm phụ",
      value: data?.widthToMainRoad ?? "-",
    },
    {
      key: 7,
      label: "Khu vực",
      value: "-",
    },
    {
      key: 8,
      label: "Vị trí trong khung giá",
      value: "-",
    },
    {
      key: 9,
      label: "Hướng chính",
      value: "-",
    },
    {
      key: 10,
      label: "Hình dạng",
      value: data?.shape ? data?.shape : "-",
    },
    {
      key: 11,
      label: "Số mặt tiền/mặt thoáng",
      value: data?.numberOfFacade ?? "-",
    },
    {
      key: 12,
      label: "Kích thước mặt tiền (m)",
      value: numberUtils.formatNumber(data?.facadeLength) ?? "-",
    },
    {
      key: 13,
      label: "Kích thước chiều dài (m)",
      value: numberUtils.formatNumber(data?.landLength) ?? "-",
    },
    {
      key: 14,
      label: "Diện tích sử dụng riêng (m²)",
      value: numberUtils.formatNumber(data?.privateArea) ?? "-",
    },
    {
      key: 15,
      label: "Diện tích sử dụng chung (m²)",
      value: numberUtils.formatNumber(data?.commonArea) ?? "-",
    },
    {
      key: 16,
      label: "Diện tích khuôn viên (m²)",
      value: numberUtils.formatNumber(data?.areaWidth) ?? "-",
    },
    {
      key: 17,
      label: "Diện tích phù hợp quy hoạch (m²)",
      value: numberUtils.formatNumber(data?.areaInplan) ?? "-",
    },
    {
      key: 18,
      label: "Diện tích không phù hợp quy hoạch (m²)",
      value: numberUtils.formatNumber(data?.areaUnplan) ?? "-",
    },
    {
      key: 19,
      label: "Cấu trúc",
      value: data?.structure ? data?.structure : "-",
    },
    {
      key: 20,
      label: "Mô tả địa lý",
      value: data?.geographicDescription ? data?.geographicDescription : "-",
    },
  ];

  const otherInfor: InputFiledParams[] = [
    {
      key: 1,
      label: "Lợi thế kinh doanh",
      value: renderBusinessAdvantageLabel(data?.businessAdvantage),
      css,
      labelCol,
      wrapperCol,
    },
    {
      key: 2,
      label: "Khả mại/Tính thanh khoản",
      value: data?.liquidity
        ? liquitiesOptions.find((item) => item.value == data?.liquidity)
            ?.label ?? data?.liquidity
        : "-",
      css,
      labelCol,
      wrapperCol,
    },
    {
      key: 3,
      label: "Tên dự án/Khu công nghiệp",
      value: data?.projectName || "-",
      css,
      labelCol,
      wrapperCol,
    },
    {
      key: 4,
      label: "Cơ sở hạ tầng",
      css,
      labelCol,
      wrapperCol,
      value: data?.infrastructure ? data?.infrastructure : "-",
    },
    {
      key: 5,
      label: "Đơn giá PHQH (đồng/m²)",
      css,
      labelCol,
      wrapperCol,
      value: numberUtils.formatNumber(data?.priceInPlan) ?? "-",
    },
    {
      key: 6,
      label: "Đơn giá đất",
      css,
      labelCol,
      wrapperCol,
      value: numberUtils.formatNumber(data?.landUnitPrice) ?? "-",
    },
    {
      key: 7,
      label: "Đơn giá xây dựng",
      value: numberUtils.formatNumber(data?.constructionUnitPrice) ?? "-",
      css,
      labelCol,
      wrapperCol,
    },
    {
      key: 8,
      label: "Giá trị XD (đồng)",
      value: numberUtils.formatNumber(data?.constructionPrice) ?? "-",
      css,
      labelCol,
      wrapperCol,
    },
    {
      key: 9,
      label: "Pháp lý",
      css,
      labelCol,
      wrapperCol,
      value: data?.legal ? data?.legal : "-",
    },
    {
      key: 10,
      label: "Mục đích sử dụng đất",
      css,
      labelCol,
      wrapperCol,
      value: data?.usingPurposeName ? data?.usingPurposeName : "-",
    },
    {
      key: 11,
      label: "Toạ độ tài sản",
      css,
      labelCol,
      wrapperCol,
      value: data?.usingPurposeName ? (
        <LocationCoordinateCell coordinate={data?.coordinate} />
      ) : (
        "-"
      ),
    },
    {
      key: 10,
      label: "Người liên hệ - sđt",
      css,
      labelCol,
      wrapperCol,
      value: data?.contact ? data?.contact : "-",
    },
    {
      key: 11,
      label: "Yếu tố khác",
      value: data?.note ? data?.note : "-",
      css: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
      labelCol: { xs: 8, lg: 4 },
      wrapperCol: { xs: 16, lg: 20 },
    },
  ];

  return (
    <div className="asset-valuation-container">
      <Card size="small" className="card-container">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <CardTitleCustomUpdate title="Đặc điểm tài sản" />
          <Form labelAlign="left" labelWrap size="small">
            <Row gutter={[8, 8]}>
              {inforBasic.map((item, index) => {
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
                    xs={item?.css?.xs || css.xs}
                    sm={item?.css?.sm || css.sm}
                    md={item?.css?.md || css.md}
                    lg={item?.css?.lg || css.lg}
                    xl={item?.css?.xl || css.xl}
                    key={index}
                    className={!(index % 2 === 0) ? "border-left" : ""}
                  >
                    <Form.Item
                      colon={false}
                      labelCol={item.labelCol}
                      wrapperCol={item.wrapperCol}
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
