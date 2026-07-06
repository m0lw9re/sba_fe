import React, { useEffect, useState } from "react";
import {
  Modal,
  Row,
  Typography,
  Button,
  Space,
  Form,
  Divider,
  message,
} from "antd";
import { ReactComponent as Close } from "assets/images/svg/Close.svg";
import { ReactComponent as MoreTool } from "assets/images/svg/MoreTool.svg";
import "pages/Accounts/subcomponents/CreateAccountModal/style.scss";
import { CreateAccountData, Staff } from "constants/types/common.type";
import { accountApi } from "apis/account";
import { roleApi } from "apis/role";
import { useForm } from "antd/es/form/Form";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { useAccounts } from "utils/request";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
};

type Role = {
  roleId: string;
  roleName: string;
  departmentId: string;
  departmentName: string;
  description: string;
  dateCreate: Date;
  dateModify: Date;
  status: 1 | 0;
  permissionGroupDtos: string | null;
};

const { INPUT, SELECT } = TYPE_FIELD;
const CreateAccountModal: React.FC<Props> = ({ isOpenModal, closeModal }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = useForm();
  const handleChangeCreateAccount = (basicData: CreateAccountData) => {
    formCreateAccount.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await roleApi.getAll();
      const staffRes = await accountApi.search({
        limit: 100,
        page: 1,
      });
      setStaffs(staffRes.data.data);
      setRoles(response.data.data);
      setIsLoading(false);
    } catch (error) {
      message.error("Lỗi lấy thông tin quyền");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const initialFormData: CreateAccountData = {
    username: "",
    password: "",
    staffId: "",
    roleId: "",
    status: 0,
  };

  const formCreateAccount = useFormik({
    initialValues: initialFormData,
    // validationSchema: createValuationProfileSchema,
    onSubmit: async (data: CreateAccountData) => {
      try {
        const response = await accountApi.create(data);
        if (response.data.code === 200) {
          message.success(response.data.message);
          form.resetFields();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo tài khoản không thành công");
      }
    },
  });
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tên tài khoản",
      placeholder: "Nhập tên tài khoản",
      type: INPUT,
      span: 8,
      value: formCreateAccount.values.username,
      onChange: (e: any) =>
        handleChangeCreateAccount({ username: e.target.value }),
    },
    {
      key: 2,
      label: "Mật khẩu",
      placeholder: "Nhập mật khẩu",
      type: INPUT,
      span: 8,
      value: formCreateAccount.values.password,
      onChange: (e: any) =>
        handleChangeCreateAccount({ password: e.target.value }),
    },
    {
      key: 3,
      label: "Cán bộ sử dụng",
      type: SELECT,
      placeholder: "Chọn cán bộ sử dụng",
      span: 8,
      value: formCreateAccount.values.staffId,
      options: [
        ...staffs.map((item: any) => {
          return {
            label: item.staffName,
            value: item.staffId,
          };
        }),
        {
          label: "Chọn cán bộ sử dụng",
          value: "",
        },
      ],
      onChange: (value: string) =>
        handleChangeCreateAccount({ staffId: value }),
    },
    {
      key: 4,
      label: "Nhóm quyền",
      type: SELECT,
      span: 8,
      placeholder: "Chọn nhóm quyền",
      value: formCreateAccount.values.roleId,
      options: [
        ...roles.map((item) => {
          return {
            label: item.roleName,
            value: item.roleId,
          };
        }),
        {
          label: "Chọn nhóm quyền",
          value: "",
        },
      ],
      onChange: (value: string) => handleChangeCreateAccount({ roleId: value }),
    },
    {
      key: 5,
      label: "Trạng thái",
      type: SELECT,
      placeholder: "Chọn trạng thái",
      span: 8,
      value: formCreateAccount.values.status,
      options: [
        {
          label: "Tạm dừng",
          value: 0,
        },
        {
          label: "Hoạt động",
          value: 1,
        },
      ],
      onChange: (value: number) => handleChangeCreateAccount({ status: value }),
    },
  ];
  return (
    <>
      <Modal
        closable={false}
        onCancel={closeModal}
        open={isOpenModal}
        className="modal-createAccount"
        footer={false}
        title={
          <>
            <Row justify={"space-between"}>
              <Typography className="card-title">Tạo tài khoản</Typography>
              <Space>
                <Button icon={<MoreTool />} />
                <Button icon={<Close />} onClick={closeModal} />
              </Space>
            </Row>
          </>
        }
      >
        <Divider />
        <Form
          size="small"
          layout="vertical"
          form={form}
          onFinish={formCreateAccount.handleSubmit}
        >
          <Row gutter={24}>
            <InputFields data={inputFields} />
          </Row>
          <Divider />
          <Row justify={"end"}>
            <Space>
              <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
              <ButtonCustom
                htmlType="submit"
                label="Tạo tài khoản"
                bgColor="rgb(0, 72, 211)"
                type="primary"
              />
            </Space>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateAccountModal;
