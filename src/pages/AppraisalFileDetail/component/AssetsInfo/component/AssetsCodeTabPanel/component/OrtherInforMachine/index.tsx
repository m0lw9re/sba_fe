import { Col, Form, Input, Row, Space, Tooltip } from "antd";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { DISPUTE_INFORMATION_OPTIONS } from "constant/common";
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
import { isDeepEqual } from "utils";
import "./style.scss";

const { INPUT, SELECT, INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  otherInfor: {
    usingOrigin: string;
    dayUse: number | null;
    currentUseSituation: string | null;
    liquidity: string | null;
    remainQuality: number | null;
    disputeInfor: string | null;
    note: string | null;
  };
};

type FormDataType = {
  usingOrigin: string;
  dayUse: number | null;
  currentUseSituation: string | null;
  liquidity: string | null;
  remainQuality: number | null;
  disputeInfor: string | null;
  note: string | null;
};

type RefProps = {
  updateOtherInfoMachineDevice: () => void;
};
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };

const OtherInfoMachine = forwardRef<RefProps, Props>(({ otherInfor }, ref) => {
  const { liquitiesOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const { isCompleteSurvey } = useSelector(
    (state: RootState) => state.appraisalFileDetailSlice
  );

  const form = useFormik({
    initialValues: {} as FormDataType | any,
    // validationSchema: formSchema,
    validateOnChange: false,
    onSubmit: (data: FormDataType): any => {
      return data;
    },
  });
  const handleChange = useCallback(
    (data: any) => {
      form.setValues({ ...form.values, ...data });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.values]
  );

  useImperativeHandle(ref, () => ({
    updateOtherInfoMachineDevice: async () => ({ ...form.values }),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherInfor]);

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Nguồn gốc",
      css: css,
      type: INPUT,
      value: form.values.usingOrigin,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      onChange: (e: any) => {
        handleChange({ usingOrigin: e.target.value });
      },
      placeholder: "Nhập",
    },
    {
      key: 2,
      label: "Hiện trạng sử dụng",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: form.values.currentUseSituation,
      onChange: (e: any) => {
        handleChange({ currentUseSituation: e.target.value });
      },
      placeholder: "Nhập",
    },
    {
      key: 3,
      type: SELECT,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: form.values.liquidity,
      label: "Khả mại/ Tính thanh khoản",
      onChange: (value: number) => {
        handleChange({ liquidity: value });
      },
      options:
        liquitiesOptions?.map((item) => ({
          value: item.value.toString(),
          label: item.label,
        })) || [],
      css: css,
      placeholder: "Nhập",
    },
    {
      key: 4,
      label: "Chất lượng còn lại (%)",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT_NUMBER,
      percentable: true,
      value: form.values.remainQuality,
      onChange: (value: number) => {
        handleChange({
          remainQuality: value,
        });
      },
      placeholder: "Nhập",
    },
    {
      key: 5,
      label: "Thông tin tranh chấp",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.disputeInfor,
      onChange: (value: string) => {
        handleChange({ disputeInfor: value });
      },
      placeholder: "Chọn",
      options: DISPUTE_INFORMATION_OPTIONS,
    },

    {
      key: 6,
      label: "Số ngày đã sử dụng",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT_NUMBER,
      currencable: true,
      value: form.values.dayUse,
      onChange: (value: number) => {
        handleChange({ dayUse: value });
      },
      placeholder: "Nhập",
    },
  ];
  return (
    <Space
      direction="vertical"
      style={{ width: "100%", marginTop: "8px" }}
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
              label={
                <Tooltip placement="bottom" title={"Ghi chú"}>
                  Ghi chú
                </Tooltip>
              }
            >
              <Input.TextArea
                rows={5}
                value={form.values.note || ""}
                onChange={(e: any) => {
                  handleChange({ note: e.target.value });
                }}
                className="form-input-custom"
                placeholder="Nhập"
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
export default memo(OtherInfoMachine, (prevProps, nextProps) =>
  isDeepEqual(prevProps.otherInfor, nextProps.otherInfor)
);
