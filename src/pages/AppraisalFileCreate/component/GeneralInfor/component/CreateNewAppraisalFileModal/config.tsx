import { AppraisalFileLegalDocumentType } from "constant/types";
import { randomId } from "utils";
import * as Yup from "yup";

const formCreateNewSbaAppraisalFileSchema = Yup.object().shape({
  legalDocumentTypeId: Yup.number().typeError(
    "Bạn chưa chọn loại tài liệu pháp lý"
  ),
  filesLength: Yup.number().test(
    "is-not-zero",
    "Bạn chưa tải file lên",
    (value) => value !== 0
  ),
});

const newItem: AppraisalFileLegalDocumentType = {
  key: randomId(),
  appraisalFileId: "",
  legalDocumentId: null,
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

export { newItem, formCreateNewSbaAppraisalFileSchema };
