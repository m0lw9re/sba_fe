import { Space, message } from "antd";
import "./style.scss";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import RoleCommonCard from "./subcomponents/RoleCommonCard";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { roleApi } from "apis/role";

const RoleAccountSetting = () => {
  const roleDetailState = useSelector(
    (state: RootState) => state.roleDetailSlice
  );

  const formikRoleSetiing = useFormik({
    initialValues: roleDetailState.permissionGroupDtos,
    onSubmit: (values) => {
      const dataSubmit: any = [];
      values.map((items) => {
        items.permissions.map((item) => {
          dataSubmit.push({ ...item });
        });
      });
      try {
        roleApi.updateStatus("1", dataSubmit);
        message.success("Cập nhật thành công!");
      } catch {
        message.error("Cập nhật thất bại!");
      }
    },
  });

  const changeStatusSwitch = (permissionId?: string) => {
    console.log(permissionId);
    console.log(formikRoleSetiing.values);
  };

  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"small"}
      className="commonInfo-wrapper"
    >
      {formikRoleSetiing?.values?.map((item: any, index) => {
        return (
          <RoleCommonCard
            permissionGroup={item}
            key={index}
            changeStatusPermission={changeStatusSwitch}
          />
        );
      })}
    </Space>
  );
};

export default RoleAccountSetting;
