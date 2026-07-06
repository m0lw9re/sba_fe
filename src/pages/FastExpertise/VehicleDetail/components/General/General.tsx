import {Card, Col, Descriptions, Row} from "antd";
import {useAppSelector} from "configs/hooks";
// import {getListRoadInPriceAPI} from "pages/FastExpertise/Store/fastExpertise";
// import {setAssetInfo} from "pages/FastExpertise/Store/fastExpertise";
import {useEffect, useState} from "react";
// import {combineAddress} from "utils/common";
import {formatToCurrencyType, toNumber} from "utils/format";
import {useAddressProvince} from "utils/request";
const General = () => {
  const itemsInit: any[] = [
    {
      label: "Hãng ô tô",
      span: 4,
    },
    {
      label: "Dòng xe",
      span: 2,
    },
    {
      label: "Số chỗ",
      span: 2,
    },
    {
      label: "Năm sản xuất",
      span: 2,
    },
    {
      label: "Ngày đăng ký",
      span: 2,
    },
    {
      label: "Số km đã đi",
      children: "Nhà phố-Đất ở",
      span: 2,
    },

    {
      label: "Giá thị trường",
      span: 2,
    },
    {
      label: "Ngân hàng định giá",
      span: 2,
    },
    {
      label: "Nguồn thông tin",
      children: "Được cung cấp từ sacombank",
      span: 2,
    },
  ];
  const assetInfo = useAppSelector(state => state.fastExpertiseSlice.assetInfo);
  const valueExpertise = useAppSelector(
    state => state.fastExpertiseSlice.valueExpertise
  );
  const listTSSS = useAppSelector(state => state.fastExpertiseSlice.listTSSS);

  const [items, setItems] = useState<any[]>(itemsInit);
  const {data} = useAddressProvince();

  useEffect(() => {
    getUnitPrice();
  }, [listTSSS]);
  useEffect(() => {
    getInfo(assetInfo);
  }, [assetInfo, data, valueExpertise]);
  const getInfo = (assetInfo: any) => {
    let address = assetInfo?.address;

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
      <Row style={{height: 200}}>
        <Col span={8} style={{height: "100%"}}>
          <img
            src={require("assets/images/png/home-demo.png")}
            alt=""
            style={{height: "100%"}}
          />
        </Col>
        <Col span={16}>
          <Descriptions
            column={{xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4}}
            items={items}
          />
        </Col>
      </Row>
    </Card>
  );
};
export default General;
