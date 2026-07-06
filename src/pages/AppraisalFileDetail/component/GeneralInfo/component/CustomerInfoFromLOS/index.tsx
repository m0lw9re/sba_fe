import { Form, Row, Space } from "antd";
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
import * as Yup from "yup";
import "./style.scss";
import renderRequired from "components/RenderRequire";

const { SELECT, INPUT, TEXT_AREA } = TYPE_FIELD;

type RefProps = {
  updateCustomerInfor: () => void;
};

type FormDataType = {
  customerNameByLos: string | null;
  addressCustomerByLos: string | null;
  typeCustomerByLos: string | null;
  cccdCustomerByLos: string | null;
};

type Props = {
  customerData: FormDataType;
  disableEdit: boolean;
};
const formSchema = Yup.object().shape({
  typeCustomerByLos: Yup.string()
    .nullable()
    .required("Vui lòng chọn loại khách hàng"),
  // cccdCustomerByLos: Yup.string()
  //   .nullable()
  //   .required("Vui lòng nhập CCCD/HC/CMTQĐ/MST/ĐKKD")
  //   .test(
  //     "cccdCustomerByLos format validation",
  //     "Vui lòng nhập đúng định dạng MST",
  //     function (value) {
  //       // Format: 1234567890-123
  //       const regexForTaxCode1 = /^\d{10}-\d{3}$/;
  //       // Format: 1234567890
  //       const regexForTaxCode2 = /^\d{10}$/;
  //       const customerType = this.parent.typeCustomerByLos;
  //       if (value && customerType === "2") {
  //         if (regexForTaxCode1.test(value) || regexForTaxCode2.test(value)) {
  //           return true;
  //         }
  //         return false;
  //       }
  //       return true;
  //     }
  //   ),
  cccdCustomerByLos: Yup.mixed()
    .test(
      "cccdCustomerByLos and PersonId validation",
      "Vui lòng nhập CCCD/HC/CMTQĐ/MST/ĐKKD",
      function (value) {
        const cccdCustomerByLos = this.parent.cccdCustomerByLos;
        if (cccdCustomerByLos || value) return true;
        return false;
      }
    )
    .test(
      "customerTypeId validation",
      "Vui lòng nhập 9 hoặc 12 số",
      function (value) {
        if (this.parent.typeCustomerByLos === "2") {
          return true;
        }
        const customerTypeId = this.parent.cccdCustomerByLos;
        const regexForTaxCode1 = /^\d{9}$/;
        const regexForTaxCode2 = /^\d{12}$/;
        if (customerTypeId) {
          if (
            regexForTaxCode1.test(customerTypeId) ||
            regexForTaxCode2.test(customerTypeId)
          ) {
            return true;
          }
          return false;
        }
        return true;
      }
    )
    .test(
      "cccdCustomerByLos format validation",
      "Vui lòng nhập đúng định dạng MST",
      function () {
        if (this.parent.typeCustomerByLos === "1") {
          return true;
        }
        const cccdCustomerByLos = this.parent.cccdCustomerByLos;
        // Format: 1234567890-123
        const regexForTaxCode1 = /^\d{10}-\d{3}$/;
        // Format: 1234567890
        const regexForTaxCode2 = /^\d{10}$/;
        if (cccdCustomerByLos) {
          if (
            regexForTaxCode1.test(cccdCustomerByLos) ||
            regexForTaxCode2.test(cccdCustomerByLos)
          ) {
            return true;
          }
          return false;
        }
        return true;
      }
    ),
  customerNameByLos: Yup.string().nullable().required("Vui lòng nhập tên"),
  addressCustomerByLos: Yup.string()
    .nullable()
    .required("Vui lòng nhập địa chỉ"),
});

const initialValue: FormDataType = {
  typeCustomerByLos: null,
  cccdCustomerByLos: null,
  customerNameByLos: null,
  addressCustomerByLos: null,
};
const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 12 };
const cssLabelCol = { xs: 10, sm: 10, md: 10, lg: 10, xl: 10 };
const cssWrapperCol = { xs: 14, sm: 14, md: 14, lg: 14, xl: 14 };

const CustomerInfoFromLOS = forwardRef<RefProps, Props>(
  ({ customerData, disableEdit }, ref) => {
    const globalSliceData = useSelector(
      (state: RootState) => state.globalSlice
    );
    const form = useFormik({
      initialValues: initialValue,
      validationSchema: !disableEdit ? formSchema : undefined,
      validateOnChange: true,
      onSubmit: (data: FormDataType): any => {
        return data;
      },
    });
    useImperativeHandle(ref, () => ({
      updateCustomerInfor: form.submitForm,
    }));

    useEffect(() => {
      form.setValues(customerData);
    }, []);

    const handleChange = useCallback(
      (data: any) => {
        form.setValues({
          ...form.values,
          ...data,
        });
      },
      [form.values]
    );

    const handleChangeCCCD = (value: string) => {
      let taxCodeValue = value;
      const customerType = form.values.typeCustomerByLos;
      const regexForTaxCode = /^\d{11}/;
      if (customerType === "2" && regexForTaxCode.test(value)) {
        taxCodeValue = value.slice(0, 10) + "-" + value.slice(10);
      }
      handleChange({
        cccdCustomerByLos: taxCodeValue,
      });
    };

    const inputFields: InputFiledParams[] = [
      {
        key: "cccdCustomerByLos",
        label: renderRequired("CCCD/CC/HC/CMTQĐ/MST/ĐKKD"),
        css: css,
        labelCol: cssLabelCol,
        wrapperCol: cssWrapperCol,
        type: INPUT,
        error: form.errors.cccdCustomerByLos,
        touched: form.touched.cccdCustomerByLos,
        value: form.values.cccdCustomerByLos,
        onChange: (e: any) => {
          // handleChange({
          //   cccdCustomerByLos: e.target.value,
          // });
          handleChangeCCCD(e.target.value);
        },
        disable: disableEdit,
      },
      {
        key: "typeCustomerByLos",
        label: renderRequired("Loại khách hàng"),
        css: css,
        labelCol: cssLabelCol,
        wrapperCol: cssWrapperCol,
        type: SELECT,
        error: form.errors.typeCustomerByLos,
        touched: form.touched.typeCustomerByLos,
        value: form.values.typeCustomerByLos,
        placeholder: "Vui lòng chọn",
        options: globalSliceData.customerTypeOptions.map((item) => ({
          ...item,
          value: item.value.toString(),
        })),
        onChange: (value: number) => {
          handleChange({
            typeCustomerByLos: value.toString(),
          });
        },
        disable: disableEdit,
      },
      {
        key: "customerNameByLos",
        label: renderRequired("Tên khách hàng"),
        css: css,
        labelCol: cssLabelCol,
        wrapperCol: cssWrapperCol,
        type: INPUT,
        error: form.errors.customerNameByLos,
        touched: form.touched.customerNameByLos,
        value: form.values.customerNameByLos,
        onChange: (e: any) => {
          handleChange({
            customerNameByLos: e.target.value,
          });
        },
        disable: disableEdit,
      },
      {
        key: "addressCustomerByLos",
        label: renderRequired("Địa chỉ xuất hóa đơn"),
        css: css,
        labelCol: cssLabelCol,
        wrapperCol: cssWrapperCol,
        type: INPUT,
        error: form.errors.addressCustomerByLos,
        touched: form.touched.addressCustomerByLos,
        value: form.values.addressCustomerByLos,
        onChange: (e: any) => {
          handleChange({
            addressCustomerByLos: e.target.value,
          });
        },
        disable: disableEdit,
      },
    ];

    return (
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={"small"}
        className="tab-appraisal-wrapper"
      >
        <Form labelWrap labelAlign="left" size="small">
          <Row gutter={[24, 8]}>
            <InputFields data={inputFields} />
          </Row>
        </Form>
      </Space>
    );
  }
);

export default memo(CustomerInfoFromLOS);
