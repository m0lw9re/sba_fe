import { message } from "antd";
import { ColumnsType } from "antd/es/table";
import { LOCAL_STORAGE_KEY } from "constant/enums";
import { AppraisalFileType } from "constant/types";
import { AssignmentsType } from "constant/types/appraisalFile";
import { jwtDecode } from "jwt-decode";

type PayLoadToken = {
  authorities: Array<string>;
  exp: number;
  iat: number;
  sub: string;
  status: number | null;
};
export const handleHardLogout = (() => {
  //handle token failed or expired
  let hasRun = false;
  return () => {
    if (!hasRun) {
      message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      hasRun = true;
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 500);
    }
  };
})();

const getRoleAccount = (token?: any) => {
  try {
    const defaultValue =
      localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN) || "";
    const decoded = jwtDecode<PayLoadToken>(token || defaultValue);
    return decoded?.authorities || [];
  } catch (error) {
    return null;
  }
};
const getAccountStatus = (token?: any) => {
  try {
    const defaultValue =
      localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN) || "";
    const decoded = jwtDecode<PayLoadToken>(token || defaultValue);
    if (decoded.hasOwnProperty("status")) {
      return decoded?.status;
    } else {
      return 1;
    }
  } catch (error) {
    return null;
  }
};
const isContainRole = (...checkRoles: string[]) => {
  const roles = getRoleAccount() || [];
  return roles.some((role) => checkRoles.includes(role));
};
const getUsernameFromToken = (token?: any) => {
  try {
    const defaultValue =
      localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN) || "";
    const decodedToken = jwtDecode<PayLoadToken>(token || defaultValue);
    return decodedToken.sub;
  } catch (error) {
    handleHardLogout();
    return "unknown";
  }
};

const renderSTT = (page: any, limit: any, index: any) => {
  return (Number(page) - 1) * Number(limit) + index + 1;
};

const objectWithoutProperties = (obj: any, keys: string[]) => {
  let target: any = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
};

const removeObjUndefined = (obj: any) => {
  if (obj) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined || obj[key] === "" || obj[key] === null) {
        delete obj[key];
      }
    });
  }
  return obj;
};

const combineAddress = (
  detail: any,
  street: any,
  ward: any,
  district: any,
  province: any
) => {
  let array = [];
  let total = "";
  if (detail && detail !== "") {
    array.push(detail);
  }
  if (street && street !== "") {
    array.push(street);
  }
  if (ward && ward !== "") {
    array.push(ward);
  }
  if (district && district !== "") {
    array.push(district);
  }
  if (province && province !== "") {
    array.push(province);
  }
  array.forEach((e: string, index: number) => {
    total += e + `${index === array.length - 1 ? "" : ", "}`;
  });
  return total;
};

const transformToOptions = (data: any[], label: string, value: string) => {
  return (
    data?.map((item) => ({
      label: item[label],
      value: item[value],
    })) || []
  );
};
const renderAppraisalFilesTableByRole = (
  columns: ColumnsType<AppraisalFileType>
) => {
  if (isContainRole("ROLE_CBTH", "ROLE_PPTĐG")) {
    return columns
      .map((column: any) => {
        if (column.dataIndex === "address") {
          return {
            ...column,
            width: "450px",
          };
        }
        if (column.dataIndex === "surveyer") {
          return {
            ...column,
            key: 10.5,
          };
        }
        if (column.dataIndex === "rmName") {
          return {
            ...column,
            key: 10.9,
          };
        }
        return column;
      })
      .sort((a: any, b: any) => a.key - b.key);
  }
  return columns;
};
const isLiveEnv = Boolean(Number(process.env.REACT_APP_LIVE_ENVIRONMENT) || 0);
const isDevEnv = Boolean(Number(process.env.REACT_APP_DEV_ENVIRONMENT) || 0);

const getNumberAssignee = (assignments: AssignmentsType[]) => {
  try {
    if (!assignments) return 0;

    // tìm jobtype === 3 là CVTD để khảo sát
    const foundObj = assignments.find((item) => item.jobTypeId === 3);
    if (foundObj) {
      const listAssignee = JSON.parse(foundObj.staff || "");
      return listAssignee.length || 0;
    }
  } catch (error: any) {
    return 0;
  }
};
export {
  renderSTT,
  objectWithoutProperties,
  removeObjUndefined,
  combineAddress,
  transformToOptions,
  getRoleAccount,
  getUsernameFromToken,
  renderAppraisalFilesTableByRole,
  isContainRole,
  getAccountStatus,
  isLiveEnv,
  isDevEnv,
  getNumberAssignee,
};
