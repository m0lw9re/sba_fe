import { ReactNode } from "react";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

type MenuItemType = {
  title: string;
  key: string;
  icon?: ReactNode;
  path?: string;
  children?: Array<MenuItemType>;
  parentKey?: number;
};

const menus: Array<MenuItemType> = [
  {
    title: "Bất động sản",
    key: "30",
    children: [
      {
        title: "Nhà đất",
        key: "realEstateSub1",
        children: [
          {
            title: "QSDĐ và tài sản gắn liền với đất",
            key: "realEstateSub1Sub1",
          },
          {
            title: "Tài sản gắn liền với đất",
            key: "realEstateSub1Sub2",
          },
          {
            title: "Dự án đầu tư XD nhà ở/Nhà ở hình thà...",
            key: "realEstateSub1Sub3",
          },
          {
            title: "QTS từ HĐMB biệt thự/liền kề/shophou...",
            key: "realEstateSub1Sub4",
          },
          {
            title: "QTS từ HĐ thuê, thuê lại đất",
            key: "realEstateSub1Sub5",
          },
        ],
      },
      {
        title: "Căn hộ chung cư",
        key: "realEstateSub2",
        children: [
          {
            title: "Chung cư đã có GCN",
            key: "realEstateSub2Sub1",
          },
          {
            title: "QTS phát sinh từ HĐ mua bán/VBTT/th...",
            key: "realEstateSub2Sub2",
          },
          {
            title: "Nhà ở hình thành trong tương lai",
            key: "realEstateSub2Sub3",
          },
          {
            title: "Văn phòng/Diện tích thương mại đã c...",
            key: "realEstateSub2Sub4",
          },
        ],
      },
    ],
  },
  {
    title: "Động sản",
    key: "31",
    children: [
      {
        title: "Phương tiện đường bộ",
        key: "movablesSub1",
        children: [
          {
            title: "Xe ô tô con",
            key: "movablesSub1Sub1",
          },
          {
            title: "Xe ô tô khách",
            key: "movablesSub1Sub2",
          },
          {
            title: "Xe ô tô tải",
            key: "movablesSub1Sub3",
          },
          {
            title: "Xe ô tô đầu kéo",
            key: "movablesSub1Sub4",
          },
          {
            title: "Rơ - mooc, sơ mi rơ mooc",
            key: "movablesSub1Sub5",
          },
          {
            title: "Xe máy chuyên dùng",
            key: "movablesSub1Sub6",
          },
        ],
      },
      {
        title: "Phương tiện đường thủy",
        key: "movablesSub2",
        children: [
          {
            title: "Tàu biển",
            key: "movablesSub2Sub1",
          },
          {
            title: "Tàu thủy nội địa",
            key: "movablesSub2Sub2",
          },
          {
            title: "Sà lan",
            key: "movablesSub2Sub3",
          },
          {
            title: "Tàu du lịch",
            key: "movablesSub2Sub4",
          },
        ],
      },
      {
        title: "Máy móc - Thiết bị",
        key: "MachineDevice",
        children: [
          {
            title: "Dây chuyền sản xuất",
            key: "MachineDeviceSub1Sub1",
          },
          {
            title: "Máy móc thiết bị",
            key: "MachineDeviceSub1Sub2",
          },
        ],
      },
    ],
  },
];

const getPriceMenus = (parentKey: string, menuLv2: any, menuLv3: any) => {
  let siderBarData: Array<MenuItem> = [];
  let Lv3 = menuLv3.map((item: any) => {
    return {
      title: item?.assetLevelThreeName,
      key: item?.assetLevelThreeId,
      parentKey: item?.assetLevelTwoId,
    }
  })


  let Lv2 = menuLv2.map((item: any) => {
    return {
      title: item?.assetLevelTwoName,
      key: item?.assetLevelTwoId,
      parentKey: item?.assetLevelOneId,
      children: Lv3.filter((item1: any) => item1?.parentKey === item?.assetLevelTwoId)
    }
  })

  // let Lv1 = menus.map((item: any) => {

  //   if (item.key === '30') {
  //     return {
  //       ...item,
  //       children: Lv2.filter((item: any) => item.parentKey === '1')
  //     }
  //   } else {
  //     return {
  //       ...item,
  //       children: Lv2.filter((item: any) => item.parentKey === '2')
  //     }
  //   }
  // })
  
  let titleMenu = ''
  // Lv1.forEach((item) => {
  //   if (item.key === parentKey) {
  //     titleMenu = item.title;
  //     console.log("Item: ", item);

  //     item.children?.forEach((itemSub1: any) => {
  //       siderBarData.push({
  //         key: itemSub1.key,
  //         label: <div>{itemSub1.title}</div>,
  //         children: itemSub1.children?.map((itemSub2: any) => {
  //           return {
  //             key: itemSub2.key,
  //             label: <div>{itemSub2.title}</div>,
  //           };
  //         }),
  //       });
  //     });
  //   }
  // });

  Lv2.forEach((itemSub1: any) => {
    siderBarData.push({
      key: itemSub1.key,
      label: <div>{itemSub1.title}</div>,
      children: itemSub1.children?.map((itemSub2: any) => {
        return {
          key: itemSub2.key,
          label: <div>{itemSub2.title}</div>,
        };
      }),
    });
  });

  return { siderBarData, titleMenu };
};

export { getPriceMenus, menus };
