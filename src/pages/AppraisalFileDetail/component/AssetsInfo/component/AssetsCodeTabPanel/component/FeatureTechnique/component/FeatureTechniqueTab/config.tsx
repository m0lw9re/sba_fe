import { ArrowRightSVG } from "assets";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { stringValidate } from "utils/validate";
import * as Yup from "yup";
const defaultColumns2: ColumnsEdit = [
  {
    key: 1,
    title: "Đặc điểm",
    dataIndex: "type",
    width: "30%",
  },
  {
    key: 2,
    title: "HSPL",
    dataIndex: "hspl",
    width: "30%",
  },
  {
    key: 3,
    title: <ArrowRightSVG />,
    dataIndex: "icon",
    width: "5%",
  },
  {
    key: 4,
    title: "Thực tế",
    dataIndex: "real",
    width: "30%",
  },
];
const commonVehicleFormSchema = Yup.object().shape({
  realVehicleBrand: Yup.string().required("Vui lòng chọn nhãn hiệu").nullable(),
  legalVehicleModel: stringValidate
    .max(255, "Chỉ nhập được 255 ký tự")
    .nullable(),
  realVehicleModel: stringValidate
    .required("Vui lòng nhập số loại/model")
    .max(255, "Chỉ nhập được 255 ký tự")
    .nullable(),
  // legalColor: Yup.string().max(25, "Chỉ nhập được 25 ký tự").nullable(),
  realColor: Yup.string()
    .required("Vui lòng nhập màu sơn")
    .nullable(),
  legalYearMfg: Yup.number()
    .max(9999, "Chỉ nhập được 4 ký tự")
    .min(0, "Không được nhập số âm")
    .nullable(),
  realYearMfg: Yup.number()
    .required("Vui lòng nhập năm sản xuất")
    .max(9999, "Chỉ nhập được 4 ký tự")
    .min(0, "Không được nhập số âm")
    .nullable(),
  realCountryMfgId: Yup.string()
    .required("Vui lòng nhập nước sản xuất")
    .nullable(),
  realGearBoxId: Yup.string().required("Vui lòng chọn hộp số").nullable(),
  realFuelId: Yup.string().required("Vui lòng chọn loại nhiên liệu").nullable(),
  legalVehicleIdNumber: Yup.string()
    .max(50, "Chỉ nhập được 50 ký tự")
    .nullable(),
  realVehicleIdNumber: Yup.string()
    .required("Vui lòng nhập số khung")
    .max(50, "Chỉ nhập được 50 ký tự")
    .nullable(),
  legalEngineNumber: Yup.string().max(50, "Chỉ nhập được 50 ký tự").nullable(),
  realEngineNumber: Yup.string()
    .required("Vui lòng nhập số máy")
    .max(50, "Chỉ nhập được 50 ký tự")
    .nullable(),
  legalPlateNumber: Yup.string().max(20, "Chỉ nhập được 20 ký tự").nullable(),
  realPlateNumber: Yup.string().max(20, "Chỉ nhập được 20 ký tự").nullable().required("Vui lòng nhập biển số"),
  legalOverallDims: Yup.string().max(50, "Chỉ nhập được 50 ký tự").nullable(),
  realOverallDims: Yup.string().max(50, "Chỉ nhập được 50 ký tự").nullable(),
  legalWeightBase: Yup.number().min(0, "Không được nhập số âm").nullable(),
  realWeightBase: Yup.number().min(0, "Không được nhập số âm").nullable(),
  legalWeightAll: Yup.string().max(25, "Chỉ nhập được 25 ký tự").nullable(),
  realWeightAll: Yup.string().max(25, "Chỉ nhập được 25 ký tự").nullable(),
  legalWheelBase: Yup.string().nullable(),
  realWheelBase: Yup.string().nullable(),
  legalPersonCarry: Yup.string().max(50, "Chỉ nhập được 50 ký tự").nullable(),
  realPersonCarry: Yup.string().max(50, "Chỉ nhập được 50 ký tự").nullable(),
  legalEngineDisp: Yup.number().min(0, "Không được nhập số âm").nullable(),
  realEngineDisp: Yup.number().min(0, "Không được nhập số âm").nullable(),
  legalMaxOutputRpm: Yup.string().max(50, "Chỉ nhập được 50 ký tự").nullable(),
  realMaxOutputRpm: Yup.string().max(50, "Chỉ nhập được 50 ký tự").nullable(),
  legalNumberOfTires: Yup.string()
    .max(255, "Chỉ nhập được 255 ký tự")
    .nullable(),
  realNumberOfTires: Yup.string()
    .max(255, "Chỉ nhập được 255 ký tự")
    .nullable(),
  legalAdditionalContent: Yup.string()
    .max(2000, "Chỉ được nhập 2000 ký tự")
    .nullable(),
  realAdditionalContent: Yup.string()
    .max(2000, "Chỉ được nhập 2000 ký tự")
    .nullable(),
});
export { defaultColumns2, commonVehicleFormSchema };
