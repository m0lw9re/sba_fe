import {lazy} from "react";
import {FAST_EXPERTISE_APARTMENT_DETAIL} from "routes/route.constant";
const apartmentFastExpertiseDetail = lazy(
  () => import("pages/FastExpertise/ApartmentDetail")
);

export default {
  path: FAST_EXPERTISE_APARTMENT_DETAIL,
  element: apartmentFastExpertiseDetail,
};
