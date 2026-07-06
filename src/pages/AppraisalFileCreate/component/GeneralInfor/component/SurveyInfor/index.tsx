import { Form, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { AppraisalFileSurveyScheduleCreateType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import TableSurvey from "pages/AppraisalFileCreate/component/GeneralInfor/component/SurveyInfor/TableSurvey";
import * as Yup from "yup";
import { useAppDispatch } from "configs/hooks";
import { setChangeAppraisalFileCreate } from "configs/globalSlice";
type RefProps = {
  addSurveyInfor: () => void;
};

const { INPUT, DATE_PICKER, RADIO } = TYPE_FIELD;

type FormDataType = {
  surveyGuide: string | null;
  surveyGuidePhone: string | null;
  surveyTime: string | null;
  surveySchedules: Array<AppraisalFileSurveyScheduleCreateType>;
  surveyGuideType: number | null;
};

const initialValue: FormDataType = {
  surveyGuide: "",
  surveyGuidePhone: "",
  surveyTime: "",
  surveySchedules: [],
  surveyGuideType: 1,
};
const formSchema = Yup.object().shape({
  surveyGuide: Yup.string().required("Vui lòng nhập tên"),
  surveyGuidePhone: Yup.string()
    .required("Vui lòng nhập SĐT")
    .matches(
      /^(0[0-9]{9}|\+84[0-9]{9})$/,
      "Số điện thoại nhập chưa đúng định dạng. Vui lòng thử lại",
    )
    .nullable(),
});

const SurveyInfor = forwardRef<RefProps>(({}, ref) => {
  const form = useFormik({
    initialValues: initialValue,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: (data: FormDataType): any => {
      return data;
    },
  });

  useImperativeHandle(ref, () => ({
    addSurveyInfor: form.submitForm,
  }));
  const changeFormData = (data: any) => {
    form.setValues({ ...form.values, ...data });
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      setChangeAppraisalFileCreate({
        title: "Thông tin lịch khảo sát",
        value: { ...form.values },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 12, xl: 12 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 12, xl: 12 };
  const inputs: InputFiledParams[] = [
    {
      key: 1,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      label: "Họ tên người hướng dẫn khảo sát",
      require: true,
      type: INPUT,
      value: form.values.surveyGuide,
      onChange: (e: any) => changeFormData({ surveyGuide: e.target.value }),
      error: form.errors.surveyGuide,
      touched: form.touched.surveyGuide,
    },
    {
      key: 2,
      css: css,
      label: "SĐT liên hệ",
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      require: true,
      value: form.values.surveyGuidePhone,
      onChange: (e: any) => {
        if (e.target.value.length > 15) return;
        const regex = /^[0-9]*$/;
        if (!regex.test(e.target.value)) return;
        changeFormData({ surveyGuidePhone: e.target.value });
      },
      error: form.errors.surveyGuidePhone,
      touched: form.touched.surveyGuidePhone,
    },
    {
      key: 3,
      css: css,
      labelCol: labelCol,
      require: false,
      wrapperCol: wrapperCol,
      label: "Thời gian khảo sát dự kiến",
      type: DATE_PICKER,
      value: form.values.surveyTime ? dayjs(form.values.surveyTime) : null,
      onChange: (value: any) =>
        changeFormData({
          surveyTime: value ? dayjs(value).toISOString() : null,
        }),
    },
    {
      key: 4,
      css: css,
      label: "Chức vụ/Quan hệ với chủ tài sản",
      type: RADIO,
      error: form.errors.surveyGuideType,
      touched: form.touched.surveyGuideType,
      placeholder: "Hệ thống tự nhập và cho chỉnh sửa",
      value: form.values.surveyGuideType,
      options: [
        { value: 1, label: "CVKH" },
        { value: 2, label: "Đại diện Khách hàng" },
      ],
      onChange: (e: any) => changeFormData({ surveyGuideType: e.target.value }),
    },
  ];
  return (
    <Space style={{ width: "100%" }} direction="vertical" size={"middle"}>
      <Form labelWrap labelAlign="left" size="small">
        <Row gutter={[24, 8]}>
          <InputFields data={inputs} />
        </Row>
      </Form>
      <CardTitleCustomUpdate title="Thời gian khảo sát SBA thống nhất với người hướng dẫn khảo sát" />
      <TableSurvey
        surveySchedules={form.values.surveySchedules}
        handleChangeFormData={changeFormData}
      />
    </Space>
  );
});

export default SurveyInfor;
