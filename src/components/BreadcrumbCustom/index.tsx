import { Breadcrumb, BreadcrumbProps } from "antd";
import React from "react";
import "components/ButtonCustom/style.scss";
import { Link } from "react-router-dom";
import { DEFAULT } from "routes/route.constant";

type Props = {
  _items: Array<{
    path: string;
    label: string;
    onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  }>;
};

const BreadcrumbCustom: React.FC<Props & BreadcrumbProps> = ({
  _items,
  ...rest
}) => {
  const breadcrumbItems = [
    {
      title: <Link to={DEFAULT}>Trang chủ</Link>,
      key: "home",
    },
    ..._items.map((item, index) => {
      const isDisabled = item.path === "";
      return {
        title: (
          <Link
            to={item.path}
            style={{
              color: index === _items.length - 1 ? "black" : "",
              pointerEvents: isDisabled ? "none" : "auto",
            }}
            onClick={item?.onClick ? item?.onClick : () => {}}
          >
            {item.label}
          </Link>
        ),
        key: index,
      };
    }),
  ];
  return (
    <div>
      <Breadcrumb {...rest} items={breadcrumbItems} />
    </div>
  );
};

export default BreadcrumbCustom;
