import { Form, Row, Space } from "antd";
import InputFields from "components/InputFields";
import { AssetLandInfoType } from "constant/types/appraisalFile";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./style.scss";
import { isDeepEqual, numberUtils } from "utils";
import { usePrevious } from "hooks/usePrevious";

const { INPUT_NUMBER, POPUP_INPUT, TEXT_AREA, INPUT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const cssLabel = { xs: 10, sm: 10, md: 10, lg: 10, xl: 10 };
const cssInput = { xs: 14, sm: 14, md: 14, lg: 14, xl: 14 };

type mergeLandDataType = {
  facadeLength: number | null;
  totalLength: number | null;
  combinePrivateArea: number | null;
  combineCommonArea: number | null;
  combineAreaWidth: number | null;
  combineAreaInPlan: number | null;
  combineAreaUnPlan: number | null;
  combineNote: string | null;
  combineAppraisalLocation: string | null;
  combineLandShape: string | null;
  combineAreaNotConsiderValue: number | null;
  combineAreaWidthDetail: string | null;
};
type Props = {
  assetLandInfors: Array<AssetLandInfoType>;
  mergeLandData: mergeLandDataType;
};

type RefProps = {
  updateMergeLand: () => void;
};

const initialValues: mergeLandDataType = {
  facadeLength: null,
  totalLength: null,
  combinePrivateArea: null,
  combineCommonArea: null,
  combineAreaWidth: null,
  combineAreaInPlan: null,
  combineAreaUnPlan: null,
  combineNote: null,
  combineAppraisalLocation: null,
  combineLandShape: null,
  combineAreaNotConsiderValue: null,
  combineAreaWidthDetail: null,
};

const formSchema = Yup.object().shape({
  facadeLength: Yup.number()
    .nullable()
    .required("Kích thước mặt tiền không được để trống"),
  totalLength: Yup.number()
    .nullable()
    .required("Kích thước chiều dài không được để trống"),
  combineAppraisalLocation: Yup.string()
    .nullable()
    .required("Địa điểm thẩm định không được để trống"),
  combineNote: Yup.string()
    .nullable()
    .required("Mô tả chi tiết vị trí hợp thửa không được để trống"),
});

const Consolidation = forwardRef<RefProps, Props>(
  ({ assetLandInfors, mergeLandData }, ref) => {
    const [count, setCount] = useState(0);

    const form = useFormik({
      initialValues: initialValues,
      validationSchema: formSchema,
      onSubmit: (data: mergeLandDataType): any => {
        return {
          ...data,
          facadeLength:
            !data.facadeLength && data.facadeLength !== 0
              ? null
              : data.facadeLength,
          totalLength:
            !data.totalLength && data.totalLength !== 0
              ? null
              : data.totalLength,
        };
      },
    });

    useImperativeHandle(ref, () => ({
      updateMergeLand: form.submitForm,
    }));

    const prevMergeLandData = usePrevious(mergeLandData);

    useEffect(() => {
      if (assetLandInfors) {
        const _combinePrivateArea = numberUtils.roundDecimalNumber(
          assetLandInfors.reduce((a, b) => {
            const purposesArr = b.assetLandUsingPurposes
              ? [...b.assetLandUsingPurposes].filter(
                  (el) => !el.isConsolidationPurposeParent
                )
              : [];

            const totalPurpose = purposesArr.reduce((sum, el) => {
              const tmp = el.realPrivateArea ? el.realPrivateArea : 0;
              return sum + tmp;
            }, 0);

            // return a + totalPurpose;
            return a + (b?.realPrivateArea || 0);
          }, 0)
        );
        const _combineCommonArea = numberUtils.roundDecimalNumber(
          assetLandInfors.reduce((a, b) => {
            const purposesArr = b.assetLandUsingPurposes
              ? [...b.assetLandUsingPurposes].filter(
                  (el) => !el.isConsolidationPurposeParent
                )
              : [];

            const totalPurpose = purposesArr.reduce((sum, el) => {
              const tmp = el.realCommonArea ? el.realCommonArea : 0;
              return sum + tmp;
            }, 0);

            // return a + totalPurpose;
            return a + (b?.realCommonArea || 0);
          }, 0)
        );
        const _combineAreaWidth = numberUtils.roundDecimalNumber(
          assetLandInfors.reduce((a, b) => {
            const purposesArr = b.assetLandUsingPurposes
              ? [...b.assetLandUsingPurposes].filter(
                  (el) => !el.isConsolidationPurposeParent
                )
              : [];

            const totalPurpose = purposesArr.reduce((sum, el) => {
              const tmp = el.realAreaWidth ? el.realAreaWidth : 0;
              return sum + tmp;
            }, 0);

            return a + totalPurpose;
          }, 0)
        );
        const _combineAreaInPlan = numberUtils.roundDecimalNumber(
          assetLandInfors.reduce((a, b) => {
            const purposesArr = b.assetLandUsingPurposes
              ? [...b.assetLandUsingPurposes].filter(
                  (el) => !el.isConsolidationPurposeParent
                )
              : [];

            const totalPurpose = purposesArr.reduce((sum, el) => {
              const tmp = el.realAreaInPlan ? el.realAreaInPlan : 0;
              return sum + tmp;
            }, 0);

            return a + totalPurpose;
          }, 0)
        );

        const _combineAreaUnPlan = numberUtils.roundDecimalNumber(
          assetLandInfors.reduce((a, b) => {
            const purposesArr = b.assetLandUsingPurposes
              ? [...b.assetLandUsingPurposes].filter(
                  (el) => !el.isConsolidationPurposeParent
                )
              : [];

            const totalPurpose = purposesArr.reduce((sum, el) => {
              const tmp = el.realAreaUnPlan ? el.realAreaUnPlan : 0;
              return sum + tmp;
            }, 0);

            return a + totalPurpose;
          }, 0)
        );

        const _combineAreaNotConsiderValue = numberUtils.roundDecimalNumber(
          assetLandInfors.reduce((a, b) => {
            const purposesArr = b.assetLandUsingPurposes
              ? [...b.assetLandUsingPurposes].filter(
                  (el) => !el.isConsolidationPurposeParent
                )
              : [];

            const totalPurpose = purposesArr.reduce((sum, el) => {
              const tmp = el.realAreaNotConsiderValue
                ? el.realAreaNotConsiderValue
                : 0;
              return sum + tmp;
            }, 0);

            return a + totalPurpose;
          }, 0)
        );

        const _combineAppraisalLocation =
          form.values.combineAppraisalLocation ||
          mergeLandData.combineAppraisalLocation;

        const _combineNote =
          form.values.combineNote || mergeLandData.combineNote;

        const _combineLandShape =
          form.values.combineLandShape || mergeLandData.combineLandShape;

        const _combineAreaWidthDetail =
          form.values.combineAreaWidthDetail ||
          mergeLandData.combineAreaWidthDetail;

        if (count < 2) {
          form.setValues({
            ...form.values,
            // ...mergeLandData,
            ...(!isDeepEqual(prevMergeLandData, mergeLandData)
              ? {
                  facadeLength: mergeLandData.facadeLength || 0,
                  totalLength: mergeLandData.totalLength || 0,
                }
              : {}),

            combineAreaUnPlan:
              mergeLandData.combineAreaUnPlan !== _combineAreaUnPlan
                ? mergeLandData.combineAreaUnPlan || 0
                : _combineAreaUnPlan,
            combinePrivateArea:
              mergeLandData.combinePrivateArea !== _combinePrivateArea
                ? mergeLandData.combinePrivateArea || 0
                : _combinePrivateArea,
            combineCommonArea:
              mergeLandData.combineCommonArea !== _combineCommonArea
                ? mergeLandData.combineCommonArea || 0
                : _combineCommonArea,
            combineAreaWidth:
              mergeLandData.combineAreaWidth !== _combineAreaWidth
                ? mergeLandData.combineAreaWidth || 0
                : _combineAreaWidth,
            combineAreaInPlan:
              mergeLandData.combineAreaInPlan !== _combineAreaInPlan
                ? mergeLandData.combineAreaInPlan || 0
                : _combineAreaInPlan,
            combineAreaNotConsiderValue:
              mergeLandData.combineAreaNotConsiderValue !==
              _combineAreaNotConsiderValue
                ? mergeLandData.combineAreaNotConsiderValue || 0
                : _combineAreaNotConsiderValue,
            combineAppraisalLocation: _combineAppraisalLocation,
            combineNote: _combineNote,
            combineLandShape: _combineLandShape,
            combineAreaWidthDetail: _combineAreaWidthDetail,
          });
          setCount(count + 1);
        } else {
          form.setValues({
            ...form.values,
            // ...mergeLandData,
            ...(!isDeepEqual(prevMergeLandData, mergeLandData)
              ? {
                  facadeLength: mergeLandData.facadeLength || 0,
                  totalLength: mergeLandData.totalLength || 0,
                }
              : {}),
            combineAreaUnPlan: _combineAreaUnPlan,
            combinePrivateArea: _combinePrivateArea,
            combineCommonArea: _combineCommonArea,
            combineAreaWidth: _combineAreaWidth,
            combineAreaInPlan: _combineAreaInPlan,
            combineAreaNotConsiderValue: _combineAreaNotConsiderValue,
            combineAppraisalLocation: _combineAppraisalLocation,
            combineNote: _combineNote,
            combineLandShape: _combineLandShape,
            combineAreaWidthDetail: _combineAreaWidthDetail,
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetLandInfors, mergeLandData]);

    const inputFields: InputFiledParams[] = [
      {
        key: 1,
        label: "Kích thước mặt tiền (m)",
        css: css,
        type: INPUT_NUMBER,
        value: numberUtils.roundDecimalNumber(form.values.facadeLength),
        onChange: (value: number) =>
          form.setValues({ ...form.values, facadeLength: value }),
        error: form.errors.facadeLength ? form.errors.facadeLength : "",
        touched: form.touched.facadeLength,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        currencable: true,
      },
      {
        key: 2,
        label: "Kích thước chiều dài (m)",
        css: css,
        type: INPUT_NUMBER,
        value: numberUtils.roundDecimalNumber(form.values.totalLength),
        onChange: (value: number) =>
          form.setValues({ ...form.values, totalLength: value }),
        error: form.errors.totalLength ? form.errors.totalLength : "",
        touched: form.touched.totalLength,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        currencable: true,
      },
      {
        key: 3,
        type: POPUP_INPUT,
        css: css,
        value: form.values.combineLandShape,
        onChange: (e: any) =>
          form.setValues({
            ...form.values,
            combineLandShape: e.target.value,
          }),
        label: "Mô tả hình dáng",
        error: form.errors.combineLandShape ? form.errors.combineLandShape : "",
        touched: form.touched.combineLandShape,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        maxLength: 500,
      },
      {
        key: 3.5,
        type: POPUP_INPUT,
        css: css,
        value: form.values.combineAreaWidthDetail,
        onChange: (e: any) =>
          form.setValues({
            ...form.values,
            combineAreaWidthDetail: e.target.value,
          }),
        label: "Chi tiết kích thước",
        error: form.errors.combineAreaWidthDetail
          ? form.errors.combineAreaWidthDetail
          : "",
        touched: form.touched.combineAreaWidthDetail,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        maxLength: 500,
      },
      {
        key: 4,
        type: INPUT_NUMBER,
        css: css,
        value: numberUtils.roundDecimalNumber(form.values.combineAreaWidth),
        label: "Diện tích khuôn viên (m²)",
        disable: true,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        currencable: true,
      },
      {
        key: 5,
        type: INPUT_NUMBER,
        css: css,
        label: "Diện tích sử dụng riêng (m²)",
        value: numberUtils.roundDecimalNumber(form.values.combinePrivateArea),
        disable: true,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        currencable: true,
      },
      {
        key: 6,
        type: INPUT_NUMBER,
        css: css,
        value: numberUtils.roundDecimalNumber(form.values.combineAreaInPlan),
        label: "Diện tích phù hợp quy hoạch (m²)",
        disable: true,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        currencable: true,
      },
      {
        key: 7,
        type: INPUT_NUMBER,
        css: css,
        value: numberUtils.roundDecimalNumber(form.values.combineCommonArea),
        label: "Diện tích sử dụng chung (m²)",
        disable: true,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        currencable: true,
      },
      {
        key: 8,
        type: INPUT_NUMBER,
        css: css,
        value: numberUtils.roundDecimalNumber(form.values.combineAreaUnPlan),
        label: "Diện tích không phù hợp quy hoạch (m²)",
        disable: true,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        currencable: true,
      },
      {
        key: 9,
        type: INPUT_NUMBER,
        css: css,
        value: numberUtils.roundDecimalNumber(
          form.values.combineAreaNotConsiderValue
        ),
        label: "Diện tích mở đường/Diện tích không xem xét giá trị (m²)",
        disable: true,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        currencable: true,
      },
      {
        key: 10,
        type: POPUP_INPUT,
        css: css,
        value: form.values.combineAppraisalLocation,
        onChange: (e: any) =>
          form.setValues({
            ...form.values,
            combineAppraisalLocation: e.target.value,
          }),
        label: "Địa điểm thẩm định",
        error: form.errors.combineAppraisalLocation
          ? form.errors.combineAppraisalLocation
          : "",
        touched: form.touched.combineAppraisalLocation,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        maxLength: 500,
      },
      {
        key: 11,
        type: TEXT_AREA,
        css: { xs: 24 },
        value: form.values.combineNote,
        onChange: (e: any) =>
          form.setValues({
            ...form.values,
            combineNote: e.target.value,
          }),
        label: "Mô tả chi tiết vị trí hợp thửa",
        error: form.errors.combineNote ? form.errors.combineNote : "",
        touched: form.touched.combineNote,
        labelCol: { xs: 5 },
        wrapperCol: { xs: 19 },
        maxLength: 1000,
      },
    ];

    return (
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={"small"}
        className="consolidation-wrapper"
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
