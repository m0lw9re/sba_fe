import { Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { ArrowRightSVG } from "assets";
import InputCustom from "components/InputCustom";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import { useFormik } from "formik";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import {
  isDeepEqual,
  reTypeEmptyString2NullObj,
  validLengthInput,
} from "utils/validate";
import * as Yup from "yup";
import "./style.scss";
import { numberUtils } from "utils";

const { INPUT, INPUT_NUMBER } = TYPE_FIELD;

type RefProps = {
  getData: () => void;
};
type FeatureTablesType = {
  legalMainDirection: string | null;
  legalShape: string | null;
  legalNumberOfFacade: number | null;
  legalFacadeLength: number | null;
  legalLandLength: number | null;
  legalAreaWidth: number | null;
  legalAreaInPlan: number | null;
  legalAreaUnPlan: number | null;
  legalPrivateArea: number | null;
  legalCommonArea: number | null;
  realMainDirection: string | null;
  realShape: string | null;
  realNumberOfFacade: number | null;
  realFacadeLength: number | null;
  realLandLength: number | null;
  realAreaWidth: number | null;
  realAreaInPlan: number | null;
  realAreaUnPlan: number | null;
  realPrivateArea: number | null;
  realCommonArea: number | null;
};
type Props = {
  data: FeatureTablesType;
  updateListTab: any;
};

const style = { width: "100%" };

const formSchema = Yup.object().shape({
  legalMainDirection: Yup.string()
    .nullable()
    .test("legalMainDirectionFormSchema", "Chỉ nhập được 255 ký tự", (val) =>
      validLengthInput(val, 255)
    ),
  legalShape: Yup.string()
    .nullable()
    .test("legalShapeFormSchema", "Chỉ nhập được 255 ký tự", (val) =>
      validLengthInput(val, 255)
    ),
  legalNumberOfFacade: Yup.number()
    .nullable()
    .integer("Chỉ nhập số nguyên dương")
    .test("legalNumberOfFacadeFormSchema", "Chỉ nhập được 10 ký tự", (val) =>
      validLengthInput(val, 10)
    ),
  legalFacadeLength: Yup.number()
    .nullable()
    .test("legalNumberOfFacadeFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
  legalLandLength: Yup.number()
    .nullable()
    .test("legalLandLengthFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
  legalAreaInPlan: Yup.number()
    .nullable()
    .test("legalAreaInPlanFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
  legalPrivateArea: Yup.number()
    .nullable()
    .test("legalPrivateAreaFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
  legalCommonArea: Yup.number()
    .nullable()
    .test("legalCommonAreaFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
  realMainDirection: Yup.string()
    .nullable()
    .test("realMainDirectionFormSchema", "Chỉ nhập được 255 ký tự", (val) =>
      validLengthInput(val, 255)
    ),
  realShape: Yup.string()
    .nullable()
    .test("realShapeFormSchema", "Chỉ nhập được 255 ký tự", (val) =>
      validLengthInput(val, 255)
    ),
  realNumberOfFacade: Yup.number()
    .nullable()
    .integer("Chỉ nhập số nguyên dương")
    .test("realNumberOfFacadeFormSchema", "Chỉ nhập được 10 ký tự", (val) =>
      validLengthInput(val, 10)
    ),
  realFacadeLength: Yup.number()
    .nullable()
    .test("realNumberOfFacadeFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
  realLandLength: Yup.number()
    .nullable()
    .test("realLandLengthFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
  realAreaInPlan: Yup.number()
    .nullable()
    .test("realAreaInPlanFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
  realPrivateArea: Yup.number()
    .nullable()
    .test("realPrivateAreaFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
  realCommonArea: Yup.number()
    .nullable()
    .test("realCommonAreaFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
});

const FeatureTables = forwardRef<RefProps, Props>(
  ({ data, updateListTab }, ref) => {
    const form = useFormik({
      initialValues: {} as FeatureTablesType,
      validationSchema: formSchema,
      onSubmit: (data: FeatureTablesType): any => {
        return data;
      },
    });
    const handleCopyLegalToReal = () => {
      handleChangeData({
        realMainDirection: form.values.legalMainDirection,
        realShape: form.values.legalShape,
        realNumberOfFacade: form.values.legalNumberOfFacade,
        realFacadeLength: form.values.legalFacadeLength,
        realLandLength: form.values.legalLandLength,
        // realAreaWidth: form.values.legalAreaWidth,
        realAreaInPlan: form.values.legalAreaInPlan,
        realAreaUnPlan: form.values.legalAreaUnPlan,
        realPrivateArea: form.values.legalPrivateArea,
        realCommonArea: form.values.legalCommonArea,
      });
      updateListTab();
    };

    const handleChangeData = (data: any) => {
      const _data = reTypeEmptyString2NullObj(data);
      form.setValues({ ...form.values, ..._data });
    };

    const dataSource = [
      {
        type: "Hướng chính",
        hspl: (
          <FormItem
            placeholder="Nhập"
            type={INPUT}
            style={style}
            value={form.values.legalMainDirection || ""}
            disable={true}
            error={form.errors.legalMainDirection}
            touched={form.touched.legalMainDirection}
            onChange={(e: any) =>
              handleChangeData({
                legalMainDirection: e.target.value,
              })
            }
          />
        ),
        real: (
          <FormItem
            placeholder="Nhập"
            type={INPUT}
            style={style}
            value={form.values.realMainDirection || ""}
            disable
            error={form.errors.realMainDirection}
            touched={form.touched.realMainDirection}
            onChange={(e: any) =>
              handleChangeData({ realMainDirection: e.target.value })
            }
          />
        ),
      },
      {
        type: "Hình dạng",
        hspl: (
          <FormItem
            type={INPUT}
            value={form.values.legalShape}
            onChange={(e: any) =>
              handleChangeData({
                legalShape: e.target.value,
              })
            }
            error={form.errors.legalShape}
            touched={form.touched.legalShape}
            placeholder="Nhập"
          />
        ),
        real: (
          <FormItem
            type={INPUT}
            value={form.values.realShape}
            onChange={(e: any) =>
              handleChangeData({
                realShape: e.target.value,
              })
            }
            error={form.errors.realShape}
            touched={form.touched.realShape}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: "Số mặt tiền/mặt thoáng",
        hspl: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.legalNumberOfFacade}
            onChange={(value: number) =>
              handleChangeData({ legalNumberOfFacade: value })
            }
            error={form.errors.legalNumberOfFacade}
            touched={form.touched.legalNumberOfFacade}
            placeholder="Nhập"
          />
        ),
        real: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.realNumberOfFacade}
            onChange={(value: number) =>
              handleChangeData({ realNumberOfFacade: value })
            }
            error={form.errors.realNumberOfFacade}
            touched={form.touched.realNumberOfFacade}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: "Kích thước mặt tiền (m)",
        hspl: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.legalFacadeLength}
            onChange={(value: number) =>
              handleChangeData({ legalFacadeLength: value })
            }
            error={form.errors.legalFacadeLength}
            touched={form.touched.legalFacadeLength}
            placeholder="Nhập"
            currencable
          />
        ),
        real: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.realFacadeLength}
            onChange={(value: number) => {
              handleChangeData({ realFacadeLength: value });
            }}
            error={form.errors.realFacadeLength}
            touched={form.touched.realFacadeLength}
            placeholder="Nhập"
            currencable
          />
        ),
      },
      {
        type: "Kích thước chiều dài (m)",
        hspl: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.legalLandLength}
            onChange={(value: number) =>
              handleChangeData({ legalLandLength: value })
            }
            error={form.errors.legalLandLength}
            touched={form.touched.legalLandLength}
            placeholder="Nhập"
            currencable
          />
        ),
        real: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.realLandLength}
            onChange={(value: number) =>
              handleChangeData({ realLandLength: value })
            }
            error={form.errors.realLandLength}
            touched={form.touched.realLandLength}
            placeholder="Nhập"
            currencable
          />
        ),
      },
      {
        type: "Diện tích khuôn viên (m²)",
        hspl: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.legalAreaWidth}
            onChange={(value: number) => {
              const legalAreaUnPlan =
                numberUtils.roundDecimalNumber(
                  Number(value) - Number(form.values.legalAreaInPlan)
                ) || 0;
              handleChangeData({
                legalAreaWidth: value,
                legalAreaUnPlan,
              });
              if (legalAreaUnPlan < 0) return;
            }}
            error={form.errors.legalAreaWidth}
            placeholder="Nhập"
            currencable
          />
        ),
        real: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.realAreaWidth}
            onChange={(value: number) => {
              handleChangeData({
                realAreaWidth: value,
                realAreaUnPlan: numberUtils.roundDecimalNumber(
                  Number(value) - Number(form.values.realAreaInPlan)
                ),
              });
            }}
            error={form.errors.realAreaWidth}
            placeholder="Nhập"
            currencable
            disable
          />
        ),
      },
      {
        type: "Diện tích phù hợp quy hoạch (m²)",
        hspl: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.legalAreaInPlan}
            onChange={(value: number) => {
              const legalAreaUnPlan =
                numberUtils.roundDecimalNumber(
                  Number(form.values.legalAreaWidth) - Number(value)
                ) || 0;

              handleChangeData({
                legalAreaInPlan: value,
                legalAreaUnPlan,
              });
              if (legalAreaUnPlan < 0) return;
            }}
            error={form.errors.legalAreaInPlan}
            touched={form.touched.legalAreaInPlan}
            placeholder="Nhập"
            currencable
          />
        ),
        real: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.realAreaInPlan}
            onChange={(value: number) => {
              const realAreaUnPlan =
                numberUtils.roundDecimalNumber(
                  Number(form.values.realAreaWidth) - Number(value)
                ) || 0;
              handleChangeData({
                realAreaInPlan: value,
                realAreaUnPlan,
              });
              if (realAreaUnPlan < 0) return;
            }}
            error={form.errors.realAreaInPlan}
            touched={form.touched.realAreaInPlan}
            placeholder="Nhập"
            currencable
          />
        ),
      },
      {
        type: "Diện tích không phù hợp quy hoạch (m²)",
        hspl: (
          <FormItem
            type={INPUT_NUMBER}
            value={
              Number(form.values.legalAreaWidth) -
              Number(form.values.legalAreaInPlan)
            }
            error={form.errors.legalAreaUnPlan}
            placeholder="Nhập"
            disable={true}
            currencable
          />
        ),
        real: (
          <FormItem
            type={INPUT_NUMBER}
            value={
              Number(form.values.realAreaWidth) -
              Number(form.values.realAreaInPlan)
            }
            onChange={() => {}}
            error={form.errors.realAreaUnPlan}
            placeholder="Nhập"
            disable={true}
            currencable
          />
        ),
      },
      {
        type: "Diện tích sử dụng riêng (m²)",
        hspl: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.legalPrivateArea}
            onChange={(value: number) =>
              handleChangeData({ legalPrivateArea: value })
            }
            error={form.errors.legalPrivateArea}
            touched={form.touched.legalPrivateArea}
            placeholder="Nhập"
            currencable
          />
        ),
        real: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.realPrivateArea}
            onChange={(value: number) => {
              handleChangeData({ realPrivateArea: value });
              updateListTab();
            }}
            error={form.errors.realPrivateArea}
            touched={form.touched.realPrivateArea}
            placeholder="Nhập"
            currencable
          />
        ),
      },
      {
        type: "Diện tích sử dụng chung (m²)",
        hspl: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.legalCommonArea}
            onChange={(value: number) => {
              handleChangeData({ legalCommonArea: value });
            }}
            error={form.errors.legalCommonArea}
            touched={form.touched.legalCommonArea}
            placeholder="Nhập"
            currencable
          />
        ),
        real: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.realCommonArea}
            onChange={(value: number) => {
              handleChangeData({ realCommonArea: value });
              updateListTab();
            }}
            error={form.errors.realCommonArea}
            touched={form.touched.realCommonArea}
            placeholder="Nhập"
            currencable
          />
        ),
      },
    ];

    const columns: ColumnsType<any> = [
      {
        key: 1,
        title: "Đặc điểm",
        dataIndex: "type",
        width: "30%",
      },
      {
        key: 2,
        title: "HSPL",
        dataIndex: "hspl",
        width: "30%",
      },
      {
        key: 3,
        title: (
          <ArrowRightSVG
            className="feature-table-icon-copy"
            onClick={handleCopyLegalToReal}
          />
        ),
        dataIndex: "icon",
        width: "5%",
      },
      {
        key: 4,
        title: "Thực tế",
        dataIndex: "real",
        width: "30%",
      },
    ];
    useImperativeHandle(ref, () => ({
      getData: form.submitForm,
    }));

    useEffect(() => {
      form.setValues(data);
    }, [data]);

    return (
      <Table
        size="small"
        className="form-item-table-add-custom-container"
        bordered
        scroll={{ x: true }}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
      />
    );
  }
);

export default memo(FeatureTables, (prevProps, nextProps) =>
  isDeepEqual(prevProps.data, nextProps.data)
);
