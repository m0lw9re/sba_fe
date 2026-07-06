import { Card, Col, Descriptions, Row } from "antd";
import { useAppSelector } from "configs/hooks";
import { UTILITIES_APARTMENT } from "constant/enums";
import { round } from "lodash";
// import {setAssetInfo} from "pages/FastExpertise/Store/fastExpertise";
import { useEffect, useState } from "react";
import { numberUtils } from "utils";
// import {combineAddress} from "utils/common";
import { formatToCurrencyType, toNumber } from "utils/format";
import { useAddressProvince } from "utils/request";

const General = () => {
  const itemsInit: any[] = [
    {
      label: "Vị trí bất động sản",
      span: 6,
    },
    {
      label: "Diện tích sử dụng riêng",
      span: 3,
    },
    {
      label: "Tổng giá trị (đồng)",
      span: 3,
    },
    {
      label: "Loại tài sản",
      children: "Chung cư",
      span: 3,
    },
    {
      label: "Đơn giá QSHCH (đồng/m²)",
      span: 3,
    },
    {
      label: "Tầng số",
      span: 3,
    },
    {
      label: UTILITIES_APARTMENT.ELEVATOR_LABEL,
      span: 3,
    },
    {
      label: UTILITIES_APARTMENT.GARAGE_LABEL,
      span: 3,
    },
    {
      label: UTILITIES_APARTMENT.POOL_LABEL,
      span: 3,
    },
    {
      label: UTILITIES_APARTMENT.COMMERCIALSERVICEAREA_LABEL,
      span: 3,
    },
    {
      label: UTILITIES_APARTMENT.RECEPTIONHALL_LABEL,
      span: 3,
    },
    {
      label: UTILITIES_APARTMENT.INNER_PARK_LABEL,
      span: 3,
    },
    {
      label: UTILITIES_APARTMENT.HOSPITAL_SCHOOL_PRESCHOOL_LABEL,
      span: 8,
    },
    {
      label: "Nguồn thông tin",
      children: "Được cung cấp từ sacombank",
      span: 3,
    },
  ];
  const assetInfo = useAppSelector(
    (state) => state.fastExpertiseSlice.assetInfo
  );
  const valueExpertise = useAppSelector(
    (state) => state.fastExpertiseSlice.valueExpertise
  );
  const listTSSS = useAppSelector((state) => state.fastExpertiseSlice.listTSSS);

  const [items, setItems] = useState<any[]>(itemsInit);
  const { data } = useAddressProvince();

  useEffect(() => {
    getUnitPrice();
  }, [listTSSS]);

  useEffect(() => {
    getInfo(assetInfo);
  }, [assetInfo, data, valueExpertise]);

  const getEstimatePrice = (valueExpertise: any, area: any) => {
    return numberUtils.formatNumber(
      round(toNumber(valueExpertise) / toNumber(area))
    );
  };

  const getInfo = (assetInfo: any) => {
    let address = assetInfo?.address;
    const estimateUnitPrice = getEstimatePrice(
      assetInfo?.estimatePrice,
      assetInfo?.privateUseArea
    );

    itemsInit.find((e: any) => e.label === "Vị trí bất động sản").children =
      address;
    itemsInit.find((e: any) => e.label === "Tổng giá trị (đồng)").children =
      formatToCurrencyType(assetInfo?.estimatePrice);
    itemsInit.find((e: any) => e.label === "Đơn giá QSHCH (đồng/m²)").children =
      estimateUnitPrice;
    itemsInit.find((e: any) => e.label === "Diện tích sử dụng riêng").children =
      assetInfo?.privateUseArea;
    itemsInit.find((e: any) => e.label === "Tầng số").children =
      assetInfo?.floorNo;
    const utilities = assetInfo?.utilities ? assetInfo?.utilities : [];
    itemsInit.find(
      (e: any) => e.label === UTILITIES_APARTMENT.ELEVATOR_LABEL
    ).children = utilities?.includes(UTILITIES_APARTMENT.ELEVATOR)
      ? "Có"
      : "Không";
    itemsInit.find(
      (e: any) => e.label === UTILITIES_APARTMENT.GARAGE_LABEL
    ).children = utilities?.includes(UTILITIES_APARTMENT.GARAGE)
      ? "Có"
      : "Không";
    itemsInit.find(
      (e: any) => e.label === UTILITIES_APARTMENT.POOL_LABEL
    ).children = utilities?.includes(UTILITIES_APARTMENT.POOL) ? "Có" : "Không";
    itemsInit.find(
      (e: any) => e.label === UTILITIES_APARTMENT.COMMERCIALSERVICEAREA_LABEL
    ).children = utilities?.includes(UTILITIES_APARTMENT.COMMERCIALSERVICEAREA)
      ? "Có"
      : "Không";
    itemsInit.find(
      (e: any) => e.label === UTILITIES_APARTMENT.RECEPTIONHALL_LABEL
    ).children = utilities?.includes(UTILITIES_APARTMENT.RECEPTIONHALL)
      ? "Có"
      : "Không";
    itemsInit.find(
      (e: any) => e.label === UTILITIES_APARTMENT.INNER_PARK_LABEL
    ).children = utilities?.includes(UTILITIES_APARTMENT.INNER_PARK)
      ? "Có"
      : "Không";
    itemsInit.find(
      (e: any) =>
        e.label === UTILITIES_APARTMENT.HOSPITAL_SCHOOL_PRESCHOOL_LABEL
    ).children = utilities?.includes(
      UTILITIES_APARTMENT.HOSPITAL_SCHOOL_PRESCHOOL
    )
      ? "Có"
      : "Không";

    setItems([...itemsInit]);
  };

  const getUnitPrice = () => {
    let tongGiaTri = 0;
    let donGia = "";
    let index = 0;
    if (listTSSS?.length > 0) {
      listTSSS?.forEach((e: any) => {
        if (toNumber(e?.unitPrice) > 0) {
          index += 1;
        }
        tongGiaTri += toNumber(e?.unitPrice);
      });

      donGia = toNumber(toNumber(tongGiaTri) / index).toFixed(0);
      return formatToCurrencyType(donGia);
    } else {
      return "";
    }
  };

  return (
    <Card className="card-container">
      <Row style={{ height: 360 }}>
        <Col span={8} style={{ height: "100%" }}>
          <img
            src={require("assets/images/png/home-demo.png")}
            alt=""
            style={{ height: 260 }}
          />
        </Col>
        <Col span={16}>
          <Descriptions
            column={{ xs: 1, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }}
            items={items}
          />
        </Col>
      </Row>
    </Card>
  );
};
export default General;
