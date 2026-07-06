import { Space, Typography } from "antd";
import { TabsCustom } from "components/TabsCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { VEHICLE_BRAND } from "routes/route.constant";
import "./style.scss";
import RoadVehicle from "./components/RoadVehicle";

const VehicleBrand = () => {
  const [searchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState<string>(
    searchParams.get("tab") || "1"
  );

  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "",
      },
      {
        label: "Danh sách nhãn hiệu",
        path: VEHICLE_BRAND,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [VEHICLE_BRAND]);

  return (
    <Fragment>
      <div className="page-container">
        <div className="header-wrapper">
          <Space className="title-wrapper" style={{ display: "flex" }}>
            <Typography className="title">Danh sách nhãn hiệu</Typography>
          </Space>
        </div>
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          className={"tab-assets"}
          items={[
            {
              label: "Phương tiện đường bộ",
              key: "1",
              children: <RoadVehicle type={Number(tabIndex)} />,
            },
            {
              label: "Phương tiện đường thủy",
              key: "2",
              children: <RoadVehicle type={Number(tabIndex)} />,
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default VehicleBrand;
