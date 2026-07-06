import { Button, Form, Row, Space, Typography } from "antd";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { InputFiledParams } from "constants/types/Form_Field_type";
import {
  forwardRef,
  useImperativeHandle,
  useState
} from "react";
import "./style.scss";
type Props = {
  fields: InputFiledParams[];
  onSearch?: (values?: any) => void;
  onReset?: () => void;
};
const ExpandSearch = forwardRef(({ fields, onSearch, onReset }: Props, ref) => {
  const defaultFields = fields.filter((e) => !e?.expand);
  const expandFields = fields.filter((e) => e?.expand);
  const [expand, setExpand] = useState<boolean>(false);
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    getFieldsValue: () => {
      const allParams = form.getFieldsValue();

      return allParams;
    },
    setFieldValue: (name: string, value: any) => {
      form.setFieldValue(name, value);
    },
    getFieldValue: (name: string) => {
      return form.getFieldValue(name);
    },
    resetFields: () => {
      return form.resetFields();
    },
    validateFields: () => {
      return form.validateFields();
    },
  }));

  const handleOnReset = () => {
    form.resetFields();
    if (onReset) {
      onReset();
    }
  };
  
  const handleOnSearch = () => {
    if (onSearch) {
      onSearch({ ...form.getFieldsValue() });
    }
  };
  
  return (
    <div className="expand-search-container">
      <Row justify={"space-between"}>
        <CardTitleCustomUpdate title="Tìm kiếm" />
        <div>
          <Button
            type="text"
            size="small"
            onClick={() => {
              setExpand(!expand);
            }}
          >
            <Space>
              <Typography className="blue-text">
                {!expand ? "Hiển thị" : "Ẩn"} tìm kiếm nâng cao
              </Typography>
              <Typography className="blue-text">
                {!expand ? <Icons.down /> : <Icons.up></Icons.up>}
              </Typography>
            </Space>
          </Button>
        </div>
      </Row>

      <Form form={form}>
        <Row gutter={[8, 8]}>
          <InputFields data={defaultFields}></InputFields>
          {expand && <InputFields data={expandFields}></InputFields>}
        </Row>
      </Form>

      <Row justify={"end"} style={{ marginTop: 4 }}>
        <Space>
          <ButtonCustom label="Xóa" onClick={handleOnReset} />
          <ButtonCustom
            label="Tìm kiếm"
            onClick={handleOnSearch}
            bgColor="#2862AF"
            type="primary"
          />
        </Space>
      </Row>
    </div>
  );
});

export default ExpandSearch;
