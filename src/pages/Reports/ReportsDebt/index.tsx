import { TabsCustom } from "components/TabsCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { REPORT_DEBT } from "routes/route.constant";
import ReportFollowDebt from "./components/FollowReportsDebt";
import TotalReportDebt from "./components/TotalReportsDebt";
import ReportDebtComparison from "./components/DebtComparison";
import ReportFollowDebtByStaff from "./components/FollowDebtByStaff";
import ReportDebtMonthYear from "./components/ReportsDebtMonth-Year";
import ReportTotalDebt from "pages/Reports/ReportsDebt/components/ReportsTotalDebt";

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
        label: "Báo cáo công nợ",
        path: "/reports/cong-no",
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [REPORT_DEBT]);

  return (
    <Fragment>
      <div className="page-container">
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          className={"tab-assets"}
          items={[
            {
              label: "Theo dõi chi tiết công nợ",
              key: "1",
              forceRender: true,
              children: <ReportFollowDebt />,
            },
            {
              label: "Đối chiếu công nợ tháng",
              key: "2",
              forceRender: true,
              children: <ReportDebtComparison />,
            },
            {
              label: "Theo dõi công nợ theo ĐGV",
              key: "3",
              forceRender: true,
              children: <ReportFollowDebtByStaff />,
            },
            {
              label: "Tổng hợp CN theo CN - KV",
              key: "4",
              forceRender: true,
              children: <TotalReportDebt />,
            },
            {
              label: "Báo cáo tổng công nợ",
              key: "5",
              forceRender: true,
              children: <ReportTotalDebt />,
            },
            {
              label: "Báo cáo công nợ tháng",
              key: "6",
              forceRender: true,
              children: <ReportDebtMonthYear />,
            }
          ]}
        />
      </div>
    </Fragment>
  );
};

export default ReportsQuantity;