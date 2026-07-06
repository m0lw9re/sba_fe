import { Button, Form, Row, Space, message } from "antd";
import { CollapseCustom } from "components/CollapseCustom";
import TitleCustom from "components/TitleCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FAST_EXPERTISE_APARTMENT,
  FAST_EXPERTISE_APARTMENT_CREATE,
  // FAST_EXPERTISE_APARTMENT_EDIT,
  FAST_EXPERTISE_APARTMENT_VIEW,
} from "routes/route.constant";
import ConstructionInfo from "./components/ConstructionInfo";
import General from "./components/General/General";
import Location from "./components/Location";
import { useAppSelector } from "configs/hooks";
import { fastExpertiseApi } from "apis/fastExpertise";
import { toNumber } from "utils/format";
import { objectWithoutProperties } from "utils/common";
import { setAssetInfo } from "../Store/fastExpertise";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import Logs from "./components/Logs";

export type PlaceType = {
  lat: number;
  lng: number;
};

const ApartmentCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const assetInfo = useAppSelector(
    (state) => state.fastExpertiseSlice.assetInfo
  );
  const addressText = useAppSelector(
    (state) => state.fastExpertiseSlice.addressText
  );
  const listTSSS = useAppSelector((state) => state.fastExpertiseSlice.listTSSS);
  // const type = useAppSelector(state => state.fastExpertiseSlice.type);
  const [place, setPlace] = useState<PlaceType>({
    lat: 21.035856,
    lng: 105.7757954545131241423424,
  });

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Chung cư",
        path: FAST_EXPERTISE_APARTMENT,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEstimatePrice = (valueExpertise: any, area: any) => {
    return toNumber(valueExpertise) * toNumber(area);
  };

  const convertUtilities = (value: any) => {
    const sortedValue = [...value].sort();
    const utilitiesString = sortedValue.join(",").toString();
    return utilitiesString;
  };

  const createDoc = async () => {
    // Lưu định giá tài sản
    const valuationIds = listTSSS.map((e: any) => e?.assetId);
    const totalValue = getEstimatePrice(
      assetInfo?.estimatePrice,
      assetInfo?.privateUseArea
    );
    const dataAddKey = {
      ...assetInfo,
      valuationIds: valuationIds,
      totalValue: totalValue,
      estimatePrice: assetInfo?.estimatePrice,
      latitude: place?.lat !== 0 ? place?.lat : assetInfo?.latitude,
      longitude: place?.lng !== 0 ? place?.lng : assetInfo?.longitude,
      // utilities: assetInfo?.utilities
      //   ? convertUtilities(assetInfo?.utilities)
      //   : null,
      utilities: assetInfo?.utilities
        ? convertUtilities(assetInfo?.utilities)
        : null,
    };
    const data = objectWithoutProperties(dataAddKey, ["addressTable"]);
    try {
      const res = await fastExpertiseApi.createDoc(
        data,
        ASSET_PRICES_SHARED_TYPE.APARTMENT
      );
      if (res?.data?.code !== 200) {
        message.error(res?.data?.message);
        // eslint-disable-next-line no-throw-literal
        throw { message: res?.data?.message };
      }
      dispatch(setAssetInfo(res?.data?.data));
      message.success("Đã lưu thành công");
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };

  const viewDetail = () => {
    navigate(
      `${FAST_EXPERTISE_APARTMENT_VIEW.replace(":id", assetInfo?.assetId)}`
    );
  };

  const reCreate = () => {
    // Nhập lại hồ sơ
    navigate(FAST_EXPERTISE_APARTMENT_CREATE);

    if (assetInfo?.assetId != null) {
      const newAssetInfo = {
        ...assetInfo,
        addressProvince: addressText?.provinceText,
        addressDistrict: addressText?.districtText,
        addressWard: addressText?.wardText,
        addressStreet: addressText?.streetText,
        addressDetail: addressText?.detailText,
      };
      console.log("co assetId: ", newAssetInfo);
      dispatch(setAssetInfo(newAssetInfo));
    } else {
      const newAssetInfo = {
        ...assetInfo,
        provinces: { code: assetInfo?.addressProvince },
        districts: { code: assetInfo?.addressDistrict },
        wards: { code: assetInfo?.addressWard },
        addressProvince: addressText?.provinceText,
        addressDistrict: addressText?.districtText,
        addressWard: addressText?.wardText,
        addressStreet: assetInfo?.addressStreet,
        addressDetail: assetInfo?.addressDetail,
      };
      console.log("khong co assetId: ", newAssetInfo);
      dispatch(setAssetInfo(newAssetInfo));
    }
  };

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <div className="page-container">
        <Row justify={"space-between"} style={{ marginBottom: 8 }}>
          <TitleCustom
            title="Định giá nhanh chung cư"
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
                navigate(FAST_EXPERTISE_APARTMENT_CREATE);
                dispatch(setAssetInfo(null));
              }}
            >
              Định giá tài sản khác
            </Button>
          </Space>
        </Row>
        <div style={{ marginBottom: 8 }}>
          <General />
        </div>

        <Form labelAlign="left">
          <CollapseCustom
            itemList={[
              {
                key: 1,
                label: "Định vị",
                children: <Location setPlace={setPlace} />,
              },

              {
                key: 3,
                label: "Thông tin tài sản so sánh",
                children: <ConstructionInfo></ConstructionInfo>,
              },
              // {
              //   key: 3,
              //   label: "Hình ảnh tài sản",
              //   children: <Image></Image>,
              // },
              {
                key: 4,
                label: "Các bước tìm kiếm",
                children: <Logs></Logs>,
              },
            ]}
            defaultActiveKey={[1, 2, 3]}
          />
        </Form>
      </div>
    </div>
  );
};
export default ApartmentCreate;
