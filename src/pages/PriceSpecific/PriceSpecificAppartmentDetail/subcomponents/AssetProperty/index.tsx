import React from "react";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { Card, Col, Form, Row, Space } from "antd";
import AddressTable from "pages/PriceSpecific/PriceSpecificAppartmentDetail/subcomponents/AssetProperty/AddressTable";
import "pages/PriceSpecific/PriceSpecificAppartmentDetail/subcomponents/AssetProperty/style.scss";
import LocationCoordinateCell from "pages/PriceSpecific/subcomponents/map";
import { numberUtils } from "utils";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

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
      label: "Tòa nhà thực tế",
      value: data?.building ? data?.building : "-",
    },
    {
      key: 2,
      label: "Tên chung cư/dự án",
      value: data?.projectName ? data?.projectName : "-",
    },
    {
      key: 3,
      label: "Số tầng tòa nhà",
      value: data?.totalFloor ? data?.totalFloor : "-",
    },
    {
      key: 4,
      label: "Số hầm tòa nhà",
      value: "-",
    },
    {
      key: 5,
      label: "Cấu trúc căn hộ",
      value: "-",
    },
    {
      key: 6,
      label: "Vị trí",
      value: data?.positionName ? data?.positionName : "-",
    },
    {
      key: 7,
      label: "Độ rộng đường chính (m)",
      value: "-",
    },
    {
      key: 8,
      label: "Hướng ban công chính",
      value: "-",
    },
    {
      key: 9,
      label: "Ghi chú",
      value: data?.sentiment ? data?.sentiment : "-",
    },
    {
      key: 10,
      label: "Số căn hộ",
      value: data?.numberAppartment ? data?.numberAppartment : "-",
    },
    {
      key: 11,
      label: "Tầng số",
      value: data?.floorNo ? data?.floorNo : "-",
    },
    {
      key: 12,
      label: "Số mặt thoáng",
      value: data?.surfaces ? data?.surfaces : "-",
    },
    {
      key: 13,
      label: "Số phòng ngủ",
      value: data?.bedrooms ? data?.bedrooms : "-",
    },
    {
      key: 14,
      label: "Số phòng WC",
      value: data?.toilets ? data?.toilets : "-",
    },
    {
      key: 15,
      label: "Diện tích sử dụng riêng (m²)",
      value: data?.privateUseArea ? data?.privateUseArea : "-",
    },
    {
      key: 16,
      label: "Diện tích thông thủy (m²)",
      value: data?.clearanceArea ? data?.clearanceArea : "-",
    },
    {
      key: 17,
      label: "Diện tích tim tường (m²)",
      value: data?.buildupArea ? data?.buildupArea : "-",
    },
    {
      key: 18,
      label: "Diện tích cơi nới (m²)",
      value: data?.extendArea ? data?.extendArea : "-",
    },
  ];

  const otherInfor = [
    {
      key: 1,
      label: "Lợi thế kinh doanh",
      value: data?.businessAdvantage ? data?.businessAdvantage : "-",
    },
    {
      key: 2,
      label: "Khả mại/Tính thanh khoản",
      value: data?.liquidity
        ? liquitiesOptions.find((item) => item.value == data?.liquidity)
            ?.label ?? data?.liquidity
        : "-",
    },
    {
      key: 3,
      label: "Thông tin tranh chấp",
      value: "-",
    },
    {
      key: 4,
      label: "Thông tin quy hoạch",
      value: "-",
    },
    {
      key: 5,
      label: "Yếu tố khác",
      value: data?.otherFactor ? data?.otherFactor : "-",
    },
    {
      key: 6,
      label: "Nội thất căn hộ",
      value: data?.furniture ? data?.furniture : "-",
    },
    {
      key: 7,
      label: "Toạ độ tài sản",
      value: data?.usingPurposeName ? (
        <LocationCoordinateCell coordinate={data?.coordinate} />
      ) : (
        "-"
      ),
    },
    {
      key: 8,
      label: "Số mặt thoáng căn hộ",
      value: data?.surfaces ? data?.surfaces : "-",
    },
    {
      key: 9,
      label: "Mô tả địa lý",
      value: data?.geographicDescription ? data?.geographicDescription : "-",
    },
    {
      key: 10,
      label: "Giá rao bán (đồng)",
      value: data?.estimatePrice
        ? numberUtils.formatNumber(data?.estimatePrice)
        : "-",
    },
    {
      key: 11,
      label: "Giá thương lượng (đồng)",
      value: data?.transactionPrice
        ? numberUtils.formatNumber(data?.transactionPrice)
        : "-",
    },
    {
      key: 12,
      label: "Đơn giá ước tính QSH căn hộ (đồng/m²)",
      value: data?.unitPrice ? numberUtils.formatNumber(data?.unitPrice) : "-",
    },
    {
      key: 16,
      label: "Người liên hệ - sđt",
      value: data?.contact ? data?.contact : "-",
    },
    {
      key: 17,
      label: "Mục đích sử dụng đất",
      value: data?.usingPurposeName ? data?.usingPurposeName : "-",
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
