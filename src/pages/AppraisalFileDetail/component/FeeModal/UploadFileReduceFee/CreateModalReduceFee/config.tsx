import * as Yup from "yup";
import { randomId } from "utils/string";
import { FeeContentReduceFeeCreateType } from "constant/types/appraisalFilesDetail";

const formUploadReduceFee = Yup.object().shape({
  filesLength: Yup.number().test(
    "is-not-zero",
    "Bạn chưa tải file lên",
    (value) => value !== 0
  ),
});

const newItem: FeeContentReduceFeeCreateType = {
  key: randomId(),
  note:"",
  dateUpload: "",
}

export { newItem, formUploadReduceFee };
