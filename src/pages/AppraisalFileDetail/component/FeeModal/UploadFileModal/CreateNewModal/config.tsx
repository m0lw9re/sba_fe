import * as Yup from "yup";
import { randomId } from "utils/string";
import { FeeContentAgreeFeeFileCreateType } from "constant/types/appraisalFilesDetail";

const formCreateNewAgreeFeeFileSchema = Yup.object().shape({
  filesLength: Yup.number().test(
    "is-not-zero",
    "Bạn chưa tải file lên",
    (value) => value !== 0
  ),
});

const newItem: FeeContentAgreeFeeFileCreateType = {
  key: randomId(),
  noteAgreeFee:"",
  dateAgreeFee: "",
}

export { newItem, formCreateNewAgreeFeeFileSchema };
