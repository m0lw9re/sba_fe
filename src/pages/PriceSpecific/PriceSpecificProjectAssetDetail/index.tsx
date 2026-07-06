import { Row, Space, Typography } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  PRICE_SPECIFIC_PROJECT,
  PRICE_SPECIFIC_PROJECT_DETAIL,
} from "routes/route.constant";
import Icons from "assets/icons";
import InforDetail from "pages/PriceSpecific/PriceSpecificProjectAssetDetail/subcomponents/InforDetail";
import AssetProperty from "pages/PriceSpecific/PriceSpecificProjectAssetDetail/subcomponents/AssetProperty";
import AssetValuation from "pages/PriceSpecific/PriceSpecificProjectAssetDetail/subcomponents/AssetValuation";
import ValuationHistory from "pages/PriceSpecific/subcomponents/ValuationHistory";
import "pages/PriceSpecific/PriceSpecificProjectAssetDetail/style.scss";
import { useLocation, useParams } from "react-router-dom";
import {
  useAssetStoredDetail,
  useAssetsValuation,
  useAssetsValuationDetail,
  useAssetValueStoredDetail,
} from "utils/request";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import UsingPurpose from "./subcomponents/UsingPurpose";
import CtxdInfo from "./subcomponents/CtxdInfo";
import { mockData } from "./config";
import { sortBy } from "lodash";
import {
  AssetProjectInfoType,
  AssetValuationType,
  TableKQDatType,
} from "constant/types/appraisalFile";
import { ASSET_LV2 } from "constant/enums";
import { appraisalFilesApi } from "apis/appraisalFiles";
import { TotalValue } from "./subcomponents/TotalValue";
import { OtherInfo } from "./subcomponents/OtherInfo";

const PriceSpecificProjectAssetDetail = () => {
  const [projectInfor, setProjectInfor] = useState<any>({});

  let { id }: { id?: string } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "DA",
        path: PRICE_SPECIFIC_PROJECT,
      },
      {
        label: "Thông tin chi tiết",
        path: PRICE_SPECIFIC_PROJECT_DETAIL.replace(":id", id || ""),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [PRICE_SPECIFIC_PROJECT]);

  const { data: assetInfor } = useAssetStoredDetail(
    ASSET_PRICES_SHARED_TYPE.PROJECT,
    id || ""
  );

  const { data: assetValue } = useAssetValueStoredDetail(
    ASSET_PRICES_SHARED_TYPE.PROJECT,
    id || ""
  );

  const {
    data: assetValuation,
  }: {
    data: AssetValuationType;
  } = useAssetsValuation(
    assetInfor?.data?.valuationHistories[0]?.appraisalFileId,
    ASSET_LV2.PROJECT
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (assetInfor) {
          const res = await appraisalFilesApi.getAllAssetsDetail(
            ASSET_LV2.PROJECT,
            [{ assetCode: assetInfor?.data?.assetCode }]
          );
          console.log("res: ", res?.data[0]);
          setProjectInfor(res?.data[0].assetObject);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [assetInfor]);

  const handleBackButton = (event: PopStateEvent) => {
    event.preventDefault();
    // const queryString = new URLSearchParams(params).toString();
    // window.location.href = `${PRICE_SPECIFIC_PROJECT}?${queryString}`;
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
              icon={<Icons.download />}
              size="middle"
              label="Xuất PDF"
            /> */}
          </Row>
          <InforDetail data={assetInfor?.data || null} />
          <AssetProperty data={projectInfor?.assetProjectInfor || null} />
          <UsingPurpose
            data={
              projectInfor?.assetProjectInfor?.assetLandUsingPurposes || null
            }
          />
          <OtherInfo data={projectInfor || null} />
          <AssetValuation data={assetValuation?.tableKQDat || null} />
          <CtxdInfo
            data={sortBy(
              assetValuation?.tableKQCTXD?.filter(
                (el: any) => el.constructionLegalTypeId === 1
              ),
              ["assetLandInforId", "orderBy"]
            )}
            title="Thông tin CTXD (theo GCN)"
          />
          <CtxdInfo
            data={sortBy(
              assetValuation?.tableKQCTXD?.filter(
                (el: any) => el.constructionLegalTypeId === 2
              ),
              ["assetLandInforId", "orderBy"]
            )}
            title="Thông tin CTXD (tham khảo)"
          />
          <TotalValue
            data={assetValuation?.tableTong?.totalValueRoundedApprovaled}
          />
          <ValuationHistory
            data={assetInfor?.data || null}
            assetLv2Id={ASSET_LV2.PROJECT}
          />
        </Space>
      </div>
    </div>
  );
};

export default PriceSpecificProjectAssetDetail;
