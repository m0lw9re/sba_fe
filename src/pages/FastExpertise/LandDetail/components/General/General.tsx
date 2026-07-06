import { Card, Col, Descriptions, Row, Image } from "antd";
import { useAppDispatch, useAppSelector } from "configs/hooks";
import { getListRoadInPriceAPI } from "pages/FastExpertise/Store/fastExpertise";
import { useEffect, useState } from "react";
import { formatToCurrencyType, toNumber } from "utils/format";
import { useAddressProvince } from "utils/request";
import imageSrc from "assets/images/png/home-demo.png";
import "./index.scss";

import { numberUtils } from "utils";

const General = () => {
  const itemsInit: any[] = [
    {
      label: "Vị trí bất động sản",
      children: "Lý Thường Kiệt, Hai Bà Trưng, Hà Nội",
      span: 4,
    },
    {
      label: "Tổng diện tích (m²)",
      span: 2,
    },
    {
      label: "Đơn giá thị trường (đồng/m²)",
      span: 2,
    },
    {
      label: "Tổng giá trị đất (đồng)",
      span: 2,
    },
    {
      label: "Tổng giá trị tài sản (đồng)",
      span: 2,
    },
    {
      label: "Loại tài sản",
      children: "Nhà phố-Đất ở",
      span: 2,
    },
    {
      label: "Đơn giá điều chỉnh (đồng/m²)",

      span: 2,
    },
    {
      label: "Khung giá STB",
      span: 2,
    },
    {
      label: "Tổng giá trị CTXD (đồng)",
      span: 2,
    },
    {
      label: "Nguồn thông tin",
      children: "Được cung cấp từ sacombank",
      span: 2,
    },
  ];
  const assetInfo = useAppSelector(
    (state) => state.fastExpertiseSlice.assetInfo
  );

  const listRoadInPrice = useAppSelector(
    (state) => state.fastExpertiseSlice.listRoadInPrice
  );
  const valueExpertise = useAppSelector(
    (state) => state.fastExpertiseSlice.valueExpertise
  );
  const listTSSS = useAppSelector((state) => state.fastExpertiseSlice.listTSSS);

  const dispatch = useAppDispatch();
  const [items, setItems] = useState<any[]>(itemsInit);
  const { data } = useAddressProvince();

  useEffect(() => {
    if (!assetInfo?.assetId) {
      getListRoadInPrice(assetInfo?.addressProvince);
    } else {
      getListRoadInPrice(assetInfo?.provinces?.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetInfo]);

  const getListRoadInPrice = (provinceCode: string) => {
    dispatch(getListRoadInPriceAPI(provinceCode));
  };

  const renderPriceRange = (fromValue: any, toValue: any) => {
    if (fromValue && toValue) {
      return `${formatToCurrencyType(fromValue)} đ/m2 -> ${formatToCurrencyType(
        toValue
      )} đ/m2`;
    } else if (fromValue || toValue) {
      return `Khoảng ${formatToCurrencyType(fromValue ?? toValue)} đ/m2`;
    }
  };

  useEffect(() => {
    getUnitPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTSSS]);

  useEffect(() => {
    getInfo(assetInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetInfo, data, valueExpertise]);

  const getInfo = (assetInfo: any) => {
    let address = assetInfo?.address;

    const priceRange = listRoadInPrice?.find(
      (e) =>
        e?.roadInPriceRangeId?.toString() ===
        assetInfo?.roadInPriceRange?.toString()
    );

    itemsInit.find((e: any) => e.label === "Vị trí bất động sản").children =
      address;

    itemsInit.find((e: any) => e.label === "Tổng giá trị đất (đồng)").children =
      formatToCurrencyType(
        numberUtils.roundDecimalNumber(assetInfo?.landPrice)
      );

    itemsInit.find(
      (e: any) => e.label === "Tổng giá trị CTXD (đồng)"
    ).children = formatToCurrencyType(assetInfo?.constructionPrice);
    itemsInit.find((e: any) => e.label === "Tổng diện tích (m²)").children =
      formatToCurrencyType(assetInfo?.areaWidth);
    itemsInit.find(
      (e: any) => e.label === "Tổng giá trị tài sản (đồng)"
    ).children = formatToCurrencyType(
      numberUtils.roundDecimalNumber(assetInfo?.totalValue)
    );
    itemsInit.find((e: any) => e.label === "Khung giá STB").children =
      renderPriceRange(priceRange?.giaThiTruongTu, priceRange?.giaThiTruongDen);
    itemsInit.find(
      (e: any) => e.label === "Đơn giá thị trường (đồng/m²)"
    ).children = formatToCurrencyType(assetInfo?.estimatePrice);
    itemsInit.find(
      (e: any) => e.label === "Đơn giá điều chỉnh (đồng/m²)"
    ).children = formatToCurrencyType(assetInfo?.optimizePrice);
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
        tongGiaTri += toNumber(e?.landUnitPrice);
      });

      donGia = toNumber(toNumber(tongGiaTri) / index).toFixed(0);
      return formatToCurrencyType(donGia);
    } else {
      return "";
    }
  };

  return (
    <Card className="card-container">
      <Row style={{ minHeight: 250, margin: "6px 0", alignItems: "center" }}>
        <Col
          span={8}
          style={{ height: "100%", display: "flex", alignItems: "center" }}
        >
          <Image
            src={imageSrc}
            alt="demo"
            style={{ height: "100%", objectFit: "cover" }}
            preview={false}
          />
        </Col>
        <Col span={16}>
          <Descriptions
            column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
            items={items}
            size="small"
            style={{ marginLeft: "8px" }}
          />
        </Col>
      </Row>
    </Card>
  );
};
export default General;
