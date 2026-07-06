import { DownOutlined } from '@ant-design/icons';
import { Form, Row, Space, Typography } from 'antd';
import ButtonCustom from 'components/ButtonCustom';
import { CollapseCustom } from 'components/CollapseCustom';
import InputFields from 'components/InputFields';
import { TYPE_FIELD } from 'constant/enums';
import './style.scss';
import React from 'react';
import { useRoles } from 'utils/request/useRoles';
import { InputFiledParams } from 'constants/types/Form_Field_type';
import { RoleGroupType } from 'constant/types';

type Props = {
  filters: { roleCode?: string };
  setFilter: (filters: { roleCode?: string }) => void;
};

const { SELECT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 20, xl: 20 };
const UserFunctionFilter: React.FC<Props> = ({ filters, setFilter }) => {
  const rolesSWR = useRoles();

  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      label: 'Nhóm tài khoản',
      css: css,
      type: SELECT,
      name: 'roleCode',
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options:
        rolesSWR?.data?.data?.map((item: RoleGroupType) => {
          return {
            label: item.roleName,
            value: item.roleCode,
          };
        }) || [],
      value: filters.roleCode,
      onChange: (value: string) => setFilter({ roleCode: value }),
    },
  ];

  return (
    <CollapseCustom
      expandIcon={({ isActive }) => (
        <Space>
          <Typography style={{ color: '#2862af' }}>
            {isActive ? 'Ẩn tìm kiếm' : 'Hiển thị tìm kiếm'}
          </Typography>
          <DownOutlined
            rotate={isActive ? 180 : 0}
            style={{ color: '#2862af' }}
          />
        </Space>
      )}
      itemList={[
        {
          label: 'Tìm kiếm',
          forceRender: true,
          children: (
            <Form labelAlign='left' labelWrap size='small'>
              <Row gutter={[16, 4]}>
                <InputFields data={inputSearch} />
              </Row>
              <Row justify={'end'} style={{ marginTop: '12px' }}>
                <Space>
                  <ButtonCustom
                    label='Xóa'
                    onClick={() => {
                      setFilter({});
                    }}
                  />
                  <ButtonCustom
                    label='Tìm kiếm'
                    bgColor='#2862AF'
                    type='primary'
                    onClick={() => setFilter({ ...filters })}
                  />
                </Space>
              </Row>
            </Form>
          ),
        },
      ]}
    />
  );
};

export default UserFunctionFilter;
