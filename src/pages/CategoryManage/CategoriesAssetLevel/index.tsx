import { Space, Typography } from "antd";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CATEGORY_ASSET_LEVEL } from "routes/route.constant";
import "./style.scss";
import RealEstateInfo from "./components/RealEstate";
import { TabsCustom } from "components/TabsCustom";
import { useSearchParams } from "react-router-dom";
import RoadVehiclesInfo from "./components/Movalble";
import OthersInfo from "./components/Others";

const CategoriesAssetLevel = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState<string>(
    searchParams.get("tab") || "1"
  );
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục phân cấp tài sản",
        path: CATEGORY_ASSET_LEVEL,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_ASSET_LEVEL]);
  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div className="header-wrapper">
          <Space className="title-wrapper" style={{ display: "flex" }} size={8}>
            <Typography className="title">Danh mục phân cấp tài sản</Typography>
          </Space>
        </div>
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          className={"tab-assets"}
          items={[
            {
              label: "Bất động sản",
              key: "1",
              forceRender: true,
              children: <RealEstateInfo />,
            },
            {
              label: "Động sản",
              key: "2",
              forceRender: true,
              children: <RoadVehiclesInfo />,
            },
            {
              label: "Khác",
              key: "3",
              forceRender: true,
              children: <OthersInfo />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default CategoriesAssetLevel;
