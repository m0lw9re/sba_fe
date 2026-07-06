import {Collapse, CollapseProps, Space, Typography} from "antd";
import "./style.scss";
import {CSSProperties, FC} from "react";
import {DownOutlined} from "@ant-design/icons";

const panelStyle: React.CSSProperties = {
  marginBottom: 16,
  paddingBottom: 0,
  background: "white",
  borderRadius: "8px",
  border: "none",
};

type Props = {
  itemList?: CollapseProps["items"];
  isInner?: boolean;
  activeKey?: string[] | number[];
  defaultActiveKey?: string[] | number[];
};

export const CollapseCustom: FC<CollapseProps & Props> = ({
  itemList,
  isInner = false,
  activeKey,
  defaultActiveKey,
  ...rest
}) => {
  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps["items"] = panelStyle =>
    itemList
      ? [...itemList]
          .filter(el => el.label && el.children)
          .map((item, index) => ({
            ...item,
            key: index + 1,
            label: (
              <Typography style={{fontSize: "16px", fontWeight: "600"}}>
                {item.label}
              </Typography>
            ),
            style: panelStyle,
          }))
      : [];

  return (
    <Collapse
      size="small"
      className={!isInner ? "collapse-wrapper" : "collapse-wrapper-inner"}
      bordered={false}
      defaultActiveKey={defaultActiveKey ?? ["1"]}
      expandIconPosition="end"
      activeKey={activeKey}
      expandIcon={({isActive}) => (
        <Space>
          <Typography style={{color: "#2862af"}}>
            {isActive ? "Ẩn thông tin" : "Hiện thông tin"}
          </Typography>
          <DownOutlined
            rotate={isActive ? 180 : 0}
            style={{color: "#2862af"}}
          />
        </Space>
      )}
      style={{background: "transparent"}}
      items={getItems(panelStyle)}
      {...rest}
    />
  );
};
