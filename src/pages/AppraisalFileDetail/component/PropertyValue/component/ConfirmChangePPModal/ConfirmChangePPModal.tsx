import { Button, Modal } from 'antd';
import CustomIcon from 'assets/images/svg/modal-PTDB-icon.svg';
import './style.scss';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onCancel: () => void;
  onOk: () => void;
};
const ConfirmChangePPModal = (props: Props) => {
  const { isOpen, setIsOpen, onCancel, onOk } = props;

  return (
    <Modal
      open={isOpen}
      width={416}
      closable={false}
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <img
            src={CustomIcon}
            alt='Icon Modal'
            style={{
              margin: '0 auto',
            }}
          />
          <p style={{ textAlign: 'center', margin: '16px 0 4px 0' }}>
            Cảnh báo
          </p>
        </div>
      }
      visible={true}
      className='modal__roadvehicle'
      cancelText='Hủy bỏ'
      okText='Đồng ý'
      footer={
        <div
          style={{
            marginTop: '30px',
            display: 'flex',
            justifyContent: 'space-evenly',
            border: '1px solid #0000000a',
          }}
        >
          <Button
            style={{
              boxShadow: 'unset',
              border: 'unset',
              color: '#00000099',
              fontSize: '16px',
              margin: '12px 0',
            }}
            onClick={onCancel}
          >
            Huỷ bỏ
          </Button>
          <p
            style={{ borderRight: '1px solid #0000000a', margin: 'unset' }}
          ></p>
          <Button
            style={{
              boxShadow: 'unset',
              border: 'unset',
              color: '#F25B60',
              fontSize: '16px',
              margin: '12px 0',
              fontWeight: 'bold',
            }}
            onClick={onOk}
          >
            Đồng ý
          </Button>
        </div>
      }
    >
      <div style={{ textAlign: 'center' }}>
        Bạn có chắc chắn muốn thay đổi phương pháp định giá này không? Nếu thay
        đổi thì tất cả dữ liệu trong phụ lục chi tiết sẽ mất.
      </div>
    </Modal>
  );
};
export default ConfirmChangePPModal;
