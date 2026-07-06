import * as Yup from "yup";
import { randomId } from "utils/string";
import {
  FeeContentAgreeFeeFileType,
  FeeContentReduceFee,
} from "constant/types/appraisalFilesDetail";

const formCreateNewAgreeFeeFileSchema = Yup.object().shape({
  filesLength: Yup.number().test(
    "is-not-zero",
    "Bạn chưa tải file lên",
    (value) => value !== 0
  ),
  dateUploadReduceFee: Yup.string().nullable(),
});

const newItem: FeeContentReduceFee = {
  key: randomId(),
  note: "",
  ecmId: "",
  fileName: "",
  mediaType: "",
  dateUpload: "",
  dateUploadReduceFee: null,
};

export { newItem, formCreateNewAgreeFeeFileSchema };
