import * as Yup from "yup";
import { stringValidate, validLengthInput } from "utils/validate";

const maxStringLength = "Chỉ nhập được 255 ký tự";
const maxNumberLength = "Chỉ nhập được 25 ký tự";

const warningDigital = "Chỉ được nhập số, số thập phân";

const getSchemaValidate = (produceInVietNam: boolean) => {
  return Yup.object().shape({
    ...formSchema.fields,
    realManufacturingLocation: produceInVietNam
      ? Yup.number()
          .required("Vui lòng chọn nơi đóng tàu")
          .typeError("Vui lòng chọn nơi đóng tàu")
      : Yup.number().nullable(),
  });
};

const formSchema = Yup.object().shape({
  legalName: stringValidate
    .nullable()
    .test("legalName", maxStringLength, (val) => validLengthInput(val, 255)),
  legalRegisterNumber: stringValidate
    .test("legalRegisterNumber", maxStringLength, (val) =>
      validLengthInput(val, 255)
    )
    .nullable(),
  legalModel: stringValidate
    .test("legalModel", maxStringLength, (val) => validLengthInput(val, 255))
    .nullable(),
  legalImoNumber: Yup.string()
    .test("legalImoNumber", maxStringLength, (val) =>
      validLengthInput(val, 255)
    )
    .nullable(),
  legalShipUtilities: stringValidate
    .test("legalShipUtilities", maxStringLength, (val) =>
      validLengthInput(val, 255)
    )
    .nullable(),
  realName: stringValidate
    .required("Vui lòng nhập tên tàu")
    .test("realName", maxStringLength, (val) => validLengthInput(val, 255))
    .nullable(),
  realRegisterNumber: stringValidate
    .required("Vui lòng nhập số đăng ký")
    .test("realRegisterNumber", maxStringLength, (val) =>
      validLengthInput(val, 255)
    )
    .nullable(),
  realModel: stringValidate
    .required("Vui lòng nhập số loại/model")
    .test("realModel", maxStringLength, (val) => validLengthInput(val, 255))
    .nullable(),
  realImoNumber: Yup.string()
    .required("Vui lòng nhập số nhận dạng tàu/Số IMO")
    .test("realImoNumber", maxStringLength, (val) => validLengthInput(val, 255))
    .nullable(),
  realYearMfg: Yup.number()
    .required("Vui lòng nhập năm sản xuất")
    .typeError("Vui lòng nhập năm sản xuất"),
  realCountryMfg: Yup.number()
    .required("Vui lòng chọn nước sản xuất")
    .typeError("Vui lòng chọn nước sản xuất"),
  realRegisterCountry: Yup.number()
    .required("Vui lòng chọn quốc gia đăng ký")
    .typeError("Vui lòng chọn quốc gia đăng ký"),
  realShipbuildingBrand: Yup.string()
    .required("Vui lòng chọn hãng đóng tàu")
    .nullable(),
  realShipUtilities: stringValidate
    .required("Vui lòng nhập công năng sử dụng")
    .test("realShipUtilities", maxStringLength, (val) =>
      validLengthInput(val, 255)
    )
    .nullable(),
  legalDesignLength: Yup.number()
    .test("legalDesignLength", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  realDesignLength: Yup.number()
    .test("realDesignLength", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  legalDesignWidth: Yup.number()
    .test("legalDesignWidth", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  realDesignWidth: Yup.number()
    .test("realDesignWidth", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  legalMaxLength: Yup.number()
    .test("legalMaxLength", maxNumberLength, (val) => validLengthInput(val, 25))
    .typeError(warningDigital)
    .nullable(),
  realMaxLength: Yup.number()
    .test("realMaxLength", maxNumberLength, (val) => validLengthInput(val, 25))
    .typeError(warningDigital)
    .nullable(),
  legalBoardHeight: Yup.number()
    .test("legalBoardHeight", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  realBoardHeight: Yup.number()
    .test("realBoardHeight", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  legalSink: Yup.number()
    .test("legalSink", maxNumberLength, (val) => validLengthInput(val, 25))
    .typeError(warningDigital)
    .nullable(),
  realSink: Yup.number()
    .test("realSink", maxNumberLength, (val) => validLengthInput(val, 25))
    .typeError(warningDigital)
    .nullable(),
  legalFreeBoard: Yup.number()
    .test("legalFreeBoard", maxNumberLength, (val) => validLengthInput(val, 25))
    .typeError(warningDigital)
    .nullable(),
  realFreeBoard: Yup.number()
    .test("realFreeBoard", maxNumberLength, (val) => validLengthInput(val, 25))
    .typeError(warningDigital)
    .nullable(),
  legalMachineNum: Yup.number()
    .test("legalMachineNum", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  realMachineNum: Yup.number()
    .test("realMachineNum", maxNumberLength, (val) => validLengthInput(val, 25))
    .typeError(warningDigital)
    .nullable(),
  legalMachinePower: Yup.number()
    .test("legalMachinePower", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  realMachinePower: Yup.number()
    .test("realMachinePower", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  legalDeadWeight: Yup.number()
    .test("legalDeadWeight", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  realDeadWeight: Yup.number()
    .test("realDeadWeight", maxNumberLength, (val) => validLengthInput(val, 25))
    .typeError(warningDigital)
    .nullable(),
  legalGrossTonnage: Yup.number()
    .test("legalGrossTonnage", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  realGrossTonnage: Yup.number()
    .test("realGrossTonnage", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  legalUseTonnage: Yup.number()
    .test("legalUseTonnage", maxNumberLength, (val) =>
      validLengthInput(val, 25)
    )
    .typeError(warningDigital)
    .nullable(),
  realUseTonnage: Yup.number()
    .test("realUseTonnage", maxNumberLength, (val) => validLengthInput(val, 25))
    .typeError(warningDigital)
    .nullable(),
  legalSpeed: Yup.number()
    .test("legalSpeed", maxNumberLength, (val) => validLengthInput(val, 25))
    .typeError(warningDigital)
    .nullable(),
  realSpeed: Yup.number()
    .test("realSpeed", maxNumberLength, (val) => validLengthInput(val, 25))
    .typeError(warningDigital)
    .nullable(),
});

export { getSchemaValidate };
