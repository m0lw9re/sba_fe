import { Col, Form, Input, Row, Space, Tooltip } from "antd";
import { assetCommonApi } from "apis/assetCommon";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import {
  BussinessAdvantages,
  Liquidities,
} from "constants/types/assetCommon.type";
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
import { validLengthInput } from "utils/validate";
import { OtherInfoProjectType } from "constant/types/appraisalFilesDetail";
import {
  DISPUTE_PROJECT_INFORMATION_OPTIONS,
  PROJECT_PLANNING_INFO,
} from "constant/common";
import { RootState } from "configs/configureStore";
import { useSelector } from "react-redux";

const { INPUT, SELECT } = TYPE_FIELD;

type Props = {
  data: OtherInfoProjectType;
};

type FormDataType = {
  businessAdvantage: number | null;
  liquidity: string | null;
  currentUseSituation: string | null;
  disputeInfor: string | null;
  planningInfor: string | null;
  note: string | null;
};

type RefProps = {
  updateOtherInfoProject: () => void;
};

const formSchema = Yup.object().shape({
  businessAdvantage: Yup.string().nullable(),
  currentUseSituation: Yup.string()
    .nullable()
    .test(
      "projectFormSchemaCurrentUseSituation",
      "Chỉ nhập được 255 ký tự",
      (val) => validLengthInput(val, 255)
    ),
  liquidity: Yup.string().nullable(),
  planningInfor: Yup.string().nullable(),
  disputeInfor: Yup.string().nullable(),
  note: Yup.string()
    .nullable()
    .test("projectFormSchemaNote", "Chỉ nhập được 4000 ký tự", (val) =>
      validLengthInput(val, 4000)
    ),
});

const OtherInfoProject = forwardRef<RefProps, Props>(({ data }, ref) => {
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

  const [businessAdvantages, setBusinessAdvantages] = useState<
    BussinessAdvantages[]
  >([]);
  const [liquidities, setLiquidities] = useState<Liquidities[]>([]);

  const handleChange = useCallback(
    (data: any) => {
      form.setValues({ ...form.values, ...data });
    },
    [form.values]
  );

  useImperativeHandle(ref, () => ({
    updateOtherInfoProject: async () => {
      return form.submitForm();
    },
  }));

  useEffect(() => {
    if (data) {
      const getData = {
        ...data,
        businessAdvantage: data.businessAdvantage,
        liquidity: data.liquidity,
        currentUseSituation: data.currentUseSituation,
        disputeInfor: data.disputeInfor ? data.disputeInfor : "0",
        planningInfor: data.planningInfor,
        note: data.note,
      };
      form.setValues({ ...form.values, ...getData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      const resliquities = await assetCommonApi.getLiquidities();
      const resbussinessAdvange = await assetCommonApi.getBussinessAdvantages();
      setBusinessAdvantages(resbussinessAdvange.data);
      setLiquidities(resliquities.data);
    };
    fetchData();
  }, []);

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      css: css,
      type: SELECT,
      label: "Lợi thế kinh doanh",
      value: Number(form.values.businessAdvantage) || null,
      error: form.errors.businessAdvantage,
      touched: form.touched.businessAdvantage,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      onChange: (e: any) => {
        handleChange({ businessAdvantage: e });
      },
      options:
        businessAdvantages?.map((item, index) => ({
          value: item.id,
          label: item.name,
        })) || [],
      placeholder: "Chọn",
    },
    {
      key: 2,
      css: css,
      type: SELECT,
      label: "Khả mại/Tính thanh khoản",
      value: form.values.liquidity,
      error: form.errors.liquidity,
      touched: form.touched.liquidity,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      onChange: (value: any) => {
        handleChange({ liquidity: value });
      },
      options:
        liquidities?.map((item, index) => ({
          value: item.id.toString(),
          label: item.name,
        })) || [],
      placeholder: "Chọn",
    },
    {
      key: 3,
      label: "Hiện trạng sử dụng",
      type: INPUT,
      value: form.values.currentUseSituation,
      error: form.errors.currentUseSituation,
      touched: form.touched.currentUseSituation,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      onChange: (e: any) => {
        handleChange({ currentUseSituation: e.target.value });
      },
      css: css,
      placeholder: "Nhập",
    },
    {
      key: 4,
      label: "Thông tin tranh chấp",
      type: SELECT,
      css: css,
      error: form.errors.disputeInfor,
      touched: form.touched.disputeInfor,
      value: form.values.disputeInfor || "0",
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      onChange: (value: any) => {
        handleChange({ disputeInfor: value });
      },
      options: DISPUTE_PROJECT_INFORMATION_OPTIONS,
      placeholder: "Chọn",
    },
    {
      key: 5,
      label: "Thông tin quy hoạch",
      css: css,
      error: form.errors.planningInfor,
      touched: form.touched.planningInfor,
      value: form.values.planningInfor,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      onChange: (value: string) => {
        handleChange({ planningInfor: value });
      },
      type: SELECT,
      placeholder: "Chọn",
      options: PROJECT_PLANNING_INFO,
    },
  ];
  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"small"}
      className="otherInfoProject-wrapper"
    >
      <Form labelAlign="left" labelWrap size="small">
        <Row gutter={[24, 4]} style={{ marginBottom: "8px", marginTop: "8px" }}>
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
                onChange={(e: any) => {
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
});

export default OtherInfoProject;
