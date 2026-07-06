import { Row } from "antd";
import AccountInfo from "./component/AccountInfo";
import ChangePassword from "./component/ChangePassword";
import DayOff from './component/DayOff'
import "./style.scss";
import { TabsCustom } from "components/TabsCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ButtonCustom from "components/ButtonCustom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { ACCOUNT_DETAIL } from "routes/route.constant";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useLocation } from "react-router-dom";
const AppraisalFileDetail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { tab }: { tab: string } = location.state || { tab: "detail" };
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục người dùng",
        path: ACCOUNT_DETAIL,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [ACCOUNT_DETAIL]);
  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <Row justify={"space-between"} style={{ paddingBottom: "8px" }}>
          <CardTitleCustomUpdate title="Thông tin tài khoản" />
          {/* <ButtonCustom label="Lưu" type="primary" size="small" /> */}
        </Row>
        <TabsCustom
          className="accountDetail-tabs"
          defaultActiveKey={tab}
          items={[
            {
              label: "Thông tin tài khoản",
              key: "detail",
              children: <AccountInfo />,
            },
            {
              label: "Ngày nghỉ phép",
              key: "day-off",
              children: <DayOff />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AppraisalFileDetail;
