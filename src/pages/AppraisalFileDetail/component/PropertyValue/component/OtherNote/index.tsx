import { Card, Form, Row, Space, Typography } from 'antd';
import './style.scss';
import InputFields from 'components/InputFields';
import { InputFiledParams } from 'constants/types/Form_Field_type';
import { TYPE_FIELD } from 'constant/enums';
const { TEXT_AREA } = TYPE_FIELD;
type Props = {
  noteValue: string;
  setNoteValue: (value: string) => void;
}
export const OtherNote = ({noteValue, setNoteValue}: Props) => {
  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const cssLabel = { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 };
  const cssInput = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      css: css,
      type: TEXT_AREA,
      value: noteValue || '',
      onChange: (e: any) => setNoteValue(e.target.value),
      labelCol: cssLabel,
      wrapperCol: cssInput,
      placeholder: 'Nhập',
      maxLength: 10000,
      textAreaHeight: 250,
    },
  ];
  return (
    <Card size='small' className='other-note-card'>
      <Typography.Text className='other-note-heading'>
        Lưu ý khác
      </Typography.Text>
      <Space
        direction='vertical'
        style={{ width: '100%' }}
        size={'small'}
        className='other-note-permisstion-use-land-wrapper'
      >
        <Form labelAlign='left' layout='vertical' labelWrap size='small'>
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
        </Form>
      </Space>
    </Card>
  );
};
