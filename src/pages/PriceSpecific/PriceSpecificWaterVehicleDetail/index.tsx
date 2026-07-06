import { Row, Space, Typography } from "antd";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import "pages/PriceSpecific/PriceSpecificWaterVehicleDetail/style.scss";
import AssetProperty from "pages/PriceSpecific/PriceSpecificWaterVehicleDetail/subcomponents/AssetProperty";
import InforDetail from "pages/PriceSpecific/PriceSpecificWaterVehicleDetail/subcomponents/InforDetail";
import ValuationHistoryVehicle from "pages/PriceSpecific/subcomponents/ValuationHistoryVehicle";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  PRICE_SPECIFIC_WATER_WAY,
  PRICE_SPECIFIC_WATER_WAY_DETAIL,
} from "routes/route.constant";
import { useAssetStoredDetail, useAssetValueStoredDetail } from "utils/request";

const PriceSpecificWaterVehicleDetail = () => {
  const { id }: { id?: string } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "PTĐT",
        path: PRICE_SPECIFIC_WATER_WAY,
      },
      {
        label: "Thông tin chi tiết",
        path: PRICE_SPECIFIC_WATER_WAY_DETAIL.replace(":id", id || ""),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [PRICE_SPECIFIC_WATER_WAY]);

  const { data: assetInfor } = useAssetStoredDetail(
    ASSET_PRICES_SHARED_TYPE.WATERWAY_VEHICLE,
    id || ""
  );
  
  const handleBackButton = (event: PopStateEvent) => {
    event.preventDefault();
    // const queryString = new URLSearchParams(params).toString();
    // window.location.href = `${PRICE_SPECIFIC_WATER_WAY}?${queryString}`;
  };
  window.addEventListener("popstate", handleBackButton);

  return (
    <div
      style={{ width: "100%" }}
      className="price-specific-road-vehicle-detail-container"
    >
      <div className="page-container">
        <Space size={8} style={{ width: "100%" }} direction="vertical">
          <Row justify={"space-between"}>
            <Typography.Text className="page-title">
              Thông tin chi tiết
            </Typography.Text>
            {/* <ButtonCustom
              bgColor="none"
              icon={<Icons.download />}
              size="middle"
              label="Xuất PDF"
            /> */}
          </Row>
          <InforDetail data={assetInfor?.data || null} />
          <AssetProperty data={assetInfor?.data || null} />
          <ValuationHistoryVehicle data={assetInfor?.data || null} />
        </Space>
      </div>
    </div>
  );
};

export default PriceSpecificWaterVehicleDetail;
