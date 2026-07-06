import { validLengthInput } from "utils/validate";
import * as Yup from "yup";

export const formSchema = Yup.object().shape({
  assetLandUsingPurposes: Yup.array().of(
    Yup.object().shape({
      realAreaWidth: Yup.number()
        .typeError("Chỉ được nhập số")
        .nullable()
        .required("Diện tích khuôn viên không được để trống"),
      usingPurposeId: Yup.string()
        .required("Vui lòng chọn mục đích sử dụng đất")
        .typeError("Vui lòng chọn mục đích sử dụng đất"),
      usingOrigin: Yup.string()
        .nullable()
        .test("usingOriginFormSchema", "Chỉ nhập được 255 ký tự", (val) =>
          validLengthInput(val, 255)
        ),
      usingPeriod: Yup.string()
        .nullable()
        .test("usingPeriodFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
          validLengthInput(val, 50)
        ),
    })
  ),
  assetTrees: Yup.array().of(
    Yup.object().shape({
      treeTypeId: Yup.number()
        .required("Vui lòng chọn loại cây trồng")
        .typeError("Vui lòng chọn loại cây trồng"),
      treeDetail: Yup.string()
        .required("Vui lòng nhập chi tiết cây trồng")
        .typeError("Vui lòng nhập chi tiết cây trồng")
        .test("treeDetailFormSchema", "Chỉ nhập được 500 ký tự", (val) =>
          validLengthInput(val, 500)
        ),
      yearOld: Yup.number()
        .required("Vui lòng nhập năm tuổi")
        .typeError("Vui lòng nhập năm tuổi")
        .test("yearOldFormSchema", "Chỉ nhập được 4 ký tự", (val) =>
          validLengthInput(val, 4)
        ),
      density: Yup.number()
        .nullable()
        .test("densityFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
          validLengthInput(val, 50)
        ),
      area: Yup.number()
        .required("Vui lòng nhập diện tích")
        .typeError("Vui lòng nhập diện tích")
        .test("areaFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
          validLengthInput(val, 50)
        ),
      lossRate: Yup.number()
        .nullable()
        .test("lossRateFormSchema", "Chỉ nhập được 3 ký tự", (val) =>
          validLengthInput(val, 3)
        ),
      amount: Yup.number()
        .nullable()
        .test("amountFormSchema", "Chỉ nhập được 25 ký tự", (val) =>
          validLengthInput(val, 25)
        ),
    })
  ),
});

