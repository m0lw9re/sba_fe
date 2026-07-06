import { validLengthInput } from "utils/validate";
import * as Yup from "yup";

export const formSchema = Yup.object().shape({
  provinceCode: Yup.string()
    .required("Vui lòng chọn Tỉnh/Thành phố")
    .typeError("Vui lòng chọn Tỉnh/Thành phố"),
  // districtCode: Yup.string()
  //   .required("Vui lòng chọn Quận/Huyện/Thị xã")
  //   .typeError("Vui lòng chọn Quận/Huyện/Thị xã"),
  // wardCode: Yup.string()
  //   .required("Vui lòng chọn Xã/ Phường/ Thị trấn")
  //   .typeError("Vui lòng chọn Xã/ Phường/ Thị trấn"),
  description: Yup.string()
    .required("Vui lòng nhập mô tả vị trí địa lý")
    .typeError("Vui lòng nhập mô tả vị trí địa lý")
    .test("descriptionFeatureFormSchema", "Chỉ nhập được 2000 ký tự", (val) =>
      validLengthInput(val, 2000)
    ),
  areaWidth: Yup.number()
    .required("Vui lòng nhập diện tích khuôn viên")
    .nullable(),
  currentAsset: Yup.string()
    .required("Vui lòng nhập hiện trạng")
    .typeError("Vui lòng nhập hiện trạng")
    .test("currentAssetFeatureFormSchema", "Chỉ nhập được 2000 ký tự", (val) =>
      validLengthInput(val, 2000)
    ),
  appraisalLocation: Yup.string()
    .required("Vui lòng nhập địa điểm thẩm định giá")
    .typeError("Vui lòng nhập địa điểm thẩm định giá")
    .test(
      "appraisalLocationFeatureFormSchema",
      "Chỉ nhập được 500 ký tự",
      (val) => validLengthInput(val, 500)
    ),
});
