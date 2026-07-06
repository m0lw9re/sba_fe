import { Space, Typography } from "antd";
import React from "react";
import { ReactComponent as Retangle } from "assets/images/svg/Retangle.svg";
import { ReactComponent as QuestionMarkCircle } from "assets/images/svg/QuestionMarkCircle.svg";
import 'components/CardTitleCustom/style.scss'

type Props = {
  title: string;
};

const CardTitleCustom: React.FC<Props> = ({ title }) => {
  return (
    <Space className="space-card-title-container">
      <Retangle />
      <Typography className="title">{title}</Typography>
      <QuestionMarkCircle />
    </Space>
  );
};

export default CardTitleCustom;
