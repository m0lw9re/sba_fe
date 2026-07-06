import { Space } from "antd";
import { accountApi } from "apis/account";
import { CollapseCustom } from "components/CollapseCustom";
import {
  GetDetailRoleParam,
  GetStaffListByRoleId,
} from "constants/types/role.type";
import {
  getDetailRole,
  getListStaff,
} from "pages/RoleDetail/store/roleDetailSlice";
import { Fragment, memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUsernameFromToken } from "utils/common";
import CommonInfo from "./component/CommonInfo";
import "./style.scss";

const AccountInfo = () => {
  const [accountDetail, setAccountDetail] = useState(null);

  const dispatch = useDispatch();

  const handleGetDetail = async () => {
    try {
      const username: string | null = getUsernameFromToken();
      
      const res = await accountApi.getDetail({ username });
      setAccountDetail(res.data.body);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    const param: GetDetailRoleParam = {
      id: "1",
    };
    dispatch(getDetailRole(param));
    const param_2: GetStaffListByRoleId = {
      id: "1",
      page: 1,
      limit: 10,
    };
    dispatch(getListStaff(param_2));
  }, []);

  useEffect(() => {
    handleGetDetail();
  }, []);

  return (
    <Fragment>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <CollapseCustom
          itemList={[
            {
              label: "Thông tin chung",
              children:
                accountDetail !== null ? (
                  <CommonInfo accountDetail={accountDetail} />
                ) : null,
            },
            // {
            //   label: "Thông tin tài khoản",
            //   children:
            //     accountDetail !== null ? (
            //       <AccountInformation accountDetail={accountDetail} />
            //     ) : null,
            // },
            // {
            //   label: "Phân quyền",
            //   children: <RoleAccountSetting />,
            // },
          ]}
        />
      </Space>
    </Fragment>
  );
};

export default memo(AccountInfo);
