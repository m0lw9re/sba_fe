import {
  APPRAISAL_FILE_STATUS,
  BUSINESS_ADVANTAGE_OPTIONS,
  REFUSED_STATUS,
} from "constant/common";
import { ROLE_STATUS } from "constant/common";
import { UTILITIES_APARTMENT } from "constant/enums";

const randomId = function (length = 6) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

const renderAppraisalStatus = (
  status: number | string,
  isReceivedLos?: boolean | null,
  sendToEmail?: number | null,
  parentId?: string | null,
  refusedStatus?: number | null //0, 1
) => {
  if (
    status === APPRAISAL_FILE_STATUS.ONE ||
    status === APPRAISAL_FILE_STATUS.ZERO
  ) {
    if (parentId) {
      // là hồ sơ tái định giá
      if (isReceivedLos) return APPRAISAL_FILE_STATUS.RE_PRICING_LOS_LABEL;
      else return APPRAISAL_FILE_STATUS.RE_PRICING_MANUAL_LABEL;
    } else {
      // Không là hồ sơ tái định giá
      if (isReceivedLos) return APPRAISAL_FILE_STATUS.ONE_PLUS_LABEL;
    }
  }

  if (status === APPRAISAL_FILE_STATUS.TWENTY && sendToEmail)
    return APPRAISAL_FILE_STATUS.TWENTY_ONE_LABEL;

  switch (status) {
    case APPRAISAL_FILE_STATUS.MINUS_ONE:
      if (refusedStatus === 1) return APPRAISAL_FILE_STATUS.REFUSED_TO_NEW;
      else return APPRAISAL_FILE_STATUS.REFUSED_NO_PRICE;
    case APPRAISAL_FILE_STATUS.ONE:
      return APPRAISAL_FILE_STATUS.ONE_LABEL;
    case APPRAISAL_FILE_STATUS.ZERO:
      return APPRAISAL_FILE_STATUS.ZERO_LABEL;
    case APPRAISAL_FILE_STATUS.TWO:
      return APPRAISAL_FILE_STATUS.TWO_LABEL;
    case APPRAISAL_FILE_STATUS.THREE:
      return APPRAISAL_FILE_STATUS.THREE_LABEL;
    case APPRAISAL_FILE_STATUS.SIX:
      return APPRAISAL_FILE_STATUS.SIX_LABEL;
    case APPRAISAL_FILE_STATUS.SEVEN:
      return APPRAISAL_FILE_STATUS.SEVEN_LABEL;
    case APPRAISAL_FILE_STATUS.EIGHT:
      return APPRAISAL_FILE_STATUS.EIGHT_LABEL;
    case APPRAISAL_FILE_STATUS.NINE:
      return APPRAISAL_FILE_STATUS.NINE_LABEL;
    case APPRAISAL_FILE_STATUS.TEN:
      return APPRAISAL_FILE_STATUS.TEN_LABEL;
    // case APPRAISAL_FILE_STATUS.ELEVEN:
    //   return APPRAISAL_FILE_STATUS.ELEVEN_LABEL;
    case APPRAISAL_FILE_STATUS.TWELVE:
      return APPRAISAL_FILE_STATUS.TWELVE_LABEL;
    // case APPRAISAL_FILE_STATUS.THIRTEEN:
    //   return APPRAISAL_FILE_STATUS.THIRTEEN_LABEL;
    case APPRAISAL_FILE_STATUS.FOURTEEN:
      return APPRAISAL_FILE_STATUS.FOURTEEN_LABEL;
    case APPRAISAL_FILE_STATUS.FIFTEEN:
      return APPRAISAL_FILE_STATUS.FIFTEEN_LABEL;
    case APPRAISAL_FILE_STATUS.SIXTEEN:
      return APPRAISAL_FILE_STATUS.SIXTEEN_LABEL;
    case APPRAISAL_FILE_STATUS.SEVENTEEN:
      return APPRAISAL_FILE_STATUS.SEVENTEEN_LABEL;
    case APPRAISAL_FILE_STATUS.NINETEEN:
      return APPRAISAL_FILE_STATUS.NINETEEN_LABEL;
    case APPRAISAL_FILE_STATUS.TWENTY:
      return APPRAISAL_FILE_STATUS.TWENTY_LABEL;
    case APPRAISAL_FILE_STATUS.FORTY_ONE:
      return APPRAISAL_FILE_STATUS.FORTY_ONE_LABEL;
    case APPRAISAL_FILE_STATUS.MINUS_TWO:
      return APPRAISAL_FILE_STATUS.MINUS_TWO_LABEL;
    default:
      return "";
  }
};

const renderRoleStatus = (status: number | string) => {
  switch (status) {
    case ROLE_STATUS.ZERO:
      return ROLE_STATUS.ZERO_LABEL;
    case ROLE_STATUS.ONE:
      return ROLE_STATUS.ONE_LABEL;
    default:
      return "";
  }
};
const renderBusinessAdvantageLabel = (id: string | number) => {
  const businessAdvantageIndex = BUSINESS_ADVANTAGE_OPTIONS.findIndex(
    //compare number vs string should ==
    (x) => x.value === id
  );
  return businessAdvantageIndex !== -1
    ? BUSINESS_ADVANTAGE_OPTIONS[businessAdvantageIndex].label
    : id;
};
const removeDoubleSpaces = (str: string, trimLinesToo: boolean = false) => {
  let strResult = ``;
  let prev: any = ``;
  const strCopy = [...str];

  while (strCopy.length) {
    const chr = strCopy.shift();
    strResult += prev + chr !== `  ` ? chr : ``;
    prev = chr;
  }

  return trimLinesToo
    ? strResult
        .split(/\n/)
        .map((v) => v.trim())
        .join(`\n`)
    : strResult.trim();
};

const genUtilitiesApartment = (utilities: string) => {
  if (!utilities) return "";
  let resultArr: string[] = [];
  const splitArr = utilities.split(",");
  splitArr.forEach((item) => {
    switch (item.trim()) {
      case UTILITIES_APARTMENT.GARAGE:
        resultArr.push(UTILITIES_APARTMENT.GARAGE_LABEL);
        break;
      case UTILITIES_APARTMENT.POOL:
        resultArr.push(UTILITIES_APARTMENT.POOL_LABEL);
        break;
      case UTILITIES_APARTMENT.INNER_PARK:
        resultArr.push(UTILITIES_APARTMENT.INNER_PARK_LABEL);
        break;
      case UTILITIES_APARTMENT.COMMERCIALSERVICEAREA:
        resultArr.push(UTILITIES_APARTMENT.COMMERCIALSERVICEAREA_LABEL);
        break;
      case UTILITIES_APARTMENT.HOSPITAL_SCHOOL_PRESCHOOL:
        resultArr.push(UTILITIES_APARTMENT.HOSPITAL_SCHOOL_PRESCHOOL_LABEL);
        break;
      case UTILITIES_APARTMENT.RECEPTIONHALL:
        resultArr.push(UTILITIES_APARTMENT.RECEPTIONHALL_LABEL);
        break;
      case UTILITIES_APARTMENT.ELEVATOR:
        resultArr.push(UTILITIES_APARTMENT.ELEVATOR_LABEL);
        break;
      default:
        break;
    }
  });
  return resultArr.join(", ");
};

const renderRefusedStatus = (refusedStatus?: number | null) => {
  if (refusedStatus === null || refusedStatus === undefined) return "Từ chối";
  if (REFUSED_STATUS.REFUSED_TO_PRICE === refusedStatus)
    return REFUSED_STATUS.REFUSED_TO_PRICE_LABEL;
  if (REFUSED_STATUS.REFUSED_TO_CREATE === refusedStatus)
    return REFUSED_STATUS.REFUSED_TO_CREATE_LABEL;
  else return "Từ chối";
};

const configFilterAppraisalFile = (filters: any) => {
  if (!filters) return {};
  return {
    ...filters,
    ...(filters.fileStatusId === APPRAISAL_FILE_STATUS.LOS_RECEIVED
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.ONE,
          isReceivedLos: true,
        }
      : {}),
    ...(filters.fileStatusId === APPRAISAL_FILE_STATUS.ONE.toString()
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.ONE,
          isReceivedLos: "false",
        }
      : {}),
    ...(filters.fileStatusId === APPRAISAL_FILE_STATUS.TWENTY_ONE.toString()
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.TWENTY,
          sendToEmail: 1, // sendToEmail có 2 giá trị là 1 và null
        }
      : {}),
    ...(filters.fileStatusId === APPRAISAL_FILE_STATUS.TWENTY.toString()
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.TWENTY,
        }
      : {}),
    ...(filters.fileStatusId ===
    APPRAISAL_FILE_STATUS.REFUSED_NO_PRICE.toString()
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.MINUS_ONE,
          refusedStatus: 0,
        }
      : {}),
    ...(filters.fileStatusId === APPRAISAL_FILE_STATUS.REFUSED_TO_NEW.toString()
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.MINUS_ONE,
          refusedStatus: 1,
        }
      : {}),
  };
};

export {
  randomId,
  renderAppraisalStatus,
  renderRoleStatus,
  removeDoubleSpaces,
  renderBusinessAdvantageLabel,
  genUtilitiesApartment,
  renderRefusedStatus,
  configFilterAppraisalFile,
};
