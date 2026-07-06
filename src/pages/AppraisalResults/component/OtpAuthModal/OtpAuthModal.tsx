import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Form, Input, Modal, Spin } from 'antd';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import './style.scss';
type Props = {
  handleCancel: () => void;
  handleOk: () => void;
  isOpen: boolean;
  sendingOtpStatus: 'pending' | 'sending' | 'success' | 'rejected';
  setSendingOtpStatus: (
    newStatus: SetStateAction<'pending' | 'sending' | 'success' | 'rejected'>,
  ) => void;
  countDownInterval: any;
};
type SuccessModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};
const SuccessModal = (props: SuccessModalProps) => {
  const { handleClose, isOpen } = props;
  return (
    <Modal
      title=''
      open={isOpen}
      centered
      footer={null}
      className='success-modal'
      width={483}
      closeIcon={null}
      bodyStyle={{
        height: '376px',
      }}
    >
      <CheckCircleFilled className='success-modal-icon' />
      <h3 className='success-modal-heading'>Ký số thành công</h3>
      <Button
        type='primary'
        className='btn-action btn-confirm'
        onClick={handleClose}
      >
        Đóng
      </Button>
    </Modal>
  );
};

const OtpAuthModal = (props: Props) => {
  const {
    handleCancel,
    handleOk,
    isOpen,
    sendingOtpStatus,
    setSendingOtpStatus,
    countDownInterval,
  } = props;

  const countdownInMinutes = 3;
  const countdownInSeconds = countdownInMinutes * 60;
  let remainingTime = useRef(countdownInSeconds).current;

  const [form] = Form.useForm();
  const inputRefs = useRef<Array<React.RefObject<any>>>([]);
  const buttonConfirmRef = React.createRef<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const [countDown, setCountDown] = useState<{
    minute: number;
    second: number;
  }>();

  const otpInput = [
    { name: 'otp1', ref: inputRefs.current[0] },
    { name: 'otp2', ref: inputRefs.current[1] },
    { name: 'otp3', ref: inputRefs.current[2] },
    { name: 'otp4', ref: inputRefs.current[3] },
    { name: 'otp5', ref: inputRefs.current[4] },
    { name: 'otp6', ref: inputRefs.current[5] },
  ];

  const handleChangeInputItem = (e: any) => {
    const { value, name } = e.target;

    // prevent not number value
    if (isNaN(+e.target.value)) {
      form.setFieldValue(name, '');
      return null;
    }

    // focus next input
    const index = otpInput.findIndex(item => item.name === name);
    if (index >= 0 && index < otpInput.length - 1 && value !== '') {
      const nextInput = otpInput[index + 1];
      if (nextInput.ref) {
        nextInput.ref.current?.focus();
      }
    }
    // focus button when end input
    if (index === 5 && value !== '') {
      buttonConfirmRef.current.focus();
    }
  };
  const handleCloseModal = () => {
    handleCancel();
    setShowSuccessModal(false);
  };
  const handleSendOtp = () => {
    const values = Object.values(form.getFieldsValue());
    const otp = values.join('');
    setLoading(true);

    // fake async
    setTimeout(() => {
      console.log(`otp: ${otp} sended!`);
      setLoading(false);
      // success
      if (otp === '000000') {
        setShowSuccessModal(true);
        clearInterval(countDownInterval.current);
        setSendingOtpStatus('success');
      } else {
        // rejected
        form.resetFields();
        setShowSuccessModal(false);
        setSendingOtpStatus('rejected');
      }
    }, 1200);
  };

  const renderCountDown = () => {
    if (countDown?.minute || countDown?.second) {
      return (
        <>
          <p className='otp-modal-timeleft'>
            Hiệu lực trong{' '}
            <span>
              {countDown?.minute}:
              {countDown?.second < 10
                ? `0${countDown?.second}`
                : countDown?.second}
            </span>
          </p>
        </>
      );
    }
  };
  const renderSendOtpStatus = () => {
    if (sendingOtpStatus === 'pending') {
      return <Spin />;
    }
    if (sendingOtpStatus === 'sending') {
      return 'Một mã 6 ký tự đã được gửi về địa chỉ email của bạn';
    }
    if (sendingOtpStatus === 'rejected') {
      return 'Mã xác thực không chính xác, vui lòng kiểm tra lại';
    }
  };
  const triggerCountDown = () => {
    countDownInterval.current = setInterval(() => {
      remainingTime--;

      if (remainingTime < 0) {
        clearInterval(countDownInterval.current);
        console.log('Countdown finished!');
      } else {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        setCountDown({
          minute: minutes,
          second: seconds,
        });
      }
    }, 1000);
  };

  useEffect(() => {
    if (isOpen && sendingOtpStatus === 'pending') {
      console.log('call api sending otp');
      setTimeout(() => {
        setSendingOtpStatus('sending');
        triggerCountDown();
      }, 3000);
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        destroyOnClose={true}
        title=''
        open={isOpen}
        centered
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={null}
        className='otp-modal'
        width={483}
      >
        <h3 className='otp-modal-heading'>Xác thực OTP</h3>
        <p className='otp-modal-description'>{renderSendOtpStatus()}</p>
        <Form form={form} className='otp-form' name='otp-form' layout='inline'>
          {otpInput.map((item, index) => {
            const inputRef = React.createRef<any>();
            inputRefs.current[index] = inputRef;
            item.ref = inputRef;
            return (
              <Form.Item
                className='otp-input-wrapper'
                key={item.name}
                name={item.name}
                // rules={[{ required: true }]}
              >
                <Input
                  size='large'
                  name={item.name}
                  placeholder='-'
                  status={sendingOtpStatus === 'rejected' ? 'error' : ''}
                  className='otp-input'
                  ref={inputRef}
                  maxLength={1}
                  onChange={handleChangeInputItem}
                />
              </Form.Item>
            );
          })}
        </Form>

        {renderCountDown()}
        <div className='group-button'>
          <Button
            type='primary'
            className='btn-action btn-confirm'
            ref={buttonConfirmRef}
            onClick={handleSendOtp}
            loading={loading}
          >
            Xác nhận
          </Button>
          <Button type='text' className='btn-action btn-sendback'>
            Gửi lại
          </Button>
        </div>
      </Modal>
      <SuccessModal handleClose={handleCloseModal} isOpen={showSuccessModal} />
    </>
  );
};

export default OtpAuthModal;
