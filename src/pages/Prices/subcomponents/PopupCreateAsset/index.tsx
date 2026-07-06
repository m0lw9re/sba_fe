import { Button, Dropdown, MenuProps } from 'antd'
import Icons from 'assets/icons';
import React from 'react'
import { Link } from 'react-router-dom';
import './style.scss'
type MenuItem = Required<MenuProps>["items"][number];

type MenuItemType = {
  title: string;
  key: string;
  path?: string;
  children?: Array<MenuItemType>;
};
const menus: Array<MenuItemType> = [
  {
    title: "Bất động sản",
    key: "1",
    children: [
      {
        title: "Nhà đất",
        key: "realEstate",
        path: "/prices/create/realestate",
      },
      {
        title: "Căn hộ chung cư",
        key: "apartment",
        path: "/price",
      },
    ],
  },
  {
    title: "Động sản",
    key: "2",
    children: [
      {
        title: "Máy mọc thiết bị",
        key: "device",
        path: "/price",
      },
      {
        title: "Phương tiện",
        key: "vehicle",
        path: "/price",
      },
    ],
  },
];




const getPriceMenus = () => {
  const siderBarData: Array<MenuItem> = [];
  menus.forEach(item => {
    siderBarData.push({
       key: item.key,
       label: item.path ? (
        <Link to={`${item.path}`}>{item.title}</Link>
      ) : (
        <div>{item.title}</div>
      ),
       children: item.children?.map((sub1) => {
          return {
             key: sub1.key,
             label: sub1.path ? (
              <Link to={`${sub1.path}`}>{sub1.title}</Link>
            ) : (
              <div>{sub1.title}</div>
            ),
          }
       })
    })
  })
  return siderBarData
};

const items: MenuProps["items"] = getPriceMenus();
const PopupCreateAssset: React.FC = () => {
  return (
    <>
      <Dropdown menu={{ items }} trigger={['click']}  overlayClassName='dropdownMenuCreateAsset'>
        <Button icon={<Icons.add type="text" style={{ color: '#0048D3' }} />}></Button>
      </Dropdown>
    </>
  )
}

export default PopupCreateAssset