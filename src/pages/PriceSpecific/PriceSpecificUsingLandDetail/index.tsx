import { Row, Space, Typography } from "antd";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import "pages/PriceSpecific/PriceSpecificUsingLandDetail/style.scss";
import AssetProperty from "pages/PriceSpecific/PriceSpecificUsingLandDetail/subcomponents/AssetProperty";
import InforDetail from "pages/PriceSpecific/PriceSpecificUsingLandDetail/subcomponents/InforDetail";
import ValuationHistory from "pages/PriceSpecific/subcomponents/ValuationHistory";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  PRICE_SPECIFIC_USING_LAND,
  PRICE_SPECIFIC_USING_LAND_DETAIL,
} from "routes/route.constant";
import { useAssetStoredDetail, useAssetValueStoredDetail } from "utils/request";
import AssetValuationTSSS from "../PriceSpecificEstimateDetail/subcomponents/AssetValuationTSSS/AssetValuationTSSS";
import AssetValuation from "./subcomponents/AssetValuation";

const PriceSpecificUsingLandDetail = () => {
  let { id }: { id?: string } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "BĐS",
        path: PRICE_SPECIFIC_USING_LAND,
      },
      {
        label: "Thông tin chi tiết",
        path: PRICE_SPECIFIC_USING_LAND_DETAIL.replace(":id", id || ""),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PRICE_SPECIFIC_USING_LAND]);

  const { data: assetInfor } = useAssetStoredDetail(
    ASSET_PRICES_SHARED_TYPE.PLAN_USING,
    id || ""
  );
  
  const { data: assetValue } = useAssetValueStoredDetail(
    ASSET_PRICES_SHARED_TYPE.PLAN_USING,
    id || ""
  );

  const handleBackButton = (event: PopStateEvent) => {
    event.preventDefault();
  };
  window.addEventListener("popstate", handleBackButton);

  return (
    <div
      style={{ width: "100%" }}
      className="price-specific-using-land-detail-container"
    >
      <div className="page-container">
        <Space size={8} style={{ width: "100%" }} direction="vertical">
          <Row justify={"space-between"}>
            <Typography.Text className="page-title">
              Thông tin chi tiết
            </Typography.Text>
            {/* <ButtonCustom
              bgColor="none"
              // eslint-disable-next-line react/jsx-pascal-case
              icon={<Icons.download />}
              size="middle"
              label="Xuất PDF"
            /> */}
          </Row>
          <InforDetail data={assetInfor?.data || null} />
          <AssetProperty data={assetInfor?.data || null} />
          {
            assetInfor?.data?.storedTypeId === 2 ? (
              <AssetValuationTSSS 
                assetInfor={assetInfor?.data || null}
              />
            ) : (
              <AssetValuation data={assetValue?.data || null} />
            )
          }
          <ValuationHistory data={assetInfor?.data || null} />
        </Space>
      </div>
    </div>
  );
};

export default PriceSpecificUsingLandDetail;
