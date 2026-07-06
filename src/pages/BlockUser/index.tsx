import { ReloadOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

type Props = {
  message?: string;
  redirectUrl?: string;
};
const BlockUser = (props: Props) => {
  const {
    message = 'Bạn không có quyền truy cập vào trang này',
    redirectUrl = '/',
  } = props;
  const navigate = useNavigate();
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
      <Typography.Title
        level={3}
        style={{
          color: '#444 !important',
          fontFamily: 'Hanken Grotesk sans-serif !important',
        }}
      >
        {message}
      </Typography.Title>
      <Button
        icon={<ReloadOutlined />}
        type='primary'
        onClick={() => navigate(redirectUrl)}
      >
        Quay lại
      </Button>
    </Space>
  );
};

export default BlockUser;
