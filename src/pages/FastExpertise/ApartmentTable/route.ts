import {lazy} from "react";
import {FAST_EXPERTISE_APARTMENT} from "routes/route.constant";
const apartmentFastExpert = lazy(
  () => import("pages/FastExpertise/ApartmentTable")
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  path: FAST_EXPERTISE_APARTMENT,
  element: apartmentFastExpert,
};
