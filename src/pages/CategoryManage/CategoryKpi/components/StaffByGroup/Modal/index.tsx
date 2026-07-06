import { CloseOutlined } from "@ant-design/icons";
import { Button, message, Modal, Row, Space } from "antd";
import { Form } from "antd";
import { useForm } from "antd/es/form/Form";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { DATE_TIME_FORMAT } from "constant/enums";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { useKpiGroup, useDepartment } from "utils/request";
import { KPIsByGroup, StaffByGroup } from "constant/types";
import { Staff } from "constants/types/common.type";
import { accountApi } from "apis/account";
import { groupKpis } from "apis/groupKpis";
import { categoryApi } from "apis/category";
import { KPIType } from "constant/types/kpi";
const { INPUT, RANGE_PICKER, SELECT } = TYPE_FIELD;
const { day } = DATE_TIME_FORMAT;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  modalType: "add" | "edit" | null;
  editItem?: StaffByGroup | null;
  onSuccess: () => void;
  setLoading: (value: boolean) => void;
};

const ModalAddStaffKPI: React.FC<Props> = ({
  isOpen,
  onClose,
  modalType,
  editItem,
  onSuccess,
  setLoading,
}) => {
  const [form] = useForm();
  const handleChangeForm = (basicData: any) => {
    formControl.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

  const [groupKPI, setGroupKPI] = useState<KPIsByGroup[]>([]);

  const getGroupKPI = async () => {
    try {
      const res = await categoryApi.getGroupKPI({
        page: 1,
        limit: 1000,
      });
      setGroupKPI(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGroupKPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialFormData: StaffByGroup = {
    dateFrom: "",
    dateTo: "",
    staffNumber: "",
    staffId: "",
    staffName: "",
    kpiGroupId: "",
    kpiGroupName: "",
    departmentId: "",
    departmentName: "",
  };

  const [staffs, setStaffs] = useState<Staff[]>([]);

  const getStaffs = async () => {
    try {
      const res = await accountApi.search({
        page: 1,
        limit: 1000,
      });
      setStaffs(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStaffs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formControl = useFormik({
    initialValues: initialFormData,
    onSubmit: async (data: StaffByGroup) => {
      data.dateFrom = dayjs(data.dateFrom).format();
      data.dateTo = dayjs(data.dateTo).format();
      setLoading(true);
      if (modalType === "add") {
        try {
          const res = await groupKpis.createEmployee(data);
          if (res.status === 200) {
            message.success(res.data.message);
            onSuccess();
            form.resetFields();
          } else {
            message.error("Error");
          }
        } catch {}
      } else {
        try {
          const res = await groupKpis.updateEmployee(data);
          if (res.status === 200) {
            message.success(res.data.message);
            onSuccess();
            form.resetFields();
          } else {
            message.error("Error");
          }
        } catch (error: any) {
          message.error(error.message);
        }
      }
      setLoading(false);
    },
  });

  const css = { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 15 };
  const css1 = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol1 = { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 };
  const wrapperCol1 = { xs: 20, sm: 20, md: 20, lg: 20, xl: 20 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tên nhân viên",
      type: SELECT,
      value: formControl.values.staffId,
      onChange: (value: any) => {
        const selectedStaff = staffs.find((staff) => staff.staffId === value);
        handleChangeForm({
          staffId: value,
          staffNumber: selectedStaff ? selectedStaff.staffNumber : "",
          staffName: selectedStaff ? selectedStaff.staffName : "",
          departmentName: selectedStaff ? selectedStaff.departmentName : "",
          departmentId: selectedStaff ? selectedStaff.departmentId : "",
        });
      },
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      error: formControl.errors.staffId,
      options: staffs
        ? staffs.map((item: Staff) => ({
            label: item.staffName,
            value: item.staffId,
          }))
        : [],
    },
    {
      key: 2,
      label: "Mã nhân viên",
      type: INPUT,
      value: formControl.values.staffNumber,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      disable: true,
      size: "small",
    },
    {
      key: 3,
      label: "Phòng ban",
      type: INPUT,
      value: formControl.values.departmentName,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      disable: true,
      size: "small",
    },
    {
      key: 4,
      label: "Nhóm",
      type: SELECT,
      value: formControl.values.kpiGroupId,
      onChange: (value: any) =>
        handleChangeForm({
          kpiGroupId: value,
        }),
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css,
      require: true,
      error: formControl.errors.kpiGroupId,
      size: "small",
      options: groupKPI
        ? groupKPI?.map((item: KPIType) => ({
            label: item.kpiGroupName,
            value: item.kpiGroupId,
          }))
        : [],
    },
    {
      key: 5,
      label: "Hiệu lực",
      type: RANGE_PICKER,
      value: [
        formControl.values.dateFrom
          ? dayjs(formControl.values.dateFrom)
          : undefined,
        formControl.values.dateTo
          ? dayjs(formControl.values.dateTo)
          : undefined,
      ],
      allowClear: false,
      formatDatetime: day,
      onChange: (value: any) => {
        const [dateFrom, dateTo] = value;
        handleChangeForm({
          dateFrom: dateTo ? dateFrom : undefined,
          dateTo: dateTo ? dateTo : undefined,
        });
      },
      labelCol: labelCol1,
      wrapperCol: wrapperCol1,
      css: css1,
      require: true,
      error: formControl.errors.dateFrom,
      size: "small",
    },
  ];
  // if is edit mode then get and set value for form
  useEffect(() => {
    formControl.resetForm();
    if (modalType === "edit" && editItem) {
      formControl.setValues((state) => ({
        ...state,
        ...editItem,
      }));
    }
  }, [editItem?.staffId, modalType]);

  return (
    <>
      <Modal
        forceRender={false}
        destroyOnClose
        open={isOpen}
        closable={false}
        footer={null}
        onCancel={onClose}
        onOk={onSuccess}
        className="modal-staff"
        style={{ display: "flex", justifyContent: "center" }}
        title={
          <Space direction="vertical" align="center">
            <Row
              justify={"space-between"}
              align={"middle"}
              className="modal-staff-header"
            >
              <CardTitleCustomUpdate
                title={`${modalType === "add" ? "Thêm" : "Sửa"} nhân viên`}
              />
              <Button
                shape="circle"
                icon={<CloseOutlined />}
                onClick={onClose}
                size="small"
              />
            </Row>
            <Form
              size="large"
              labelWrap
              layout="horizontal"
              form={form}
              onFinish={formControl.handleSubmit}
              className="modal-kpi-form"
              labelAlign="left"
              style={{
                padding: "0 4px",
              }}
            >
              <Row style={{ width: "100%" }}>
                <InputFields data={inputFields} />
              </Row>
              <Row
                justify={"end"}
                style={{ marginTop: "8px", width: "100%", columnGap: "12px" }}
              >
                <ButtonCustom label="Hủy bỏ" onClick={onClose} />
                <ButtonCustom
                  htmlType="submit"
                  label="Lưu lại"
                  bgColor="#2862AF"
                  type="primary"
                />
              </Row>
            </Form>
          </Space>
        }
      ></Modal>
    </>
  );
};

export default ModalAddStaffKPI;
