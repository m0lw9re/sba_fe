import { Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { ArrowRightSVG } from "assets";
import InputCustom from "components/InputCustom";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import { useFormik } from "formik";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import { isDeepEqual, reTypeEmptyString2NullObj } from "utils/validate";
import * as Yup from "yup";
import "./style.scss";
import { numberUtils } from "utils";

const { POPUP_INPUT, INPUT_NUMBER, INPUT } = TYPE_FIELD;

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
  legalAreaNotConsiderValue: number | null;
  legalCurrentPrivateUsing: string | null;
  legalLandLengthDetail: string | null;
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
  realAreaNotConsiderValue: number | null;
  realCurrentPrivateUsing: string | null;
  realLandLengthDetail: string | null;
};
type Props = {
  data: FeatureTablesType;
  updateListTab: any;
};

const style = { width: "100%" };
const formSchema = Yup.object().shape({
  realAreaWidth: Yup.number()
    .typeError("Chỉ được nhập số")
    .nullable()
    .required("Diện tích khuôn viên không được để trống"),
  realAreaInPlan: Yup.number().nullable(),

  realAreaNotConsiderValue: Yup.number().nullable(),
  realAreaUnPlan: Yup.number()
    .nullable()
    .test({
      name: "realAreaUnPlan",
      exclusive: false,
      params: {},
      message: "Diện tích KPHQH sai công thức",
      test: (value, context) => {
        const realAreaWidth: number = context.parent?.realAreaWidth || 0;
        const realAreaInPlan: number = context.parent?.realAreaInPlan || 0;
        const realAreaNotConsiderValue: number =
          context.parent?.realAreaNotConsiderValue || 0;

        const sub_value: string = Number(
          realAreaWidth - realAreaInPlan - realAreaNotConsiderValue
        ).toFixed(3);

        return value === Number(sub_value);
      },
    }),
});

const FeatureTables = forwardRef<RefProps, Props>(
  ({ data, updateListTab }, ref) => {
    const form = useFormik({
      initialValues: {} as FeatureTablesType,
      validationSchema: formSchema,
      validateOnChange: true,
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
        realAreaNotConsiderValue: form.values.legalAreaNotConsiderValue,
        realCurrentPrivateUsing: form.values.legalCurrentPrivateUsing,
        realLandLengthDetail: form.values.legalLandLengthDetail,
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
          <InputCustom
            placeholder="Nhập"
            style={style}
            value={form.values.legalMainDirection || ""}
            onChange={(e: any) =>
              handleChangeData({
                legalMainDirection: e.target.value,
              })
            }
          />
        ),
        real: (
          <InputCustom
            placeholder="Nhập"
            style={style}
            value={form.values.realMainDirection || ""}
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
            type={POPUP_INPUT}
            maxLength={500}
            value={form.values.legalShape}
            onChange={(e: any) =>
              handleChangeData({
                legalShape: e.target.value,
              })
            }
            error={form.errors.legalShape}
            placeholder="Nhập"
          />
        ),
        real: (
          <FormItem
            type={POPUP_INPUT}
            maxLength={500}
            value={form.values.realShape}
            onChange={(e: any) =>
              handleChangeData({
                realShape: e.target.value,
              })
            }
            error={form.errors.realShape}
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
            placeholder="Nhập"
            currencable
          />
        ),
      },
      {
        type: "Chi tiết kích thước",
        hspl: (
          <FormItem
            type={POPUP_INPUT}
            maxLength={500}
            value={form.values.legalLandLengthDetail}
            onChange={(e: any) =>
              handleChangeData({
                legalLandLengthDetail: e.target.value,
              })
            }
            error={form.errors.legalLandLengthDetail}
            placeholder="Nhập"
          />
        ),
        real: (
          <FormItem
            type={POPUP_INPUT}
            maxLength={500}
            value={form.values.realLandLengthDetail}
            onChange={(e: any) =>
              handleChangeData({
                realLandLengthDetail: e.target.value,
              })
            }
            error={form.errors.realLandLengthDetail}
            placeholder="Nhập"
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
                  Number(value) -
                    Number(form.values.legalAreaInPlan) -
                    Number(form.values.legalAreaNotConsiderValue)
                ) || 0;
              if (legalAreaUnPlan < 0) return;

              handleChangeData({
                legalAreaWidth: value,
                legalAreaUnPlan,
              });
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
                  Number(value) -
                    Number(form.values.realAreaInPlan) -
                    Number(form.values.realAreaNotConsiderValue)
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
                  Number(form.values.legalAreaWidth) -
                    Number(form.values.legalAreaNotConsiderValue) -
                    Number(value)
                ) || 0;
              if (legalAreaUnPlan < 0) return;

              handleChangeData({
                legalAreaInPlan: value,
                legalAreaUnPlan,
              });
            }}
            error={form.errors.legalAreaInPlan}
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
                  Number(form.values.realAreaWidth) -
                    Number(form.values.realAreaNotConsiderValue) -
                    Number(value)
                ) || 0;
              if (realAreaUnPlan < 0) return;

              handleChangeData({
                realAreaInPlan: value,
                realAreaUnPlan,
              });
            }}
            error={form.errors.realAreaInPlan}
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
            value={Number(form.values.legalAreaUnPlan)}
            error={form.errors.legalAreaUnPlan}
            touched={form.errors.legalAreaUnPlan}
            placeholder="Nhập"
            disable={true}
            currencable
          />
        ),
        real: (
          <FormItem
            type={INPUT_NUMBER}
            value={Number(form.values.realAreaUnPlan)}
            error={form.errors.realAreaUnPlan}
            touched={form.errors.realAreaUnPlan}
            placeholder="Nhập"
            disable={true}
            currencable
          />
        ),
      },
      {
        type: "Diện tích mở đường/Diện tích không xem xét giá trị (m²)",
        hspl: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.legalAreaNotConsiderValue}
            onChange={(value: number) => {
              const legalAreaUnPlan =
                numberUtils.roundDecimalNumber(
                  Number(form.values.legalAreaWidth) -
                    Number(form.values.legalAreaInPlan) -
                    Number(value)
                ) || 0;
              if (legalAreaUnPlan < 0) return;

              handleChangeData({
                legalAreaNotConsiderValue: value,
                legalAreaUnPlan,
              });
            }}
            error={form.errors.legalAreaNotConsiderValue}
            placeholder="Nhập"
            currencable
          />
        ),
        real: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.realAreaNotConsiderValue}
            onChange={(value: number) => {
              const realAreaUnPlan =
                numberUtils.roundDecimalNumber(
                  Number(form.values.realAreaWidth) -
                    Number(form.values.realAreaInPlan) -
                    Number(value)
                ) || 0;
              if (realAreaUnPlan < 0) return;

              handleChangeData({
                realAreaNotConsiderValue: value,
                realAreaUnPlan,
              });
            }}
            error={form.errors.realAreaNotConsiderValue}
            placeholder="Nhập"
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
            placeholder="Nhập"
            currencable
          />
        ),
      },
      {
        type: "Hiện trạng sử dụng riêng",
        hspl: (
          <FormItem
            type={INPUT}
            value={form.values.legalCurrentPrivateUsing}
            onChange={(e: any) =>
              handleChangeData({
                legalCurrentPrivateUsing: e.target.value,
              })
            }
            error={form.errors.legalCurrentPrivateUsing}
            placeholder="Nhập"
            currencable
          />
        ),
        real: (
          <FormItem
            type={INPUT}
            value={form.values.realCurrentPrivateUsing}
            onChange={(e: any) =>
              handleChangeData({
                realCurrentPrivateUsing: e.target.value,
              })
            }
            error={form.errors.realCurrentPrivateUsing}
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
      getData: async () => {
        await form.submitForm();
        const _data = { ...form.values };
        const validate =
          JSON.stringify(form.errors) === "{}" ? false : form.errors;
        return [_data, validate];
      },
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
