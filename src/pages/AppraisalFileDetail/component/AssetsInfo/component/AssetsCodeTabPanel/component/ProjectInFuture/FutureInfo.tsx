import { Row } from "antd";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { FutureInfoType } from "constant/types/appraisalFile";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import { isDeepEqual } from "utils";
import * as Yup from "yup";
import "./style.scss";
const { INPUT_NUMBER, PERCENT } = TYPE_FIELD;

type Props = {
  data: FutureInfoType;
};
type RefProps = {
  getData: () => void;
};
const css = { xs: 24, md: 12, lg: 12 };
const formSchema = Yup.object().shape({
  totalFloorArea: Yup.number()
    .nullable()
    .required("Diện tích sàn không được để trống"),
});
const futureInfoInit: FutureInfoType = {
  totalArea: null,
  buildingDensity: null,
  coeffcientsUsed: null,
  height: null,
  totalFloorArea: null,
  numOfFloors: null,
  totalApartments: null,
  underTankArea: null,
  wasteTankArea: null,
};
const FutureInfo = forwardRef<RefProps, Props>(({ data }, ref) => {
  const form = useFormik({
    initialValues: futureInfoInit as FutureInfoType | any,
    validationSchema: formSchema,
    onSubmit: (data: FutureInfoType): any => {
      return {
        ...data,
      };
    },
  });
  const handleChange = (value: any) => {
    form.setValues({ ...form.values, ...value });
  };
  const futureInfoInputs: InputFiledParams[] = [
    {
      key: 1,
      label: "Tổng diện tích đất quy hoạch (m²)",
      type: INPUT_NUMBER,
      css,
      value: form.values.totalArea,
      onChange: (value: any) => handleChange({ totalArea: value }),
      currencable: true,
    },
    {
      key: 2,
      label: "Mật độ xây dựng (%)",
      type: INPUT_NUMBER,
      css,
      percentable: true,
      value: form.values.buildingDensity,
      onChange: (value: any) => handleChange({ buildingDensity: value }),
    },
    {
      key: 3,
      label: "Hệ số sử dụng đất (lần)",
      type: INPUT_NUMBER,
      css,
      currencable: true,
      value: form.values.coeffcientsUsed,
      onChange: (value: any) => handleChange({ coeffcientsUsed: value }),
    },
    {
      key: 4,
      label: "Chiều cao công trình (m)",
      type: INPUT_NUMBER,
      css,
      value: form.values.height,
      onChange: (value: any) => handleChange({ height: value }),
      currencable: true,
    },
    {
      key: 5,
      label: "Tổng diện tích sàn xây dựng (m²)",
      type: INPUT_NUMBER,
      css,
      value: form.values.totalFloorArea,
      onChange: (value: any) => handleChange({ totalFloorArea: value }),
      currencable: true,
      error: form.errors.totalFloorArea,
      touched: form.touched.totalFloorArea,
    },
    {
      key: 6,
      label: "Số tầng",
      type: INPUT_NUMBER,
      css,
      currencable: true,
      value: form.values.numOfFloors,
      onChange: (value: any) => handleChange({ numOfFloors: value }),
    },
    {
      key: 7,
      label: "Tổng số căn hộ (căn)",
      type: INPUT_NUMBER,
      css,
      // currencable: true,
      value: form.values.totalApartments,
      onChange: (value: any) => handleChange({ totalApartments: value }),
    },
    {
      key: 8,
      label: "Bể nước ngầm (m3)",
      type: INPUT_NUMBER,
      css,
      value: form.values.underTankArea,
      onChange: (value: any) => handleChange({ underTankArea: value }),
      currencable: true,
    },
    {
      key: 9,
      label: "Bể nước thải (m3)",
      type: INPUT_NUMBER,
      css,
      value: form.values.wasteTankArea,
      onChange: (value: any) => handleChange({ wasteTankArea: value }),
      currencable: true,
    },
  ];

  useImperativeHandle(ref, () => ({
    getData: async () => {
      await form.submitForm();
      const validate =
        JSON.stringify(form.errors) === "{}" ? false : form.errors;
      return [form.values, validate];
    },
  }));

  useEffect(() => {
    if (data) {
      form.setValues(data);
    }
  }, [JSON.stringify(data)]);

  return (
    <Row gutter={[8, 8]} style={{ width: "100%" }}>
      <InputFields data={futureInfoInputs} />
    </Row>
  );
});
export default memo(FutureInfo, (prevProps, nextProps) => {
  return isDeepEqual(prevProps.data, nextProps.data);
});
