import { TabsCustom } from "components/TabsCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { REPORT_COMPLETED_FILE } from "routes/route.constant";
import ReportCompletedFileArea from "./components/ReportsCompleteFile";
import ReportCompletedFileDetail from "./components/ReportsCompleteFileTime";
import ReportCompletedFileDetailTDV from "./components/ReportsCompleteFileDetail";
import "./style.scss"

const ReportsCompletedFile = () => {
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
        label: "Báo cáo HS hoàn thành",
        path: "/reports/completed-files",
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [REPORT_COMPLETED_FILE]);
  return (
    <Fragment>
      <div className="page-container">
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          className={"tab-assets"}
          items={[
            {
              label: "Báo cáo hồ sơ hoàn thành",
              key: "1",
              forceRender: true,
              children: <ReportCompletedFileArea />,
            },
            {
              label: "Báo cáo hồ sơ hoàn thành theo thời gian",
              key: "2",
              forceRender: true,
              children: <ReportCompletedFileDetail />,
            },
            {
              label: "Báo cáo chi tiết hồ sơ hoàn thành",
              key: "3",
              forceRender: true,
              children: <ReportCompletedFileDetailTDV />,
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default ReportsCompletedFile;
