import { Button, Space, Typography } from "antd";
import { TabsCustom } from "components/TabsCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { CATEGORY_LEGAL } from "routes/route.constant";
import "./style.scss";
import RealEstateInfo from "./components/RealEstateInfo";
import RoadVehicle from "./components/RoadVehicle";
import WaterVehicle from "./components/WaterVehicle";
import Device from "./components/Device";

const CategoryLegal = () => {
  const [searchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState<string>(
    searchParams.get("tab") || "1"
  );

  const [isBtnLoading, setisBtnLoading] = useState<{
    saveBtn: boolean;
  }>({
    saveBtn: false,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "",
      },
      {
        label: "Hồ sơ pháp lý",
        path: CATEGORY_LEGAL,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CATEGORY_LEGAL]);

  return (
    <Fragment>
      <div className="page-container">
        <div className="header-wrapper">
          <Space className="title-wrapper" style={{ display: "flex" }}>
            <Typography className="title">Danh sách hồ sơ pháp lý</Typography>
          </Space>
        </div>
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          className={"tab-assets"}
          items={[
            {
              label: "Bất động sản, dự án, dự toán, đất thuê",
              key: "1",
              forceRender: true,
              children: <RealEstateInfo />,
            },
            {
              label: "Phương tiện đường bộ",
              key: "2",
              forceRender: true,
              children: <RoadVehicle />,
            },
            {
              label: "Phương tiện đường thủy",
              key: "3",
              forceRender: true,
              children: <WaterVehicle />,
            },
            {
              label: "Máy móc thiết bị, dây chuyền sản xuất",
              key: "4",
              forceRender: true,
              children: <Device />,
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default CategoryLegal;
