import { Card, Input, Space, Typography } from "antd";
import "./style.scss";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

type Props = {
  note: string;
};

type RefProps = {
  updateNote: () => void;
};

const Comment = forwardRef<RefProps, Props>(({ note }, ref) => {
  const [text, setText] = useState<string>();

  useImperativeHandle(ref, () => ({
    updateNote: () => ({
      note: text,
    }),
  }));

  useEffect(() => {
    setText(note);
  }, [note]);
  return (
    <Card size="small" className="commant-wrapper">
      <Space
        size={"small"}
        direction="vertical"
        className="commant-wrapper-content"
      >
        <Typography.Title level={5} className="commant-header">
          Nhận định, diễn giải
        </Typography.Title>
        <Input.TextArea
          rows={10}
          placeholder="Nhập"
          value={text}
          maxLength={10000}
          showCount
          onChange={(e) => setText(e.target.value)}
        />
      </Space>
    </Card>
  );
});
export default Comment;
