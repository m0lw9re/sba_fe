import {Button, Card, Form, Row, Space, message} from "antd";
import {CollapseCustom} from "components/CollapseCustom";
import TitleCustom from "components/TitleCustom";
import {setSelectedBeadCrumb} from "pages/App/store/appSlice";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
  FAST_EXPERTISE_LAND_TOWNHOUSE,
  FAST_EXPERTISE_LAND_TOWNHOUSE_CREATE,
  FAST_EXPERTISE_LAND_TOWNHOUSE_VIEW,
} from "routes/route.constant";
import ConstructionInfo from "./components/ConstructionInfo";
import General from "./components/General/General";
import Location from "./components/Location";
import Zoning from "./components/Zoning";
import {useAppSelector} from "configs/hooks";
import {fastExpertiseApi} from "apis/fastExpertise";
import { objectWithoutProperties } from "utils/common";
import { setAssetInfo } from "../Store/fastExpertise";
import TablePrice from "./components/TablePrice/TablePrice";
import Logs from "./components/Logs";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";

export type PlaceType = {
  lat: number;
  lng: number;
};

const LandDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const assetInfo = useAppSelector(state => state.fastExpertiseSlice.assetInfo);
  const addressText = useAppSelector(
    state => state.fastExpertiseSlice.addressText
  );
  // const type = useAppSelector(state => state.fastExpertiseSlice.type);
  // const valueExpertise = useAppSelector(
  //   state => state.fastExpertiseSlice.valueExpertise
  // );
  
  const [place, setPlace] = useState<PlaceType>({
    lat: 21.035856,
    lng: 105.7757954545131241423424,
  });
  const [radiusValue, setRadiusValue] = useState<number>(3000);

  const listTSSS = useAppSelector(state => state.fastExpertiseSlice.listTSSS);
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Nhà phố - Đất ở",
        path: FAST_EXPERTISE_LAND_TOWNHOUSE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const getValueOfConstuctor = (listConstructor: any[]) => {
  //   let tongGiaTri = 0;
  //   listConstructor?.forEach((e: any) => {
  //     tongGiaTri += toNumber(e?.value);
  //   });

  //   return tongGiaTri;
  // };
  // const getEstimatePrice = (valueExpertise: any, area: any) => {
  //   return toNumber(valueExpertise) * toNumber(area);
  // };

  const createDoc = async () => {
    const valuationIds = listTSSS.map((e: any) => e?.assetId);

    const dataAddKey = {
      ...assetInfo,
      valuationIds: valuationIds,
      latitude: assetInfo?.latitude,
      longitude: assetInfo?.longitude,
    };
    const data = objectWithoutProperties(dataAddKey, ["addressTable"]);
    try {
      const res = await fastExpertiseApi.createDoc(data, ASSET_PRICES_SHARED_TYPE.PLAN_USING);
      if (res?.data?.code !== 200) {
        message.error(res?.data?.message);
        // throw {message: res?.data?.message};
      }
      dispatch(setAssetInfo(res?.data?.data));
      message.success("Đã lưu thành công");
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };

  const viewDetail = () => {
    navigate(
      `${FAST_EXPERTISE_LAND_TOWNHOUSE_VIEW.replace(":id", assetInfo?.assetId)}`
    );
  };

  const reCreate = () => {
    navigate(FAST_EXPERTISE_LAND_TOWNHOUSE_CREATE);

    if (assetInfo?.assetId != null) {
      const newAssetInfo = {
        ...assetInfo,
        // provinces: {code: assetInfo?.addressProvince},
        // districts: {code: assetInfo?.addressDistrict},
        // wards: {code: assetInfo?.addressWard},
        addressProvince: addressText?.provinceText,
        addressDistrict: addressText?.districtText,
        addressWard: addressText?.wardText,
        addressStreet: addressText?.streetText,
        addressDetail: addressText?.detailText,
      };

      dispatch(setAssetInfo(newAssetInfo));
    } else {
      const newAssetInfo = {
        ...assetInfo,
        provinces: {code: assetInfo?.addressProvince},
        districts: {code: assetInfo?.addressDistrict},
        wards: {code: assetInfo?.addressWard},
        addressProvince: addressText?.provinceText,
        addressDistrict: addressText?.districtText,
        addressWard: addressText?.wardText,
        addressStreet: assetInfo?.addressStreet,
        addressDetail: assetInfo?.addressDetail,
      };

      dispatch(setAssetInfo(newAssetInfo));
    }
  };

  useEffect(() => {
    if (assetInfo?.radius) {
      setRadiusValue(Number(assetInfo?.radius) * 1000 || 3000);
    }
  }, [assetInfo]);

  return (
    <div style={{width: "100%"}}>
      <div className="page-container">
        <Row justify={"space-between"} style={{marginBottom: 8}}>
          <TitleCustom
            title="Định giá nhanh nhà phố - đất ở"
            size="middle"
          ></TitleCustom>
          <Space>
            <Button className="btn-middle" onClick={reCreate}>
              Nhập lại
            </Button>
            {assetInfo?.assetId && (
              <Button className="btn-middle" onClick={viewDetail}>
                Xem hồ sơ
              </Button>
            )}
            {!assetInfo?.assetId && (
              <Button className="btn-middle" onClick={createDoc}>
                Lưu
              </Button>
            )}
            <Button
              className="btn-primary"
              onClick={() => {
                navigate(FAST_EXPERTISE_LAND_TOWNHOUSE_CREATE);
                dispatch(setAssetInfo(null));
              }}
            >
              Định giá tài sản khác
            </Button>
          </Space>
        </Row>
        <Card className="card-container">
          <General />
        </Card>
        <Form labelWrap labelAlign="left" style={{marginTop: "8px"}}>
          <CollapseCustom
            itemList={[
              {
                key: 1,
                label: "Chi tiết kết quả định giá nhanh",
                children: <TablePrice />,
              },
              {
                key: 2,
                label: "Định vị",
                children: (
                  <Location radiusValue={radiusValue} setPlace={setPlace} />
                ),
              },
              {
                key: 3,
                label: "Quy hoạch",
                children: <Zoning place={place} />,
              },
              {
                key: 4,
                label: "Thông tin tài sản so sánh",
                children: <ConstructionInfo></ConstructionInfo>,
              },
              {
                key: 5,
                label: "Các bước tìm kiếm",
                children: <Logs></Logs>,
              },
              // {
              //   key: 6,
              //   label: "Hình ảnh tài sản",
              //   children: <Image></Image>,
              // },
            ]}
            defaultActiveKey={[2, 3, 4, 5]}
          />
        </Form>
      </div>
    </div>
  );
};
export default LandDetail;
