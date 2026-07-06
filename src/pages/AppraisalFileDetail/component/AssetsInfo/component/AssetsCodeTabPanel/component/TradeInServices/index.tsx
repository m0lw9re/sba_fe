import { Col, Form, Input, Radio, Row, Space, Tooltip } from "antd";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import { validLengthInput } from "utils/validate";
import renderRequired from "components/RenderRequire";

type DataType = {
  haveLandForRent: boolean;
  landForRentNote: string | null;
  typeService: string | null;
};

type Props = {
  data: DataType;
  visible: boolean;
  setVisible: (value: boolean) => void;
};

type RefProps = {
  updateTradeInServices: () => void;
};

const { SELECT } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  landForRentNote: Yup.string()
    .nullable()
    .test("formSchemaLandForRentNote", "Chỉ nhập được 1000 ký tự", (val) =>
      validLengthInput(val, 1000)
    ),
});

const TradeInServices = forwardRef<RefProps, Props>(
  ({ data, visible, setVisible }, ref) => {
    const form = useFormik({
      initialValues: { haveLandForRent: false, landForRentNote: "" } as
        | DataType
        | any,
      validateOnChange: false,
      validationSchema: formSchema,
      onSubmit: (data: DataType): any => {
        return data;
      },
    });

    useImperativeHandle(ref, () => ({
      updateTradeInServices: async () => form.submitForm(),
    }));

    useEffect(() => {
      if (data) {
        const getData = {
          ...data,
          haveLandForRent: data.haveLandForRent,
          landForRentNote: data.landForRentNote,
          typeService: data.typeService,
        };
        form.setValues({ ...form.values, ...getData });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.haveLandForRent]);

    return (
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={"small"}
        className="otherInfo-wrapper"
      >
        <div style={{ marginBottom: "2px" }}>
          <Radio.Group
            onChange={(e) => {
              form.setValues({
                ...form.values,
                haveLandForRent: e.target.value,
              });
              setVisible(e.target.value);
            }}
            value={visible}
          >
            <Radio value={true}>Có</Radio>
            <Radio value={false}>Không</Radio>
          </Radio.Group>
        </div>
        {visible && (
          <Form labelAlign="left" labelWrap size="small">
            <Row gutter={[24, 4]} style={{ marginBottom: "8px" }}>
              <Col span={24}>
                <FormItem
                  labelCol={{ span: 8 }}
                  style={{ width: "50%" }}
                  type={SELECT}
                  value={form.values.typeService || null}
                  validateStatus={
                    form.errors.typeService && form.touched.typeService
                      ? "error"
                      : ""
                  }
                  help={
                    form.errors.typeService && form.touched.typeService
                      ? form.errors.typeService
                      : ""
                  }
                  label={renderRequired("Loại hình")}
                  options={[
                    { label: "Bán", value: "Bán" },
                    { label: "Cho thuê", value: "Cho thuê" },
                  ]}
                  onChange={(value: any) => {
                    form.setValues({ ...form.values, typeService: value });
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[24, 4]}>
              <Col span={24}>
                <Form.Item
                  className="form-item-custom"
                  labelCol={{ span: 4 }}
                  colon={false}
                  validateStatus={
                    form.errors.landForRentNote && form.touched.landForRentNote
                      ? "error"
                      : ""
                  }
                  help={
                    form.errors.landForRentNote && form.touched.landForRentNote
                      ? form.errors.landForRentNote
                      : ""
                  }
                  label={
                    <Tooltip placement="bottom" title={"Ghi chú"}>
                      Ghi chú
                    </Tooltip>
                  }
                >
                  <Input.TextArea
                    placeholder="Nhập"
                    value={
                      form.values.landForRentNote === null
                        ? ""
                        : String(form.values.landForRentNote)
                    }
                    onChange={(e: any) => {
                      form.setValues({
                        ...form.values,
                        landForRentNote: e.target.value,
                      });
                    }}
                    cols={4}
                    showCount
                    className="form-input-custom"
                    maxLength={1000}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Space>
    );
  }
);

export default memo(TradeInServices);
