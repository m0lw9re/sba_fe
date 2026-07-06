import { TabsCustom } from "components/TabsCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { REPORT_QUANTITY } from "routes/route.constant";
import ChartQuantityFileArisingInMonth from "./components/ChartQuantityFileArisingInMonth";
import QuantityFileArisingInMonth from "./components/ReportsQuantityFileArisingInMonth";
import QuantityCancelFileArisingInMonth from "./components/ReportsQuantityCancelFileArisingInMonth";

const ReportsQuantity = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState<string>(
    searchParams.get("tab") || "1"
  );
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Báo cáo thống kê",
        path: "",
      },
      {
        label: "Báo cáo số lượng HS phát sinh tháng",
        path: "/reports/quantity",
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [REPORT_QUANTITY]);
  return (
    <Fragment>
      <div className="page-container">
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          className={"tab-assets"}
          items={[
            {
              label: "Biểu đồ báo cáo số lượng HS phát sinh",
              key: "1",
              forceRender: true,
              children: <ChartQuantityFileArisingInMonth />,
            },
            {
              label: "Báo cáo số lượng hồ sơ phát sinh trong tháng",
              key: "2",
              forceRender: true,
              children: <QuantityFileArisingInMonth />,
            },
            {
              label: "Báo cáo số lượng hồ sơ huỷ phát sinh trong tháng",
              key: "3",
              forceRender: true,
              children: <QuantityCancelFileArisingInMonth />,
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default ReportsQuantity;
