import { Row, Space, Typography } from "antd";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  PRICE_SPECIFIC_DEVICE,
  PRICE_SPECIFIC_DEVICE_DETAIL,
} from "routes/route.constant";
import InforDetail from "pages/PriceSpecific/PriceSpecificDeviceDetail/subcomponents/InforDetail";
import AssetProperty from "pages/PriceSpecific/PriceSpecificDeviceDetail/subcomponents/AssetProperty";
import "pages/PriceSpecific/PriceSpecificDeviceDetail/style.scss";
// import
import { useAssetStoredDetail } from "utils/request";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import ValuationHistoryVehicle from "pages/PriceSpecific/subcomponents/ValuationHistoryVehicle";

const PriceSpecificDeviceDetail = () => {
  const { id }: { id?: string } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "MMTB",
        path: PRICE_SPECIFIC_DEVICE,
      },
      {
        label: "Thông tin chi tiết",
        path: PRICE_SPECIFIC_DEVICE_DETAIL.replace(":id", id || ""),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [PRICE_SPECIFIC_DEVICE_DETAIL]);

  const { data: assetInfor } = useAssetStoredDetail(ASSET_PRICES_SHARED_TYPE.DEVICE, id || "");
  
  const handleBackButton = (event: PopStateEvent) => {
    event.preventDefault();
  };
  window.addEventListener("popstate", handleBackButton);

  return (
    <div
      style={{ width: "100%" }}
      className="price-specific-device-detail-container"
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

export default PriceSpecificDeviceDetail;
