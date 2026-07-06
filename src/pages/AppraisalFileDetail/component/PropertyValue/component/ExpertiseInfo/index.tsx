import { Form, Row, Space } from "antd";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import { useAppraisalFileDetail } from "utils/request";
type Props = {
  appraisalFileId: string;
}
export const ExpertiseInfo = ({ appraisalFileId }: Props) => {
  const {data: appraisalData} = useAppraisalFileDetail(appraisalFileId)
  const { INPUT, DATE_PICKER } = TYPE_FIELD;
  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Thời điểm thẩm định",
      type: DATE_PICKER,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: appraisalData.appraisalDate ? dayjs(appraisalData.appraisalDate) : null,
      onChange: () => {},
      require: true,
      disable: true,
    },
    {
      key: 2,
      label: "Lần thẩm định",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      value: "1",
      onChange: () => {},
      require: true,
      disable: true,
    },
  ];

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
        </Row>
      </Form>
    </Space>
  );
};
