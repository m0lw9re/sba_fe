import { Form, Row, Space } from "antd";
import InputFields from "components/InputFields";
import renderRequired from "components/RenderRequire";
import { RootState } from "configs/configureStore";
import { setChangeAppraisalFileCreate } from "configs/globalSlice";
import { useAppDispatch } from "configs/hooks";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

type RefProps = {
  addBranchInfor: () => void;
};

type FormDataType = {
  transOfficeCode: string | null;
  rmName: string;
  rmPhone: string;
  resultEmail: string;
  invoiceEmail: string;
};

const formSchema = Yup.object().shape({
  transOfficeCode: Yup.string().typeError("Vui lòng chọn chi nhánh"),
  rmName: Yup.string().required("Vui lòng nhập tên"),
  rmPhone: Yup.string()
    .required("Vui lòng nhập SĐT")
    .matches(
      /^(0[0-9]{9}|\+84[0-9]{9})$/,
      "Số điện thoại nhập chưa đúng định dạng. Vui lòng thử lại"
    ),
  resultEmail: Yup.string()
    .required("Vui lòng nhập Email")
    .test("multiple-emails", "Vui lòng nhập đúng định dạng email", (value) => {
      if (!value) return true;
      // Xóa khoảng trắng và các dấu chấm phẩy ở cuối
      const cleanedValue = value.trim().replace(/;$/, "");
      // Tách các email bằng dấu chấm phẩy
      const emails = cleanedValue.split(";").map((email) => email.trim());
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}$/;
      // Kiểm tra xem tất cả các email có đúng định dạng hay không
      return emails.every((email) => emailRegex.test(email));
    }),
  invoiceEmail: Yup.string()
    .required("Vui lòng nhập Email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}$/,
      "Vui lòng nhập đúng định dạng email"
    )
    .nullable(),
});

const { INPUT, SELECT } = TYPE_FIELD;

const BranchInfor = forwardRef<RefProps>(({}, ref) => {
  const form = useFormik({
    initialValues: {
      transOfficeCode: null,
      rmName: "",
      rmPhone: "",
      resultEmail: "",
      invoiceEmail: "",
    },
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: (data: FormDataType): any => {
      return data;
    },
  });

  const globalState = useSelector((state: RootState) => state.globalSlice);

  useImperativeHandle(ref, () => ({
    addBranchInfor: form.submitForm,
  }));

  const dispatch = useAppDispatch();

  const handleChange = useCallback(
    (data: any) => {
      form.setValues({ ...form.values, ...data });
      dispatch(
        setChangeAppraisalFileCreate({
          title: "Thông tin chi nhánh Sacombank",
          value: { ...form.values, ...data },
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.values]
  );

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 12 };
  const labelCol = { xs: 10, sm: 10, md: 10, lg: 10, xl: 10 };
  const wrapperCol = { xs: 14, sm: 14, md: 14, lg: 14, xl: 14 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: renderRequired("Chi nhánh/Phòng GD"),
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      showSearch: true,
      error: form.errors.transOfficeCode,
      touched: form.touched.transOfficeCode,
      value: form.values.transOfficeCode,
      options: globalState.sacombankUnitOptions,
      onChange: (value: string) => {
        handleChange({ transOfficeCode: value });
      },
    },
    {
      key: 2,
      label: renderRequired("Họ và tên CBTD"),
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      error: form.errors.rmName,
      touched: form.touched.rmName,
      value: form.values.rmName,
      onChange: (e: any) => {
        handleChange({ rmName: e.target.value });
      },
    },
    {
      key: 4,
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.rmPhone,
      error: form.touched.rmPhone && form.errors.rmPhone,
      touched: form.touched.rmPhone,
      label: renderRequired("Số ĐT di động"),
      onChange: (e: any) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/\D/g, "");

        if (inputValue !== numericValue) {
          // Nếu có ký tự không phải số, hiển thị thông báo lỗi
          // message.error("Vui lòng chỉ nhập số điện thoại.");
          handleChange({
            rmPhone: numericValue,
            errors: { rmPhone: "Vui lòng chỉ nhập số." },
          });
        } else {
          handleChange({
            rmPhone: numericValue,
            errors: { rmPhone: undefined },
          });
        }
      },
    },
    {
      key: 5,
      type: INPUT, // Sử dụng type 'email' cho trường nhập email
      css: css,
      error: form.touched.resultEmail && form.errors.resultEmail,
      touched: form.touched.resultEmail,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.resultEmail,
      onChange: (e: any) => {
        const inputValue = e.target.value;
        handleChange({ resultEmail: inputValue });
      },
      label: renderRequired("Email tiếp nhận thông báo phí/TBKQ/KQĐG/hóa đơn"),
      rules: [
        {
          type: "email",
          message: "Vui lòng nhập đúng định dạng email!",
        },
      ],
    },
    {
      key: 6,
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      placeholder: "Nhập",
      error: form.errors.invoiceEmail,
      touched: form.touched.invoiceEmail,
      value: form.values.invoiceEmail,
      onChange: (e: any) => {
        handleChange({ invoiceEmail: e.target.value });
      },
      label: renderRequired("Email trưởng đơn vị"),
      rules: [
        {
          type: "email",
          message: "Vui lòng nhập đúng định dạng email!",
        },
      ],
    },
  ];

  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"small"}
      className="tab-appraisal-wrapper"
    >
      <Form labelAlign="left" labelWrap size="small">
        <Row gutter={[24, 8]}>
          <InputFields data={inputFields} />
        </Row>
      </Form>
    </Space>
  );
});

export default BranchInfor;
