import React from "react";
import { Button, Card, Divider, Row, Space, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./style.scss";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import RoleCommonCard from "./subcomponents/RoleCommonCard";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { roleApi } from "apis/role";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ButtonCustom from "components/ButtonCustom";

type Props = {
  changeOpenEdit: () => void;
};

const RoleSettingCardEdit: React.FC<Props> = ({ changeOpenEdit }) => {
  const roleDetailState = useSelector(
    (state: RootState) => state.roleDetailSlice
  );

  const { id: roleId } = useParams();

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
        roleApi.updateStatus(roleId, dataSubmit);
        message.success("Cập nhật thành công!");
      } catch {
        message.error("Cập nhật thất bại!");
      }
    },
  });

  const changeStatusSwitch = (permissionId?: string) => {
    const newValue: any = formikRoleSetiing.values.map((items) => {
      return {
        ...items,
        permissions: items.permissions.map((item) => {
          if (item.permissionId === permissionId) {
            if (item.status === 0) {
              return { ...item, status: 1 };
            } else return { ...item, status: 0 };
          } else return { ...item };
        }),
      };
    });
    formikRoleSetiing.setValues(newValue);
  };

  return (
    <Card
      loading={roleDetailState.isLoadingGetDetail}
      className="role-cardEddit-wrapper"
      style={{ padding: "8px" }}
      size="small"
    >
      <Row justify={"space-between"}>
        <CardTitleCustomUpdate title={"Phân quyền"} />
        <Space>
          <Button
            onClick={changeOpenEdit}
            size="small"
            className="btn-role-edit"
          >
            Ẩn
          </Button>
          <Button icon={<DownOutlined />} size="small" />
        </Space>
      </Row>
      <Divider />
      <Space direction="vertical" size="small">
        {formikRoleSetiing?.values?.map((item: any, index) => {
          return (
            <RoleCommonCard
              permissionGroup={item}
              key={index}
              changeStatusPermission={changeStatusSwitch}
            />
          );
        })}
        <Row justify={"end"}>
          <Space>
            <ButtonCustom onClick={changeOpenEdit} size="small" label="Hủy" />
            <ButtonCustom
              type="primary"
              onClick={formikRoleSetiing.submitForm}
              size="small"
              label="Lưu"
            />
          </Space>
        </Row>
      </Space>
    </Card>
  );
};

export default RoleSettingCardEdit;
