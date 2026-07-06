import { useEffect, useState} from "react";
import "./style.scss";
import { Row } from "antd";
import RoleSettingCard from "./subcomponents/RoleSettingCard";
import UserInfoCard from "./subcomponents/UserInfoCard";
import RoleSettingCardEdit from "./subcomponents/RoleSettingCardEdit";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {
  GetDetailRoleParam,
  GetStaffListByRoleId,
} from "constants/types/role.type";

import {getDetailRole, getListStaff} from "./store/roleDetailSlice";

import {setSelectedBeadCrumb} from "pages/App/store/appSlice";
import {ROLE, ROLE_DETAIL} from "routes/route.constant";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";

// import {RootState} from "configs/configureStore";

// type BreadcrumbItem = {
//   key: number;
//   href: string;
//   title: ReactNode;
// };

const RoleDetail = () => {
  const dispatch = useDispatch();

  const {id: roleId} = useParams();

  useEffect(() => {
    const param: GetDetailRoleParam = {
      id: roleId,
    };
    dispatch(getDetailRole(param));
    const param_2: GetStaffListByRoleId = {
      id: roleId,
      page: 1,
      limit: 10,
    };
    dispatch(getListStaff(param_2));
  }, []);

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh sách nhóm quyền",
        path: ROLE,
      },
      {
        label: "Chi tiết nhóm quyền",
        path: ROLE_DETAIL.replace(":id", String(roleId)),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [roleId, ROLE, ROLE]);

  const [isOpenEditRole, setIsOpenEditRole] = useState<boolean>(false);
  const changeOpenEditRole = () => {
    setIsOpenEditRole(!isOpenEditRole);
  };

  return (
    <div className="page-container">
      <Row justify={"space-between"} style={{paddingBottom: "8px"}}>
        <CardTitleCustomUpdate title="Chi tiết quyền" />
        <ButtonCustom label="Lưu" type="primary" size="small" />
      </Row>
      <Row justify={"space-between"} gutter={[8, 4]}>
        <UserInfoCard />
        <div className="space-roleDetail">
          {isOpenEditRole ? (
            <RoleSettingCardEdit changeOpenEdit={changeOpenEditRole} />
          ) : (
            <RoleSettingCard changeOpenEdit={changeOpenEditRole} />
          )}
        </div>
      </Row>
    </div>
  );
};

export default RoleDetail;
