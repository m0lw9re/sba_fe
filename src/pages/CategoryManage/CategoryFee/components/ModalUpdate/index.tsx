import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Row,
  Button,
  Space,
  Form,
  message,
  DatePickerProps,
  Checkbox,
  Tag,
} from "antd";
import "./style.scss";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { updateFeeSchedule } from "constant/types";
import { AssetLevelTwoType } from "constant/types";
import { useAssetLevelTwoAll, useFeeScheduleParent } from "utils/request";
import { assetCommonApi } from "apis/assetCommon";
import { useDispatch } from "react-redux";
import { setAssetLevelThreeId } from "../../store/feeCreateSlice";
import dayjs from "dayjs";
import { disabledEndDate, disabledStartDate } from "utils/date";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { feeScheduleApi } from "apis/feeSchedule";
import { checkStatusLabel } from "../CategoryFeeTable/config";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  feeScheduleSelected?: updateFeeSchedule;
};

const { INPUT_NUMBER, SELECT, RADIO, DATE_PICKER, INPUT } = TYPE_FIELD;

const genSchemaValid = (feeLevel: number, parentId: number | null) => {
  if (!parentId)
    return Yup.object().shape({
      feeCode: Yup.string().nullable().required("Phải nhập biểu phí"),
      idFeeScheduleIdNew: Yup.number()
        .nullable()
        .required("Phải chọn loại biểu phí"),
      assetLevelTwo: Yup.string().nullable().required("Phải chọn loại hình TS"),
      effectiveFrom: Yup.string().nullable().required("Phải nhập trường này"),
      validUntil: Yup.string().nullable().required("Phải nhập trường này"),
    });
  else
    return Yup.object().shape({
      feeCode: Yup.string().nullable().required("Phải nhập biểu phí"),
      idFeeScheduleIdNew: Yup.number()
        .nullable()
        .required("Phải chọn loại biểu phí"),
      assetLevelTwo: Yup.string().nullable().required("Phải chọn loại hình TS"),
      assetValidationForm: Yup.number()
        .nullable()
        .required("Phải nhập giá trị này"),
      assetValidationUpTo: Yup.number()
        .nullable()
        .required("Phải nhập giá trị này"),
      minimumFee: Yup.number()
        .nullable()
        .required("Phải nhập mức phí tối thiểu"),
      maximumFeeHstdNew: Yup.number()
        .nullable()
        .required("Phải nhập giá trị này"),
      maximumFeeHstdReissue: Yup.number()
        .nullable()
        .required("Phải nhập giá trị này"),
      feeLevel: Yup.number().nullable().required("Phải chọn mức phí"),
      newHstdRegistrationFee:
        feeLevel === 0
          ? Yup.number().nullable().required("Phải nhập trường này")
          : Yup.number().nullable(),
      newHstdRegistrationFeePercent:
        feeLevel === 1
          ? Yup.number().nullable().required("Phải nhập trường này")
          : Yup.number().nullable(),
      registrationFeeHstdReissuance:
        feeLevel === 0
          ? Yup.number().nullable().required("Phải nhập trường này")
          : Yup.number().nullable(),
      registrationFeeHstdReissuancePercent:
        feeLevel === 1
          ? Yup.number().nullable().required("Phải nhập trường này")
          : Yup.number().nullable(),
      effectiveFrom: Yup.string().nullable().required("Phải nhập trường này"),
      validUntil: Yup.string().nullable().required("Phải nhập trường này"),
    });
};

const ModalUpdateFeeSchedule: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  feeScheduleSelected,
}) => {
  const dispatch = useDispatch();

  const assetLV2 = useAssetLevelTwoAll();

  const [feeLevel, setFeeLevel] = useState<number>(0);

  const { data: feeScheduleParentData } = useFeeScheduleParent();

  const [assetLevelThreeOption, setAssetLevelThreeOption] = useState<{
    AssetLevelThreeType: Array<any>;
  }>({ AssetLevelThreeType: [] });

  const formUpdate = useFormik({
    initialValues: {} as any | updateFeeSchedule,
    validationSchema: genSchemaValid(
      feeLevel,
      feeScheduleSelected?.parentId || null
    ),
    validateOnChange: true,
    onSubmit: async (data: updateFeeSchedule) => {
      try {
        const response = await feeScheduleApi.updateFeeSchedule(data);
        if (response.data.statusCode === 200) {
          message.success(response.data.message);
          formUpdate.resetForm();
          handleCloseModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Sửa biểu phí không thành công");
      }
    },
  });

  const handleChange = useCallback(
    (data: any) => {
      formUpdate.setValues({ ...formUpdate.values, ...data });
    },
    [formUpdate.values]
  );

  const handleCloseModal = useCallback(() => {
    closeModal();
    formUpdate.resetForm();
  }, [formUpdate]);

  useEffect(() => {
    if (feeScheduleSelected && isOpenModal) {
      formUpdate.setValues({
        ...feeScheduleSelected,
      });
      setFeeLevel(feeScheduleSelected?.feeLevel || 0);
    }
  }, [feeScheduleSelected, isOpenModal]);

  const getAssetLevelThree = async (levelTwoValue: any) => {
    if (levelTwoValue) {
      try {
        const res = await assetCommonApi.getAssetLevel3(levelTwoValue);
        setAssetLevelThreeOption((prevAssetsData) => ({
          ...prevAssetsData,
          AssetLevelThreeType: res.data?.map((item: any) => ({
            value: item.assetLevelThreeId.toString(),
            label: item.assetLevelThreeName,
          })),
        }));
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (formUpdate.values.assetLevelTwo) {
      getAssetLevelThree(formUpdate.values.assetLevelTwo);
    } else {
      setAssetLevelThreeOption((prevState: any) => ({
        ...prevState,
        AssetLevelThreeType: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formUpdate.values.assetLevelTwo]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const css2 = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Biểu phí",
      require: true,
      type: INPUT,
      value: formUpdate.values.feeCode,
      css: css2,
      disable: true,
    },
    {
      key: 2,
      label: "Loại biểu phí",
      require: true,
      type: SELECT,
      onChange: (value: number) =>
        handleChange({ idFeeScheduleIdNew: value, assetLevelThree: null }),
      options: [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
      ],
      css: css2,
      value: formUpdate.values.idFeeScheduleIdNew,
      error: formUpdate.errors.idFeeScheduleIdNew,
      touched: formUpdate.touched.idFeeScheduleIdNew,
      allowClear: true,
      disable: formUpdate.values.parentId ? true : false,
    },
    {
      key: 3,
      label: "Biểu phí cha",
      type: SELECT,
      options: feeScheduleParentData
        ? feeScheduleParentData?.data.map((el: any) => ({
            label: el.feeCode,
            value: el.id,
          }))
        : [],
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 6, xl: 6 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 18, xl: 18 },
      value: formUpdate.values.parentId,
      allowClear: true,
      disable: formUpdate.values.parentId ? false : true,
      onChange: (value: number) => handleChange({ parentId: value }),
    },
    {
      key: 4,
      label: "Loại hình tài sản",
      require: true,
      type: SELECT,
      onChange: (value: number) =>
        handleChange({ assetLevelTwo: value, assetLevelThree: null }),
      options:
        assetLV2?.data?.map((item: AssetLevelTwoType) => {
          return {
            label: item.assetLevelTwoName,
            value: item.assetLevelTwoId.toString(),
          };
        }) || [],
      css: css2,
      value: formUpdate.values.assetLevelTwo,
      error: formUpdate.errors.assetLevelTwo,
      touched: formUpdate.touched.assetLevelTwo,
      allowClear: true,
      disable: formUpdate.values.parentId ? true : false,
    },
    {
      key: 5,
      label: "Phân loại tài sản",
      type: SELECT,
      onChange: (value: number) => {
        dispatch(setAssetLevelThreeId(value));
        handleChange({ assetLevelThree: value });
      },
      options: assetLevelThreeOption.AssetLevelThreeType,
      css: css2,
      value: formUpdate.values.assetLevelThree,
      error: formUpdate.errors.assetLevelThree,
      touched: formUpdate.touched.assetLevelThree,
      allowClear: true,
      disable: formUpdate.values.parentId ? true : false,
    },
    {
      key: 6,
      label: "Giá trị TSTĐ từ (đồng)",
      type: INPUT_NUMBER,
      require: formUpdate.values.parentId ? true : false,
      css: css2,
      value: formUpdate.values.assetValidationForm,
      error: formUpdate.errors.assetValidationForm,
      touched: formUpdate.touched.assetValidationForm,
      allowClear: true,
      onChange: (value: number) => handleChange({ assetValidationForm: value }),
      currencable: true,
    },
    {
      key: 7,
      label: "Giá trị TSTĐ đến (đồng)",
      type: INPUT_NUMBER,
      require: formUpdate.values.parentId ? true : false,
      css: css2,
      value: formUpdate.values.assetValidationUpTo,
      error: formUpdate.errors.assetValidationUpTo,
      touched: formUpdate.touched.assetValidationUpTo,
      allowClear: true,
      onChange: (value: number) => handleChange({ assetValidationUpTo: value }),
      currencable: true,
    },
    {
      key: 8,
      label: "Mức phí tối thiểu (đồng)",
      type: INPUT_NUMBER,
      require: formUpdate.values.parentId ? true : false,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 6, xl: 6 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 18, xl: 18 },
      value: formUpdate.values.minimumFee,
      error: formUpdate.errors.minimumFee,
      touched: formUpdate.touched.minimumFee,
      allowClear: true,
      onChange: (value: number) => handleChange({ minimumFee: value }),
      currencable: true,
    },
    {
      key: 9,
      label: "Mức phí tối đa HSTĐ mới (đồng)",
      type: INPUT_NUMBER,
      require: formUpdate.values.parentId ? true : false,
      css: css2,
      value: formUpdate.values.maximumFeeHstdNew,
      error: formUpdate.errors.maximumFeeHstdNew,
      touched: formUpdate.touched.maximumFeeHstdNew,
      allowClear: true,
      onChange: (value: number) => handleChange({ maximumFeeHstdNew: value }),
      currencable: true,
    },
    {
      key: 10,
      label: "Mức phí tối đa HSTĐ tái cấp (đồng)",
      type: INPUT_NUMBER,
      require: formUpdate.values.parentId ? true : false,
      css: css2,
      value: formUpdate.values.maximumFeeHstdReissue,
      error: formUpdate.errors.maximumFeeHstdReissue,
      touched: formUpdate.touched.maximumFeeHstdReissue,
      allowClear: true,
      onChange: (value: number) =>
        handleChange({ maximumFeeHstdReissue: value }),
      currencable: true,
    },
    {
      key: 11,
      label: "Mức phí",
      type: RADIO,
      require: true,
      options: [
        {
          label: "Giá trị TSTĐ (đồng)",
          value: 0,
        },
        {
          label: "% giá trị TSTĐ",
          value: 1,
        },
      ],
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 6, xl: 6 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 18, xl: 18 },
      value: formUpdate.values.feeLevel,
      error: formUpdate.errors.feeLevel,
      touched: formUpdate.touched.feeLevel,
      allowClear: true,
      onChange: (e: any) => {
        const val = e.target.value;
        setFeeLevel(val);

        handleChange({
          feeLevel: val,
          newHstdRegistrationFee:
            val === 0 ? formUpdate.values.newHstdRegistrationFee : null,
          registrationFeeHstdReissuance:
            val === 0 ? formUpdate.values.registrationFeeHstdReissuance : null,
          newHstdRegistrationFeePercent:
            val === 1 ? formUpdate.values.newHstdRegistrationFeePercent : null,
          registrationFeeHstdReissuancePercent:
            val === 1
              ? formUpdate.values.registrationFeeHstdReissuancePercent
              : null,
        });
      },
    },
    formUpdate.values.feeLevel === 0
      ? {
          key: 12,
          label: "Mức phí TĐHS mới (đồng)",
          type: INPUT_NUMBER,
          require: formUpdate.values.parentId ? true : false,
          css: css2,
          value: formUpdate.values.newHstdRegistrationFee,
          error: formUpdate.errors.newHstdRegistrationFee,
          touched: formUpdate.touched.newHstdRegistrationFee,
          allowClear: true,
          onChange: (value: number) =>
            handleChange({ newHstdRegistrationFee: value }),
          currencable: true,
        }
      : {
          key: 12,
          label: "Mức phí TĐHS mới (%)",
          type: INPUT_NUMBER,
          require: formUpdate.values.parentId ? true : false,
          css: css2,
          value: formUpdate.values.newHstdRegistrationFeePercent,
          error: formUpdate.errors.newHstdRegistrationFeePercent,
          touched: formUpdate.touched.newHstdRegistrationFeePercent,
          allowClear: true,
          onChange: (value: number) =>
            handleChange({ newHstdRegistrationFeePercent: value }),
          currencable: true,
        },
    formUpdate.values.feeLevel === 0
      ? {
          key: 13,
          label: "Mức phí TĐHS tái cấp (đồng)",
          type: INPUT_NUMBER,
          require: formUpdate.values.parentId ? true : false,
          css: css2,
          value: formUpdate.values.registrationFeeHstdReissuance,
          error: formUpdate.errors.registrationFeeHstdReissuance,
          touched: formUpdate.touched.registrationFeeHstdReissuance,
          allowClear: true,
          onChange: (value: number) =>
            handleChange({ registrationFeeHstdReissuance: value }),
          currencable: true,
        }
      : {
          key: 13,
          label: "Mức phí TĐHS tái cấp (%)",
          type: INPUT_NUMBER,
          require: formUpdate.values.parentId ? true : false,
          css: css2,
          value: formUpdate.values.registrationFeeHstdReissuancePercent,
          error: formUpdate.errors.registrationFeeHstdReissuancePercent,
          touched: formUpdate.touched.registrationFeeHstdReissuancePercent,
          allowClear: true,
          onChange: (value: number) =>
            handleChange({ registrationFeeHstdReissuancePercent: value }),
          currencable: true,
        },
    {
      key: 14,
      label: "Hiệu lực từ ngày",
      allowClear: true,
      type: DATE_PICKER,
      require: formUpdate.values.parentId ? true : false,
      css: css2,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: formUpdate.values.effectiveFrom
        ? dayjs(formUpdate.values.effectiveFrom)
        : null,
      error: formUpdate.errors.effectiveFrom,

      touched: formUpdate.touched.effectiveFrom,

      disabledDate: (value: any) => {
        if (formUpdate.values.validUntil) {
          return disabledStartDate(value, formUpdate.values.validUntil);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        handleChange({
          effectiveFrom: value ? dayjs(value).toISOString() : null,
        });
      },
    },
    {
      key: 15,
      label: "Hiệu lực đến ngày",
      allowClear: true,
      type: DATE_PICKER,
      require: formUpdate.values.parentId ? true : false,
      css: css2,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: formUpdate.values.validUntil
        ? dayjs(formUpdate.values.validUntil)
        : null,
      error: formUpdate.errors.validUntil,
      touched: formUpdate.touched.validUntil,
      disabledDate: (value: any) => {
        if (formUpdate.values.effectiveFrom) {
          return disabledEndDate(value, formUpdate.values.effectiveFrom);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        handleChange({
          validUntil: value ? dayjs(value).toISOString() : null,
        });
      },
    },
  ];

  const handleCheckPromotion = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      formUpdate.setValues({ ...formUpdate.values, applyPromotion: true });
    } else
      formUpdate.setValues({ ...formUpdate.values, applyPromotion: false });
  };

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalCreate"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreate-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Sửa biểu phí" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={handleCloseModal}
            size="small"
          />
        </Row>
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
          <Row
            justify={"space-between"}
            style={{
              padding: "0 16px",
              paddingBottom: "16px",
              paddingTop: "16px",
            }}
            align={"middle"}
          >
            {checkStatusLabel(
              formUpdate.values.effectiveFrom,
              formUpdate.values.validUntil
            ) ? (
              <Tag color="green">Đang hiệu lực</Tag>
            ) : (
              <Tag>Hết hiệu lực</Tag>
            )}

            <Checkbox
              onChange={handleCheckPromotion}
              checked={formUpdate.values.applyPromotion ? true : false}
            >
              Áp dụng khuyến mãi
            </Checkbox>
            <Space>
              <ButtonCustom
                label="Hủy bỏ"
                onClick={() => {
                  formUpdate.resetForm();
                  closeModal();
                }}
              />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                // htmlType="submit"
                bgColor="rgba(40, 98, 175, 1)"
                onClick={formUpdate.submitForm}
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default ModalUpdateFeeSchedule;
