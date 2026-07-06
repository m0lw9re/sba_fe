import { Typography } from "antd";
import React from "react";
import 'components/PageTitle/style.scss'

type Props = {
  title: string;
};

const PageTitle: React.FC<Props> = ({ title }) => {
  return <Typography className="title-page-custom">{title}</Typography>;
};

export default PageTitle;
