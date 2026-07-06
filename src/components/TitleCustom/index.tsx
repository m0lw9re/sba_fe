import {Typography} from "antd";
import React from "react";
import "./styles.scss";
type Props = {
  title: string;
  size: "small" | "middle" | "big";
  textAlign?: "left" | "center" | "right";
};

const TitleCustom = ({title, size = "middle", textAlign = 'left'}: Props) => {
  return (
    <div className="title-custom">
      <Typography style={{textAlign: textAlign}} className={size}>{title}</Typography>
    </div>
  );
};
export default TitleCustom;
