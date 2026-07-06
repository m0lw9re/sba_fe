import { Col, Form, Input, Row, Space, Tooltip } from "antd";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import "pages/AppraisalFileCreate/component/GeneralInfor/component/CustomerInfor/style.scss";
import { useFormik } from "formik";
import { useCustomerType } from "utils/request";
import { CustomerTypeCreate, CustomerTypesType } from "constant/types";
import { customerApi } from "apis/customer";
import { randomId } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerTypeId } from "pages/AppraisalFileCreate/store/appraisalFileCreateSlice";
import * as Yup from "yup";
import { RootState } from "configs/configureStore";
import { setChangeAppraisalFileCreate } from "configs/globalSlice";
import renderRequired from "components/RenderRequire";

type RefProps = {
  addCustomerInfor: () => void;
};

type FormDataType = {
  customer: CustomerTypeCreate;
};

const formSchema = Yup.object().shape({
  customer: Yup.object().shape({
    customerTypeId: Yup.string().typeError("Vui lòng chọn loại khách hàng"),
    personIdentification: Yup.mixed()
      .test(
        "taxCode and PersonId validation",
        "Vui lòng nhập CCCD/HC/CMTQĐ/MST/ĐKKD",
        function (value) {
          const taxCode = this.parent.taxCode;
          if (taxCode || value) return true;
          return false;
        }
      )
      .test(
        "customerTypeId validation",
        "Vui lòng nhập 9 hoặc 12 số",
        function (value) {
          const customerTypeId = this.parent.personIdentification;
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
        "taxCode format validation",
        "Vui lòng nhập đúng định dạng MST",
        function () {
          const taxCode = this.parent.taxCode;
          // Format: 1234567890-123
          const regexForTaxCode1 = /^\d{10}-\d{3}$/;
          // Format: 1234567890
          const regexForTaxCode2 = /^\d{10}$/;
          if (taxCode) {
            if (
              regexForTaxCode1.test(taxCode) ||
              regexForTaxCode2.test(taxCode)
            ) {
              return true;
            }
            return false;
          }
          return true;
        }
      ),
    customerName: Yup.string().required("Vui lòng nhập tên"),
    address: Yup.string()
      .typeError("Vui lòng nhập địa chỉ")
      .required("Vui lòng nhập địa chỉ"),
  }),
});

const initialValue: FormDataType = {
  customer: {
    address: null,
    customerId: null,
    customerName: "",
    customerTypeId: null,
    dateCreate: "",
    dateModify: "",
    personIdentification: null,
    phoneNumber: null,
    position: null,
    representator: null,
    status: 1,
    taxCode: null,
  },
};

const { SELECT, AUTO_COMPLETE } = TYPE_FIELD;

const trimObjectStrings = (obj: any) => {
  if (typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "string") {
          obj[key] = obj[key].trim();
        } else if (typeof obj[key] === "object") {
          trimObjectStrings(obj[key]);
        }
      }
    }
  }
};

const CustomerInfor = forwardRef<RefProps>(({}, ref) => {
  const form = useFormik({
    initialValues: initialValue,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: (data: FormDataType): any => {
      trimObjectStrings(data.customer);
      return {
        ...data,
        customerId: form.values.customer.customerId || null,
      };
    },
  });

  const { customerTypeOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const { data, error, isLoading } = useCustomerType();
  const dispatch = useDispatch();

  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const [valueIdentity, setValueIndentity] = useState<string | null>(
    form.values.customer.personIdentification
  );

  useImperativeHandle(ref, () => ({
    addCustomerInfor: form.submitForm,
  }));

  useEffect(() => {
    setValueIndentity(form.values.customer?.personIdentification);
  }, [form.values.customer?.personIdentification]);

  const handleChange = useCallback(
    (data: any) => {
      form.setValues({
        customer: {
          ...form.values.customer,
          ...data,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.values]
  );

  useEffect(() => {
    dispatch(
      setChangeAppraisalFileCreate({
        title: "Thông tin khách hàng",
        value: { ...form.values.customer },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const handleChangeCustomerIndentify = (value: string) => {
    setValueIndentity(value);
    // Kiểm tra value có trong list tìm kiếm ko
    const foundIndex = customerOptions.findIndex((item) =>
      item.personIdentification === null
        ? item.taxCode === value
        : item.personIdentification === value
    );
    // Nếu không có thì reset thông tin khách hàng
    if (foundIndex === -1) {
      const customerTypeId = form.values.customer.customerTypeId;
      // nếu taxCode của tổ chức là /^\d{13}$/ thì thêm dấu -
      const regexForTaxCode = /^\d{11}/;
      let taxCodeValue = value;
      if (customerTypeId === 2 && regexForTaxCode.test(value)) {
        // thêm dấu - vào 10 số đầu
        taxCodeValue = value.slice(0, 10) + "-" + value.slice(10);
        setValueIndentity(taxCodeValue);
      }
      form.setValues({
        customer: {
          ...form.values.customer,
          // nếu loại khách hàng = 1 (cá nhân) thì thay đổi personId, và taxCode = null
          personIdentification:
            customerTypeId === 1 || !customerTypeId ? value : null,
          // nếu loại khách hàng = 2 (tổ chức) thì thay đổi taxCode, và personId = null
          taxCode: customerTypeId === 2 ? taxCodeValue : null,
          customerId: null,
          // address: "",
          // customerName: "",
          // customerTypeId: null,
        },
      });
      return;
    }

    // nếu khách hàng có trong list thì lấy các thông tin đã có
    const foundItem = customerOptions[foundIndex];
    form.setValues({
      customer: {
        ...form.values.customer,
        // nếu loại khách hàng = 1 (cá nhân) thì thay đổi personId, và taxCode = null
        personIdentification: foundItem?.customerTypeId === 1 ? value : null,
        // nếu loại khách hàng = 2 (tổ chức) thì thay đổi taxCode, và personId = null
        taxCode: foundItem?.customerTypeId === 2 ? value : null,
        customerId: foundItem?.customerId,
        customerName: foundItem?.customerName,
        customerTypeId: foundItem?.customerTypeId,
        address: foundItem?.address,
      },
    });
    dispatch(setCustomerTypeId(foundItem?.customerTypeId) || null);
  };

  // Thay đổi loại khách hàng
  const handleChangeCustomerType = (customerType: number) => {
    const taxCodeOrPersonId =
      form.values.customer.personIdentification || form.values.customer.taxCode;
    // Kiểm tra loại khách hàng là cá nhân
    if (customerType === 1) {
      form.setValues({
        customer: {
          ...form.values.customer,
          customerTypeId: 1,
          personIdentification: taxCodeOrPersonId,
          taxCode: null,
        },
      });
    }
    // Kiểm tra loại khách hàng là tổ chức
    else if (customerType === 2) {
      form.setValues({
        customer: {
          ...form.values.customer,
          personIdentification: null,
          customerTypeId: 2,
          taxCode: taxCodeOrPersonId,
        },
      });
    }
  };

  // Chọn từ list thông tin tìm kiếm
  const handleSelectIdentityCustomer = (value: string) => {
    const newCustomer = customerOptions.find((item) =>
      item.personIdentification === null
        ? item.taxCode === value
        : item.personIdentification === value
    );
    if (newCustomer) {
      form.setValues({
        customer: {
          ...form.values.customer,
          // nếu loại khách hàng = 1 (cá nhân) thì thay đổi personId, và taxCode = null
          personIdentification:
            newCustomer?.customerTypeId === 1 ? value : null,
          // nếu loại khách hàng = 2 (tổ chức) thì thay đổi taxCode, và personId = null
          taxCode: newCustomer?.customerTypeId === 2 ? value : null,
          customerId: newCustomer?.customerId,
          customerName: newCustomer?.customerName,
          customerTypeId: newCustomer?.customerTypeId,
          address: newCustomer?.address,
        },
      });
      dispatch(setCustomerTypeId(newCustomer.customerTypeId));
    }
  };

  const handleOnClickCustomerIndentify = (e: any) => {
    if (e.target.value === "") {
      handleGetCutsomers("0");
    }
  };

  // Tìm kiếm list khách hàng theo PersonId
  const handleGetCutsomers = async (identity: string) => {
    if (identity && identity !== "") {
      const params = {
        page: 1,
        limit: 10,
        identity: identity,
      };
      const response = await customerApi.getCustomerByIdentify(params);
      setCustomerOptions(
        response.data.data?.map((item: any) => {
          return {
            ...item,
            key: randomId(),
          };
        })
      );
    }
  };

  const optionsAutoComplete = () => {
    const res: any[] = [];
    let filterRes = customerOptions.filter(
      (item) => item.personIdentification !== null
    );
    filterRes.forEach((item) => {
      res.push({
        value: item.personIdentification,
      });
    });
    return res;
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 12 };
  const labelCol = { xs: 10, sm: 10, md: 10, lg: 10, xl: 10 };
  const wrapperCol = { xs: 14, sm: 14, md: 14, lg: 14, xl: 14 };
  const inputFields1: InputFiledParams[] = [
    {
      key: 1,
      label: renderRequired("CCCD/HC/CMTQĐ/MST/ĐKKD"),
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: AUTO_COMPLETE,
      error: form.errors.customer?.personIdentification,
      touched: form.touched.customer?.personIdentification,
      onSearch: handleGetCutsomers,
      value: valueIdentity || form.values.customer.taxCode,
      onChange: handleChangeCustomerIndentify,
      onSelect: handleSelectIdentityCustomer,
      onClick: handleOnClickCustomerIndentify,
      optionsAutocomplete: optionsAutoComplete(),
    },
    {
      key: 2,
      label: renderRequired("Loại khách hàng"),
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      error: form.errors.customer?.customerTypeId,
      touched: form.touched.customer?.customerTypeId,
      value: form.values.customer.customerTypeId,
      options: customerTypeOptions,
      onChange: (value: number) => {
        handleChangeCustomerType(value);
        dispatch(setCustomerTypeId(value));
      },
    },
  ];

  if (isLoading) return <div>...Loading</div>;

  if (error) return <div>Đã có lỗi xảy ra</div>;
  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"small"}
      className="tab-appraisal-wrapper"
    >
      <Form labelWrap labelAlign="left" size="small">
        <Row gutter={[24, 8]}>
          <InputFields data={inputFields1} />
          <Col span={24}>
            <Form.Item
              className="form-item-custom-container"
              labelCol={{ xl: 5, xs: 10, sm: 10, md: 10, lg: 10 }}
              colon={false}
              validateStatus={
                form.touched.customer?.customerName &&
                form.errors.customer?.customerName
                  ? "error"
                  : ""
              }
              help={
                form.touched.customer?.customerName &&
                form.errors.customer?.customerName
              }
              label={
                <Tooltip placement="bottom" title={"Tên khách hàng"}>
                  {/* Tên khách hàng */}
                  {renderRequired("Tên khách hàng")}
                </Tooltip>
              }
            >
              <Input
                placeholder="Nhập"
                value={form.values.customer.customerName}
                onChange={(e: any) => {
                  handleChange({ customerName: e.target.value });
                }}
                className="form-input-custom"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              className="form-item-custom-container"
              labelCol={{ xl: 5, xs: 10, sm: 10, md: 10, lg: 10 }}
              colon={false}
              validateStatus={
                form.touched.customer?.address && form.errors.customer?.address
                  ? "error"
                  : ""
              }
              help={
                form.touched.customer?.address && form.errors.customer?.address
              }
              label={
                <Tooltip placement="bottom" title={"Địa chỉ xuất hóa đơn"}>
                  {/* Địa chỉ xuất hóa đơn */}
                  {renderRequired("Địa chỉ xuất hóa đơn")}
                </Tooltip>
              }
            >
              <Input
                placeholder="Nhập"
                value={form.values.customer.address || ""}
                onChange={(e: any) => {
                  handleChange({ address: e.target.value });
                }}
                className="form-input-custom"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Space>
  );
});

export default CustomerInfor;
