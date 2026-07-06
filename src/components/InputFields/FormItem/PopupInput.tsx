import { Input, Popover } from 'antd';
import React, { memo, useRef, useState } from 'react';

type Props = {
  value: string;
  onChange: (e: any) => void;
  size?: 'small' | 'middle' | 'large';
  placeholder?: string;
  disable?: boolean;
  addonAfter?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  maxLength?: number;
};

const PopupInput = (props: Props) => {
  const {
    value,
    onChange,
    placeholder,
    size,
    maxLength,
    disable,
    suffixIcon,
    addonAfter,
    prefix,
  } = props;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const textAreaRef = useRef<any>(null);
  return (
    <Popover
      afterOpenChange={(visible: boolean) => {
        if (visible && textAreaRef.current) {
          textAreaRef.current?.focus();
        }
      }}
      content={
        <Input.TextArea
          autoFocus
          ref={textAreaRef}
          size={size ?? 'small'}
          maxLength={maxLength || 1500}
          spellCheck={false}
          style={{ height: 200, width: 500, marginBottom: 12 }}
          onChange={onChange}
          value={value || ''}
          placeholder={!disable ? placeholder ?? 'Nhập' : ''}
          allowClear
          showCount
          onBlur={() => setOpenModal(false)}
        />
      }
      trigger={'click'}
      open={openModal}
      onOpenChange={() => setOpenModal(true)}
    >
      <Input
        value={value || ''}
        size={size ?? 'small'}
        onChange={onChange}
        disabled={disable}
        suffix={suffixIcon}
        placeholder={!disable ? placeholder ?? 'Nhập' : ''}
        addonAfter={addonAfter}
        prefix={prefix}
        allowClear={true}
        onFocus={() => setOpenModal(true)}
      />
    </Popover>
  );
};

export default memo(PopupInput);
