import { Row } from 'antd';
import InputFields from 'components/InputFields';
import { TYPE_FIELD } from 'constant/enums';
import { ProjectInFutureOthersType } from 'constant/types/appraisalFile';
import { InputFiledParams } from 'constants/types/Form_Field_type';
import { memo } from 'react';
import './style.scss';
import { isDeepEqual } from 'utils';
const { TEXT_AREA } = TYPE_FIELD;

type Props = {
  data: ProjectInFutureOthersType;
  onChange: (data: any) => void;
};
const css = { xs: 24 };
const labelCol = { xs: 24, md: 4 };
const wrapperCol = { xs: 24, md: 20 };

const ProjectInFutureOthers = ({ data, onChange }: Props) => {
  const otherInputs: InputFiledParams[] = [
    {
      key: 15,
      label: 'Phần hầm',
      type: TEXT_AREA,
      maxLength: 1000,
      css,
      labelCol,
      wrapperCol,
      value: data.turnPart || null,
      onChange: (e: any) => onChange({ turnPart: e.target.value }),
    },
    {
      key: 16,
      label: 'Phần đế',
      type: TEXT_AREA,
      maxLength: 1000,
      css,
      labelCol,
      wrapperCol,
      value: data.solePart || null,
      onChange: (e: any) => onChange({ solePart: e.target.value }),
    },
    {
      key: 17,
      label: 'Phần tháp',
      type: TEXT_AREA,
      maxLength: 1000,
      css,
      labelCol,
      wrapperCol,
      value: data.towerPart || null,
      onChange: (e: any) => onChange({ towerPart: e.target.value }),
    },
    {
      key: 18,
      label: 'Các đề mục công trình',
      type: TEXT_AREA,
      maxLength: 1000,
      css,
      labelCol,
      wrapperCol,
      value: data.constructionTitle || null,
      onChange: (e: any) => onChange({ constructionTitle: e.target.value }),
    },
    {
      key: 19,
      label: 'Giải pháp kết cấu',
      type: TEXT_AREA,
      maxLength: 1000,
      css,
      labelCol,
      wrapperCol,
      value: data.structuralSolution || null,
      onChange: (e: any) => onChange({ structuralSolution: e.target.value }),
    },
    {
      key: 20,
      label: 'Giải pháp kiến trúc',
      type: TEXT_AREA,
      maxLength: 1000,
      css,
      labelCol,
      wrapperCol,
      value: data.architectualSolution || null,
      onChange: (e: any) => onChange({ architectualSolution: e.target.value }),
    },
    {
      key: 21,
      label: 'Phần điện nước tổng thể/Hệ thống kỹ thuật tổng thể',
      type: TEXT_AREA,
      maxLength: 1000,
      css,
      labelCol,
      wrapperCol,
      value: data.systemEngineering || null,
      onChange: (e: any) => onChange({ systemEngineering: e.target.value }),
    },
    {
      key: 22,
      label: 'Hệ thống giao thông',
      type: TEXT_AREA,
      maxLength: 1000,
      css,
      labelCol,
      wrapperCol,
      value: data.systemTraffic || null,
      onChange: (e: any) => onChange({ systemTraffic: e.target.value }),
    },
    {
      key: 23,
      label: 'Nội thất',
      type: TEXT_AREA,
      maxLength: 1000,
      css,
      labelCol,
      wrapperCol,
      value: data.interior || null,
      onChange: (e: any) => onChange({ interior: e.target.value }),
    },
    {
      key: 24,
      label: 'Nhận định dự toán',
      type: TEXT_AREA,
      maxLength: 1000,
      css,
      labelCol,
      wrapperCol,
      value: data.estimateComment || null,
      onChange: (e: any) => onChange({ estimateComment: e.target.value }),
    },
  ];

  return (
    <Row gutter={[8, 8]} style={{ width: '100%' }}>
      <InputFields data={otherInputs} />
    </Row>
  );
};

export default memo(ProjectInFutureOthers, (prevProps, nextProps) => {
  return isDeepEqual(prevProps.data, nextProps.data)
})
