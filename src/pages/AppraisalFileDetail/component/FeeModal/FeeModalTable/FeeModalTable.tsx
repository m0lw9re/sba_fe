import {
  Button,
  Card,
  Form,
  message,
  Modal,
  Typography
} from "antd";
import { ColumnsType } from "antd/es/table";
import Upload, { RcFile } from "antd/es/upload";
import { appraisalFilesApi } from "apis/appraisalFiles";
import { ecmFileApi } from "apis/ecmFile";
import Icons from "assets/icons";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { DynamicTable } from "components/DynamicTable";
import FormItem from "components/InputFields/FormItem";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { ROLES } from "constant/common";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { AppraisalFileLegalDocumentType } from "constant/types";
import {
  FeeContentAgreeFeeFileType,
  FeeContentType
} from "constant/types/appraisalFilesDetail";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { useFormik } from "formik";
import ModalListDocument, {
  DataPropsListDocumentType,
} from "pages/AccountantDebtDetail/components/FeeNotifiDetail/ModalListDocument";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { numberUtils, randomId } from "utils";
import { isContainRole } from "utils/common";
import { FeeModalContext } from "../../../../AppraisalFileDetail";
import CreateNewModal from "../UploadFileModal/CreateNewModal";
import EditLegalModal from "../UploadFileModal/EditLegalModal";
import "./style.scss";
const { INPUT_NUMBER, INPUT, SELECT, DATE_PICKER, POPUP_INPUT } = TYPE_FIELD;

type Props = {
  data: FeeContentType[];
  dataAll: any;
  sendMail: boolean;
  isReceivedFromLOS: boolean;
};

type FormDataType = {
  legalDocuments: Array<AppraisalFileLegalDocumentType>;
};

type RefProps = {
  feeContentsData: () => void;
  uploadFile: () => void;
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
  dateNotification: "",
  dateUpload: "",
  fileName: "",
  ecmId: "",
  isChecked: false,
  note: "",
  contentId: null,
  price: null,
  totalPrice: null,
  status: 0,
  statusEms: null,
  noteByLos: "",
  whoCreate: "",
  reducedFee: 0,
  reduceFeePercent: 0,
  listDocuments: [],
};

const initialValue: FormDataType = {
  legalDocuments: [],
};

const FeeModalTable = forwardRef<RefProps, Props>((props, ref) => {
  const showModal = useContext(FeeModalContext);
  const { data, dataAll, sendMail, isReceivedFromLOS } = props;
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<FeeContentType[]>([]);
  const [dataSource, setDataSource] = useState<FeeContentType[]>([]);
  const [contentsData, setContentsData] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState({
    isOpenModalUploadFile: false,
  });

  const [isOpenModalCreate, setIsOpenModalCreate] = useState<boolean>(false);
  const [feeContentIndex, setFeeContentIndex] = useState<number>();

  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);

  const [agreeFeeFileUpdate, setAgreeFeeFileUpdate] = useState<
    FeeContentAgreeFeeFileType | undefined
  >(undefined);

  const [isOpenModalListDocument, setIsOpenModalListDocument] =
    useState<boolean>(false);

  const [dataListDocument, setDataListDocument] =
    useState<DataPropsListDocumentType>({
      feeContentId: null,
      listDocuments: [],
      disabled: true,
    });

  const openModalCreate = (index: number) => {
    setFeeContentIndex(index);
    setIsOpenModalCreate(true);
  };

  const closeModalCreate = () => {
    setFeeContentIndex(undefined);
    setIsOpenModalCreate(false);
  };

  const openModalEdit = (index: number, record: FeeContentAgreeFeeFileType) => {
    setFeeContentIndex(index);
    setAgreeFeeFileUpdate({
      ecmIdAgreeFee: record.ecmIdAgreeFee,
      noteAgreeFee: record.noteAgreeFee,
      fileNameAgreeFee: record.fileNameAgreeFee,
      mediaTypeAgreeFee: record.mediaTypeAgreeFee,
      dateAgreeFee: record.dateAgreeFee,
    });
    setIsOpenEdit(true);
  };

  const closeModalEdit = () => {
    setIsOpenEdit(false);
  };

  const formDataFile = useFormik({
    initialValues: initialValue,
    onSubmit: (data: FormDataType): any => {
      return data;
    },
  });

  const handleAddFeeContent = () => {
    const newFeeContent = { ...feeContentInit, key: randomId() };
    setDataSource([...dataSource, newFeeContent]);
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

  const handleRowChangeContent = (value: any, index: number) => {
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
          ...tmpDataSource?.map((item, i) => {
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
        tmpDataSource?.map((item, i) => {
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

  const handleRowChangeNoteByLOS = (value: any, index: number) => {
    const tmpDataSource = [...dataSource];
    tmpDataSource[index] = { ...tmpDataSource[index], ...value };

    form.setFieldsValue({
      data: [
        ...tmpDataSource?.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              noteByLos: item.noteByLos,
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
            noteByLos: item.noteByLos,
          };
        }
        return item;
      })
    );
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

  const handleRowChangePrice = (value: any, index: number) => {
    const tmpDataSource = [...dataSource];
    tmpDataSource[index] = { ...tmpDataSource[index], ...value };

    const totalPrice = handleUpdateTotalPrice(tmpDataSource[index]);
    const reduceFeePercent = handleUpdatePercent(tmpDataSource[index]);

    tmpDataSource[index].totalPrice = totalPrice;
    tmpDataSource[index].reduceFeePercent = reduceFeePercent;

    setDataSource(tmpDataSource);
    form.setFieldsValue({
      data: tmpDataSource,
    });
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
    const reduceFeePercent = numberUtils.roundNumber(
      Math.abs((reducedFee / price) * 100)
    );
    return Number(reduceFeePercent);
  };

  const uploadProps = (index: any) => ({
    onRemove: () => {
      const newDataSource = [...dataSource];
      newDataSource[index].fileList = [];
      setDataSource(newDataSource);
    },
    beforeUpload: (file: any) => {},
    fileList: dataSource[index].fileList,
    accept: ".pdf",
  });

  const uploadAgreeFeeProps = (index: any) => ({
    onRemove: () => {
      const newDataSource = [...dataSource];
      newDataSource[index].fileAgreeFeeList = [];
      setDataSource(newDataSource);
    },
    beforeUpload: (file: any) => {},
    fileList: dataSource[index].fileAgreeFeeList,
    accept: ".pdf",
  });

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

  const columns: ColumnsType<FeeContentType> = [
    {
      key: 1,
      title: "STT",
      align: "center",
      fixed: "left",
      width: "50px",
      render: (value: any, _, index: number) => index + 1,
    },
    {
      key: 2,
      title: "Nội dung",
      dataIndex: "content",
      fixed: "left",
      width: "150px",
      render: (value: any, _, index: number) => (
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
              const isContentId2 = item.contentId === 2;
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

              const hasContentId2AndStatus2 =
                dataAll.feeContents &&
                dataAll.feeContents.some(
                  (feeItem: any) =>
                    feeItem.contentId === 2 && feeItem.status === 2
                );

              return {
                value: item.contentId,
                label: item.content,
                disabled: hasContentId2AndStatus2
                  ? false
                  : isContentId2
                  ? !isDisabled
                  : false,
              };
            })}
            onChange={(value: any, option: any) => {
              handleRowChangeContent({ content: option.label }, index);
            }}
          />
        </Form.Item>
      ),
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
          />
        );
      },
    },
    {
      key: 4,
      title: "Ngày TB",
      dataIndex: "dateNotification",
      width: "180px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            disable={true}
            type={DATE_PICKER}
            value={
              dataSource[index].dateNotification
                ? dayjs(dataSource[index].dateNotification)
                : null
            }
            formatDatetime={DATE_TIME_FORMAT.momentTime}
            placeholder="DD/MM/YYYY - hh:mm:ss"
          />
        );
      },
    },
    {
      key: 5,
      title: "Số tiền",
      dataIndex: "price",
      width: "180px",
      render: (value: any, _, index: number) => (
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
                return Promise.resolve();
              },
            },
          ]}
          style={{ marginBottom: "0" }}
        >
          <FormItem
            disable={dataSource[index].status === 0 ? false : true}
            type={INPUT_NUMBER}
            currencable
            // isRounded
            value={value}
            onChange={(value: number) => {
              handleRowChangePrice({ price: value }, index);
            }}
          />
        </Form.Item>
      ),
    },
    {
      key: 6,
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
      key: 6.5,
      title: "Điều chỉnh/giảm phí",
      dataIndex: "reducedFee",
      width: "200px",
      render: (value: any, _, index: number) => {
        return (
          <Form.Item
            name={["data", index, "reducedFee"]}
            style={{ marginBottom: "0" }}
          >
            <FormItem
              type={INPUT_NUMBER}
              value={value}
              onChange={(value: number) => {
                handleRowChangePrice({ reducedFee: value }, index);
              }}
              currencable={true}
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
      render: (value: any, _, index: number) => {
        return (
          <FormItem
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
          />
        );
      },
    },
    {
      key: 7,
      title: "Thành tiền sau giảm phí",
      dataIndex: "totalPrice",
      width: "180px",
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
      key: 8,
      title: "Ghi chú",
      dataIndex: "note",
      width: "150px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            disable={dataSource[index].status === 0 ? false : true}
            type={dataSource[index].status === 0 ? POPUP_INPUT : INPUT}
            tooltipInput={value}
            value={value}
            onChange={(e: any) =>
              handleRowChangeNote({ note: e.target.value }, index)
            }
          />
        );
      },
    },
    {
      key: 9,
      title: "Ngày xác nhận",
      dataIndex: "dateConfirm",
      width: "180px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            disable={isContainRole(ROLES.CBTH) || sendMail ? false : true}
            type={DATE_PICKER}
            value={
              dataSource[index].dateConfirm
                ? dayjs(dataSource[index].dateConfirm)
                : null
            }
            showTime={true}
            formatDatetime={DATE_TIME_FORMAT.momentTime}
            placeholder="DD/MM/YYYY - hh:mm:ss"
            onChange={(value: any) => {
              handleRowChangeDateConfirm(
                {
                  dateConfirm: value
                    ? dayjs(value).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                    : null,
                },
                index
              );
            }}
          />
        );
      },
    },
    {
      key: 10,
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
            ]}
            disable={true}
            onChange={(selectedValue: any) => {
              handleRowChangeStatus({ status: selectedValue }, index);
            }}
          />
        );
      },
    },
    {
      key: 11,
      title: "Ý kiến phản hồi từ LOS",
      dataIndex: "noteByLos",
      width: "180px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            disable={sendMail && isContainRole(ROLES.CBTH) ? false : true}
            type={sendMail ? POPUP_INPUT : INPUT}
            tooltipInput={value}
            value={value}
            onChange={(e: any) =>
              handleRowChangeNoteByLOS({ noteByLos: e.target.value }, index)
            }
          />
        );
      },
    },
    {
      key: 12,
      title: "Người tạo",
      dataIndex: "whoCreate",
      align: "center",
      width: "180px",
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
      key: 13,
      title: "Tờ trình giảm phí",
      dataIndex: "fileName",
      width: "150px",
      render: (_: any, record: any, index: number) => {
        return (
          <Button
            icon={<Icons.upload />}
            onClick={() => {
              setDataListDocument({
                feeContentId: record.feeContentId,
                listDocuments: record.listDocuments || [],
                index,
                disabled: false,
              });
              setIsOpenModalListDocument(true);
            }}
          >
            Tải lên
          </Button>
        );
      },
    },
    {
      key: 14,
      title: "Chứng từ XNP",
      dataIndex: "fileNameAgreeFee",
      width: "150px",
      render: (_: any, record: any, index: number) => {
        return (
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Upload
              {...uploadAgreeFeeProps(index)}
              maxCount={1}
              disabled={true}
            >
              <Button
                icon={<Icons.upload />}
                onClick={() => {
                  if (record.fileNameAgreeFee) {
                    openModalEdit(index, record);
                  } else {
                    openModalCreate(index);
                  }
                }}
              >
                Chọn file
              </Button>
            </Upload>
            {!dataSource[index].fileAgreeFeeList && record.fileNameAgreeFee && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListButtonActionUpdate
                  downloading={record.downloading || false}
                  downloadFunction={() => {
                    handleDownload(
                      record.ecmIdAgreeFee,
                      record.fileNameAgreeFee,
                      record.key
                    );
                  }}
                />
                <ListButtonActionUpdate
                  downloading={record.downloading || false}
                  viewFunction={() => {
                    handleDisplay(
                      record.ecmIdAgreeFee,
                      record.fileNameAgreeFee
                    );
                    openModalUploadFile();
                  }}
                />
              </div>
            )}
          </span>
        );
      },
    },
  ];

  const openModalUploadFile = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalUploadFile: true,
    });
  };

  const closeModalUploadFile = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalUploadFile: false,
    });
  };

  const handleUploadFileEcm = async () => {
    const fileUploadedInfo = [];
    const fileUploadedAgreeFee = [];

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

    const handleUploadAgreeFee = async (item: any) => {
      const formDataFile = new FormData();
      formDataFile.append("file", item.fileAgreeFeeList[0] as RcFile);

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
            message.success(
              `Upload file ${item.fileAgreeFeeList[0].name} thành công!`
            );
            success = true;
          } else {
            throw new Error(`Lỗi server: ${JSON.stringify(res.data)}`);
          }
        } catch (error) {
          retryCount++;
        }
      }

      if (!success) {
        message.error(`Upload file ${item.fileAgreeFeeList[0].name} thất bại!`);
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

    for (let i = 0; i < dataSource.length; i++) {
      const item = dataSource[i];
      if (item.fileAgreeFeeList && item.fileAgreeFeeList.length > 0) {
        const result = await handleUploadAgreeFee(item);
        fileUploadedAgreeFee.push(result);
      }
    }

    return { fileUploadedInfo, fileUploadedAgreeFee };
  };

  const handleFeeContentsData = async () => {
    try {
      const validateForm = await form.validateFields();
      const updatedDataSource = dataSource?.map((item, index) => {
        let contentId;
        if (item.content === "Phí đợt 1") {
          contentId = 1;
        } else if (item.content === "Phí đợt 2") {
          contentId = 2;
        } else if (item.content === "Công tác phí") {
          contentId = 3;
        }
        return {
          ...item,
          contentId: contentId !== undefined ? contentId : 0,
        };
      });
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

  useImperativeHandle(ref, () => ({
    feeContentsData: handleFeeContentsData,
    uploadFile: handleUploadFileEcm,
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
    if (showModal?.isFeeModalShow === true || !showModal) {
      const updatedData: any = data.map((item) => ({
        ...item,
        reducedFee:
          item.reducedFee === null
            ? 0
            : numberUtils.roundDecimalNumber(item.reducedFee),
        price:
          item.price === null ? 0 : numberUtils.roundDecimalNumber(item.price),
        totalPrice:
          item.totalPrice === null
            ? 0
            : numberUtils.roundDecimalNumber(item.totalPrice),
      }));

      setDataSource(updatedData);
      onSelectChange([]);
      form.setFieldsValue({ data: updatedData });
    }
  }, [data, showModal?.isFeeModalShow]);

  useEffect(() => {
    fetchContentsData();
  }, []);

  useEffect(() => {
    form.setFieldsValue({ data: { dataSource } });
  }, [dataSource]);

  const handleAdd = (pr: any) => {
    const { fileNameAgreeFee, index, noteAgreeFee } = pr;

    const fileExtension = fileNameAgreeFee.name.split(".").pop().toLowerCase();
    if (fileExtension !== "pdf") {
      message.error("Vui lòng chỉ tải lên tệp PDF!");
      const newDataSource = [...dataSource];
      newDataSource[index].fileAgreeFeeList = [];
      setDataSource(newDataSource);
    }
    const newDataSource = [...dataSource];
    newDataSource[index].fileAgreeFeeList = [fileNameAgreeFee];
    newDataSource[index].noteAgreeFee = noteAgreeFee;
    setDataSource(newDataSource);
  };

  const handleAddReduceFee = (pr: any) => {
    const { fileName, index, note } = pr;

    const fileExtension = fileName.name.split(".").pop().toLowerCase();
    if (fileExtension !== "pdf") {
      message.error("Vui lòng chỉ tải lên tệp PDF!");
      const newDataSource = [...dataSource];
      newDataSource[index].fileList = [];
      setDataSource(newDataSource);
    }
    const newDataSource = [...dataSource];
    newDataSource[index].fileList = [fileName];
    newDataSource[index].note = note;
    setDataSource(newDataSource);
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

  const handleChangeListDocument = (dataUpdate: DataPropsListDocumentType) => {
    const tmpDataSource = [...dataSource];
    if (dataUpdate.index === undefined || dataUpdate.index === null) return;
    tmpDataSource[dataUpdate.index].listDocuments = [
      ...dataUpdate.listDocuments,
    ];
    setDataListDocument({
      feeContentId: null,
      listDocuments: [],
      disabled: true,
    });
  };

  return (
    <>
      {!pdfUrl && (
        <Card className="card-container-fee-table" size="small">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <CardTitleCustomUpdate title="Danh sách theo dõi thông báo phí" />
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
            <div style={{ width: "100%", overflowX: "auto", maxWidth: "1500px" }}>
              <DynamicTable
                scroll={{ x: 1980 }}
                columns={columns}
                dataSource={dataSource || []}
                onAddRow={() => {
                  handleAddFeeContent();
                }}
                onRemoveRow={(data, index: number) => {
                  data.status === 0 && handleDeleteFeeContent(data.key);
                }}
                {...(isContainRole(ROLES.CBTH) ? {} : { hiddenRow: true })}
                rowSelection={{
                  type: "checkbox",
                  selectedRowKeys,
                  onChange: onSelectChange,
                  getCheckboxProps: (record) => {
                    let disabled;
                    if (record.status === 0 && !record.code) {
                      // Chưa tạo và chưa báo phí thì không cho check box
                      disabled = true;
                    } else if (record.status === 2) {
                      // Nếu trạng thái là 2 hoặc 0 thì không cho check box
                      disabled = true;
                    }
                    // Báo phí
                    else if (!sendMail && record.status === 0 && record.code) {
                      // Đã tạo và chưa báo phí thì cho check box
                      disabled = false;
                    } else if (record.status !== 0 && record.code) {
                      // Đã tạo và và báo phí thì không cho check box
                      // disabled = true;
                    }
                    // Gửi mail
                    else if (
                      sendMail &&
                      (record.status === 0 || !record.isCheckedEmail) &&
                      record.code
                    ) {
                      // Hstc và chưa gửi mail thì cho check box
                      disabled = false;
                    } else if (
                      sendMail &&
                      (record.status !== 0 || record.isCheckedEmail) &&
                      record.code
                    ) {
                      // Hstc và đã gửi mail thì không cho check box
                      disabled = true;
                    }
                    return { disabled };
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
              />
            </div>
          </Form>
        </Card>
      )}
      {pdfUrl && (
        <Modal
          className="custom-modal"
          open={isOpenModal.isOpenModalUploadFile}
          onCancel={() => {
            setPdfUrl("");
            closeModalUploadFile();
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

      <CreateNewModal
        index={feeContentIndex}
        addNew={handleAdd}
        closeModal={closeModalCreate}
        isOpen={isOpenModalCreate}
      />

      <EditLegalModal
        index={feeContentIndex}
        closeModal={closeModalEdit}
        dataInit={agreeFeeFileUpdate}
        handleEdit={handleAdd}
        isOpen={isOpenEdit}
      />

      <ModalListDocument
        dataListDocument={dataListDocument}
        isOpen={isOpenModalListDocument}
        closeModal={() => setIsOpenModalListDocument(false)}
        updateData={(dataUpdate: any) => handleChangeListDocument(dataUpdate)}
        isDetail={false}
      />
    </>
  );
});
export default FeeModalTable;
