import _ from "lodash";
import * as Yup from "yup";
import validator from "validator";
import { numberUtils } from "./number";

const isValidEmail = (email: string) => {
  return validator.isEmail(email);
};

const isValidPhoneNumber = (phone: string) => {
  return validator.isMobilePhone(phone, "vi-VN");
};

const isValidPassWord = (pass: string) => {
  return validator.isStrongPassword(pass);
};

const isPositiveNumber = (rule: any, value: any, callback: any) => {
  const numberValue = Number(value);
  if (isNaN(numberValue) || numberValue <= 0) {
    callback("Nhập số lớn hơn 0!");
    callback("Nhập số lớn hơn 0!");
  } else {
    callback();
  }
};

const avoidZeroAndNullSelect = (
  rule: any,
  value: number | null,
  callback: any
) => {
  if (value === 0 || value === null) {
    callback("Chưa chọn giá trị!");
  } else {
    callback("");
  }
};

const serialize = (obj: any) => {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      if (obj[p] || obj[p] === 0)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};
const serializeAcceptNull = (obj: any) => {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

const isDeepEqual = (object1: any, object2: any) => {
  if (!object1 || !object2) return false;
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) return false;

  for (var key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if (
      (isObjects && !isDeepEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false;
    }
  }
  return true;
};

const isObject = (object: any) => {
  return object != null && typeof object === "object";
};

const transformRowSchemaToColumnSchema = (
  arr: any[],
  first_object_has_all_keys = true
) => {
  if (_.isEmpty(arr)) {
    return [];
  }

  let orderedKeys: any;
  if (first_object_has_all_keys) {
    // In case the first object has all keys
    orderedKeys = _.chain(arr).first().keys().sortBy().value();
  } else {
    // Alternative if not all objects have all keys :
    orderedKeys = _.uniq(_.flatMap(arr, _.keys));
  }

  let sortKeysBy = function (obj: any) {
    return _.zipObject(
      orderedKeys,
      _.map(orderedKeys, function (key) {
        return obj[key];
      })
    );
  };

  let indexToKeyMapping = _.reduce(
    orderedKeys,
    function (agg: any, key, i) {
      agg[i] = key;
      return agg;
    },
    {}
  );

  let arrayOfRowObjects = _.map(arr, sortKeysBy);
  let arrayOfRowArrays = _.map(arrayOfRowObjects, function (obj) {
    return _.values(obj);
  });
  let arrayOfColumnArrays = _.unzip(arrayOfRowArrays);
  let objectOfColumnArrays = _.reduce(
    arrayOfColumnArrays,
    function (agg: any, columnArr, i) {
      let key = indexToKeyMapping[i];
      agg[key] = columnArr;
      return agg;
    },
    {}
  );

  return objectOfColumnArrays;
};

const reTypeEmptyString2NullObj = (data: any) => {
  for (const key in data) {
    //value is array
    if (Array.isArray(data[key])) {
      data[key] = data[key].map((el: any) => {
        const tmpEl = { ...el };
        for (const elKey in tmpEl) {
          tmpEl[elKey] =
            !tmpEl[elKey] && tmpEl[elKey] !== 0 ? null : tmpEl[elKey];
        }
        return tmpEl;
      });
    } else {
      data[key] = !data[key] && data[key] !== 0 ? null : data[key];
    }
  }

  return data;
};

const removeFields = (array: any[], fields = ["key"]) => {
  return (
    array?.map((el) => {
      const tmpEl = { ...el };
      fields.forEach((field) => {
        delete tmpEl[field];
      });
      return tmpEl;
    }) || []
  );
};

const validLengthInput = (val: any, maxLength: number) => {
  const _val = val ? val.toString() : "";
  return _val.length <= maxLength;
};
const validateCurrencyMaxLength = 
  Yup.number().nullable()
  .test(
    "validateCurrencyMaxLength",
    "Số tiền quá lớn so với hệ thống. vui lòng liên hệ quản trị viên", 
    (val) => {
      if (!val && val !== 0) return true
      return  validLengthInput(numberUtils.roundNumber(val), 16)
    }
  )

const validateLengthAndWhiteSpace = (
  // message: string,
  length: number,
) => {
  return Yup.string()
    // .required(message)
    // .matches(
    //   /^[a-zA-Z\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ\s.,!?]*$/,
    //   'Vui lòng chỉ nhập ký tự chữ và khoảng trắng.',
    // )
    .max(length, `Chỉ nhập được ${length} ký tự`)
    .nullable();
};

const stringValidate = Yup.string().matches(
  /^[a-zA-Z0-9\s\(\)aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s.,!?/:;"'|+=_-]*$/,
  'Vui lòng chỉ nhập ký tự chữ, số và khoảng trắng.'
);

export {
  isDeepEqual,
  isValidEmail,
  isValidPassWord,
  isValidPhoneNumber,
  isPositiveNumber,
  avoidZeroAndNullSelect,
  serialize,
  transformRowSchemaToColumnSchema,
  serializeAcceptNull,
  reTypeEmptyString2NullObj,
  removeFields,
  validLengthInput,
  validateLengthAndWhiteSpace,
  validateCurrencyMaxLength,
  stringValidate,
};
