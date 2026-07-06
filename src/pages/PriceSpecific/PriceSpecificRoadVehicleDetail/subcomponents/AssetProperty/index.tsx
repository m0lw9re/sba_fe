import React, { useEffect, useState } from "react";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { Card, Col, Form, Row, Space } from "antd";
import AddressTable from "pages/PriceSpecific/PriceSpecificRoadVehicleDetail/subcomponents/AssetProperty/AddressTable";
import "pages/PriceSpecific/PriceSpecificRoadVehicleDetail/subcomponents/AssetProperty/style.scss";
import { ASSET_LV3 } from "constant/enums";
import { numberUtils } from "utils";
import { DISPUTE_INFORMATION_OPTIONS } from "constant/common";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  data: any;
};

type Filed = {
  key: number;
  label: string;
  value: string;
};

const AssetProperty: React.FC<Props> = ({ data }) => {
  const isTruckRermocVehicle =
    data?.assetLevelThreeId === ASSET_LV3.TRUCK ||
    data?.assetLevelThreeId === ASSET_LV3.SPECIALIZED ||
    data?.assetLevelThreeId === ASSET_LV3.TRACTORTRUCK ||
    data?.assetLevelThreeId === ASSET_LV3.RERMOCTRUCK;
  const isCarVehicle =
    data?.assetLevelThreeId === ASSET_LV3.CAR ||
    data?.assetLevelThreeId === ASSET_LV3.BUS;

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const labelCol = { xs: 12, md: 12, lg: 12, xl: 12 };
  const wrapperCol = { xs: 12, md: 12, lg: 12, xl: 12 };

  const [mainInfor, setMainInfor] = useState<Filed[]>([]);
  const { liquitiesOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  useEffect(() => {
    // Kiểm tra xem data có giá trị hay không
    if (data) {
      setMainInfor([
        {
          key: 1,
          label: "Nhãn hiệu",
          value: data.vehicleBrandName,
        },
        {
          key: 2,
          label: "Số loại / Model",
          value: data.vehicleModel,
        },
        {
          key: 3,
          label: "Màu sơn",
          value: data.vehicleColor,
        },
        {
          key: 4,
          label: "Năm sản xuất",
          value: data.yearMfg,
        },
        {
          key: 5,
          label: "Nước sản xuất",
          value: data.countryMfg,
        },
        {
          key: 6,
          label: "Loại nhiên liệu",
          value: data.fuelName,
        },
        {
          key: 7,
          label: "Số khung",
          value: data.vehicleIdNumber,
        },
        {
          key: 8,
          label: "Số máy",
          value: data.engineNumber,
        },
        {
          key: 9,
          label: "Biển kiểm soát",
          value: data.plateNumber,
        },
        {
          key: 10,
          label: "Số người cho phép chở",
          value: data.personCarry,
        },
        {
          key: 26,
          label: "Giá giao dịch/ rao bán (đồng)",
          value: numberUtils.formatNumber(data?.transactionPrice) ?? "-",
        },
        {
          key: 29,
          label: "Chiều dài thiết kế (m)",
          value: numberUtils.formatNumber(data?.designLength) ?? "-",
        },
        {
          key: 28,
          label: "Tỷ lệ ước tính (%)",
          value: data?.estimatedRate ? data?.estimatedRate : "-",
        },
        {
          key: 30,
          label: "Giá ước tính giao dịch thành công (đồng)",
          value: numberUtils.formatNumber(data?.estimatedPrice) ?? "-",
        },
      ]);
    } else {
      // Nếu data là null hoặc undefined, đặt mainInfor thành một mảng trống
      setMainInfor([]);
    }
  }, [data]);

  const carInfor: Filed[] = [
    {
      key: 11,
      label: "Hộp số",
      value: data?.gearBoxName,
    },
    {
      key: 12,
      label: "Công thức bánh xe",
      value: data?.wheelFormulaName,
    },
    {
      key: 13,
      label: "Kích thước bao (mm)",
      value: numberUtils.formatNumber(data?.overallDims) ?? "-",
    },
    {
      key: 14,
      label: "Khối lượng bản thân (kg)",
      value: numberUtils.formatNumber(data?.weightBase) ?? "-",
    },
    {
      key: 15,
      label: "Khối lượng toàn bộ theo TK /CP TGGT (kg)",
      value: numberUtils.formatNumber(data?.weightAll) ?? "-",
    },
    {
      key: 16,
      label: "Chiều dài cơ sở (mm)",
      value: data?.wheelBase ?? "-",
    },
    {
      key: 17,
      label: "Thể tích làm việc của động cơ (CC)",
      value: data?.engineDisp,
    },
    {
      key: 18,
      label: "Công suất lớn nhất /tốc độ quay (kW/vph)",
      value: data?.maxOutputRpm,
    },
    {
      key: 19,
      label: "Số lượng lốp/cỡ lốp",
      value: data?.numberOfTires,
    },
  ];

  const truckInfor: Filed[] = [
    {
      key: 20,
      label: "Kích thước lòng thùng xe (mm)",
      value: numberUtils.formatNumber(data?.vehicleTrunkSize) ?? "-",
    },
    {
      key: 21,
      label: "Khối lượng hàng chuyên chở theo TK/CP TGGT (kg)",
      value: numberUtils.formatNumber(data?.volumeOfGoodsTransported) ?? "-",
    },
    {
      key: 22,
      label: "Khối lượng hàng chuyên kéo theo TK/CP TGGT (kg)",
      value: numberUtils.formatNumber(data?.volumeOfTowedGoods) ?? "-",
    },
    {
      key: 24,
      label: "Dung tích bồn (gallons/lit)",
      value: data?.tankCapacity,
    },
  ];

  const otherInfor = [
    {
      key: 1,
      label: "Nguồn gốc sử dụng",
      value: data?.usingOrigin ? data?.usingOrigin : "-",
    },
    {
      key: 2,
      label: "Số km đã qua sử dụng",
      value: numberUtils.formatNumber(data?.numberOfKilometersUsed) ?? "-",
    },
    {
      key: 3,
      label: "Chất lượng còn lại (%)",
      value: data?.remainQuality ? Math.round(data?.remainQuality * 100) : "-",
    },
    {
      key: 4,
      label: "Khả mại/Tính thanh khoản",
      value: data?.liquidity
        ? liquitiesOptions.find((item) => item.value == data?.liquidity)
            ?.label ?? data?.liquidity
        : "-",
    },
    {
      key: 5,
      label: "Thông tin tranh chấp",
      value: data?.disputeInfor
        ? DISPUTE_INFORMATION_OPTIONS?.find(
            (item) => item.value === data?.disputeInfor
          )?.label ?? data?.disputeInfor
        : "-",
    },
    {
      key: 6,
      label: "Hiện trạng sử dụng",
      value: data?.currentUseSituation ? data?.currentUseSituation : "-",
    },
    {
      key: 7,
      label: "Ghi chú",
      value: data?.note || "-",
    },
    {
      key: 8,
      label: "Người liên hệ - sđt",
      value: data?.contact ? data?.contact : "-",
    },
  ];

  useEffect(() => {
    if (!data?.assetLevelThreeId) {
      return;
    }
    if (isCarVehicle) {
      setMainInfor((prevMainInfor: Filed[]) => {
        return [...prevMainInfor, ...carInfor];
      });
    }

    if (isTruckRermocVehicle) {
      setMainInfor((prevMainInfor: Filed[]) => {
        return [...prevMainInfor, ...carInfor, ...truckInfor];
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
