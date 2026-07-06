import { AppraisalFileLegalDocumentType } from "constant/types";
import * as Yup from "yup";
import { randomId } from "utils/string";

const formEditSbaAppraisalFileSchema = Yup.object().shape({
  legalDocumentTypeId: Yup.number().typeError(
    "Bạn chưa chọn loại tài liệu pháp lý"
  ),
  // documentContent: Yup.string().required("Bạn chưa nhập nội dung"),
  // filesLength: Yup.number().test(
  //   "is-not-zero",
  //   "Bạn chưa tải file lên",
  //   (value) => value !== 0
  // ),
});

const newItem: AppraisalFileLegalDocumentType = {
  key: randomId(),
  legalDocumentId: null,
  appraisalFileId: "",
  dateUpload: "",
  documentContent: "",
  ecmId: "",
  filename: "",
  legalDocumentType: {
    legalDocumentTypeId: 0,
    assetLevelTwoId: 0,
    customerTypeId: 0,
    isDeleted: 0,
    isRequired: 1,
    name: "",
  },
  legalDocumentTypeId: null,
  mediaType: "",
  type: 2,
  whoUpload: "",
};

export { newItem, formEditSbaAppraisalFileSchema };
