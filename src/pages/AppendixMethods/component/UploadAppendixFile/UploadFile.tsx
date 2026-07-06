import { UploadFile, message } from "antd";
import { RcFile, UploadProps } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";
import { ecmFileApi } from "apis/ecmFile";
import Icons from "assets/icons";
import { PdfFileType } from "constant/types/appraisalFile";
import { saveAs } from "file-saver";
import { debounce } from "lodash";
import "pages/AppraisalFileDetail/component/PositonAndImg/component/ImagePanelTab/components/ImageAddendum/style.scss";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { randomId } from "utils";
import "./style.scss";

type Props = {
  data: Array<PdfFileType>;
  maxCount?: number;
  typeSection: "local" | "los";
};

type FileListType = UploadFile & { key: string };

type RefProps = {
  uploadFile: () => void;
};

const UploadFileSection = forwardRef<RefProps, Props>(
  ({ data, maxCount, typeSection }, ref) => {
    const [fileList, setFileList] = useState<FileListType[]>([]);
    const MAX_TOTAL_SIZE = 5; // 5MB
    // const exceededFilesRef = useRef<FileListType[]>([]);

    const handleChange = useCallback(
      debounce(({ fileList: newFileList }) => {
        // const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        let newFileListImage = newFileList?.map((item: FileListType) => {
          const foundIndex = fileList.findIndex(
            (itemSub) => itemSub.uid === item.uid
          );
          if (foundIndex === -1)
            return {
              ...item,
              key: randomId(),
            };
          return {
            ...item,
            key: randomId(),
          };
        });

        let totalSize = 0;
        let newFileListImageTemp: any = [];
        for (const item of newFileListImage) {
          if (item.size) {
            const itemSizeInMB = item.size * 0.000001;
            if (totalSize + itemSizeInMB <= MAX_TOTAL_SIZE) {
              newFileListImageTemp.push(item);
              totalSize += itemSizeInMB;
            } else {
              message.error(`${item.name} làm tổng dung lượng vượt quá 5MB`);
              // exceededFilesRef.current.push(item);
            }
          } else {
            newFileListImageTemp.push(item);
          }
        }

        setFileList((prevFileList) => {
          const updatedFileList = [...newFileListImageTemp];
          return updatedFileList;
        });
        // }
      }, 500),
      []
    );

    // useEffect(() => {
    //   if (exceededFilesRef.current.length > 0) {
    //     const uniqueExceededFiles = Array.from(
    //       new Set(exceededFilesRef.current.map((file) => file.uid))
    //     ).map((uid) =>
    //       exceededFilesRef.current.find((file) => file.uid === uid)
    //     );

    //     uniqueExceededFiles.forEach((item: any) => {
    //       message.error(`${item.name} làm tổng dung lượng vượt quá 5MB`);
    //     });
    //   }
    // }, [exceededFilesRef.current]);

    const handleCustomStatusUpload = (options: any) => {
      if (options.onSuccess()) {
        options.onSuccess();
      }
      return 1;
    };

    useEffect(() => {
      if (data && data.length > 0) {
        const existingUids = new Set(fileList.map((item) => item.uid));
        const newItems = data
          //.filter((item) => !existingUids.has(item.ecmId))
          .map((item) => {
            const convertedFile = {
              ...item,
              key: randomId(),
              uid: item.ecmId,
              name: item?.filename,
              status: "done",
            };

            const { type, ...newObj } = convertedFile;
            return newObj;
            // ...item,
          }) as any[];

        setFileList((prev) => [...newItems]);
      } else {
        setFileList([]);
      }
    }, [data]);

    const propsDragger: UploadProps = {
      onChange: handleChange,
      accept: typeSection === "local" ? ".pdf, .xlsx" : ".pdf",
      fileList,
      customRequest: handleCustomStatusUpload,
      multiple: true,
      maxCount: maxCount,
      onDownload: async (file: any) => {
        if (file?.ecmId && file?.filename) {
          try {
            const res = await ecmFileApi.downloadECMFile(
              "appendix",
              file?.ecmId
            );
            saveAs(res.data, file?.filename);
          } catch {
            message.success("Tải file thất bại");
          }
        }
      },
      showUploadList: {
        showDownloadIcon: true,
        downloadIcon: <Icons.download />,
        showRemoveIcon: true,
      },
    };

    const handleCheckFileListChange = () => {
      if (data.length !== fileList.length) return true;
      if (data.length === 0 && fileList.length === 0) return false;

      let flag = false;
      const dataUids = new Set(data.map((item) => item.ecmId));
      const fileUuids = new Set(fileList.map((item) => item.uid));
      dataUids.forEach((item) => {
        if (!fileUuids.has(item)) flag = true;
      });
      return flag;
    };

    // useEffect(() => {
    //   let totalSize = 0;
    //   const newFileList: any = [];

    //   fileList.forEach((item) => {
    //     if (item.size && (totalSize + item.size) * 0.000001 <= MAX_TOTAL_SIZE) {
    //       newFileList.push(item);
    //       totalSize += item.size * 0.000001;
    //     } else {
    //       message.error(`${item.name} làm tổng dung lượng vượt quá 5MB`);
    //     }
    //   });

    //   setFileList(newFileList);
    // }, [fileList]);

    const handleUploadFileEcm = async () => {
      if (!handleCheckFileListChange()) return fileList;

      const handleUpload = async (item: FileListType) => {
        if (!item.originFileObj) return;
        const formData = new FormData();
        formData.append("file", item.originFileObj as RcFile);
        try {
          const response = await ecmFileApi.uploadECMFile(formData, {
            fileType: "appendix",
          });
          if (
            response.data?.statusCodeValue === 200 &&
            response.data?.body?.ecmId
          ) {
            // message.success(`Upload file ${item.name} thành công!`);
            setFileList([]);
            return {
              ...response.data.body,
              filename: item.name,
            };
          } else {
            setFileList([]);
            throw new Error();
          }
        } catch (error) {
          message.error(`Lỗi khi upload file: ${item.name}!`);
          return null;
        }
      };

      const processFileUpload: any = async (fileIndex: any) => {
        if (fileIndex >= fileList.length) {
          return [];
        }

        try {
          const fileUploadedInfo =
            (await handleUpload(fileList[fileIndex])) || fileList[fileIndex];
          const nextFileIndex = fileIndex + 1;
          const remainingFileUploadedInfo = await processFileUpload(
            nextFileIndex
          );
          return [fileUploadedInfo, ...remainingFileUploadedInfo];
        } catch (error) {
          return [];
        }
      };

      const fileUploadedInfo = await processFileUpload(0);
      return fileUploadedInfo.filter((item: any) => item.ecmId);
    };

    useImperativeHandle(ref, () => ({
      uploadFile: handleUploadFileEcm,
    }));

    return (
      <>
        <Dragger
          {...propsDragger}
          height={202}
          className={fileList.length > 0 ? "pdf-form-upload" : ""}
        >
          <p className="ant-upload-text">
            Kéo thả hoặc Upload file từ máy tính
          </p>
          <p style={{ color: "#2862AF", fontSize: "16px" }}>
            Upload file {typeSection === "local" ? "PDF, EXCEL" : "PDF"}{" "}
            <Icons.upload style={{ fontSize: "20px", marginLeft: "8px" }} />
          </p>
        </Dragger>
      </>
    );
  }
);

export default memo(UploadFileSection);
