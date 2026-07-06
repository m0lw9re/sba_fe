import {
  ArrowLeftOutlined
} from '@ant-design/icons';
import { Button, Image, Space, Typography } from 'antd';
import notFoundImage from 'assets/images/png/404 Error with a cute animal.gif';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
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
      <Image preview={false} width={500} height={500} src={notFoundImage} />
      <Typography.Title
        level={3}
        style={{
          color: '#444 !important',
        }}
      >
        Không tìm thấy trang
      </Typography.Title>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
        Quay lại
      </Button>
    </Space>
  );
};

export default NotFoundPage;
