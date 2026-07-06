import { SBAAxiosClient } from "./base";

export const ecmFileApi = {
  uploadECMFile: (
    data: FormData,
    params: { fileType: string; isChangeFileName?: boolean }
  ) => {
    return SBAAxiosClient("/bussiness/api/v1/uploadECMFile", {
      method: "POST",
      data,
      params,
      timeout: 15000,
    });
  },
  downloadECMFile: (mediaType: string, ecmId: string) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/downloadECMFile/${mediaType}/${ecmId}`,
      {
        method: "GET",
        responseType: "blob",
      }
    );
  },
  downloadECMFileFromNotification: (data: {
    ecmId: string;
    filename: string;
    mediaType: string;
  }) => {
    return SBAAxiosClient("/bussiness/api/v1/downloadECMFile", {
      method: "POST",
      data,
      responseType: "blob",
      timeout: 15000,
    });
  },
  // upload multi file cho chức năng thay thế hồ sơ - không sử dụng cho chức năng khác
  uploadMultiECMFileReplace: (data: FormData) => {
    return SBAAxiosClient(
      "/bussiness/api/v1/uploadMultiFiles/legalDocument/sv?code=kkk",
      {
        method: "POST",
        data,
        timeout: 15000,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }
    );
  },

  uploadMultiFile: (data: FormData, fileType: string) => {
    return SBAAxiosClient(
      `/bussiness/api/v1/uploadMultiFiles/${fileType}/sv?code=new`,
      {
        method: "POST",
        data,
        timeout: 30000,
      }
    );
  },
};
