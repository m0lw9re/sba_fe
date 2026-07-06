import { TYPE_FIELD } from 'constant/enums';
import { InputFiledParams } from 'constants/types/Form_Field_type';
const { INPUT } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const wrapperCol = { xs: 10, md: 10, lg: 10, xl: 16 };
const labelCol = { xs: 14, md: 14, lg: 14, xl: 8 };
const fields: InputFiledParams[] = [
  {
    key: 1,
    label: 'Tên khách hàng',
    name: 'date',
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
  {
    key: 1,
    label: 'CCCD/CC/HC/CMTQĐ/MST/ĐKKD',
    name: '',
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
];
export { fields };
