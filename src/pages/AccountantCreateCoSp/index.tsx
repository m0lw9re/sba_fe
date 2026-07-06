import { TabsCustom } from "components/TabsCustom";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ACCOUNTANT_CREATE_CO_SP } from "routes/route.constant";
import "./style.scss";
import PhieuThuInfo from "./components/PhieuThu";
import PhieuChiInfo from "./components/PhieuChi";

const AccountantCreateCoSp = () => {
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
        label: "Lập phiếu thu - chi",
        path: ACCOUNTANT_CREATE_CO_SP,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ACCOUNTANT_CREATE_CO_SP]);

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
              children: <PhieuThuInfo />,
            },
            {
              label: "Phiếu chi",
              key: "2",
              forceRender: true,
              children: <PhieuChiInfo />,
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default AccountantCreateCoSp;
