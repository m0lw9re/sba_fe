import { TabsCustom } from "components/TabsCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { REPORT_LATE } from "routes/route.constant";
import ReportWeek from "./components/ReportsWeek";
import ReportDetailWeek from "./components/ReportsDetailWeek";
import ReportTotalLate from "./components/ReportsTotalLate";
import ReportDetailTotalLate from "./components/ReportsDetailTotalLate";

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
        label: "Báo cáo hồ sơ trễ tiến độ",
        path: "/reports/late",
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [REPORT_LATE]);
  return (
    <Fragment>
      <div className="page-container">
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          className={"tab-assets"}
          items={[
            {
              label: "Báo cáo tiến độ tuần",
              key: "1",
              forceRender: true,
              children: <ReportWeek />,
            },
            {
              label: "Báo cáo chi tiết tuần",
              key: "2",
              forceRender: true,
              children: <ReportDetailWeek />,
            },
            {
              label: "Báo cáo tổng hợp HS trễ tiến độ",
              key: "3",
              forceRender: true,
              children: <ReportTotalLate />,
            },
            {
              label: "Báo cáo chi tiết HS trễ tiến độ",
              key: "4",
              forceRender: true,
              children: <ReportDetailTotalLate />,
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default ReportsQuantity;
