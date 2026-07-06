import { Col, Form, Input, Row, Space, Tooltip } from "antd";
import { assetCommonApi } from "apis/assetCommon";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { Liquidities } from "constants/types/assetCommon.type";
import { useFormik } from "formik";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as Yup from "yup";
import "./style.scss";
import { stringValidate, validLengthInput } from "utils/validate";
import { numberUtils } from "utils";
import { DISPUTE_INFORMATION_OPTIONS } from "constant/common";
import { RootState } from "configs/configureStore";
import { useSelector } from "react-redux";

const { INPUT, SELECT, INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  assetlevel2: number;
  otherInfor: {
    usingOrigin: string;
    numberOfKilometersUsed: number;
    currentUseSituation: string | null;
    liquidity: string | null;
    remainQuality: number;
    disputeInfor: string | null;
    note: string | null;
  };
};

type FormDataType = {
  usingOrigin: string;
  numberOfKilometersUsed: number;
  currentUseSituation: string | null;
  liquidity: string | null;
  remainQuality: number;
  disputeInfor: string | null;
  note: string | null;
};

type RefProps = {
  updateOtherInfoLand: () => void;
};

const maxStringLength = "Chỉ nhập được 255 ký tự";

const formSchema = Yup.object().shape({
  usingOrigin: stringValidate
    .test("usingOrigin", maxStringLength, (val) => validLengthInput(val, 255))
    .nullable(),
  currentUseSituation: Yup.string()
    .test("currentUseSituation", maxStringLength, (val) =>
      validLengthInput(val, 255)
    )
    .nullable(),
  liquidity: Yup.string().nullable(),
  remainQuality: Yup.number()
    .test("remainQuality", "Chỉ được nhập 10 ký tự", (val) =>
      validLengthInput(val, 10)
    )
    .nullable(),

  disputeInfor: Yup.string().nullable(),
  numberOfKilometersUsed: Yup.number()
    .test("numberOfKilometersUsed", "Chỉ được nhập 25 ký tự", (val) =>
      validLengthInput(val, 25)
    )
    .nullable(),
  note: Yup.string()
    .test("note", "Chỉ được nhập 4000 ký tự", (val) =>
      validLengthInput(val, 4000)
    )
    .nullable(),
});

const OtherInfoTransport = forwardRef<RefProps, Props>(
  ({ otherInfor, assetlevel2 }, ref) => {
    const form = useFormik({
      initialValues: {} as FormDataType | any,
      validationSchema: formSchema,
      validateOnChange: true,
      onSubmit: (data: FormDataType): any => {
        return data;
      },
    });

    const { isCompleteSurvey } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );

    const [liquidities, setLiquidities] = useState<Liquidities[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        const resliquities = await assetCommonApi.getLiquidities();
        setLiquidities(resliquities.data);
      };
      fetchData();
    }, []);

    const handleChange = useCallback(
      (data: any) => {
        form.setValues({ ...form.values, ...data });
      },
      [form.values]
    );

    useImperativeHandle(ref, () => ({
      updateOtherInfoLand: async () => {
        return form.submitForm();
      },
    }));

    useEffect(() => {
      if (otherInfor) {
        form.setValues({
          ...form.values,
          ...otherInfor,
          liquidity: otherInfor.liquidity || "2",
          disputeInfor: otherInfor.disputeInfor || "0",
        });
      }
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        const resliquities = await assetCommonApi.getLiquidities();
        setLiquidities(resliquities.data);
      };
      fetchData();
    }, []);

    const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
    const inputFields: InputFiledParams[] = [
      {
        key: 1,
        css: css,
        type: INPUT,
        label: "Nguồn gốc",
        value: form.values.usingOrigin,
        error: form.errors.usingOrigin,
        touched: form.touched.usingOrigin,
        labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
        wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
        onChange: (e: any) => {
          handleChange({ usingOrigin: e.target.value });
        },
        maxLength: 255,
        placeholder: "Nhập",
      },
      {
        key: 2,
        css: css,
        type: INPUT,
        label: "Hiện trạng sử dụng",
        error: form.errors.currentUseSituation,
        touched: form.touched.currentUseSituation,
        value: form.values.currentUseSituation,
        labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
        wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
        onChange: (e: any) => {
          handleChange({ currentUseSituation: e.target.value });
        },
        maxLength: 255,
        placeholder: "Nhập",
      },
      {
        key: 3,
        label: "Khả mại/ Tính thanh khoản",
        type: SELECT,
        error: form.errors.liquidity,
        touched: form.touched.liquidity,
        value: form.values.liquidity,
        labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
        wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
        onChange: (value: string) => {
          handleChange({ liquidity: value });
        },
        options:
          liquidities?.map((item) => ({
            value: item.id.toString(),
            label: item.name,
          })) || [],
        maxLength: 255,
        css: css,
        placeholder: "Nhập",
      },
      {
        key: 4,
        label: "Chất lượng còn lại (%)",
        type: INPUT_NUMBER,
        css: css,
        error: form.errors.remainQuality,
        touched: form.touched.remainQuality,
        value: form.values.remainQuality,
        labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
        wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
        onChange: (value: number) => {
          handleChange({
            remainQuality: numberUtils.roundTwoDigitsDecimalNumber(
              parseFloat(`${value}`.replace(",", "."))
            ),
          });
        },
        formatter: (value) => {
          const parts = `${value}`.split(",");
          return parts.join(".");
        },
        parser: (value) => value!.replace(/,/g, "."),
        max: 100,
        min: 0,
        placeholder: "Nhập",
      },
      {
        key: 5,
        label: "Thông tin tranh chấp",
        css: css,
        error: form.errors.disputeInfor,
        touched: form.touched.disputeInfor,
        value: form.values.disputeInfor,
        labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
        wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
        onChange: (value: string) => {
          handleChange({ disputeInfor: value });
        },
        type: SELECT,
        placeholder: "Chọn",
        options: DISPUTE_INFORMATION_OPTIONS,
      },
      {
        key: 6,
        label: "Số km đã qua sử dụng",
        css: css,
        value: form.values.numberOfKilometersUsed,
        error: form.errors.numberOfKilometersUsed,
        touched: form.touched.numberOfKilometersUsed,
        labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
        wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
        onChange: (value: number) => {
          handleChange({
            numberOfKilometersUsed:
              numberUtils.roundTwoDigitsDecimalNumber(value),
          });
        },
        currencable: true,
        min: 0,
        type: INPUT_NUMBER,
        placeholder: "Nhập",
      },
    ];
    return (
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={"small"}
        className="otherInfo-wrapper"
      >
        <Form labelAlign="left" labelWrap size="small">
          <Row
            gutter={[24, 4]}
            style={{ marginBottom: "8px", marginTop: "8px" }}
          >
            <InputFields data={inputFields} />
            <Col span={24}>
              <Form.Item
                className="form-item-custom"
                labelCol={{ span: 4 }}
                colon={false}
                label={
                  <Tooltip placement="bottom" title={"Ghi chú"}>
                    Ghi chú
                  </Tooltip>
                }
                validateStatus={
                  form.errors.note && form.touched.note ? "error" : ""
                }
                help={
                  form.errors.note && form.touched.note ? form.errors.note : ""
                }
              >
                <Input.TextArea
                  rows={4}
                  showCount={true}
                  value={form.values.note ? form.values.note : ""}
                  onChange={(e) => {
                    handleChange({ note: e.target.value });
                  }}
                  className="form-input-custom"
                  maxLength={4000}
                  allowClear={false}
                  placeholder="Nhập"
                  disabled={isCompleteSurvey}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Space>
    );
  }
);

export default OtherInfoTransport;
