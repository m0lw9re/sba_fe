import {lazy} from "react";
import {
  FAST_EXPERTISE_APARTMENT_CREATE,
  FAST_EXPERTISE_APARTMENT_EDIT,
  FAST_EXPERTISE_APARTMENT_VIEW,
} from "routes/route.constant";
const apartmentFastExpertiseCreate = lazy(
  () => import("pages/FastExpertise/ApartmentCreate")
);

const apartmentFastExpertiseCreateRoute = {
  path: FAST_EXPERTISE_APARTMENT_CREATE,
  element: apartmentFastExpertiseCreate,
};
const apartmentFastExpertiseEditRoute = {
  path: FAST_EXPERTISE_APARTMENT_EDIT,
  element: apartmentFastExpertiseCreate,
};
const apartmentFastExpertiseViewRoute = {
  path: FAST_EXPERTISE_APARTMENT_VIEW,
  element: apartmentFastExpertiseCreate,
};
export {
  apartmentFastExpertiseCreateRoute,
  apartmentFastExpertiseEditRoute,
  apartmentFastExpertiseViewRoute,
};
