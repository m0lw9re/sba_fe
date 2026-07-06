import { Col, Row } from "antd";
import { useEffect, useCallback } from "react";
import "pages/Prices/subcomponents/PriceMenu/style.scss";
import PriceMenu from "pages/Prices/subcomponents/PriceMenu";
import AssetsTable from "pages/Prices/subcomponents/AssetsTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import { getPriceMenus } from "./subcomponents/PriceMenu/config";
import { getAllAssetRealEstateStorage } from "./store/PricesSlice";
import { useParams } from "react-router-dom";
import { PRICE } from "routes/route.constant";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";

const Prices = () => {
  // const [itemsMenu, setItemsMenu] = useState<MenuProps["items"]>();
  // const [title, setTitle] = useState<string>("");
  const dispatch = useDispatch();
  // const [stateKeyPrice, setStateKeyPrice] = useState("");
  const params = useParams();
  let id = params.id ? Number(params.id) : 1;
  const appState = useSelector((state: RootState) => state.appSlice);
  // const listMenu = useSelector((state: RootState) => state.getMenuPrice);
  const handleGetData = () => {
    // const { siderBarData, titleMenu } = getPriceMenus(
    //   appState?.selectedKeys[1] || "29",
    //   listMenu.menuLv2,
    //   listMenu.menuLv3
    // );
    // setItemsMenu(siderBarData);
    // setTitle(titleMenu);
  };

  useEffect(() => {
    dispatch(getAllAssetRealEstateStorage());
    handleGetData();
  }, [appState.selectedKeys, id]);

  const renderBreadcrumb = useCallback(() => {
    if (params.id) {
      if (params.id === "1") {
        return {
          label: "Bất động sản",
          path: PRICE.replace(":id", params.id),
        };
      }
      if (params.id === "2") {
        return {
          label: "Động sản",
          path: PRICE.replace(":id", params.id),
        };
      }
      return {
        label: "",
        path: "",
      };
    } else
      return {
        label: "",
        path: "",
      };
  }, [params.id, PRICE]);

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Quản lý kho giá",
        path: "",
      },
      { ...renderBreadcrumb() },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [renderBreadcrumb]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <PriceMenu idLevelOne={params.id?.toString() || ""} />
          </Col>
          <Col span={18}>
            <AssetsTable />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Prices;
