import { ReloadOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
const ComponentsError = () => {
  return (
    <Space
      direction='vertical'
      style={{
        margin: '50px 0',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography.Title level={3} 
        style={{ 
          color: '#444 !important',
          fontFamily: 'Hanken Grotesk sans-serif !important',
        }}
      >
        Lỗi khi tải dữ liệu.
      </Typography.Title>
      <Button
        icon={<ReloadOutlined />}
        type='primary'
        onClick={() => window.location.reload()}
      >
        Tải lại
      </Button>
    </Space>
  );
};

export default ComponentsError;
