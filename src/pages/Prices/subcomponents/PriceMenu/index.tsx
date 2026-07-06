import React, { memo, useEffect, useState } from "react";
import "pages/Prices/subcomponents/PriceMenu/style.scss";
import { Card, Space, Typography, Menu, MenuProps } from "antd";
import Icons from "assets/icons";
import { useDispatch } from "react-redux";
import { getAllMenu, getAllMenuLv3, getAssetLv3 } from "./store/PriceMenuSlice";
import { useParams } from "react-router-dom";
import InputCustom from "components/InputCustom";
import { usePriceMenus } from "utils/request";
import ComponentsError from "pages/ComponentsError";

type MenuItem = Required<MenuProps>["items"][number];

type Props = {
  idLevelOne: string;
};

const PriceMenu: React.FC<Props> = ({ idLevelOne }) => {
  const dispatch = useDispatch();
  const params = useParams();
  let id: number = Number(params.id);
  const [textSearch, setTextSearch] = useState<string>("");
  useEffect(() => {
    dispatch(getAllMenu(id));
    dispatch(getAllMenuLv3());
  }, [id]);

  const handleClickMenu = (e: any) => {
    let code = Number(e.key);
    dispatch(getAssetLv3(code));
  };

  const handleChangeTextSearch = (e: any) => {
    setTextSearch(e.target.value);
  };

  const { data, error } = usePriceMenus(idLevelOne);

  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  };
  const items: MenuItem[] = data?.map((element, index) =>
    getItem(
      element.assetLevelTwoName,
      `levelOne${element.assetLevelTwoId}`,
      null,
      element.children?.map((el: any) =>
        getItem(el.assetLevelThreeName, el.assetLevelThreeId, null)
      )
    )
  );

  if (error.errorLevelThree && error.errorLevelTwo)
    return <ComponentsError />;

  return (
    <Card className="prices-menu-card">
      <Space direction="vertical" size={"middle"} className="price-menu-space">
        <Typography className="prices-menu-card-title">Danh mục kho</Typography>
        <InputCustom
          prefix={<Icons.search />}
          value={textSearch}
          placeholder="Tìm kiếm"
          onChange={handleChangeTextSearch}
        />
        <Menu
          mode="inline"
          inlineIndent={10}
          items={items}
          onClick={handleClickMenu}
        ></Menu>
      </Space>
    </Card>
  );
};

export default memo(PriceMenu);
