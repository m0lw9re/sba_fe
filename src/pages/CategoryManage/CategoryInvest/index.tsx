import { Space, Typography } from "antd";
import { TabsCustom } from "components/TabsCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CATEGORY_INVEST } from "routes/route.constant";
import { useSearchParams } from "react-router-dom";
import Invest from "./components/Invest";
import Construction from "./components/Construction";
import "./style.scss";

const CategoryInvest = () => {
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
        label: "Khung giá xuất vốn đầu tư",
        path: CATEGORY_INVEST,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_INVEST]);

  return (
    <Fragment>
      <div className="page-container">
        <div className="header-wrapper">
          <Space className="title-wrapper" style={{ display: "flex" }}>
            <Typography className="title">
              Danh sách khung giá xuất vốn đầu tư, CTXD
            </Typography>
          </Space>
        </div>
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          className={"tab-assets"}
          items={[
            {
              label: "Khung giá xuất vốn đầu tư",
              key: "1",
              children: <Invest />,
            },
            {
              label: "Công trình xây dựng",
              key: "2",
              children: <Construction />,
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default CategoryInvest;
