import { TYPE_FIELD, UTILITIES_APARTMENT } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
const { CHECKBOX_GROUP } = TYPE_FIELD;
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 20, xl: 20 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 };
const fields: InputFiledParams[] = [
  {
    key: 1,
    name: "utilities",
    type: CHECKBOX_GROUP,
    css: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    options: [
      {
        value: UTILITIES_APARTMENT.GARAGE,
        label: UTILITIES_APARTMENT.GARAGE_LABEL,
      },
      {
        value: UTILITIES_APARTMENT.ELEVATOR,
        label: UTILITIES_APARTMENT.ELEVATOR_LABEL,
      },
      {
        value: UTILITIES_APARTMENT.RECEPTIONHALL,
        label: UTILITIES_APARTMENT.RECEPTIONHALL_LABEL,
      },
      {
        value: UTILITIES_APARTMENT.POOL,
        label: UTILITIES_APARTMENT.POOL_LABEL,
      },
      {
        value: UTILITIES_APARTMENT.INNER_PARK,
        label: UTILITIES_APARTMENT.INNER_PARK_LABEL,
      },
      {
        value: UTILITIES_APARTMENT.HOSPITAL_SCHOOL_PRESCHOOL,
        label: UTILITIES_APARTMENT.HOSPITAL_SCHOOL_PRESCHOOL_LABEL,
      },
      {
        value: UTILITIES_APARTMENT.COMMERCIALSERVICEAREA,
        label: UTILITIES_APARTMENT.COMMERCIALSERVICEAREA_LABEL,
      },
    ],
  },
];

export { fields };
