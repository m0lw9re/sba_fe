import { Col, Form, Input, Radio, Row, Space, Tooltip } from "antd";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { validLengthInput } from "utils/validate";

type DataType = { haveGround: boolean; groundNote: string | null };

type Props = {
  data: DataType;
  visible: boolean;
  setVisible: (value: boolean) => void;
};

type RefProps = {
  updateGround: () => void;
};

const formSchema = Yup.object().shape({
  groundNote: Yup.string()
    .nullable()
    .test("groundNoteFormSchema", "Chỉ nhập được 1000 ký  tự", (val) =>
      validLengthInput(val, 1000)
    ),
});

const Ground = forwardRef<RefProps, Props>(
  ({ data, visible, setVisible }, ref) => {
    const form = useFormik({
      initialValues: { haveGround: false, groundNote: "" } as DataType | any,
      validationSchema: formSchema,
      onSubmit: (data: DataType): any => {
        return data;
      },
    });

    useImperativeHandle(ref, () => ({
      updateGround: async () => form.submitForm(),
    }));

    useEffect(() => {
      if (data) {
        const getData = {
          ...data,
          haveGround: data.haveGround,
          groundNote: data.groundNote,
        };
        form.setValues({ ...form.values, ...getData });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.haveGround]);

    return (
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={"small"}
        className="otherInfo-wrapper"
      >
        <div style={{ marginBottom: "2px" }}>
          <Radio.Group
            onChange={(e: any) => {
              form.setValues({ ...form.values, haveGround: e.target.value });
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
            <Row gutter={[24, 4]}>
              <Col span={24}>
                <Form.Item
                  className="form-item-custom"
                  labelCol={{ span: 4 }}
                  colon={false}
                  validateStatus={
                    form.errors.groundNote && form.touched.groundNote
                      ? "error"
                      : ""
                  }
                  help={
                    form.errors.groundNote && form.touched.groundNote
                      ? form.errors.groundNote
                      : ""
                  }
                  label={
                    <Tooltip placement="bottom" title={"Ghi chú"}>
                      Ghi chú
                    </Tooltip>
                  }
                >
                  <Input
                    placeholder="Nhập"
                    value={
                      form.values.groundNote === null
                        ? ""
                        : String(form.values.groundNote)
                    }
                    maxLength={1000}
                    onChange={(e: any) => {
                      form.setValues({
                        ...form.values,
                        groundNote: e.target.value,
                      });
                    }}
                    className="form-input-custom"
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

export default memo(Ground);
