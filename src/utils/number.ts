import { ReadingConfig, doReadNumber } from "read-vietnamese-number";
import { removeDoubleSpaces } from "./string";

const defaultWords = ["hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

const units = ["1", "một", ...defaultWords];

const dozens = ["lẻ", "mười", ...defaultWords];

const hundreds = ["không", "một", ...defaultWords];

const unitBlock = ["1", "nghìn", "triệu", "tỷ", "ngìn tỷ", "triệu tỷ", "tỷ tỷ"];

const convert_block_three = (number: any) => {
  if (number === "000") return "";
  let _a: any = number + "";

  switch (_a.length) {
    case 0:
      return "";
    case 1:
      return units[_a];
    case 2:
      return convert_block_two(_a);
    case 3:
      let dozen = "";
      if (_a.slice(1, 3) !== "00") {
        dozen = convert_block_two(_a.slice(1, 3));
      }
      let hundred = hundreds[_a[0]] + " trăm";
      return hundred + " " + dozen;
  }
};

const convert_block_two = (number: any) => {
  let unit = units[number[1]];
  let dozen = dozens[number[0]];
  let append = "";

  if (number[0] > 0 && number[1] === 5) {
    unit = "lăm";
  }

  if (number[0] > 1) {
    append = " mươi";

    if (number[1] === 1) {
      unit = " mốt";
    }
  }

  return dozen + "" + append + " " + unit;
};

const numberUtils = {
  formatNumber: (number: number | string) => {
    if (!number) return "0";
    const parts = `${number}`.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    let strNumber = parts.join(",");
    // 09/01/2024 - haipham - #983 - remove "," in lastest
    if (parts[parts.length - 1] === "") {
      return strNumber.substring(0, strNumber.length - 1);
    }
    // end
    return strNumber;
  },

  numberToWords: (number: any) => {
    if (number === null || number === undefined) return "";
    if (number === 0) return "Không đồng";
    if (number > 9007199254740991) return "Số quá lớn";

    let str = parseInt(number) + "";
    let i = 0;
    let arr = [];
    let index = str.length;
    let result = [];
    let rsString = "";

    if (index === 0 || str === "NaN") {
      return "";
    }

    while (index >= 0) {
      arr.push(str.substring(index, Math.max(index - 3, 0)));
      index -= 3;
    }

    for (i = arr.length - 1; i >= 0; i--) {
      if (arr[i] !== "" && arr[i] !== "000") {
        result.push(convert_block_three(arr[i]));

        if (unitBlock[i]) {
          result.push(unitBlock[i]);
        }
      }
    }

    rsString = removeDoubleSpaces(result.join(" ").replace(/[0-9]/g, ""));

    return rsString.charAt(0).toUpperCase() + rsString.slice(1) + " đồng";
  },

  numberToWordsLib: (number: number | ""): string => {
    // Config reading options
    const config = new ReadingConfig();
    config.unit = ["đồng"];
    config.units = [
      [""],
      ["nghìn"],
      ["triệu"],
      ["tỷ"],
      ["nghìn tỷ"],
      ["triệu tỷ"],
      ["tỷ tỷ"],
    ];

    try {
      // Start reading
      const result = doReadNumber(number.toString(), config).replaceAll(
        "tư",
        "bốn"
      );
      return result.charAt(0).toUpperCase() + result.slice(1);
    } catch (err) {
      console.log("err:", err);
      return "";
      // // Handle errors
      // if (err instanceof InvalidFormatError) {
      //   console.error('Định dạng input không hợp lệ')
      // } else if (err instanceof InvalidNumberError) {
      //   console.error('Số không hợp lệ')
      // } else if (err instanceof NotEnoughUnitError) {
      //   console.error('Không đủ đơn vị đọc số')
      // }
    }
  },
  roundDecimalNumber: (number: number | null) => {
    if (!number && number !== 0) return null;
    if (number === 0) return 0;
    return Math.round(number * Math.pow(10, 3)) / Math.pow(10, 3);
  },
  roundTwoDigitsDecimalNumber: (number: number | null) => {
    if (!number && number !== 0) return null;
    if (number === 0) return 0;
    return Math.round(number * Math.pow(10, 2)) / Math.pow(10, 2);
  },
  roundNumber: (number: number | null) => {
    if (!number && number !== 0) return null;
    if (number === 0) return 0;
    return Math.round(number);
  },
};

export { numberUtils };
