import { TabsCustom } from "components/TabsCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ACCOUNTANT_APPROVED } from "routes/route.constant";
import "./style.scss";
import AccountantApprovedInfo from "./AccountantApprovedThu";
import AccountantApprovedChiInfo from "./AccountantApprovedChi";

const AccountantApproved = () => {
  const [searchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState<string>(
    searchParams.get("tab") || "1"
  );

  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Phê duyệt phiếu thu - chi",
        path: ACCOUNTANT_APPROVED,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ACCOUNTANT_APPROVED]);

  return (
    <Fragment>
      <div className="page-container">
        <TabsCustom
          activeKey={tabIndex}
          onChange={(value: string) => setTabIndex(value)}
          className={"tab-assets"}
          items={[
            {
              label: "Phiếu thu",
              key: "1",
              forceRender: true,
              children: <AccountantApprovedInfo />,
            },
            {
              label: "Phiếu chi",
              key: "2",
              forceRender: true,
              children: <AccountantApprovedChiInfo />,
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default AccountantApproved;
