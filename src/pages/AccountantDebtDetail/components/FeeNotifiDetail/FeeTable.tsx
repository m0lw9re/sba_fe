import {
  Button,
  Form,
  message,
  Card,
  Space,
  Col,
  Typography,
  Modal,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { RcFile } from "antd/es/upload";
import { appraisalFilesApi } from "apis/appraisalFiles";
import Icons from "assets/icons";
import { ecmFileApi } from "apis/ecmFile";
import { DynamicTable } from "components/DynamicTable";
import FormItem from "components/InputFields/FormItem";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { AssetLandInfoType } from "constant/types/appraisalFile";
import {
  FeeContentType,
  ProfileExpenseLOS,
} from "constant/types/appraisalFilesDetail";
import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { saveAs } from "file-saver";
import {
  AppraisalFileLegalDocumentType,
  AppraisalFileType,
} from "constant/types";
import { randomId } from "utils";
import { useFormik } from "formik";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ButtonCustom from "components/ButtonCustom";
import ModalEdit from "./ModalEdit";
import ModalUploadFile from "./ModalUploadFile";
import { useAppraisalFileDetail } from "utils/request";
import { BUTTON_CODES, FEE_LIST_DOCUMENT } from "constant/common";
import { syncEMSApi } from "apis/syncEMS";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { setConfirmButtonRedux } from "pages/AccountantDebtDetail/store/accountantDebtDetailSlice";
import { RootState } from "configs/configureStore";
import ModalListDocument, {
  DataPropsListDocumentType,
} from "pages/AccountantDebtDetail/components/FeeNotifiDetail/ModalListDocument";
import ModalTBKQ from "./ModalTBKQ";

const { INPUT_NUMBER, INPUT, SELECT, DATE_PICKER, POPUP_INPUT } = TYPE_FIELD;

type Props = {
  data: FeeContentType[];
  dataAll: any;
  appraisalFileId: string;
  mutateFeeModalTable: any;
};

type FormDataType = {
  legalDocuments: Array<AppraisalFileLegalDocumentType>;
};

type RefProps = {
  feeContentsData: () => void;
  uploadFile: () => void;
  // uploadFileResult: () => void;
  checkCheckBox: FeeContentType[];
  clearSelectedRows: () => void;
};

const feeContentInit: FeeContentType = {
  feeContentId: null,
  feeNotificationId: null,
  key: "",
  content: "",
  code: "",
  dateConfirm: "",
  dateCreate: "",
  dateModify: "",
  ngayThuTien: "",
  ngayXuatHd: "",
  receiveDate: "",
  reductFeeDate: "",
  dateNotification: "",
  dateUpload: "",
  fileName: "",
  ecmId: "",
  isChecked: false,
  note: "",
  contentId: null,
  price: null,
  daThu: null,
  soTienXuatHoaDonThucTe: null,
  soTienCanXuatHoaDon: null,
  totalPrice: null,
  status: 0,
  statusEms: null,
  noteByLos: "",
  whoCreate: "",
  received: 0,
  congNo: 0,
  revenue: 0,
  reducedFee: null,
  reduceFeePercent: null,
  isLocked: false,
};

const initialValue: FormDataType = {
  legalDocuments: [],
};
type LoadingState = {
  paymentRequest: boolean;
  profileExpense: boolean;
  thuHoiXuatHD: boolean;
};

const FeeModalTable = forwardRef<RefProps, Props>((props, ref) => {
  const { data = [], dataAll, appraisalFileId, mutateFeeModalTable } = props;
  const dispatch = useDispatch();
  const { isSetConfirmButton } = useSelector(
    (state: RootState) => state.accountantDebtDetailSlice
  );
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<FeeContentType[]>([]);
  const [dataSource, setDataSource] = useState<FeeContentType[]>([]);
  const [contentsData, setContentsData] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [internalRecording, setInternalRecording] = useState<any>({
    title: "",
    edit: {},
    index: undefined,
  });
  const [dataEditFile, setDataEditFile] = useState<any>({
    ecmId: "",
    fileName: "",
    noteFile: "",
    dateUpload: null,
  });
  const [fileListResult, setFileListResult] = useState<any>([]);
  const [loadingBtn, setLoadingBtn] = useState<LoadingState>({
    paymentRequest: false,
    profileExpense: false,
    thuHoiXuatHD: false,
  });
  const [isOpenModal, setIsOpenModal] = useState({
    isOpenModalUploadFile: false,
    isOpenModalUploadFileTotal: false,
    isOpenModalEdit: false,
    isOpenModalListDocument: false,
  });
  const [exporting, setExporting] = useState(false);
  const formDataFile = useFormik({
    initialValues: initialValue,
    onSubmit: (data: FormDataType): any => {
      return data;
    },
  });

  const [dataListDocument, setDataListDocument] =
    useState<DataPropsListDocumentType>({
      feeContentId: null,
      listDocuments: [],
      disabled: true,
    });

  const [dataModalTBKQ, setDataTBKQ] = useState<{
    type: number;
    isOpenModal: boolean;
  }>({
    type: FEE_LIST_DOCUMENT.FILE_THONG_BAO,
    isOpenModal: false,
  });

  const {
    data: dataAppraisalFileDetail,
    isLoading: isLoadingAppraisalFileDetail,
    error: errorAppraisalFileDetail,
    mutate: mutateAppraisalFileDetail,
  }: {
    data: AppraisalFileType;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useAppraisalFileDetail(appraisalFileId);

  const openModalUploadFile = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalUploadFile: true,
    });
    setDataEditFile((prevState: any) => ({
      ...prevState,
      ecmId: dataAll.ecmId,
      fileName: dataAll.fileName,
      noteFile: dataAll.noteFile,
      dateUpload: dataAll.dateUpload,
    }));
  };

  const closeModalUploadFileTotal = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalUploadFileTotal: false,
    });
  };

  const openModalEdit = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalEdit: true,
    });
  };

  const closeModalUploadFile = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalUploadFile: false,
    });
  };

  const closeModalEdit = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalEdit: false,
    });
  };

  const handleAddFeeContent = () => {
    const newFeeContent = { ...feeContentInit, key: randomId(), isNew: true };
    setDataSource([...dataSource, newFeeContent]);
  };

  const handleSetLoadingBtn = (key: string, value: boolean) => {
    setLoadingBtn((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const syncEMS = async (data: string) => {
    try {
      setExporting(true);
      let res = await syncEMSApi.syncEMS({
        profileCode: data,
        options: 1,
        clientId: null,
        issuedInvoiceOnly: false,
        paidOnly: false,
      });
      if (res?.data?.code === 200) {
        mutateFeeModalTable();
        message.success(`Đồng bộ từ EMS thành công!`);
        setExporting(false);
      } else {
        message.error(res?.data?.message || `Đồng bộ từ EMS thất bại!`);
        setExporting(false);
      }
    } catch (error) {
      message.error(`Lỗi! Đồng bộ từ EMS thất bại!`);
      setExporting(false);
    } finally {
      setExporting(false);
    }
  };

  const autoSyncEMS = async (data: string): Promise<void> => {
    try {
      const response = await syncEMSApi.syncEMS({
        profileCode: data,
        options: 1,
        clientId: null,
        issuedInvoiceOnly: false,
        paidOnly: false,
      });

      if (response?.data?.code === 200) {
        await mutateFeeModalTable();
      }
    } catch (error) {
      console.error("Error occurred during EMS sync:", error);
    }
  };

  const sendMail =
    dataAppraisalFileDetail && dataAppraisalFileDetail.typeCreated === 0;

  const handleSetProfileExpense = async () => {
    try {
      handleSetLoadingBtn("profileExpense", true);
      let body = {
        feeNotificationId: selectedRows[0].feeNotificationId,
        feeContentIds: selectedRows.map((item: any) => item.feeContentId),
      };

      if (dataAll.isLocked) {
        await appraisalFilesApi.lockEditFee({
          feeNotificationId: dataAll.feeNotificationId,
          isLocked: false,
          feeContentIds: [],
        });
      }

      const resUpdate = await appraisalFilesApi.updateFeeNotificationInfo(
        {
          ...dataAll,
          feeContents: [...dataSource],
        },
        dataAll.isLocked ? true : false
      );

      if (resUpdate?.data?.body?.code === 200) {
        let responseProfileExpense;
        responseProfileExpense = await appraisalFilesApi.setProfileExpense(
          body as ProfileExpenseLOS
        );
        if (responseProfileExpense?.data?.code === 200) {
          message.success(
            responseProfileExpense?.data?.message ||
              "Thực hiện xuất hóa đơn thành công!"
          );
          await appraisalFilesApi.setProfileExpense(body as ProfileExpenseLOS);
          clearSelectedRows();
          mutateFeeModalTable();
        } else {
          message.error(
            responseProfileExpense?.data?.message ||
              "Thực hiện xuất hóa đơn thất bại!"
          );
        }
      } else {
        message.error("Không cập nhật được phí! Đề nghị xuất HĐ thất bại!");
      }
    } catch (error) {
      message.error("Lỗi không xác định! Thực hiện xuất hóa đơn thất bại!");
    } finally {
      handleSetLoadingBtn("profileExpense", false);
    }
  };

  const thuHoiXuatHD = async () => {
    handleSetLoadingBtn("thuHoiXuatHD", true);
    let body = {
      feeNotificationId: selectedRows[0].feeNotificationId,
      feeContentIds: selectedRows.map((item: any) => item.feeContentId),
    };

    try {
      let response = await appraisalFilesApi.unProfileExpense(
        body as ProfileExpenseLOS
      );

      if (response.data.code === 200) {
        message.success(
          response.data.message ||
            "Yêu cầu thu thu hồi xuất hóa đơn thành công!"
        );
        mutateFeeModalTable();
        clearSelectedRows();
      } else {
        const messErr =
          response.data.message || "Yêu cầu thu thu hồi xuất hóa đơn thất bại!";
        console.log(messErr);

        message.error(
          <>
            {messErr.split("\n").map((item: any) => item && <div>{item}</div>)}
          </>
        );
      }
    } catch (error) {
      message.error("Yêu cầu thu thu hồi xuất hóa đơn thất bại!");
    } finally {
      handleSetLoadingBtn("thuHoiXuatHD", false);
    }
  };

  const handleSendPaymentRequest = async () => {
    try {
      handleSetLoadingBtn("paymentRequest", true);
      let body = {
        feeNotificationId: selectedRows[0].feeNotificationId,
        feeContentIds: selectedRows.map((item: any) => item.feeContentId),
      };

      if (dataAll.isLocked) {
        await appraisalFilesApi.lockEditFee({
          feeNotificationId: dataAll.feeNotificationId,
          isLocked: false,
          feeContentIds: [],
        });
      }

      const resUpdate = await appraisalFilesApi.updateFeeNotificationInfo(
        {
          ...dataAll,
          feeContents: [...dataSource],
        },
        dataAll.isLocked ? true : false
      );

      if (resUpdate?.data?.body?.code === 200) {
        let response = await appraisalFilesApi.sendPaymentRequest(
          body as ProfileExpenseLOS
        );
        if (response?.data?.code === 200) {
          message.success(
            response.data.message || "Yêu cầu thu tiền thành công!"
          );
          mutateFeeModalTable();
          clearSelectedRows();
        } else {
          message.error(response.data.message || "Yêu cầu thu tiền thất bại!");
        }
      } else {
        message.error("Không cập nhật được phí! Yêu cầu thu tiền thất bại!");
      }
    } catch (error) {
      message.error("Lỗi không xác định! Yêu cầu thu tiền thất bại!");
    } finally {
      handleSetLoadingBtn("paymentRequest", false);
    }
  };

  const handleDeleteFeeContent = (key: string) => {
    const newFeeContentData = dataSource.filter(
      (item) => item.key !== key
    ) as FeeContentType[];
    setDataSource(newFeeContentData);
    form.setFieldsValue({
      data: newFeeContentData,
    });
  };

  const handleRowChange = (value: any, index: number) => {
    const tmpDataSource = [...dataSource];
    tmpDataSource[index] = { ...tmpDataSource[index], ...value };

    let tmpPrice = tmpDataSource[index].price;

    if (
      (tmpDataSource[index].content === "Phí đợt 1" &&
        (!tmpPrice ||
          tmpPrice === 5000000 ||
          tmpPrice === 10000000 ||
          tmpPrice === 2000000 ||
          tmpPrice === 0)) ||
      (tmpDataSource[index].content === "Công tác phí" &&
        (!tmpPrice ||
          tmpPrice === 5000000 ||
          tmpPrice === 10000000 ||
          tmpPrice === 2000000 ||
          tmpPrice === 0)) ||
      tmpDataSource[index].content === "Phí đợt 2"
    ) {
      form.setFieldsValue({
        data: [
          ...tmpDataSource.map((item, i) => {
            if (item.content === "Phí đợt 1" && i === index) {
              const price =
                dataAll?.natureName === "Dự án"
                  ? 5000000
                  : dataAll?.natureName === "Dự toán"
                  ? 10000000
                  : dataAll?.natureName === "Các loại hồ sơ khác"
                  ? 2000000
                  : null;

              return {
                ...item,
                price: price,
                status: 0,
                reducedFee: 0,
                totalPrice: price,
              };
            } else if (item.content === "Công tác phí" && i === index) {
              const price = 2000000;
              return {
                ...item,
                price: price,
                status: 0,
                reducedFee: 0,
                totalPrice: price,
              };
            } else if (item.content === "Phí đợt 2" && i === index) {
              const price = 0;
              return {
                ...item,
                price: price,
                status: 0,
                reducedFee: 0,
                totalPrice: price,
              };
            } else {
              return {
                ...item,
                status: 0,
              };
            }
          }),
        ],
      });
      setDataSource(
        tmpDataSource.map((item, i) => {
          if (item.content === "Phí đợt 1" && i === index) {
            const price =
              dataAll?.natureName === "Dự án"
                ? 5000000
                : dataAll?.natureName === "Dự toán"
                ? 10000000
                : dataAll?.natureName === "Các loại hồ sơ khác"
                ? 2000000
                : null;

            return {
              ...item,
              price: price,
              status: 0,
              reducedFee: 0,
              totalPrice: price,
            };
          } else if (item.content === "Công tác phí" && i === index) {
            const price = 2000000;
            return {
              ...item,
              price: price,
              status: 0,
              reducedFee: 0,
              totalPrice: price,
            };
          } else if (item.content === "Phí đợt 2" && i === index) {
            const price = 0;
            return {
              ...item,
              price: price,
              status: 0,
              reducedFee: 0,
              totalPrice: price,
            };
          } else {
            return item;
          }
        })
      );
      return;
    }

    setDataSource(tmpDataSource);
  };

  const handleRowChangePrice = (value: any, index: number) => {
    const tmpDataSource = [...dataSource];
    tmpDataSource[index] = { ...tmpDataSource[index], ...value };

    const totalPrice = handleUpdateTotalPrice(tmpDataSource[index]);
    const reduceFeePercent = handleUpdatePercent(tmpDataSource[index]);

    tmpDataSource[index].totalPrice = totalPrice;
    tmpDataSource[index].reduceFeePercent = reduceFeePercent;
    tmpDataSource[index].soTienCanXuatHoaDon =
      (totalPrice || 0) - (tmpDataSource[index]?.received || 0);
    // tmpDataSource[index].congNo = handleCalculateCongNo(tmpDataSource[index]);
    tmpDataSource[index].reductFeeDate = value.reducedFee
      ? dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")
      : null;

    form.setFieldsValue({
      data: tmpDataSource,
    });
    setDataSource(tmpDataSource);
  };

  const handleRowChangeNote = (value: any, index: number) => {
    const tmpDataSource = [...dataSource];
    tmpDataSource[index] = { ...tmpDataSource[index], ...value };

    form.setFieldsValue({
      data: [
        ...tmpDataSource?.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              note: item.note,
            };
          }
          return item;
        }),
      ],
    });
    setDataSource(
      tmpDataSource?.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            note: item.note,
          };
        }
        return item;
      })
    );
  };

  const handleRowChangeSoTienCanXuatHd = (value: any, index: number) => {
    const tmpDataSource = [...dataSource];
    tmpDataSource[index] = { ...tmpDataSource[index], ...value };

    form.setFieldsValue({
      data: [
        ...tmpDataSource?.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              soTienCanXuatHoaDon: item.soTienCanXuatHoaDon,
            };
          }
          return item;
        }),
      ],
    });
    setDataSource(
      tmpDataSource?.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            soTienCanXuatHoaDon: item.soTienCanXuatHoaDon,
          };
        }
        return item;
      })
    );
  };

  const handleRowChangeStatus = (value: any, index: number) => {
    const tmpDataSource = [...dataSource];
    tmpDataSource[index] = { ...tmpDataSource[index], ...value };

    form.setFieldsValue({
      data: [
        ...tmpDataSource?.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              status: item.status,
            };
          }
          return item;
        }),
      ],
    });
    setDataSource(
      tmpDataSource?.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            status: item.status,
          };
        }
        return item;
      })
    );
  };

  const handleUpdateTotalPrice = (rowValue: FeeContentType) => {
    if (rowValue === null || rowValue.price === null) {
      return null;
    }
    const price = Number(rowValue.price);
    const reducedFee =
      rowValue.reducedFee !== undefined ? Number(rowValue.reducedFee) : 0;
    const totalPrice = (price + reducedFee).toFixed(2);
    return Number(totalPrice);
  };

  const handleUpdatePercent = (rowValue: FeeContentType) => {
    if (rowValue === null || rowValue.price === null) {
      return null;
    }
    const price = Number(rowValue.price);
    const reducedFee =
      rowValue.reducedFee !== undefined ? Number(rowValue.reducedFee) : 0;
    const reduceFeePercent = price ? Math.abs((reducedFee / price) * 100) : 0;
    return Number(reduceFeePercent?.toFixed(1));
  };

  const handleRowChangeDateConfirm = (value: any, index: number) => {
    const tmpDataSource = [...dataSource];
    tmpDataSource[index] = { ...tmpDataSource[index], ...value };

    form.setFieldsValue({
      data: [
        ...tmpDataSource?.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              dateConfirm: item.dateConfirm,
              reductFeeDate: item.reductFeeDate,
            };
          }
          return item;
        }),
      ],
    });
    setDataSource(
      tmpDataSource?.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            dateConfirm: item.dateConfirm,
            reductFeeDate: item.reductFeeDate,
          };
        }
        return item;
      })
    );
  };

  const handleRowChangeGhiNhanNoiBo = (value: any, index: number) => {
    const tmpDataSource = [...dataSource];
    tmpDataSource[index] = { ...tmpDataSource[index], ...value };
    const totalPrice = handleUpdateTotalPrice(tmpDataSource[index]) || 0;
    tmpDataSource[index].totalPrice = totalPrice;
    tmpDataSource[index].soTienCanXuatHoaDon = totalPrice - value.received;
    tmpDataSource[index].isFullyReceived = value.isFullyReceived;
    // tmpDataSource[index].congNo = handleCalculateCongNo(tmpDataSource[index]);

    form.setFieldsValue({
      data: [...tmpDataSource],
    });
    setDataSource(tmpDataSource?.map((item, i) => item));
  };

  const handleChangeListDocument = (dataUpdate: DataPropsListDocumentType) => {
    const tmpDataSource = [...dataSource];
    const foundIndex = tmpDataSource.findIndex(
      (item) => item.feeContentId === dataUpdate.feeContentId
    );
    if (foundIndex === -1) return;
    tmpDataSource[foundIndex].listDocuments = [...dataUpdate.listDocuments];
  };

  const showConfirm = (status: string) => {
    Modal.confirm({
      title: "Xác nhận",
      content:
        status === "thuHoi"
          ? `Bạn có chắc muốn thu hồi xuất hóa đơn mã ${selectedRows
              .map((item) => {
                return item.code;
              })
              .join(", ")}?`
          : status === "xuat"
          ? `Bạn có chắc muốn xuất hóa đơn mã ${selectedRows
              .map((item) => {
                return item.code;
              })
              .join(", ")}?`
          : `Bạn có chắc muốn thu tiền mã ${selectedRows
              .map((item) => {
                return item.code;
              })
              .join(", ")}?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        status === "thuHoi"
          ? thuHoiXuatHD()
          : status === "xuat"
          ? handleSetProfileExpense()
          : handleSendPaymentRequest();
      },
    });
  };

  const handleDownload = async (
    ecmId: string,
    filename: string,
    key?: string
  ) => {
    if (ecmId && filename) {
      try {
        handlechange({ downloading: true }, key || "");

        const res = await ecmFileApi.downloadECMFileFromNotification({
          ecmId,
          filename,
          mediaType: "application/pdf",
        });

        saveAs(res.data, filename);

        handlechange({ downloading: false }, key || "");
      } catch {
        message.error("Tải file thất bại");
        handlechange({ downloading: false }, key || "");
      }
    } else message.error("Tải file thất bại");
  };

  const handleDisplay = async (ecmId: string, filename: string) => {
    if (ecmId && filename) {
      try {
        const res = await ecmFileApi.downloadECMFileFromNotification({
          ecmId,
          filename,
          mediaType: "application/pdf",
        });

        const pdfUrl = URL.createObjectURL(res.data);
        setPdfUrl(pdfUrl);
      } catch {
        message.error("Xem file thất bại!");
      }
    } else message.error("Xem file thất bại!");
  };

  const handlechange = (data: any, key: string) => {
    const foundIndex = formDataFile.values?.legalDocuments.findIndex(
      (item: any) => item.key === key
    );
    if (foundIndex === -1) return;

    const newData = [...formDataFile.values.legalDocuments];
    newData.splice(foundIndex, 1, {
      ...formDataFile.values.legalDocuments[foundIndex],
      ...data,
    });
    formDataFile.setValues({ legalDocuments: newData });
  };

  const isDisableRow = (data: any) => {
    if (data?.status === 2) return true;

    if (data?.isFirstEdited) {
      if (data.isLocked) return true;
    }

    return false;
  };

  const handleCalculateCongNo = (record: any) => {
    if (!record) {
      return null;
    }
    const price = Number(record.price || 0);
    const reducedFee = Number(record.reducedFee || 0);
    const received = Number(record.received || 0);
    const daThu = Number(record.daThu || 0);

    const congNo = price + reducedFee - received - daThu;
    return congNo;
  };

  const columns: ColumnsType<AssetLandInfoType> = [
    {
      key: 1,
      title: "STT",
      align: "center",
      fixed: "left",
      width: "5%",
      render: (value: any, _, index: number) => index + 1,
    },
    {
      key: 2,
      title: "Nội dung",
      dataIndex: "content",
      fixed: "left",
      width: "150px",
      render: (value: any, record: any, index: number) => {
        return (
          <Form.Item
            name={["data", index, "content"]}
            rules={[
              {
                required: true,
                message: "Nhập thông tin",
              },
            ]}
            style={{ marginBottom: "0" }}
          >
            <FormItem
              name={["data", index, "content"]}
              type={SELECT}
              value={value}
              allowClear={false}
              disable={dataSource[index].code ? true : false}
              options={contentsData.map((item: any, index: number) => {
                const isContentId2 = item.contentId >= 2;
                let isDisabled =
                  isContentId2 &&
                  dataAll.feeContents &&
                  dataAll.feeContents.some(
                    (feeItem: any) =>
                      feeItem.contentId === 2 &&
                      feeItem.status === 2 &&
                      feeItem.feeContentId !== index
                  );

                if (dataAll.feeContents && dataAll.feeContents.length === 0) {
                  isDisabled = false;
                }

                return {
                  value: item.contentId,
                  label: item.content,
                  disabled: isContentId2 ? !isDisabled : false,
                };
              })}
              onChange={(value: any, option: any) => {
                handleRowChange({ content: option.label }, index);
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      key: 3,
      title: "Mã",
      dataIndex: "code",
      fixed: "left",
      width: "150px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            name={["data", index, "code"]}
            type={INPUT}
            value={value}
            disable={true}
            tooltipInput={value}
          />
        );
      },
    },
    {
      key: 4,
      title: "Ngày TB",
      dataIndex: "dateNotification",
      width: "190px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            style={{ color: "#000!important" }}
            disable={true}
            type={DATE_PICKER}
            value={value ? dayjs(value) : null}
            formatDatetime={`${DATE_TIME_FORMAT.day} - HH:mm:ss`}
            placeholder="DD/MM/YYYY"
            onChange={(value: any) => {
              handleRowChange(
                {
                  dateNotification: value ? dayjs(value).toISOString() : null,
                },
                index
              );
            }}
          />
        );
      },
    },
    {
      key: 5,
      title: "Ngày Upload đã XN",
      dataIndex: "dateUpload",
      width: "190px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            style={{ color: "#000!important" }}
            disable={true}
            type={DATE_PICKER}
            value={value ? dayjs(value) : null}
            formatDatetime={`${DATE_TIME_FORMAT.day} - HH:mm:ss`}
            placeholder="DD/MM/YYYY"
            onChange={(value: any) => {
              handleRowChange(
                {
                  dateUpload: value ? dayjs(value).toISOString() : null,
                },
                index
              );
            }}
          />
        );
      },
    },
    {
      key: 6,
      title: "Số tiền",
      dataIndex: "price",
      width: "150px",
      render: (value: any, record: any, index: number) => {
        const checkDisabled = () => {
          if (isDisableRow(record)) return true;
          else if (record.status === 0 && record.contentId === 1) return false;
          else return true;
        };
        return (
          <Form.Item
            name={["data", index, "price"]}
            rules={[
              {
                required: true,
                message: "Nhập thông tin",
              },
              {
                validator: async (_, value) => {
                  if (Number(value) < 0) {
                    return Promise.reject(new Error("Số tiền không được âm"));
                  }
                  if (isNaN(value)) {
                    return Promise.reject(new Error("Vui lòng chỉ nhập số"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ marginBottom: "0" }}
          >
            <FormItem
              disable={checkDisabled()}
              type={INPUT_NUMBER}
              currencable
              isRounded
              value={value}
              onChange={(value: number) => {
                handleRowChangePrice({ price: value }, index);
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      key: 7,
      title: "Tỉ lệ điều chỉnh/giảm phí (%)",
      dataIndex: "reduceFeePercent",
      width: "200px",
      render: (_: any, record: any, index: number) => {
        return (
          <FormItem
            name={["data", index, "reduceFeePercent"]}
            type={INPUT_NUMBER}
            // percentable
            isRounded
            value={handleUpdatePercent(record)}
            disable
          />
        );
      },
    },
    {
      key: 8,
      title: "Điều chỉnh/giảm phí",
      dataIndex: "reducedFee",
      width: "200px",
      render: (value: any, record: any, index: number) => {
        return (
          <Form.Item
            name={["data", index, "reducedFee"]}
            rules={[
              {
                required: true,
                message: "Nhập thông tin",
              },
              {
                validator: async (_, value) => {
                  if (isNaN(value)) {
                    return Promise.reject(new Error("Vui lòng chỉ nhập số"));
                  }
                  if (record.received + record.daThu - value > record.price) {
                    return Promise.reject(
                      new Error("Số tiền giảm phí quá lớn!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ marginBottom: "0" }}
          >
            <FormItem
              disable={isDisableRow(record) || checkDisableConfirm}
              type={INPUT_NUMBER}
              value={value}
              onChange={(value: number) => {
                handleRowChangePrice(
                  {
                    reducedFee: value,
                  },
                  index
                );
              }}
              currencable={true}
              allowClear
            />
          </Form.Item>
        );
      },
    },
    {
      key: 9,
      title: "Ngày điều chỉnh/giảm phí",
      dataIndex: "reductFeeDate",
      width: "190px",
      render: (value: any, record: any, index: number) => {
        return (
          <FormItem
            disable={isDisableRow(record) || checkDisableConfirm}
            type={DATE_PICKER}
            value={
              dataSource[index].reductFeeDate
                ? dayjs(dataSource[index].reductFeeDate)
                : null
            }
            showTime={true}
            formatDatetime={DATE_TIME_FORMAT.momentTime}
            placeholder="DD/MM/YYYY - hh:mm:ss"
            onChange={(value: any) => {
              handleRowChangeDateConfirm(
                {
                  reductFeeDate: value
                    ? dayjs(value).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                    : null,
                },
                index
              );
            }}
            allowClear={false}
          />
        );
      },
    },
    {
      key: 10,
      title: "Thành tiền sau điều chỉnh/giảm phí",
      dataIndex: "totalPrice",
      width: "200px",
      render: (_: any, record: any, index: number) => {
        return (
          <FormItem
            name={["data", index, "totalPrice"]}
            type={INPUT_NUMBER}
            currencable
            isRounded
            value={handleUpdateTotalPrice(record)}
            disable
          />
        );
      },
    },

    {
      key: 11,
      title: "Ngày xác nhận",
      dataIndex: "dateConfirm",
      width: "190px",
      render: (value: any, record: any, index: number) => {
        return (
          <FormItem
            // disable={isContainRole(ROLES.CBTH) || sendMail ? false : true}
            type={DATE_PICKER}
            value={value ? dayjs(value) : null}
            formatDatetime={`${DATE_TIME_FORMAT.day} - HH:mm:ss`}
            placeholder="DD/MM/YYYY"
            onChange={(value: any) => {
              handleRowChangeDateConfirm(
                {
                  dateConfirm: value ? dayjs(value).toISOString() : null,
                },
                index
              );
            }}
          />
        );
      },
    },
    {
      key: 12,
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: "150px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            type={SELECT}
            allowClear={false}
            value={value}
            options={[
              {
                value: 0,
                label: "Chờ báo phí",
                disabled:
                  data[index]?.status === 1 || data[index]?.status === 3
                    ? true
                    : false,
              },
              {
                value: 1,
                label: "Đã báo phí",
                disabled: data[index]?.status === 3 ? true : false,
              },
              // {
              //   value: 2,
              //   label: "Từ chối",
              //   disabled:
              //     data[index]?.status === 1 || data[index]?.status === 3
              //       ? true
              //       : false,
              // },
              // { value: 2, label: "Từ chối" },
              {
                value: 2,
                label: "Từ chối",
                disabled: data[index]?.status === 3 ? true : false,
              },
              { value: 3, label: "Chưa thu tiền" },
              { value: 4, label: "Đã thu tiền" },
              { value: 5, label: "Đã xuất hoá đơn" },
              { value: 6, label: "Điều chuyển phí" },
            ]}
            disable={true}
            onChange={(selectedValue: any) => {
              // if (data[index]?.status === 1) {
              //   if (![1, 3, 4].includes(selectedValue)) {
              //     message.info(
              //       'Chỉ cho phép chỉnh sửa trạng thái từ "Đã báo phí" sang "Chưa thu tiền" hoặc "Đã thu tiền"!'
              //     );
              //     return;
              //   }
              // }
              // if (data[index]?.status === 3) {
              //   if (![3, 4].includes(selectedValue)) {
              //     message.info(
              //       'Chỉ cho phép chỉnh sửa trạng thái từ "Chưa thu tiền" sang "Đã thu tiền"!'
              //     );
              //     return;
              //   }
              // }
              handleRowChangeStatus({ status: selectedValue }, index);
            }}
          />
        );
      },
    },
    {
      key: 13,
      title: "Ý kiến phản hồi từ LOS",
      dataIndex: "noteByLos",
      width: "150px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            disable={true}
            type={INPUT}
            value={value}
            tooltipInput={value}
          />
        );
      },
    },
    {
      key: 14,
      title: "Công nợ",
      dataIndex: "congNo",
      width: "150px",
      render: (value: any, record: any, index: number) => {
        return (
          <FormItem
            disable={true}
            type={INPUT_NUMBER}
            currencable
            isRounded
            // value={record.received > 0 || record.statusEms === 3 ? value : 0}
            value={handleCalculateCongNo(record)}
          />
        );
      },
    },
    {
      key: 15,
      title: "Đã thu",
      dataIndex: "daThu",
      width: "150px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            disable={true}
            type={INPUT_NUMBER}
            currencable
            isRounded
            value={value}
          />
        );
      },
    },
    {
      key: 16,
      title: "Doanh thu",
      dataIndex: "soTienXuatHoaDonThucTe",
      width: "150px",
      render: (value: any, record: any, index: number) => {
        return (
          <FormItem
            disable={true}
            type={INPUT_NUMBER}
            currencable
            // value={record.received > 0 || record.statusEms === 3 ? value : 0}
            value={value}
          />
        );
      },
    },
    {
      key: 17,
      title: "Ngày xuất HĐ",
      dataIndex: "ngayXuatHd",
      width: "190px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            disable={true}
            type={DATE_PICKER}
            value={value ? dayjs(value) : null}
            formatDatetime={DATE_TIME_FORMAT.day}
            placeholder="DD/MM/YYYY"
          />
        );
      },
    },
    // {
    //   key: 22,
    //   title: "Ngày đề nghị xuất HĐ",
    //   dataIndex: "ngayDeNghiXuatHd",
    //   width: "190px",
    //   render: (value: any, _, index: number) => {
    //     return (
    //       <FormItem
    //         disable={true}
    //         type={DATE_PICKER}
    //         value={value ? dayjs(value) : null}
    //         formatDatetime={`${DATE_TIME_FORMAT.day} - HH:mm:ss`}
    //         placeholder="DD/MM/YYYY"
    //       />
    //     );
    //   },
    // },
    {
      key: 18,
      title: "Số tiền đề nghị xuất HĐ",
      dataIndex: "soTienCanXuatHoaDon",
      width: "150px",
      render: (value: any, record: any, index: number) => (
        <Form.Item
          name={["data", index, "soTienCanXuatHoaDon"]}
          rules={[
            {
              required: false,
              message: "Nhập thông tin",
            },
            {
              validator: async (_, value) => {
                if (Number(value) < 0) {
                  return Promise.reject(new Error("Số tiền không được âm"));
                }
                if (isNaN(value)) {
                  return Promise.reject(new Error("Vui lòng chỉ nhập số"));
                }
                return Promise.resolve();
              },
            },
          ]}
          style={{ marginBottom: "0" }}
        >
          <FormItem
            disable={record.statusEms === 3 || isDisableRow(record)}
            type={INPUT_NUMBER}
            currencable
            isRounded
            value={value}
            onChange={(value: any) => {
              handleRowChangeSoTienCanXuatHd(
                { soTienCanXuatHoaDon: value },
                index
              );
            }}
          />
        </Form.Item>
      ),
    },
    {
      key: 19,
      title: "Số tiền xuất HĐ thực tế",
      dataIndex: "soTienXuatHoaDonThucTe",
      width: "150px",
      render: (value: any, _, index: number) => (
        <Form.Item
          name={["data", index, "soTienXuatHoaDonThucTe"]}
          // rules={[
          //   {
          //     required: true,
          //     message: "Nhập thông tin",
          //   },
          //   {
          //     validator: async (_, value) => {
          //       if (Number(value) < 0) {
          //         return Promise.reject(new Error("Số tiền không được âm"));
          //       }
          //       if (isNaN(value)) {
          //         return Promise.reject(new Error("Vui lòng chỉ nhập số"));
          //       }
          //       return Promise.resolve();
          //     },
          //   },
          // ]}
          style={{ marginBottom: "0" }}
        >
          <FormItem
            disable={true}
            type={INPUT_NUMBER}
            currencable
            isRounded
            value={value}
          />
        </Form.Item>
      ),
    },
    {
      key: 20,
      title: "Ngày thu tiền",
      dataIndex: "ngayThuTien",
      width: "190px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            disable={true}
            type={DATE_PICKER}
            value={value ? dayjs(value) : null}
            formatDatetime={DATE_TIME_FORMAT.day}
            placeholder="DD/MM/YYYY"
          />
        );
      },
    },
    {
      key: 21,
      title: "Ghi nhận nội bộ",
      dataIndex: "received",
      width: "150px",
      align: "right",
      render: (value: any, record: any, index: number) => {
        const isDisabled = isDisableRow(record) || checkDisableConfirm;
        return (
          <span
            onClick={
              isDisabled
                ? () => {}
                : () => {
                    openModalEdit();
                    setInternalRecording((prevState: any) => ({
                      ...prevState,
                      edit: {
                        soTien: dataSource[index].received || 0,
                        isFullyReceived: dataSource[index].isFullyReceived || 2,
                        feeNotificationId: dataSource[index].feeNotificationId,
                        appraisalFileId: dataAll.appraisalFileId,
                        feeContentId: dataSource[index].feeContentId,
                        totalPrice: dataSource[index].totalPrice || 0,
                        congNo: dataSource[index].congNo,
                        ngayGhiNhanNb: dataSource[index].receiveDate || null,
                        price: dataSource[index].price || 0,
                        reducedFee: dataSource[index].reducedFee || 0,
                        daThu: dataSource[index].daThu || 0,
                      },
                      title: "Ghi nhận nội bộ",
                      index: index,
                    }));
                  }
            }
            style={{
              textDecoration: isDisabled ? "none" : "underline",
              color: isDisabled ? "black" : "#1677ff",
              cursor: isDisabled ? "default" : "pointer",
            }}
          >
            {value ? value.toLocaleString("vi-VN") : 0}
          </span>
        );
      },
    },
    {
      key: 22,
      title: "Ngày ghi nhận nội bộ",
      dataIndex: "receiveDate",
      width: "190px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            disable={true}
            type={DATE_PICKER}
            value={value ? dayjs(value) : null}
            formatDatetime={`${DATE_TIME_FORMAT.day} - HH:mm:ss`}
            placeholder="DD/MM/YYYY"
          />
        );
      },
    },

    {
      key: 25,
      title: "Tài liệu đính kèm",
      dataIndex: "fileName",
      width: "155px",
      render: (_: any, record: any, index: number) => {
        return (
          <Button
            icon={<Icons.upload />}
            onClick={() => {
              setDataListDocument({
                feeContentId: record.feeContentId,
                listDocuments: record.listDocuments || [],
                disabled: isDisableRow(record) || checkDisableConfirm,
              });
              setIsOpenModal({
                ...isOpenModal,
                isOpenModalListDocument: true,
              });
            }}
          >
            Tải lên
          </Button>
        );
      },
    },
    {
      key: 26,
      title: "Ghi chú",
      dataIndex: "note",
      width: "150px",
      render: (value: any, record: any, index: number) => {
        return (
          <FormItem
            disable={isDisableRow(record) || checkDisableConfirm}
            type={
              isDisableRow(record) || checkDisableConfirm ? INPUT : POPUP_INPUT
            }
            value={value}
            onChange={(e: any) =>
              handleRowChangeNote({ note: e.target.value }, index)
            }
            tooltipInput={value}
          />
        );
      },
    },
    {
      key: 27,
      title: "Người tạo",
      dataIndex: "whoCreate",
      align: "center",
      width: "180px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            tooltipInput={value}
            disable={true}
            type={INPUT}
            value={value}
          />
        );
      },
    },
  ];

  const handleUploadFileEcm = async () => {
    const fileUploadedInfo = [];

    const handleUpload = async (item: any) => {
      const formDataFile = new FormData();
      formDataFile.append("file", item.fileList[0] as RcFile);

      let res;
      let success = false;
      let retryCount = 0;
      const maxRetries = 3;

      while (!success && retryCount < maxRetries) {
        try {
          res = await ecmFileApi.uploadECMFile(formDataFile, {
            fileType: "legalDocument",
          });

          if (res.data?.statusCodeValue === 200 && res.data?.body?.ecmId) {
            message.success(`Upload file ${item.fileList[0].name} thành công!`);
            success = true;
          } else {
            throw new Error(`Lỗi server: ${JSON.stringify(res.data)}`);
          }
        } catch (error) {
          retryCount++;

          // if (retryCount > 1) {
          // Chỉ hiển thị thông báo lỗi từ lần thứ hai trở đi
          // message.error(`Lỗi khi upload file ${item.fileList[0].name}!`);
          // }

          // Thêm cơ chế giảm tần suất gọi API ở đây nếu cần (delay, backoff, ...)
        }
      }

      if (!success) {
        // message.error(
        //   `Upload file ${item.fileList[0].name} thất bại sau ${maxRetries} lần thử!`
        // );
        message.error(`Upload file ${item.fileList[0].name} thất bại!`);
        return null;
      }

      return { ...res?.data?.body, key: item.key };
    };

    for (let i = 0; i < dataSource.length; i++) {
      const item = dataSource[i];
      if (item.fileList && item.fileList.length > 0) {
        const result = await handleUpload(item);
        fileUploadedInfo.push(result);
      }
    }

    return fileUploadedInfo;
  };
  const handleFeeContentsData = async () => {
    try {
      const validateForm = await form.validateFields();
      const updatedDataSource: FeeContentType[] = [];
      for (let i = 0; i < dataSource.length; i++) {
        const item = dataSource[i];
        const originalItem = data[i];
        let contentId;
        if (item.content === "Phí đợt 1") {
          contentId = 1;
        } else if (item.content === "Phí đợt 2") {
          contentId = 2;
        } else if (item.content === "Công tác phí") {
          contentId = 3;
        }

        let objForPush = {
          ...item,
          contentId: contentId !== undefined ? contentId : 0,
        };

        if (originalItem.received !== item.received) {
          try {
            const dataPut = {
              internalRecordType: item.isFullyReceived || 2,
              feeNotificationId: item.feeNotificationId || "",
              appraisalFileId: dataAll.appraisalFileId,
              feeContentId: Number(item.feeContentId || 0),
              received: Number(item.received || 0),
              receiveDate: item.receiveDate || null,
            };
            const resGNNB = await appraisalFilesApi.updateInternalRecord(
              dataPut
            );
            if (resGNNB.data.code === 200) {
              //ok
            } else {
              objForPush.received = originalItem.received;
              objForPush.receiveDate = originalItem.receiveDate;
              objForPush.isFullyReceived = originalItem.isFullyReceived;
              message.error(
                `${item.content} - ${item.feeContentId} ${
                  resGNNB.data.message || "GNNB thất bại"
                }.`
              );
            }
          } catch (err) {
            objForPush.received = originalItem.received;
            objForPush.receiveDate = originalItem.receiveDate;
            objForPush.isFullyReceived = originalItem.isFullyReceived;
            message.error(
              `${item.content} - ${item.feeContentId} Lỗi GNNB không xác định.`
            );
          }
        }
        updatedDataSource.push(objForPush);
      }

      setDataSource(updatedDataSource);

      return [updatedDataSource, validateForm];
    } catch (error: any) {
      return [{}, false];
    }
  };

  const clearSelectedRows = () => {
    onSelectChange([]);
    setSelectedRows([]);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  var checkValidate = (request: string) => {
    if (selectedRows.length === 0) return true;
    if (request === "thuTien") {
      const invalidRecords = selectedRows.filter(
        (item: any) => item.statusEms !== null && item.statusEms > 2
      );
      if (invalidRecords.length > 0) {
        message.error(
          `Mã hồ sơ ${invalidRecords
            .map((item: any) => item.code)
            .join(", ")} đã được yêu cầu thu tiền trước đó! `
        );
        return true;
      } else {
        return false;
      }
    } else if (request === "xuat") {
      const invalidRecords = selectedRows.filter(
        (item: any) => item.statusEms !== 2
      );

      if (invalidRecords.length > 0) {
        // message.error(
        //   `Mã hồ sơ ${invalidRecords
        //     .map((item: any) => item.code)
        //     .join(", ")} không đủ điều kiện xuất HĐ!`
        // );
        return true;
      } else {
        return false;
      }
    } else if (request === "thuHoi") {
      const invalidRecords = selectedRows.filter(
        (item: any) => item.statusEms !== 3
      );

      if (invalidRecords.length > 0) {
        if (invalidRecords.length > 0) {
          // message.error(
          //   `Mã hồ sơ ${invalidRecords
          //     .map((item: any) => item.code)
          //     .join(", ")} không đủ điều kiện thu hồi xuất HĐ! `
          // );
          return true;
        }
      } else {
        return false;
      }
    }
  };
  useImperativeHandle(ref, () => ({
    feeContentsData: handleFeeContentsData,
    uploadFile: handleUploadFileEcm,
    // uploadFileResult: handleUploadFileEcmResult,
    checkCheckBox: selectedRows,
    clearSelectedRows: clearSelectedRows,
  }));

  const fetchContentsData = async () => {
    try {
      const res = await appraisalFilesApi.getFeeNotificationContent();
      if (res.status === 200) setContentsData(res.data);
    } catch (error: any) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    const updatedData: any = data.map((item) => ({
      ...item,
      reducedFee:
        item.reducedFee === null || item.reducedFee === undefined
          ? 0
          : Number(item.reducedFee.toFixed(2)),
      price:
        item.price === null || item.price === undefined
          ? 0
          : Number(item.price.toFixed(2)),
      totalPrice:
        item.totalPrice === null || item.totalPrice === undefined
          ? 0
          : Number(item.totalPrice.toFixed(2)),
      daThu:
        item.daThu === null || item.daThu === undefined
          ? 0
          : item.daThu && Number(item.daThu.toFixed(2)),
      received:
        item.received === null || item.received === undefined
          ? 0
          : item.received && Number(item.received.toFixed(2)),
      congNo:
        item.congNo === null || item.congNo === undefined
          ? 0
          : item.congNo && Number(item.congNo.toFixed(2)),
      revenue:
        item.revenue === null || item.revenue === undefined
          ? 0
          : item.revenue && Number(item.revenue.toFixed(2)),
      soTienCanXuatHoaDon: item.soTienCanXuatHoaDon
        ? Number((item.soTienCanXuatHoaDon || 0).toFixed(2))
        : (handleUpdateTotalPrice(item) || 0) - (item.received || 0),
      soTienXuatHoaDonThucTe:
        item.soTienXuatHoaDonThucTe === null ||
        item.soTienXuatHoaDonThucTe === undefined
          ? 0
          : item.soTienXuatHoaDonThucTe &&
            Number(item.soTienXuatHoaDonThucTe.toFixed(2)),
    }));
    setDataSource(updatedData);
    fetchContentsData();
    onSelectChange([]);
    form.setFieldsValue({ data: updatedData });
  }, [data]);

  useEffect(() => {
    form.setFieldsValue({ data: { dataSource } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  const [hasCalledSyncEMS, setHasCalledSyncEMS] = useState(false);

  useEffect(() => {
    if (dataAll?.reportCode && !hasCalledSyncEMS) {
      (async () => {
        await syncEMS(dataAll.reportCode);
        setHasCalledSyncEMS(true);
      })();
    }
  }, [dataAll, hasCalledSyncEMS]);

  useEffect(() => {
    if (dataAll) {
      dispatch(setConfirmButtonRedux(dataAll.isLocked));
    }
  }, [dataAll, dispatch]);

  const handleLockEditFee = () => {
    dispatch(setConfirmButtonRedux(true));
  };

  const handleUnlockEditFee = async () => {
    try {
      if (selectedRows.length === 0) {
        message.error("Chưa chọn dòng phí muốn trả xác nhận!");
        return;
      }
      const res = await appraisalFilesApi.lockEditFee({
        feeNotificationId: dataAll.feeNotificationId,
        isLocked: false,
        feeContentIds: selectedRows
          .filter((item) => item.feeContentId)
          .map((el) => ({ id: el.feeContentId || "", isFirst: true })),
      });
      if (res.data?.code === 200) {
        message.success("Trả xác nhận thành công!");
        mutateFeeModalTable();
        dispatch(setConfirmButtonRedux(false));
        clearSelectedRows();
      } else {
        message.error(res.data?.message);
      }
    } catch (e) {
      console.log(e);
      message.error("Trả xác nhận không thành công!");
    }
  };

  const checkDisableConfirm = dataAll.isLocked
    ? true
    : isSetConfirmButton
    ? false
    : true;

  return (
    // Đã thu tiền (statusEms = 2)
    // Đã đề nghị xuất hóa đơn trên CMV (statusEms = 3)
    // Đã thu hồi xuất hóa đơn trên CMV (statusEms = 4)
    // Đã xuất hóa đơn trên EMS (statusEms = 5)
    <>
      {!pdfUrl && (
        <Card
          className="card-container-debt-fee-table"
          size="small"
          style={{ padding: "4px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
              gap: "1rem",
              alignItems: "start",
            }}
          >
            <div style={{ minWidth: 200 }}>
              <CardTitleCustomUpdate title="Danh sách theo dõi doanh thu, công nợ" />
            </div>
            <Space wrap style={{ justifyContent: "end" }}>
              <ButtonCustom
                label={"Trả xác nhận"}
                icon={<Icons.stopOutlined />}
                onClick={handleUnlockEditFee}
                style={{
                  color: "rgb(242, 91, 96)",
                  border: "1px solid rgb(242, 91, 96)",
                  background: "transparent",
                }}
                type="primary"
                ghost
                // disabled={
                //   dataAll.isLocked
                //     ? false
                //     : !isSetConfirmButton
                //     ? true
                //     : false
                // }
                code={BUTTON_CODES.ctdtcn_tra_xac_nhan}
              />
              <ButtonCustom
                label={"Xác nhận"}
                icon={<Icons.check />}
                onClick={handleLockEditFee}
                style={{
                  color: "rgb(40, 98, 175)",
                  border: "1px solid rgb(40, 98, 175)",
                  background: "transparent",
                }}
                type="primary"
                ghost
                disabled={
                  dataAll.isLocked ? true : isSetConfirmButton ? true : false
                }
                code={BUTTON_CODES.ctdtcn_xac_nhan}
              />
              <ButtonCustom
                label={"Đồng bộ từ EMS"}
                // icon={
                //   exporting ? (
                //     <div className="spin-overlay">
                //       <Spin className="spin" />
                //     </div>
                //   ) : (
                //     <Icons.reload />
                //   )
                // }
                icon={<Icons.reload />}
                loading={exporting}
                onClick={async () => {
                  await syncEMS(dataAll.reportCode);
                }}
                style={{
                  background: "transparent",
                  // color: "#fff",
                }}
                // className={`button-Report ${exporting ? "exporting" : ""}`}
                type="primary"
                ghost
                disabled={exporting}
                code={BUTTON_CODES.ctdtcn_dong_bo_tu_ems}
              />
              <ButtonCustom
                label="Upload TB đã XN"
                danger
                style={{
                  border: "1px solid #21A366",
                  color: "#21A366",
                }}
                icon={<Icons.upload />}
                onClick={() => {
                  openModalUploadFile();
                }}
                code={BUTTON_CODES.ctdtcn_xem_tb_da_xn}
              />
              <>
                <ButtonCustom
                  label="Yêu cầu thu tiền"
                  icon={<Icons.money />}
                  loading={loadingBtn.paymentRequest}
                  onClick={() => {
                    if (selectedRows && selectedRows.length > 0) {
                      if (checkValidate("thuTien")) {
                        return;
                      } else {
                        showConfirm("thuTien");
                      }
                    } else {
                      message.error("Vui lòng chọn hóa đơn cần thu tiền!");
                    }
                  }}
                  disabled={(() => {
                    if (
                      dataSource.every(
                        (item) =>
                          item.statusEms === 2 ||
                          (item.statusEms !== null && item.statusEms >= 2)
                      )
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  })()}
                  style={{
                    background: "transparent",
                    borderColor: "#17A2B8",
                    color: "#17A2B8",
                  }}
                  code={BUTTON_CODES.ctdtcn_yeu_cau_thu_tien}
                />
                <ButtonCustom
                  label="Đề nghị xuất HĐ"
                  style={{
                    background: "transparent",
                    borderColor: "#ECA52B",
                    color: "#ECA52B",
                  }}
                  icon={<Icons.printer />}
                  loading={loadingBtn.profileExpense}
                  // disabled={(() => {
                  //   if (
                  //     dataSource.every(
                  //       (item) =>
                  //         item.statusEms === 3 ||
                  //         item.statusEms === 5 ||
                  //         (item.statusEms !== null &&
                  //           item.statusEms >= 3 &&
                  //           item.statusEms !== 4) ||
                  //         item.statusEms === null ||
                  //         item?.statusEms < 2
                  //     ) ||
                  //     dataAppraisalFileDetail?.fileStatus < 12
                  //   ) {
                  //     return true;
                  //   } else {
                  //     return false;
                  //   }
                  // })()}
                  disabled={checkValidate("xuat")}
                  onClick={() => {
                    if (selectedRows && selectedRows.length > 0) {
                      if (checkValidate("xuat")) {
                        return;
                      } else {
                        showConfirm("xuat");
                      }
                    } else {
                      message.error("Vui lòng chọn hóa đơn để xuất!");
                    }
                  }}
                  code={BUTTON_CODES.ctdtcn_de_nghi_xuat_hd}
                />
                <ButtonCustom
                  label="Thu hồi xuất hoá đơn"
                  style={{
                    background: "transparent",
                    borderColor: "rgb(233 19 19)",
                    color: "rgb(233 19 19)",
                  }}
                  icon={<Icons.sync />}
                  loading={loadingBtn.thuHoiXuatHD}
                  // disabled={(() => {
                  //   if (
                  //     dataSource.every(
                  //       (item) =>
                  //         item.statusEms === 4 ||
                  //         item.statusEms === 5 ||
                  //         (item.statusEms !== null && item.statusEms >= 4) ||
                  //         item.statusEms === null ||
                  //         item?.statusEms <= 2
                  //     )
                  //   ) {
                  //     return true;
                  //   } else {
                  //     return false;
                  //   }
                  // })()}
                  disabled={checkValidate("thuHoi")}
                  code={BUTTON_CODES.ctdtcn_thu_hoi_xuat_hd}
                  onClick={() => {
                    if (selectedRows && selectedRows.length > 0) {
                      if (checkValidate("thuHoi")) {
                        return;
                      } else {
                        showConfirm("thuHoi");
                      }
                    } else {
                      message.error("Vui lòng chọn hóa đơn thu hồi!");
                    }
                  }}
                />
                <ButtonCustom
                  label={"Thông báo"}
                  onClick={() =>
                    setDataTBKQ({
                      ...dataModalTBKQ,
                      isOpenModal: true,
                      type: FEE_LIST_DOCUMENT.FILE_THONG_BAO,
                    })
                  }
                  style={{
                    color: "rgb(40, 98, 175)",
                    border: "1px solid rgb(40, 98, 175)",
                    background: "transparent",
                  }}
                  type="primary"
                  ghost
                />
                <ButtonCustom
                  label={"Kết quả"}
                  onClick={() =>
                    setDataTBKQ({
                      ...dataModalTBKQ,
                      isOpenModal: true,
                      type: FEE_LIST_DOCUMENT.FILE_KET_QUA,
                    })
                  }
                  style={{
                    color: "rgb(40, 98, 175)",
                    border: "1px solid rgb(40, 98, 175)",
                    background: "transparent",
                  }}
                  type="primary"
                  ghost
                />
              </>
            </Space>
          </div>

          <Form
            labelWrap
            labelAlign="left"
            size="small"
            form={form}
            component={false}
            initialValues={{
              data: dataSource,
            }}
          >
            <DynamicTable
              hiddenRow={false}
              columns={columns}
              dataSource={dataSource || []}
              // onAddRow={() => {
              //   handleAddFeeContent();
              // }}
              // onRemoveRow={(data, index: number) => {
              //   data.status !== 1 && handleDeleteFeeContent(data.key);
              // }}
              rowSelection={{
                type: "checkbox",
                selectedRowKeys,
                onChange: onSelectChange,
                getCheckboxProps: (record: any) => {
                  let disabled = false;
                  if (!record.code) {
                    // Chưa tạo hoặc không có mã thì không cho check box
                    disabled = true;
                  } else if (record.status === 2) {
                    // Nếu trạng thái là 2 hoặc 0 thì không cho check box
                    disabled = true;
                  }
                  return {
                    onMouseEnter: () => {
                      if (record.status === 2) {
                        message.info(
                          "Phí đã từ chối nên không thể yêu cầu thu tiền và xuất hoá đơn"
                        );
                      } else if (record.status === 0) {
                        message.info(
                          "Chưa báo phí nên không thể yêu cầu thu tiền và xuất hoá đơn"
                        );
                      } else if (record.statusEms === 2) {
                        message.info("Hồ sơ đã có yêu cầu thu tiền!");
                      } else if (record.statusEms < 2) {
                        message.info("Hồ sơ chưa có yêu cầu thu tiền!");
                      } else if (record.statusEms === 3) {
                        message.info("Hồ sơ đã được đề nghị xuất hóa đơn!");
                      } else if (record.statusEms === 4) {
                        message.info(
                          "Hồ sơ đã được thu hồi đề nghị xuất hóa đơn!"
                        );
                      } else if (record.statusEms === 5) {
                        message.info("Hồ sơ đã xuất hóa đơn!");
                      }
                    },
                    onMouseLeave: () => {
                      message.destroy();
                    },
                    disabled,
                  };
                },
                onSelect: (
                  record,
                  selected,
                  selectedRows: any,
                  nativeEvent
                ) => {
                  setSelectedRows(selectedRows);
                },
                onSelectAll: (selected, selectedRows, changeRows) => {
                  setSelectedRows(selectedRows);
                },
              }}
              scroll={{ x: 1980 }}
            />
          </Form>
          <ModalEdit
            internalRecording={internalRecording}
            isOpen={isOpenModal.isOpenModalEdit}
            closeModal={closeModalEdit}
            mutateFeeModalTable={mutateFeeModalTable}
            updateData={(value: any, index: any) =>
              handleRowChangeGhiNhanNoiBo(value, index)
            }
          />
          <ModalUploadFile
            isOpen={isOpenModal.isOpenModalUploadFile}
            closeModal={closeModalUploadFile}
            dataFile={dataEditFile}
            dataAll={dataAll}
            mutateFeeModalTable={mutateFeeModalTable}
          />
          <ModalListDocument
            dataListDocument={dataListDocument}
            isOpen={isOpenModal.isOpenModalListDocument}
            closeModal={() =>
              setIsOpenModal({ ...isOpenModal, isOpenModalListDocument: false })
            }
            updateData={(dataUpdate: any) =>
              handleChangeListDocument(dataUpdate)
            }
            isDetail={true}
          />
          <ModalTBKQ
            isOpen={dataModalTBKQ.isOpenModal}
            type={dataModalTBKQ.type}
            appraisalFileData={{
              appraisalFileId: appraisalFileId,
              appraisalFileStatus: dataAppraisalFileDetail?.fileStatus,
              sendToEmail: dataAppraisalFileDetail?.sendToEmail,
            }}
            closeModal={() =>
              setDataTBKQ({ ...dataModalTBKQ, isOpenModal: false })
            }
          />
        </Card>
      )}
      {pdfUrl && (
        <Modal
          className="custom-modal"
          open={isOpenModal.isOpenModalUploadFileTotal}
          onCancel={() => {
            setPdfUrl("");
            closeModalUploadFileTotal();
          }}
          footer={false}
          title={
            <Typography.Text className="modal-title">
              Xem chi tiết tài liệu
            </Typography.Text>
          }
        >
          <iframe src={pdfUrl} className="custom-iframe"></iframe>
        </Modal>
      )}
    </>
  );
});
export default FeeModalTable;
