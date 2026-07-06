import { Form, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import TableSurvey from "./TableSurvey";
import { AppraisalFileSurveyScheduleType } from "constant/types";
import { useFormik } from "formik";
import dayjs from "dayjs";
import * as Yup from "yup";
import { randomId } from "utils/string";
import renderRequired from "components/RenderRequire";
import { DATE_TIME_FORMAT } from "constant/enums";

const { INPUT, DATE_PICKER } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  surveyGuide: Yup.string().nullable().required("Vui lòng nhập tên"),
  surveyGuidePhone: Yup.string()
    .required("Vui lòng nhập SĐT")
    .matches(
      /^(0[0-9]{9}|\+84[0-9]{9})$/,
      "Số điện thoại nhập chưa đúng định dạng. Vui lòng thử lại",
    )
    .nullable(),
  surveySchedules: Yup.array().of(
    Yup.object().shape({
      timeStart: Yup.string().nullable().required("Ngày không được để trống."),
      // timeEnd: Yup.string().nullable().required("Ngày không được để trống."),
      timeEnd: Yup.string()
        .nullable()
        .test(
          "surveyTimeEnd",
          "Ngày kết thúc phải lớn hơn ngày bắt đầu",
          function (value) {
            const { timeStart } = this.parent;

            if (!timeStart || !value) return true;

            const startDate = new Date(timeStart);
            const endDate = new Date(value);

            return endDate > startDate;
          },
        ),
    }),
  ),
});

type Props = {
  surveyInfo: {
    surveyGuide: string | null;
    surveyGuidePhone: string | null;
    surveyTime: string | null;
    surveySchedules: Array<AppraisalFileSurveyScheduleType>;
    appraisalDate: string | null;
    surveyGuidePosition: string | null;
  };
  disableEdit: boolean;
};

type formDataType = {
  surveyGuide: string | null;
  surveyGuidePhone: string | null;
  surveyTime: string | null;
  surveySchedules: Array<AppraisalFileSurveyScheduleType>;
  surveyGuidePosition: string | null;
};

const initialValue: formDataType = {
  surveyGuide: "",
  surveyGuidePhone: "",
  surveyTime: "",
  surveySchedules: [],
  surveyGuidePosition: "",
};

type RefProps = {
  updateSurveyInfo: () => void;
};

const SurveyInfor = forwardRef<RefProps, Props>(
  ({ surveyInfo, disableEdit }, ref) => {
    const form = useFormik({
      initialValues: initialValue,
      validationSchema: formSchema,
      validateOnChange: true,
      onSubmit: (data: formDataType): any => {
        return {
          ...data,
          surveySchedules: data.surveySchedules.map((item) => {
            const tmp = { ...item };
            delete tmp.isNew;
            return tmp;
          }),
        };
      },
    });

    useImperativeHandle(ref, () => ({
      updateSurveyInfo: form.submitForm,
    }));

    useEffect(() => {
      if (surveyInfo) {
        const formData: formDataType = {
          surveyGuide: surveyInfo.surveyGuide,
          surveyGuidePhone: surveyInfo.surveyGuidePhone,
          surveyTime: surveyInfo.surveyTime,
          surveySchedules: surveyInfo.surveySchedules
            ? [...surveyInfo.surveySchedules]?.map((item) => ({
                ...item,
                key: randomId(),
              }))
            : [],
          surveyGuidePosition: surveyInfo?.surveyGuidePosition || "",
        };

        form.setValues({ ...form.values, ...formData });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(surveyInfo)]);

    const changeFormData = (data: any) => {
      form.setValues({ ...form.values, ...data });
    };

    const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
    const inputs: InputFiledParams[] = [
      {
        key: 1,
        css: css,
        label: renderRequired("Họ tên người hướng dẫn khảo sát"),
        type: INPUT,
        error: form.errors.surveyGuide,
        touched: form.touched.surveyGuide,
        placeholder: "Hệ thống tự nhập và cho chỉnh sửa",
        value: form.values.surveyGuide,
        onChange: (e: any) => changeFormData({ surveyGuide: e.target.value }),
        disable: disableEdit,
      },
      {
        key: 2,
        css: css,
        label: renderRequired("SĐT liên hệ"),
        error: form.errors.surveyGuidePhone,
        touched: form.touched.surveyGuidePhone,
        type: INPUT,
        placeholder: "Hệ thống tự nhập và cho chỉnh sửa",
        value: form.values.surveyGuidePhone,
        onChange: (e: any) =>
          changeFormData({ surveyGuidePhone: e.target.value }),
        disable: disableEdit,
      },
      {
        key: 3,
        css: css,
        label: "Thời gian khảo sát dự kiến",
        type: DATE_PICKER,
        placeholder: "Hệ thống tự nhập và cho chỉnh sửa",
        value: form.values.surveyTime ? dayjs(form.values.surveyTime) : null,
        onChange: (value: any) =>
          changeFormData({
            surveyTime: value ? dayjs(value).toISOString() : null,
          }),
        disable: disableEdit,
      },
      {
        key: 4,
        css: css,
        label: "Thời gian hoàn thành khảo sát",
        type: DATE_PICKER,
        placeholder: "Thời gian hoàn thành khảo sát",
        formatDatetime: "DD/MM/YYYY HH:mm:ss",
        value: surveyInfo.appraisalDate
          ? dayjs(surveyInfo.appraisalDate)
          : null,
        disable: true,
      },
      {
        key: 5,
        css: css,
        label: "Chức vụ/Quan hệ với chủ tài sản",
        type: INPUT,
        error: form.errors.surveyGuidePosition,
        touched: form.touched.surveyGuidePosition,
        placeholder: "Hệ thống tự nhập và cho chỉnh sửa",
        value: form.values.surveyGuidePosition,
        onChange: (e: any) =>
          changeFormData({ surveyGuidePosition: e.target.value }),
        disable: disableEdit,
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
          allowEdit={disableEdit}
          errors={form.errors.surveySchedules}
          touched={form.touched.surveySchedules}
        />
      </Space>
    );
  },
);

export default memo(SurveyInfor);
