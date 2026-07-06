import { Col, Form, Input, Row, Space, Tooltip } from "antd";
import InputFields from "components/InputFields";
import "./style.scss";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { OtherInfoLand } from "constant/types/appraisalFilesDetail";
import { CurrentUseSituations } from "constants/types/assetInfor_new_type";
import {
  BussinessAdvantages,
  Liquidities,
} from "constants/types/assetCommon.type";
import { assetCommonApi } from "apis/assetCommon";
import { stringValidate } from "utils/validate";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

const { INPUT, SELECT } = TYPE_FIELD;
type Props = {
  assetlevel2: number;
  data: OtherInfoLand;
};

type RefProps = {
  updateOtherInfoLand: () => void;
};
const formSchema = Yup.object().shape({
  note: stringValidate.trim().nullable().max(255, "Tối đa 255 ký tự."),
  disputeInfor: stringValidate
    .trim()
    .required("Chưa nhập thông tin tranh chấp.")
    .max(255, "Tối đa 255 ký tự.")
    .nullable(),
});
const OtherInfo = forwardRef<RefProps, Props>(({ data, assetlevel2 }, ref) => {
  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const [businessAdvantages, setBusinessAdvantages] = useState<
    BussinessAdvantages[]
  >([]);
  const [liquidities, setLiquidities] = useState<Liquidities[]>([]);
  const [currentUseSituations, setCurrentUseSituations] = useState<
    CurrentUseSituations[]
  >([]);

  const { isCompleteSurvey } = useSelector(
    (state: RootState) => state.appraisalFileDetailSlice
  );

  const form = useFormik({
    initialValues: {} as OtherInfoLand | any,
    validationSchema: formSchema,
    validateOnChange: false,
    onSubmit: (data: OtherInfoLand): any => {
      return data;
    },
  });

  const fetchData = async () => {
    // const resCur = await assetDetailApi.getCurrentUseSituationByAssetLevelTwoId(
    //   assetlevel2
    // );
    const resliquities = await assetCommonApi.getLiquidities();
    const resbussinessAdvange = await assetCommonApi.getBussinessAdvantages();
    setBusinessAdvantages(resbussinessAdvange.data);
    // setCurrentUseSituations(resCur.data);
    setLiquidities(resliquities.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const getData = {
        ...data,
        businessAdvantage: data.businessAdvantage,
        liquidity: data.liquidity || "2",
        currentUseSituation: data.currentUseSituation,
        disputeInfor: data.disputeInfor ?? "Không tranh chấp.",
        planningInfor: data.planningInfor ?? "Không",
        note: data.note,
      };
      form.setValues({ ...form.values, ...getData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useImperativeHandle(ref, () => ({
    updateOtherInfoLand: async () => ({ ...form.values }), //form.submitForm,
  }));
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Lợi thế kinh doanh",
      css: css,
      type: SELECT,
      value: Number(form.values.businessAdvantage) || null,
      error: form.errors.businessAdvantage,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      placeholder: "Chọn",
      onChange: (e: any) => {
        form.setValues({ ...form.values, businessAdvantage: e });
      },
      options:
        businessAdvantages?.map((item, index) => ({
          value: item.id,
          label: item.name,
        })) || [],
    },
    {
      key: 2,
      label: "Khả mại/Tính thanh khoản",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      placeholder: "Chọn",
      value: form.values.liquidity,
      error: form.errors.liquidity,
      onChange: (e: any) => {
        form.setValues({ ...form.values, liquidity: e });
      },
      options:
        liquidities?.map((item, index) => ({
          value: item.id.toString(),
          label: item.name,
        })) || [],
    },
    {
      key: 3,
      label: "Hiện trạng sử dụng",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      placeholder: "Nhập",
      value: form.values.currentUseSituation,
      error: form.errors.currentUseSituation,
      onChange: (e: any) => {
        form.setValues({ ...form.values, currentUseSituation: e.target.value });
      },
    },
    {
      key: 4,
      type: INPUT,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: form.values.disputeInfor || "",
      label: "Thông tin tranh chấp",
      error: form.errors.disputeInfor,
      onChange: (e: any) =>
        form.setValues({ ...form.values, disputeInfor: e.target.value }),
      css: css,
    },
    {
      key: 5,
      label: "Thông tin quy hoạch",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      placeholder: "Chọn",
      value: form.values.planningInfor,
      onChange: (e: any) => {
        form.setValues({ ...form.values, planningInfor: e });
      },
      options: [
        {
          label: "Có",
          value: "Có",
        },
        {
          label: "Không",
          value: "Không",
        },
      ],
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
        <Row gutter={[24, 4]}>
          <InputFields data={inputFields} />
          <Col span={24}>
            <Form.Item
              className="form-item-custom"
              labelCol={{ span: 4 }}
              colon={false}
              validateStatus={
                form.errors.note && form.touched.note ? "error" : ""
              }
              help={
                form.errors.note && form.touched.note ? form.errors.note : ""
              }
              label={
                <Tooltip placement="bottom" title={"Ghi chú"}>
                  Ghi chú
                </Tooltip>
              }
            >
              <Input.TextArea
                rows={3}
                placeholder="Nhập"
                value={form.values.note || ""}
                onChange={(e: any) => {
                  form.setValues({ ...form.values, note: e.target.value });
                }}
                className="form-input-custom"
                showCount={true}
                maxLength={4000}
                spellCheck={false}
                disabled={isCompleteSurvey}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Space>
  );
});

export default memo(OtherInfo);
