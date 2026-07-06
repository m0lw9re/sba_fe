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
import { createFeeSchedule } from "constant/types";
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
};

const { INPUT_NUMBER, SELECT, RADIO, DATE_PICKER, INPUT } = TYPE_FIELD;

const initialFormData: createFeeSchedule = {
  assetLevelTwo: null,
  assetLevelThree: null,
  assetValidationForm: null,
  assetValidationUpTo: null,
  minimumFee: null,
  maximumFeeHstdNew: null,
  maximumFeeHstdReissue: null,
  newHstdRegistrationFee: null,
  registrationFeeHstdReissuance: null,
  effectiveFrom: null,
  validUntil: null,
  applyPromotion: false,
  status: 1,
  feeLevel: 0,
  idFeeScheduleIdNew: null,
  feeCode: null,
  parentId: null,
  newHstdRegistrationFeePercent: null,
  registrationFeeHstdReissuancePercent: null,
};

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

const ModalCreateFeeSchedule: React.FC<Props> = ({
  isOpenModal,
  closeModal,
}) => {
  const dispatch = useDispatch();

  const [feeLevel, setFeeLevel] = useState<number>(0);
  const [parrentId, setParentId] = useState<number | null>(null);

  const { data: feeScheduleParentData } = useFeeScheduleParent();

  const handleChangeCreate = (basicData: any) => {
    formCreate.setValues((state: any) => ({
      ...state,
      ...basicData,
    }));
  };

  const assetLV2 = useAssetLevelTwoAll();

  const [assetLevelThreeOption, setAssetLevelThreeOption] = useState<{
    AssetLevelThreeType: Array<any>;
  }>({ AssetLevelThreeType: [] });

  const formCreate = useFormik({
    initialValues: initialFormData,
    validationSchema: genSchemaValid(feeLevel, parrentId),
    validateOnChange: true,
    onSubmit: async (data: createFeeSchedule) => {
      try {
        const response = await feeScheduleApi.createFeeSchedule(data);
        if (response.data.statusCode === 200) {
          message.success(response.data.message);
          formCreate.resetForm();
          handleCloseModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Tạo biểu phí không thành công");
      }
    },
  });

  const handleCloseModal = useCallback(() => {
    closeModal();
    formCreate.resetForm();
  }, [formCreate]);

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
    if (formCreate.values.assetLevelTwo) {
      getAssetLevelThree(formCreate.values.assetLevelTwo);
    } else {
      setAssetLevelThreeOption((prevState: any) => ({
        ...prevState,
        AssetLevelThreeType: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formCreate.values.assetLevelTwo]);

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const css2 = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Biểu phí",
      require: true,
      type: INPUT,
      value: formCreate.values.feeCode,
      error: formCreate.errors.feeCode,
      touched: formCreate.touched.feeCode,
      css: css2,
      onChange: (e: any) => handleChangeCreate({ feeCode: e.target.value }),
    },
    {
      key: 2,
      label: "Loại biểu phí",
      require: true,
      type: SELECT,
      onChange: (value: number) =>
        handleChangeCreate({
          idFeeScheduleIdNew: value,
          assetLevelThree: null,
        }),
      options: [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
      ],
      css: css2,
      value: formCreate.values.idFeeScheduleIdNew,
      error: formCreate.errors.idFeeScheduleIdNew,
      touched: formCreate.touched.idFeeScheduleIdNew,
      allowClear: true,
      disable: formCreate.values.parentId ? true : false,
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
      value: formCreate.values.parentId,
      allowClear: true,
      onChange: (value: number) => {
        let additionData: any = {};
        if (value) {
          const foundObj = feeScheduleParentData?.data?.find(
            (el: any) => el.id === value
          );

          if (foundObj) {
            additionData.idFeeScheduleIdNew = foundObj.idFeeScheduleIdNew;
            additionData.assetLevelTwo = foundObj.assetLevelTwo;
            additionData.assetLevelThree = foundObj.assetLevelThree;
            additionData.effectiveFrom = foundObj.effectiveFrom;
            additionData.validUntil = foundObj.validUntil;
            additionData.applyPromotion = foundObj.applyPromotion;
          }
        }
        handleChangeCreate({ parentId: value, ...additionData });
        setParentId(value);
      },
    },
    {
      key: 4,
      label: "Loại hình tài sản",
      require: true,
      type: SELECT,
      onChange: (value: number) =>
        handleChangeCreate({ assetLevelTwo: value, assetLevelThree: null }),
      options:
        assetLV2?.data?.map((item: AssetLevelTwoType) => {
          return {
            label: item.assetLevelTwoName,
            value: item.assetLevelTwoId.toString(),
          };
        }) || [],
      css: css2,
      value: formCreate.values.assetLevelTwo,
      error: formCreate.errors.assetLevelTwo,
      touched: formCreate.touched.assetLevelTwo,
      allowClear: true,
      disable: formCreate.values.parentId ? true : false,
    },
    {
      key: 5,
      label: "Phân loại tài sản",
      type: SELECT,
      onChange: (value: number) => {
        dispatch(setAssetLevelThreeId(value));
        handleChangeCreate({ assetLevelThree: value });
      },
      options: assetLevelThreeOption.AssetLevelThreeType,
      css: css2,
      value: formCreate.values.assetLevelThree,
      error: formCreate.errors.assetLevelThree,
      touched: formCreate.touched.assetLevelThree,
      allowClear: true,
      disable: formCreate.values.parentId ? true : false,
    },
    {
      key: 6,
      label: "Giá trị TSTĐ từ (đồng)",
      type: INPUT_NUMBER,
      require: formCreate.values.parentId ? true : false,
      css: css2,
      value: formCreate.values.assetValidationForm,
      error: formCreate.errors.assetValidationForm,
      touched: formCreate.touched.assetValidationForm,
      allowClear: true,
      onChange: (value: number) =>
        handleChangeCreate({ assetValidationForm: value }),
      currencable: true,
    },
    {
      key: 7,
      label: "Giá trị TSTĐ đến (đồng)",
      type: INPUT_NUMBER,
      require: formCreate.values.parentId ? true : false,
      css: css2,
      value: formCreate.values.assetValidationUpTo,
      error: formCreate.errors.assetValidationUpTo,
      touched: formCreate.touched.assetValidationUpTo,
      allowClear: true,
      onChange: (value: number) =>
        handleChangeCreate({ assetValidationUpTo: value }),
      currencable: true,
    },
    {
      key: 8,
      label: "Mức phí tối thiểu (đồng)",
      type: INPUT_NUMBER,
      require: formCreate.values.parentId ? true : false,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 6, xl: 6 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 18, xl: 18 },
      value: formCreate.values.minimumFee,
      error: formCreate.errors.minimumFee,
      touched: formCreate.touched.minimumFee,
      allowClear: true,
      onChange: (value: number) => handleChangeCreate({ minimumFee: value }),
      currencable: true,
    },
    {
      key: 9,
      label: "Mức phí tối đa HSTĐ mới (đồng)",
      type: INPUT_NUMBER,
      require: formCreate.values.parentId ? true : false,
      css: css2,
      value: formCreate.values.maximumFeeHstdNew,
      error: formCreate.errors.maximumFeeHstdNew,
      touched: formCreate.touched.maximumFeeHstdNew,
      allowClear: true,
      onChange: (value: number) =>
        handleChangeCreate({ maximumFeeHstdNew: value }),
      currencable: true,
    },
    {
      key: 10,
      label: "Mức phí tối đa HSTĐ tái cấp (đồng)",
      type: INPUT_NUMBER,
      require: formCreate.values.parentId ? true : false,
      css: css2,
      value: formCreate.values.maximumFeeHstdReissue,
      error: formCreate.errors.maximumFeeHstdReissue,
      touched: formCreate.touched.maximumFeeHstdReissue,
      allowClear: true,
      onChange: (value: number) =>
        handleChangeCreate({ maximumFeeHstdReissue: value }),
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
      value: formCreate.values.feeLevel,
      error: formCreate.errors.feeLevel,
      touched: formCreate.touched.feeLevel,
      allowClear: true,
      onChange: (e: any) => {
        const val = e.target.value;
        setFeeLevel(val);

        handleChangeCreate({
          feeLevel: val,
          newHstdRegistrationFee:
            val === 0 ? formCreate.values.newHstdRegistrationFee : null,
          registrationFeeHstdReissuance:
            val === 0 ? formCreate.values.registrationFeeHstdReissuance : null,
          newHstdRegistrationFeePercent:
            val === 1 ? formCreate.values.newHstdRegistrationFeePercent : null,
          registrationFeeHstdReissuancePercent:
            val === 1
              ? formCreate.values.registrationFeeHstdReissuancePercent
              : null,
        });
      },
    },
    formCreate.values.feeLevel === 0
      ? {
          key: 12,
          label: "Mức phí TĐHS mới (đồng)",
          type: INPUT_NUMBER,
          require: formCreate.values.parentId ? true : false,
          css: css2,
          value: formCreate.values.newHstdRegistrationFee,
          error: formCreate.errors.newHstdRegistrationFee,
          touched: formCreate.touched.newHstdRegistrationFee,
          allowClear: true,
          onChange: (value: number) =>
            handleChangeCreate({ newHstdRegistrationFee: value }),
          currencable: true,
        }
      : {
          key: 12,
          label: "Mức phí TĐHS mới (%)",
          type: INPUT_NUMBER,
          require: formCreate.values.parentId ? true : false,
          css: css2,
          value: formCreate.values.newHstdRegistrationFeePercent,
          error: formCreate.errors.newHstdRegistrationFeePercent,
          touched: formCreate.touched.newHstdRegistrationFeePercent,
          allowClear: true,
          onChange: (value: number) =>
            handleChangeCreate({ newHstdRegistrationFeePercent: value }),
          currencable: true,
        },
    formCreate.values.feeLevel === 0
      ? {
          key: 13,
          label: "Mức phí TĐHS tái cấp (đồng)",
          type: INPUT_NUMBER,
          require: formCreate.values.parentId ? true : false,
          css: css2,
          value: formCreate.values.registrationFeeHstdReissuance,
          error: formCreate.errors.registrationFeeHstdReissuance,
          touched: formCreate.touched.registrationFeeHstdReissuance,
          allowClear: true,
          onChange: (value: number) =>
            handleChangeCreate({ registrationFeeHstdReissuance: value }),
          currencable: true,
        }
      : {
          key: 13,
          label: "Mức phí TĐHS tái cấp (%)",
          type: INPUT_NUMBER,
          require: formCreate.values.parentId ? true : false,
          css: css2,
          value: formCreate.values.registrationFeeHstdReissuancePercent,
          error: formCreate.errors.registrationFeeHstdReissuancePercent,
          touched: formCreate.touched.registrationFeeHstdReissuancePercent,
          allowClear: true,
          onChange: (value: number) =>
            handleChangeCreate({ registrationFeeHstdReissuancePercent: value }),
          currencable: true,
        },
    {
      key: 14,
      label: "Hiệu lực từ ngày",
      allowClear: true,
      type: DATE_PICKER,
      require: formCreate.values.parentId ? true : false,
      css: css2,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: formCreate.values.effectiveFrom
        ? dayjs(formCreate.values.effectiveFrom)
        : null,
      error: formCreate.errors.effectiveFrom,

      touched: formCreate.touched.effectiveFrom,

      disabledDate: (value: any) => {
        if (formCreate.values.validUntil) {
          return disabledStartDate(value, formCreate.values.validUntil);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        handleChangeCreate({
          effectiveFrom: value
            ? dayjs(value).hour(0).minute(0).second(0).toISOString()
            : null,
        });
      },
    },
    {
      key: 15,
      label: "Hiệu lực đến ngày",
      allowClear: true,
      type: DATE_PICKER,
      require: formCreate.values.parentId ? true : false,
      css: css2,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: formCreate.values.validUntil
        ? dayjs(formCreate.values.validUntil)
        : null,
      error: formCreate.errors.validUntil,
      touched: formCreate.touched.validUntil,
      disabledDate: (value: any) => {
        if (formCreate.values.effectiveFrom) {
          return disabledEndDate(value, formCreate.values.effectiveFrom);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        handleChangeCreate({
          validUntil: value
            ? dayjs(value).hour(23).minute(59).second(59).toISOString()
            : null,
        });
      },
    },
  ];

  const handleCheckPromotion = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      formCreate.setValues({ ...formCreate.values, applyPromotion: true });
    } else
      formCreate.setValues({ ...formCreate.values, applyPromotion: false });
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
          <CardTitleCustomUpdate title="Thêm biểu phí mới" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
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
              formCreate.values.effectiveFrom,
              formCreate.values.validUntil
            ) ? (
              <Tag color="green">Đang hiệu lực</Tag>
            ) : (
              <Tag>Hết hiệu lực</Tag>
            )}
            <Checkbox
              onChange={handleCheckPromotion}
              checked={formCreate.values.applyPromotion ? true : false}
            >
              Áp dụng ưu đãi
            </Checkbox>
            <Space>
              <ButtonCustom
                label="Hủy bỏ"
                onClick={() => {
                  formCreate.resetForm();
                  closeModal();
                }}
              />
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                bgColor="rgba(40, 98, 175, 1)"
                onClick={formCreate.submitForm}
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};

export default ModalCreateFeeSchedule;
