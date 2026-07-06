import { TabsCustom } from "components/TabsCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { REPORT_KPI_DETAILS } from "routes/route.constant";
import ReportKPISInWeek from "./components/ReportsDetailKPIsInWeek";
import ReportKPISInMonth from "./components/ReportsDetailKPIsInMonth";
import ReportChartKPITable from "pages/Reports/ReportsKPIS/components/TableReportAllKPI";

const ReportsKPIDetails = () => {
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
        label: "Báo cáo KPIS",
        path: "/reports/kpis",
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [REPORT_KPI_DETAILS]);
  return (
    <div style={{ width: "100%" }}>
      <Fragment>
        <div className="page-container">
          <TabsCustom
            activeKey={tabIndex}
            onChange={(value: string) => setTabIndex(value)}
            className={"tab-assets"}
            items={[
              {
                label: "Báo cáo tổng hợp KPIS",
                key: "1",
                forceRender: true,
                children: <ReportChartKPITable />,
              },
              {
                label: "Báo cáo chi tiết KPIs theo tuần",
                key: "2",
                forceRender: true,
                children: <ReportKPISInWeek />,
              },
              {
                label: "Báo cáo chi tiết KPIs theo tháng",
                key: "3",
                forceRender: true,
                children: <ReportKPISInMonth />,
              },
            ]}
          />
        </div>
      </Fragment>
    </div>
  );
};

export default ReportsKPIDetails;