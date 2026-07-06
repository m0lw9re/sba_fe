import { Form, Row, Space } from "antd";
import InputFields from "components/InputFields";
import { AssetApartmentInfoType } from "constant/types/appraisalFile";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { numberUtils } from "utils";

const { TEXT_AREA, INPUT_NUMBER, POPUP_INPUT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
const cssLabel = { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 };
const cssInput = { xs: 18, sm: 18, md: 18, lg: 18, xl: 18 };

type mergeApartmentDataType = {
  combinePrivateArea: number | null;
  combineNote: string | null;
  combineAppraisalLocation: string | null;
};
type Props = {
  assetApartmentInfors: Array<AssetApartmentInfoType>;
  mergeApartmentData: mergeApartmentDataType;
};

type RefProps = {
  updateMergeApartment: () => void;
};

const initialValues: mergeApartmentDataType = {
  combinePrivateArea: null,
  combineNote: null,
  combineAppraisalLocation: null,
};

const formSchema = Yup.object().shape({
  // facadeLength: Yup.number().required(
  //   "Diện tích sử dụng riêng không được để trống"
  // ),
});

const Consolidation = forwardRef<RefProps, Props>(
  ({ assetApartmentInfors, mergeApartmentData }, ref) => {
    const form = useFormik({
      initialValues: initialValues,
      validationSchema: formSchema,
      onSubmit: (data: mergeApartmentDataType): any => {
        return data;
      },
    });

    useImperativeHandle(ref, () => ({
      updateMergeApartment: form.submitForm,
    }));

    useEffect(() => {
      if (assetApartmentInfors) {
        const getData: mergeApartmentDataType = {
          ...mergeApartmentData,
          combinePrivateArea: assetApartmentInfors.reduce((a, b) => {
            const tmp = b.realPrivateUseArea ? b.realPrivateUseArea : 0;
            return a + tmp;
          }, 0),
        };
        form.setValues({ ...form.values, ...getData });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetApartmentInfors]);

    const inputFields: InputFiledParams[] = [
      {
        key: 1,
        type: INPUT_NUMBER,
        css: css,
        label: "Diện tích sử dụng riêng (m²)",
        currencable: true,
        value: numberUtils.roundDecimalNumber(form.values.combinePrivateArea),
        onChange: (value: number) =>
          form.setValues({ ...form.values, combinePrivateArea: value }),
        labelCol: cssLabel,
        wrapperCol: cssInput,
      },
      {
        key: 2,
        type: TEXT_AREA,
        css: css,
        value: form.values.combineAppraisalLocation,
        onChange: (e: any) =>
          form.setValues({
            ...form.values,
            combineAppraisalLocation: e.target.value,
          }),
        label: "Địa điểm thẩm định",
        // error: form.errors.combineAppraisalLocation
        //   ? form.errors.combineAppraisalLocation
        //   : "",
        // touched: form.touched.combineAppraisalLocation,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        maxLength: 500,
      },
      {
        key: 3,
        type: TEXT_AREA,
        css: css,
        label: "Ghi chú",
        value: form.values.combineNote,
        onChange: (e: any) =>
          form.setValues({ ...form.values, combineNote: e.target.value }),
        labelCol: cssLabel,
        wrapperCol: cssInput,
        maxLength: 1000,
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
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
        </Form>
      </Space>
    );
  }
);

export default memo(Consolidation);
