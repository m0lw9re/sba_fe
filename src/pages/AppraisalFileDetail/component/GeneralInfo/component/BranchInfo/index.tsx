import { Form, Row, Space, message } from "antd";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { useSelector } from "react-redux";
import { isValidEmail } from "utils";
import * as Yup from "yup";
import "./style.scss";
import renderRequired from "components/RenderRequire";
const { INPUT, SELECT, MULTI_TEXT_ITEMS } = TYPE_FIELD;

type Props = {
  branchData: {
    transOfficeCode: string | null;
    rmName: string | null;
    rmPhone: string | null;
    resultEmail: string | null;
    invoiceEmail: string | null;
  };
  allowEdit: boolean;
  disableEditRoleCBTH: boolean;
};

type RefProps = {
  updateBranchInfo: () => void;
};

type formDataType = {
  transOfficeCode: string | null;
  rmName: string | null;
  rmPhone: string | null;
  resultEmail: string | null;
  invoiceEmail: string | null;
};

const initialValue: formDataType = {
  invoiceEmail: "",
  resultEmail: "",
  rmName: "",
  rmPhone: "",
  transOfficeCode: null,
};

const formSchema = Yup.object().shape({
  rmPhone: Yup.string()
    .required("Vui lòng nhập SĐT")
    .matches(
      /^(0[0-9]{9}|\+84[0-9]{9})$/,
      "Số điện thoại nhập chưa đúng định dạng. Vui lòng thử lại"
    )
    .nullable(),
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
    .email("Vui lòng nhập đúng định dạng email")
    .required("Email không được bỏ trống"),
  rmName: Yup.string().required("Tên không được bỏ trống"),
});

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 12 };
const cssLabelCol = { xs: 10, sm: 10, md: 10, lg: 10, xl: 10 };
const cssWrapperCol = { xs: 14, sm: 14, md: 14, lg: 14, xl: 14 };

const BranchInfo = forwardRef<RefProps, Props>(
  ({ branchData, allowEdit, disableEditRoleCBTH }, ref) => {
    const globalSliceData = useSelector(
      (state: RootState) => state.globalSlice
    );
    const form = useFormik({
      initialValues: initialValue,
      validationSchema: formSchema,
      validateOnChange: true,
      onSubmit: (data: formDataType): any => {
        return data;
      },
    });

    useImperativeHandle(ref, () => ({
      updateBranchInfo: form.submitForm,
    }));

    const handleChange = useCallback(
      (data: any) => {
        form.setValues({ ...form.values, ...data });
      },
      [form.values]
    );

    useEffect(() => {
      form.setValues({
        ...form.values,
        ...branchData,
      });
    }, []);

    const inputFields: InputFiledParams[] = [
      {
        key: 1,
        label: renderRequired("Chi nhánh/Phòng GD"),
        css: css,
        labelCol: cssLabelCol,
        wrapperCol: cssWrapperCol,
        type: SELECT,
        value: form.values.transOfficeCode,
        error: form.errors.transOfficeCode,
        touched: form.touched.transOfficeCode,
        showSearch: true,
        options: globalSliceData.sacombankUnitOptions,
        onChange: (value: string) => {
          handleChange({ transOfficeCode: value });
        },
        disable: allowEdit,
      },
      {
        key: 2,
        label: renderRequired("Họ và tên CBTD"),
        css: css,
        labelCol: cssLabelCol,
        wrapperCol: cssWrapperCol,
        type: INPUT,
        error: form.errors.rmName,
        touched: form.touched.rmName,
        value: form.values.rmName,
        onChange: (e: any) => {
          handleChange({ rmName: e.target.value });
        },
        disable: allowEdit,
      },
      {
        key: 4,
        type: INPUT,
        css: css,
        labelCol: cssLabelCol,
        wrapperCol: cssWrapperCol,
        value: form.values.rmPhone,
        error: form.errors.rmPhone,
        touched: form.touched.rmPhone,
        label: renderRequired("Số ĐT di động"),
        onChange: (e: any) => handleChange({ rmPhone: e.target.value}),
        disable: allowEdit && disableEditRoleCBTH,
      },
      {
        key: 5,
        type: MULTI_TEXT_ITEMS,
        css: css,
        labelCol: cssLabelCol,
        wrapperCol: cssWrapperCol,
        error: form.errors.resultEmail,
        touched: form.touched.resultEmail,
        value: form.values.resultEmail,
        allowClear: true,
        onChange: (value: any) => {
          const checkEmail = value.every((item: any) => {
            return isValidEmail(item);
          });
          if (!checkEmail) {
            message.error("Vui lòng nhập đúng định dạng email!");
            return;
          }
          handleChange({ resultEmail: value.join(";") });
        },
        label: renderRequired(
          "Email tiếp nhận thông báo phí/TBKQ/KQĐG/hóa đơn"
        ),
        rules: [
          {
            type: "email",
            message: "Vui lòng nhập đúng định dạng email!",
          },
        ],
        disable: allowEdit,
      },
      {
        key: 6,
        type: INPUT,
        css: css,
        labelCol: cssLabelCol,
        wrapperCol: cssWrapperCol,
        placeholder: "Nhập",
        error: form.errors.invoiceEmail,
        touched: form.touched.invoiceEmail,
        value: form.values.invoiceEmail,
        label: renderRequired("Email trưởng đơn vị"),
        rules: [
          {
            type: "email",
            message: "Vui lòng nhập đúng định dạng email!",
          },
        ],
        onChange: (e: any) => {
          handleChange({ invoiceEmail: e.target.value });
        },
        disable: allowEdit,
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
  }
);

export default memo(BranchInfo);