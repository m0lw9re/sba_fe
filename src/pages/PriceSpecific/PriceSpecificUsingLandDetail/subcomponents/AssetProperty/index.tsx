import { Card, Col, Form, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { RootState } from "configs/configureStore";
import AddressTable from "pages/PriceSpecific/PriceSpecificUsingLandDetail/subcomponents/AssetProperty/AddressTable";
import "pages/PriceSpecific/PriceSpecificUsingLandDetail/subcomponents/AssetProperty/style.scss";
import LocationCoordinateCell from "pages/PriceSpecific/subcomponents/map";
import React from "react";
import { useSelector } from "react-redux";
import { numberUtils } from "utils";
import { renderBusinessAdvantageLabel } from "utils/string";

type Props = {
  data: any;
};

const AssetProperty: React.FC<Props> = ({ data }) => {
  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const labelCol = { xs: 12, md: 12, lg: 12, xl: 12 };
  const wrapperCol = { xs: 12, md: 12, lg: 12, xl: 12 };
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
    {
      key: 21,
      label: "Giá rao bán (đồng)",
      value: data?.estimatePrice
        ? numberUtils.formatNumber(data?.estimatePrice)
        : "-",
    },
    {
      key: 22,
      label: "Giá thương lượng (đồng)",
      value: data?.transactionPrice
        ? numberUtils.formatNumber(data?.transactionPrice)
        : "-",
    },
    {
      key: 23,
      label: "Tổng giá trị tài sản (đồng)",
      value: data?.totalValue
        ? numberUtils.formatNumber(data?.totalValue)
        : "-",
    },
  ];

  const otherInfor = [
    {
      key: 1,
      label: "Lợi thế kinh doanh",
      value: renderBusinessAdvantageLabel(data?.businessAdvantage),
    },
    {
      key: 2,
      label: "Khả mại/Tính thanh khoản",
      // value: data?.legal,
      value: data?.liquidity
        ? liquitiesOptions.find((item) => item.value == data?.liquidity)
            ?.label ?? data?.liquidity
        : "-",
    },
    {
      key: 3,
      label: "Tên dự án/Khu công nghiệp",
      value: data?.projectName || "-",
    },
    {
      key: 4,
      label: "Cơ sở hạ tầng",
      value: data?.infrastructure ? data?.infrastructure : "-",
    },
    {
      key: 5,
      label: "Đơn giá PHQH (đồng/m²)",
      value: numberUtils.formatNumber(data?.priceInPlan) ?? "-",
    },
    {
      key: 6,
      label: "Đơn giá đất (đồng)",
      value: numberUtils.formatNumber(data?.landUnitPrice) ?? "-",
    },
    {
      key: 7,
      label: "Đơn giá xây dựng",
      value: numberUtils.formatNumber(data?.constructionUnitPrice) ?? "-",
    },
    {
      key: 8,
      label: "Giá trị XD (đồng)",
      value: numberUtils.formatNumber(data?.constructionPrice) ?? "-",
    },
    {
      key: 9,
      label: "Pháp lý",
      value: data?.legal ? data?.legal : "-",
    },
    {
      key: 10,
      label: "Mục đích sử dụng đất",
      value: data?.usingPurposeName ? data?.usingPurposeName : "-",
    },
    {
      key: 11,
      label: "Thời hạn sử dụng đất",
      value: data?.usingPeriod ? data?.usingPeriod : "-",
    },
    {
      key: 12,
      label: "Toạ độ tài sản",
      value: <LocationCoordinateCell coordinate={data?.coordinate} />,
    },
    {
      key: 13,
      label: "Diện tích sàn (m²)",
      value: data?.totalFloorArea ? data?.totalFloorArea : "-",
    },
    {
      key: 14,
      label: "Chất lượng còn lại (%)",
      value: data?.remainQuality ? Math.round(data?.remainQuality * 100) : "-",
    },
    {
      key: 15,
      label: "Yếu tố khác",
      value: data?.otherFactor ? data?.otherFactor : "-",
    },
    {
      key: 16,
      label: "Ghi chú",
      value: data?.note ? data?.note : "-",
    },
    {
      key: 17,
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
