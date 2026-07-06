/* eslint-disable react-hooks/exhaustive-deps */
import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, message, Modal, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import React, { useEffect } from "react";
import "./style.scss";
import { InputFiledParams } from "constants/types/Form_Field_type";
import * as Yup from "yup";
import { useFormik } from "formik";
import { TYPE_FIELD } from "constant/enums";
import ButtonCustom from "components/ButtonCustom";
import InputFields from "components/InputFields";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import { approvalConfigsApi } from "apis/approvalConfigs";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mutate?: any;
};

const formSchema = Yup.object().shape({
  valueFrom: Yup.number().nullable().required("Không được để trống"),
  valueTo: Yup.number().nullable().required("Không được để trống"),
});

const initialFormData: any = {
  approvalConfigDtos: [
    {
      approvalConfigId: null,
      assetValueId: null,
      companyBranchId: 1,
      level1: null,
      level2: null,
      level3: null,
      level4: null,
      level5: null,
      level6: null,
    },
    {
      approvalConfigId: null,
      assetValueId: null,
      companyBranchId: 2,
      level1: null,
      level2: null,
      level3: null,
      level4: null,
      level5: null,
      level6: null,
    },
  ],
  assetValueId: null,
  valueFrom: null,
  valueFromTxt: "",
  valueTo: null,
  valueToTxt: "",
};

const { INPUT_NUMBER, SELECT } = TYPE_FIELD;

const ModalCreateApprovalConfig: React.FC<Props> = ({
  isOpen,
  onClose,
  mutate,
}) => {
  const { listRoleOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const formCreate = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: false,
    onSubmit: async (data: any) => {
      try {
        const response = await approvalConfigsApi.createApprovalConfig({
          ...data,
        });
        console.log(response);
        if (response?.data?.code === 200) {
          message.success("Thêm cấu hình duyệt thành công");
          mutate();
          handleCloseModal();
        } else {
          message.error(
            response?.data?.message || "Thêm cấu hình duyệt không thành công"
          );
        }
      } catch (error) {
        message.error(
          "Lỗi không xác định! Chức năng cấu hình duyệt không hoạt động"
        );
      }
    },
  });

  const handleChangeData = (basicData: any) => {
    formCreate.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

  const handleChangeLevelData = (
    companyBranchId: number,
    val: string[],
    fieldName: string
  ) => {
    let item = { ...formCreate.values };

    for (let el of item.approvalConfigDtos) {
      if (el.companyBranchId === companyBranchId) {
        el[fieldName] = val ? [...val] : val;
        break;
      }
    }

    console.log(item);

    formCreate.setValues({ ...item });
  };

  const handleCloseModal = () => {
    formCreate.resetForm();
    onClose();
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 8, sm: 8, md: 8, lg: 6, xl: 6 };
  const wrapperCol = { xs: 16, sm: 16, md: 16, lg: 18, xl: 18 };

  const inputFields1: InputFiledParams[] = [
    {
      key: 1,
      label: "Giá trị từ",
      type: INPUT_NUMBER,
      require: true,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: formCreate.values.valueFrom,
      error: formCreate.errors.valueFrom,
      touched: formCreate.touched.valueFrom,
      allowClear: true,
      onChange: (value: number) => handleChangeData({ valueFrom: value }),
      currencable: true,
    },
  ];
  const inputFields2: InputFiledParams[] = [
    {
      key: 2,
      label: "Giá trị đến",
      type: INPUT_NUMBER,
      require: true,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: formCreate.values.valueTo,
      error: formCreate.errors.valueTo,
      touched: formCreate.touched.valueTo,
      allowClear: true,
      onChange: (value: number) => handleChangeData({ valueTo: value }),
      currencable: true,
    },
  ];

  const inputFieldsLeft: InputFiledParams[] = [
    {
      key: 3,
      label: "Duyệt cấp 1",
      placeholder: "Duyệt cấp 1",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[0].level1 || [],
      // error: formCreate.errors.approvalConfigDtos.level1,
      // touched: formCreate.touched.approvalConfigDtos?.level1,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      onChange: (value: string[]) => handleChangeLevelData(1, value, "level1"),
    },
    {
      key: 4,
      label: "Duyệt cấp 2",
      placeholder: "Duyệt cấp 2",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[0].level2 || [],
      // error: formCreate.errors.type,
      // touched: formCreate.touched.type,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      // require: true,
      onChange: (value: string[]) => handleChangeLevelData(1, value, "level2"),
    },
    {
      key: 5,
      label: "Duyệt cấp 3",
      placeholder: "Duyệt cấp 3",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[0].level3 || [],
      // error: formCreate.errors.type,
      // touched: formCreate.touched.type,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      // require: true,
      onChange: (value: string[]) => handleChangeLevelData(1, value, "level3"),
    },
    {
      key: 6,
      label: "Duyệt cấp 4",
      placeholder: "Duyệt cấp 4",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[0].level4 || [],
      // error: formCreate.errors.type,
      // touched: formCreate.touched.type,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      // require: true,
      onChange: (value: string[]) => handleChangeLevelData(1, value, "level6"),
    },
    {
      key: 7,
      label: "Duyệt cấp 5",
      placeholder: "Duyệt cấp 5",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[0].level5 || [],
      // error: formCreate.errors.type,
      // touched: formCreate.touched.type,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      // require: true,
      onChange: (value: string[]) => handleChangeLevelData(1, value, "level5"),
    },
    {
      key: 8,
      label: "Duyệt cấp 6",
      placeholder: "Duyệt cấp 6",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[0].level6 || [],
      // error: formCreate.errors.type,
      // touched: formCreate.touched.type,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      // require: true,
      onChange: (value: string[]) => handleChangeLevelData(1, value, "level6"),
    },
  ];

  const inputFieldsRight: InputFiledParams[] = [
    {
      key: 3,
      label: "Duyệt cấp 1",
      placeholder: "Duyệt cấp 1",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[1].level1 || [],
      // error: formCreate.errors.approvalConfigDtos.level1,
      // touched: formCreate.touched.approvalConfigDtos?.level1,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      onChange: (value: string[]) => handleChangeLevelData(2, value, "level1"),
    },
    {
      key: 4,
      label: "Duyệt cấp 2",
      placeholder: "Duyệt cấp 2",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[1].level2 || [],
      // error: formCreate.errors.type,
      // touched: formCreate.touched.type,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      // require: true,
      onChange: (value: string[]) => handleChangeLevelData(2, value, "level2"),
    },
    {
      key: 5,
      label: "Duyệt cấp 3",
      placeholder: "Duyệt cấp 3",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[1].level3 || [],
      // error: formCreate.errors.type,
      // touched: formCreate.touched.type,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      // require: true,
      onChange: (value: string[]) => handleChangeLevelData(2, value, "level3"),
    },
    {
      key: 6,
      label: "Duyệt cấp 4",
      placeholder: "Duyệt cấp 4",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[1].level4 || [],
      // error: formCreate.errors.type,
      // touched: formCreate.touched.type,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      // require: true,
      onChange: (value: string[]) => handleChangeLevelData(2, value, "level6"),
    },
    {
      key: 7,
      label: "Duyệt cấp 5",
      placeholder: "Duyệt cấp 5",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[1].level5 || [],
      // error: formCreate.errors.type,
      // touched: formCreate.touched.type,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      // require: true,
      onChange: (value: string[]) => handleChangeLevelData(2, value, "level5"),
    },
    {
      key: 8,
      label: "Duyệt cấp 6",
      placeholder: "Duyệt cấp 6",
      type: SELECT,
      selectMultiple: true,
      options: listRoleOptions,
      value: formCreate.values.approvalConfigDtos[1].level6 || [],
      // error: formCreate.errors.type,
      // touched: formCreate.touched.type,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      // require: true,
      onChange: (value: string[]) => handleChangeLevelData(2, value, "level6"),
    },
  ];

  useEffect(() => {
    if (isOpen) {
      formCreate.setValues({ ...initialFormData });
    }
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      closable={false}
      footer={null}
      onCancel={onClose}
      className="modal-kpi-bonus"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreate-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title={"Thêm cấu hình duyệt"} />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={onClose}
            size="small"
          />
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form labelAlign="left" labelWrap size="small">
              <InputFields data={inputFields1} />
            </Form>
          </Col>
          <Col span={12}>
            <Form labelAlign="left" labelWrap size="small">
              <InputFields data={inputFields2} />
            </Form>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form labelAlign="left" labelWrap size="small">
              <Row gutter={[24, 8]}>
                <Divider plain style={{ margin: "0" }}>
                  Trụ sở SBA (SG)
                </Divider>
                <InputFields data={inputFieldsLeft} />
              </Row>
            </Form>
          </Col>
          <Col span={12}>
            <Form labelAlign="left" labelWrap size="small">
              <Row gutter={[24, 8]}>
                <Divider plain style={{ margin: "0" }}>
                  CN Hà nội (HN)
                </Divider>
                <InputFields data={inputFieldsRight} />
              </Row>
            </Form>
          </Col>
        </Row>
        <Row
          justify={"end"}
          align={"middle"}
          style={{
            padding: "0.5rem",
          }}
        >
          <Space align="end">
            <ButtonCustom
              label="Hủy bỏ"
              onClick={() => {
                formCreate.resetForm();
                onClose();
              }}
            />
            <ButtonCustom
              label="Thêm mới"
              type="primary"
              // htmlType="submit"
              bgColor="rgba(40, 98, 175, 1)"
              onClick={formCreate.submitForm}
            />
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};

export default ModalCreateApprovalConfig;
