import {Button, Form, Row, Space, message} from "antd";
import {CollapseCustom} from "components/CollapseCustom";
import TitleCustom from "components/TitleCustom";
import {setSelectedBeadCrumb} from "pages/App/store/appSlice";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
  FAST_EXPERTISE_VEHICLE,
  FAST_EXPERTISE_VEHICLE_CREATE,
  // FAST_EXPERTISE_VEHICLE_EDIT,
  FAST_EXPERTISE_VEHICLE_VIEW,
} from "routes/route.constant";
import ConstructionInfo from "./components/ConstructionInfo";
import General from "./components/General/General";
import Image from "./components/Image";

import {useAppSelector} from "configs/hooks";
import {fastExpertiseApi} from "apis/fastExpertise";
import {toNumber} from "utils/format";
import {objectWithoutProperties} from "utils/common";
import {setAssetInfo} from "../Store/fastExpertise";

export type PlaceType = {
  lat: number;
  lng: number;
};

const LandCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const assetInfo = useAppSelector(state => state.fastExpertiseSlice.assetInfo);
  // const type = useAppSelector(state => state.fastExpertiseSlice.type);
  const valueExpertise = useAppSelector(
    state => state.fastExpertiseSlice.valueExpertise
  );

  const listTSSS = useAppSelector(state => state.fastExpertiseSlice.listTSSS);
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Xe",
        path: FAST_EXPERTISE_VEHICLE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getValueOfConstuctor = (listConstructor: any[]) => {
    let tongGiaTri = 0;
    listConstructor?.forEach((e: any) => {
      tongGiaTri += toNumber(e?.value);
    });

    return tongGiaTri;
  };

  const createDoc = async () => {
    const valuationIds = listTSSS.map((e: any) => e?.assetId);
    const totalValue =
      toNumber(getValueOfConstuctor(assetInfo?.constructions)) +
      toNumber(valueExpertise);
    const dataAddKey = {
      ...assetInfo,
      valuationIds: valuationIds,
      totalValue: totalValue,
      estimatePrice: toNumber(valueExpertise),
    };
    try {
      const res = await fastExpertiseApi.createDoc(dataAddKey, 2);
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
      `${FAST_EXPERTISE_VEHICLE_VIEW.replace(":id", assetInfo?.assetId)}`
    );
  };
  return (
    <div style={{width: "100%"}}>
      <div className="page-container">
        <Row justify={"space-between"} style={{marginBottom: 8}}>
          <TitleCustom
            title="Định giá nhanh nhà phố - đất ở"
            size="middle"
          ></TitleCustom>
          <Space>
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
                navigate(FAST_EXPERTISE_VEHICLE_CREATE);
              }}
            >
              Định giá tài sản khác
            </Button>
          </Space>
        </Row>
        <div style={{marginBottom: 8}}>
          <General></General>
        </div>

        <Form labelWrap labelAlign="left">
          <CollapseCustom
            itemList={[
              {
                key: 3,
                label: "Thông tin chung",
                children: <ConstructionInfo></ConstructionInfo>,
              },
              {
                key: 3,
                label: "Hình ảnh tài sản",
                children: <Image></Image>,
              },
            ]}
            defaultActiveKey={[1, 2, 3]}
          />
        </Form>
      </div>
    </div>
  );
};
export default LandCreate;
