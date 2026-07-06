import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "./style.scss";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { AppraisalInfoType } from "constant/types/appraisalFilesDetail";
import { useFormik } from "formik";
import { purposesApi } from "apis/purposes";
import * as Yup from "yup";

const { INPUT } = TYPE_FIELD;
type Props = {
  appraisalInfo: AppraisalInfoType;
};

type RefProps = {
  updateAppraisalInfo: any;
};

interface OptionsType {
  value: number | string;
  label: string;
}

interface formType {
  appraisalPurposeId?: string | number;
}

const initialValue: formType = {
  appraisalPurposeId: 0,
};

const AppraisalInfoSchema = Yup.object().shape({
  appraisalPurposeId: Yup.string().required("required"),
});
const AppraisalInfo = forwardRef<RefProps, Props>(({ appraisalInfo }, ref) => {
  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const [listPurpose, setListPurpose] = useState<OptionsType[]>([]);
  const form = useFormik({
    initialValues: initialValue,
    validationSchema: AppraisalInfoSchema,
    onSubmit: (data: formType): any => {
      return data;
    },
  });

  useImperativeHandle(ref, () => ({
    updateAppraisalInfo: form.submitForm,
  }));

  useEffect(() => {
    const getListPupose = async () => {
      try {
        const res = await purposesApi.getPurposes();
        let purposes = res.data;
        let options: OptionsType[] = purposes.map((item: any) => {
          return {
            label: item.appraisalPurposeName,
            value: item.appraisalPurposeId,
          };
        });
        setListPurpose(options);
      } catch (error) {
        console.log("purposesApi error", error);
      }
    };
    getListPupose();
  }, []);

  useEffect(() => {
    if (appraisalInfo) {
      const formData: formType = {
        appraisalPurposeId: appraisalInfo.appraisalPurposeId,
      };
      form.setValues({ ...form.values, ...formData });
    }
  }, [appraisalInfo]);

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tên khách hàng",
      type: INPUT,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: appraisalInfo.customerName,
      require: true,
      disable: true,
    },
    {
      key: 2,
      label: "CCCD/ĐKKD/MST",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: appraisalInfo.personIdentification,
      require: true,
      disable: true,
    },
  ];

  const onChangePurpose = (data: number | string) => {
    form.setFieldValue("appraisalPurposeId", data);
  };

  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"small"}
      className="appraisalInfo-wrapper"
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
                <Tooltip placement="bottom" title={"Tài sản thẩm định"}>
                  <>
                    Tài sản thẩm định{" "}
                    <span style={{ color: "#F25B60" }}> *</span>
                  </>
                </Tooltip>
              }
            >
              <Input
                value={appraisalInfo.assetName ? appraisalInfo.assetName : ""}
                placeholder={"Nhập"}
                className="form-input-custom"
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              className="form-item-custom"
              labelCol={{ span: 4 }}
              colon={false}
              label={
                <Tooltip placement="bottom" title={"Địa chỉ TS thẩm định"}>
                  <>
                    Địa chỉ TS thẩm định{" "}
                    <span style={{ color: "#F25B60" }}> *</span>
                  </>
                </Tooltip>
              }
            >
              <Input
                value={appraisalInfo.address ? appraisalInfo.address : ""}
                placeholder={"Nhập"}
                className="form-input-custom"
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              className="form-item-custom"
              labelCol={{ span: 4 }}
              colon={false}
              label={
                <Tooltip placement="bottom" title={"Mục đích thẩm định"}>
                  <>
                    Mục đích thẩm định{" "}
                    <span style={{ color: "#F25B60" }}> *</span>
                  </>
                </Tooltip>
              }
              validateStatus={
                form.errors.appraisalPurposeId === "required" ? "error" : ""
              }
            >
              <Select
                options={listPurpose}
                value={form.values.appraisalPurposeId}
                defaultValue={form.values.appraisalPurposeId}
                onChange={onChangePurpose}
                placeholder={"Chọn"}
                className="form-input-custom"
              />
              {form.errors.appraisalPurposeId === "required" ? (
                <Typography.Text className="warn-typography" type="danger">
                  Mục đích thẩm định không được bỏ trống
                </Typography.Text>
              ) : (
                ""
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Space>
  );
});

export default memo(AppraisalInfo);
