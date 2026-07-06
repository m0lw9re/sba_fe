import { Row, Space, Typography } from "antd";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  PRICE_SPECIFIC_APPARTMENT,
  PRICE_SPECIFIC_APPARTMENT_DETAIL,
} from "routes/route.constant";
import InforDetail from "pages/PriceSpecific/PriceSpecificAppartmentDetail/subcomponents/InforDetail";
import AssetProperty from "pages/PriceSpecific/PriceSpecificAppartmentDetail/subcomponents/AssetProperty";
import ValuationHistory from "pages/PriceSpecific/subcomponents/ValuationHistory";
import AssetValuation from "pages/PriceSpecific/PriceSpecificAppartmentDetail/subcomponents/AssetValuation";
import { useLocation, useParams } from "react-router-dom";
import "pages/PriceSpecific/PriceSpecificAppartmentDetail/style.scss";
import { useAssetStoredDetail, useAssetValueStoredDetail } from "utils/request";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";

const PriceSpecificAppartmentDetail = () => {
  const { id }: { id?: string } = useParams();
  const location = useLocation();

  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "CHCC",
        path: PRICE_SPECIFIC_APPARTMENT,
      },
      {
        label: "Thông tin chi tiết",
        path: PRICE_SPECIFIC_APPARTMENT_DETAIL.replace(":id", id || ""),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PRICE_SPECIFIC_APPARTMENT]);

  const { data: assetInfor } = useAssetStoredDetail(
    ASSET_PRICES_SHARED_TYPE.APARTMENT,
    id || ""
  );
  
  const { data: assetValue } = useAssetValueStoredDetail(
    ASSET_PRICES_SHARED_TYPE.APARTMENT,
    id || ""
  );

  const handleBackButton = (event: PopStateEvent) => {
    event.preventDefault();
  };
  window.addEventListener("popstate", handleBackButton);

  return (
    <div
      style={{ width: "100%" }}
      className="price-specific-appartment-detail-container"
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
          <AssetValuation data={assetValue?.data || null} />
          <ValuationHistory data={assetInfor?.data || null} />
        </Space>
      </div>
    </div>
  );
};

export default PriceSpecificAppartmentDetail;
