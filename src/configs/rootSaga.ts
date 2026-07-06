import { all } from "redux-saga/effects";
import pricesSaga from "pages/Prices/store/PricesSaga";
import getMenuPriceSaga from "pages/Prices/subcomponents/PriceMenu/store/PriceMenuSaga";
import appSaga from "pages/App/store/appSaga";

export default function* rootSaga() {
  yield all([pricesSaga(), getMenuPriceSaga(), appSaga()]);
}
