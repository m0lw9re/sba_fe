import React from "react";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { Card, Col, Form, Row, Space } from "antd";
import AddressTable from "pages/PriceSpecific/PriceSpecificProjectAssetDetail/subcomponents/AssetProperty/AddressTable";
import "pages/PriceSpecific/PriceSpecificProjectAssetDetail/subcomponents/AssetProperty/style.scss";
import { numberUtils } from "utils";
import LocationCoordinateCell from "pages/PriceSpecific/subcomponents/map";

type Props = {
  data: any;
};

const AssetProperty: React.FC<Props> = ({ data }) => {
  // const inforBasic = [
  //   {
  //     key: 1,
  //     label: "Số thửa",
  //     value: data?.landPlotNumber ? data?.landPlotNumber : "-",
  //   },
  //   {
  //     key: 2,
  //     label: "Số tờ bản đồ",
  //     value: data?.mapSheetNumber ? data?.mapSheetNumber : "-",
  //   },
  // ];

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
      value: data?.widthToMainRoad ? data?.widthToMainRoad : "-",
    },
    {
      key: 7,
      label: "Khu vực",
      value: data?.areaUnplan ? data?.areaUnplan : "-",
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
      value: data?.numberOfFacade ? data?.numberOfFacade : "-",
    },
    {
      key: 12,
      label: "Kích thước mặt tiền (m)",
      value: data?.facadeLength ? data?.facadeLength : "-",
    },
    {
      key: 13,
      label: "Kích thước chiều dài (m)",
      value: data?.landLength ? data?.landLength : "-",
    },
    {
      key: 1,
      label: "Diện tích sử dụng riêng (m²)",
      value: data?.privateArea ? data?.privateArea : "-",
    },
    {
      key: 2,
      label: "Diện tích sử dụng chung (m²)",
      value: data?.commonArea ? data?.commonArea : "-",
    },
    {
      key: 3,
      label: "Diện tích khuôn viên (m²)",
      value: data?.areaWidth ? data?.areaWidth : "-",
    },
    {
      key: 4,
      label: "Diện tích phù hợp quy hoạch (m²)",
      value: data?.areaInplan ? data?.areaInplan : "-",
    },
    {
      key: 5,
      label: "Diện tích không phù hợp quy hoạch (m²)",
      value: data?.areaUnplan ? data?.areaUnplan : "0",
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

  return (
    <div className="asset-valuation-container">
      <Card size="small" className="card-container">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <CardTitleCustomUpdate title="Đặc điểm tài sản" />

          {/* {inforBasic.map((item, index) => {
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
              })} */}
          <AddressTable data={data} />
        </Space>
      </Card>
    </div>
  );
};

export default AssetProperty;
