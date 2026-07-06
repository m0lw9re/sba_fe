import { Row, Space, Typography } from "antd";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import AssetProperty from "pages/PriceSpecific/PriceSpecificEstimateDetail/subcomponents/AssetProperty";
import InforDetail from "pages/PriceSpecific/PriceSpecificEstimateDetail/subcomponents/InforDetail";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  PRICE_SPECIFIC_ESTIMATE_PRICE,
  PRICE_SPECIFIC_ESTIMATE_PRICE_DETAIL,
} from "routes/route.constant";
// import AssetValuation from "pages/PriceSpecific/PriceSpecificEstimateDetail/subcomponents/AssetValuation";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import "pages/PriceSpecific/PriceSpecificEstimateDetail/style.scss";
import ValuationHistory from "pages/PriceSpecific/subcomponents/ValuationHistory";
import { useParams } from "react-router-dom";
import { useAssetStoredDetail, useAssetValueStoredDetail } from "utils/request";
import AssetValuation from "./subcomponents/AssetValuation";
import AssetValuationTSSS from "./subcomponents/AssetValuationTSSS/AssetValuationTSSS";

const PriceSpecificEstimateDetail = () => {
  let { id }: { id?: string } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "DT",
        path: PRICE_SPECIFIC_ESTIMATE_PRICE,
      },
      {
        label: "Thông tin chi tiết",
        path: PRICE_SPECIFIC_ESTIMATE_PRICE_DETAIL.replace(":id", id || ""),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PRICE_SPECIFIC_ESTIMATE_PRICE]);

  const { data: assetInfor } = useAssetStoredDetail(
    ASSET_PRICES_SHARED_TYPE.ESTIMATE,
    id || ""
  );

  const { data: assetValue } = useAssetValueStoredDetail(
    ASSET_PRICES_SHARED_TYPE.ESTIMATE,
    id || ""
  );

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

export default PriceSpecificEstimateDetail;
