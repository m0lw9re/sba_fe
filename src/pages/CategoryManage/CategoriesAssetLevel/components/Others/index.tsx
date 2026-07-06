import Energy from "./components/Energy";
import AgriculturalProducts from "./components/AgriculturalProducts";
import "./style.scss";
import { CollapseCustom } from "components/CollapseCustom";
import Metal from "./components/Metal";
import Ingredient from "pages/CategoryManage/CategoriesAssetLevel/components/Others/components/Ingredient";
import ConsumerGoods from "pages/CategoryManage/CategoriesAssetLevel/components/Others/components/ConsumerGoods";
import Vehicle from "pages/CategoryManage/CategoriesAssetLevel/components/Others/components/Vehicle";
import ElectronicProducts from "pages/CategoryManage/CategoriesAssetLevel/components/Others/components/ElectronicProducts";
import Pharmaceuticals from "pages/CategoryManage/CategoriesAssetLevel/components/Others/components/Pharmaceuticals";
import Foods from "pages/CategoryManage/CategoriesAssetLevel/components/Others/components/Foods";

const OthersInfo = () => {
  return (
    <CollapseCustom
      itemList={[
        {
          label: "Năng lượng",
          children: <Energy />,
        },
        {
          label: "Kim loại dùng trong công nghiệp, VLXD",
          children: <Metal />,
        },
        {
          label: "Nhựa, vải, gỗ, cotton, thuỷ tinh, gốm sứ, giấy",
          children: <Ingredient />,
        },
        {
          label: "Sản phẩm nông nghiệp",
          children: <AgriculturalProducts />,
        },
        {
          label: "Hàng tiêu dùng, gia dụng",
          children: <ConsumerGoods />,
        },
        {
          label: "Phương tiện, máy móc thiết bị",
          children: <Vehicle />,
        },
        {
          label: "Sản phẩm điện tử",
          children: <ElectronicProducts />,
        },
        {
          label: "Hoá chất, dược phẩm, mỹ phẩm",
          children: <Pharmaceuticals />,
        },
        {
          label: "Thực phẩm/ Nước giải khát",
          children: <Foods />,
        },
        {
          label: "Hàng hoá khác",
          children: <ElectronicProducts />,
        },
      ]}
    />
  );
};

export default OthersInfo;
