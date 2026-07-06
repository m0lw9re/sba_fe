import { Col, Form, Input, Radio, Row, Space, Tooltip } from "antd";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { validLengthInput } from "utils/validate";

type DataType = { haveApartment: boolean; apartmentNote: string };

type Props = {
  data: DataType;
  visible: boolean;
  setVisible: (value: boolean) => void;
};

type RefProps = {
  updateApartment: () => void;
};

const formSchema = Yup.object().shape({
  apartmentNote: Yup.string()
    .nullable()
    .test("apartmentNoteFormSchema", "Chỉ nhập được 1000 ký  tự", (val) =>
      validLengthInput(val, 1000)
    ),
});

const Apartment = forwardRef<RefProps, Props>(
  ({ data, visible, setVisible }, ref) => {
    const form = useFormik({
      initialValues: { haveApartment: false, apartmentNote: "" } as
        | DataType
        | any,
      validationSchema: formSchema,
      onSubmit: (data: DataType): any => {
        return data;
      },
    });

    useImperativeHandle(ref, () => ({
      updateApartment: async () => form.submitForm(),
    }));

    useEffect(() => {
      if (data.haveApartment) {
        const getData = {
          ...data,
          haveApartment: data.haveApartment,
          apartmentNote: data.apartmentNote,
        };
        form.setValues({ ...form.values, ...getData });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.haveApartment]);

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
              form.setValues({ ...form.values, haveApartment: e.target.value });
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
                    form.errors.apartmentNote && form.touched.apartmentNote
                      ? "error"
                      : ""
                  }
                  help={
                    form.errors.apartmentNote && form.touched.apartmentNote
                      ? form.errors.apartmentNote
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
                      form.values.apartmentNote === null
                        ? ""
                        : String(form.values.apartmentNote)
                    }
                    maxLength={1000}
                    onChange={(e: any) => {
                      form.setValues({
                        ...form.values,
                        apartmentNote: e.target.value,
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

export default memo(Apartment);
