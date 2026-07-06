import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Modal,
  Space,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import { RcFile } from "antd/es/upload";
import { ecmFileApi } from "apis/ecmFile";
import Icons from "assets/icons";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import TableCustom from "components/TableCustom";
import { RootState } from "configs/configureStore";
import { BUTTON_CODES, ROLES } from "constant/common";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { saveAs } from "file-saver";
import CompareFile from "pages/UnidentifiedProfile/components/ModalEdit/index";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isContainRole } from "utils/common";
import { isNotAllowed } from "utils/permission";
import { appraisalFilesApi } from "../../../../apis/appraisalFiles";
import { syncEMSApi } from "../../../../apis/syncEMS";
import {
  AccDataDto,
  AppraisalFilesCompareFilter,
} from "../../../../constant/types/appraisalFilesDetail";
import { reloadTable } from "../../../App/store/appSlice";
import ModalEdit from "./ModalEdit";
import { defaultColumns } from "./config";
import "./style.scss";
import ButtonCustom from "components/ButtonCustom";

type Props = {
  filters: AccDataDto;
  setFilters: (filters: AccDataDto) => void;
  dataTable: any;
  setDataTable: (dataTable: any) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const Table: React.FC<Props> = ({
  filters,
  setFilters,
  dataTable,
  setDataTable,
  isLoading,
  setIsLoading,
}) => {
  const [exporting, setExporting] = useState(false);
  const [isOpenCompare, setIsOpenCompare] = useState<boolean>(false);
  const [selectRowKey, setSelectRowKey] = useState<any[]>([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedListObject, setSelectedListObject] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const prevParamsRef = useRef<any>(filters);
  const [isOpenModal, setIsOpenModal] = useState({
    isOpenModalEdit: false,
  });
  const [internalRecording, setInternalRecording] = useState<any>({
    title: "",
    edit: {},
  });
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [openViewFile, setOpenViewFile] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const [filterAppraisal, setFilterAppraisal] =
    useState<AppraisalFilesCompareFilter>({
      limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
        ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
        : PAGE_SIZE_OPTIONS.OPTION_10,
      page: 1,
      keywords: null,
    });

  const handleUploadFileEcm = async (file: RcFile, index: number) => {
    const formDataFile = new FormData();
    formDataFile.append("file", file as RcFile);

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
          success = true;
        } else {
          throw new Error(`Lỗi server: ${JSON.stringify(res.data)}`);
        }
      } catch (error) {
        retryCount++;
      }
    }
    if (success) {
      // call api update
      try {
        const record = dataTable.data[index];
        const updateResponse = await syncEMSApi.updateStatusEms({
          accDataId: record.accDataId,
          feeContentId: record.feeContentId,
          statusEms: record.statusEms,
          ecmId: res?.data?.body?.ecmId,
          filename: res?.data?.body?.filename,
          mediaType: "application/pdf",
        });
        message.success(`Upload file ${file.name} thành công!`);
      } catch (error) {
        message.error("Cập nhật file thất bại!");
      }
      return res?.data?.body;
    } else {
      message.error(`Upload file ${file.name} thất bại!`);
      return null;
    }
  };
  const uploadProps = (index: any) => ({
    onRemove: () => {},
    beforeUpload: async (file: RcFile) => {
      if (!file) return;
      const fileExtension = file.type;
      if (fileExtension !== "application/pdf") {
        message.error("Vui lòng chỉ tải lên tệp PDF!");
        return false;
      }
      // upload file
      const uploadedData = await handleUploadFileEcm(file, index);

      // update data table
      setDataTable((prev: any) => {
        const newData = [...prev.data];
        newData[index] = {
          ...newData[index],
          ecmId: uploadedData?.ecmId,
          filename: uploadedData?.filename,
        };
        return {
          ...prev,
          data: newData,
        };
      });
      return false;
    },
    accept: ".pdf",
  });
  const handleDownload = async (ecmId: string, filename: string) => {
    if (ecmId && filename) {
      try {
        const res = await ecmFileApi.downloadECMFileFromNotification({
          ecmId,
          filename,
          mediaType: "application/pdf",
        });

        saveAs(res.data, filename);
      } catch {
        message.error("Tải file thất bại!");
      }
    } else message.error("Tải file thất bại!");
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
        setOpenViewFile(true);
      } catch {
        message.error("Xem file thất bại!");
      }
    } else message.error("Xem file thất bại!");
  };

  useLayoutEffect(() => {
    if (
      filters?.page !== undefined &&
      filters?.page > 1 &&
      filters?.limit !== undefined &&
      filters?.limit >= 5 &&
      filters.limit !== prevParamsRef.current.limit
    ) {
      setFilters({
        ...filters,
        limit: filters.limit,
        page: 1,
      });
    }
    if (filters.limit !== prevParamsRef.current.limit) {
      setSelectRowKey([]);
      setSelectedListObject([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY.CHECK_BOX);
      localStorage.removeItem(LOCAL_STORAGE_KEY.CHECK_BOX_KEY);
    }
    if (filters.page !== prevParamsRef.current.page) {
      let checkBoxSaved: any = localStorage.getItem(
        LOCAL_STORAGE_KEY.CHECK_BOX_KEY
      );
      if (checkBoxSaved && checkBoxSaved !== "{}") {
        try {
          checkBoxSaved = JSON.parse(checkBoxSaved);
          setSelectRowKey(checkBoxSaved);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    prevParamsRef.current = filters;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.CHECK_BOX_KEY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeEdit = () => {
    setIsOpenCompare(false);
  };

  const syncEMS = async () => {
    try {
      setExporting(true);
      let res = await syncEMSApi.unSyncEMS({
        options: 2,
        clientId: null,
        issuedInvoiceOnly: false,
        paidOnly: false,
      });
      if (res.status === 200) {
        message.success(`Đồng bộ từ EMS thành công!`);
      } else {
        message.error(`Đồng bộ từ EMS thất bại!`);
      }
    } catch (error) {
      message.error(`Đồng bộ từ EMS thất bại!`);
    } finally {
      setExporting(false);
    }
  };

  const openModalEdit = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalEdit: true,
    });
  };

  const closeModalEdit = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalEdit: false,
    });
  };

  const columns = defaultColumns.reduce((arr: any[], item: any) => {
    if (filters.statusEms === 2 && item.key === 13) {
      return arr;
    }

    if (item.key === 1) {
      return [
        ...arr,
        {
          ...item,
          render: (_: any, record: any, index: number) => {
            return (
              (Number(filters.page) - 1) * Number(filters.limit) + index + 1
            );
          },
        },
      ];
    }

    if (item.key === 11) {
      return [
        ...arr,
        {
          ...item,
          render: (text: any) => (
            <Tooltip title={text}>
              <div className="tooltip-text">{text}</div>
            </Tooltip>
          ),
        },
      ];
    }
    if (item.key === 13) {
      return [
        ...arr,
        {
          ...item,
          render: (_: any, record: any) => {
            return (
              <Space>
                {(record.statusEms === 0 ||
                  record.statusEms === 1 ||
                  record.statusEms === 2 ||
                  record.statusEms === null) && (
                  <>
                    <span
                      style={{
                        color: isNotAllowed(
                          currentPagePermissions,
                          BUTTON_CODES.hscxd_doi_chieu
                        )
                          ? "#4883F6"
                          : "rgba(0, 0, 0, 0.25)",
                        cursor: isNotAllowed(
                          currentPagePermissions,
                          BUTTON_CODES.hscxd_doi_chieu
                        )
                          ? "pointer"
                          : "no-drop",
                        textDecoration: "underline",
                      }}
                      onClick={() =>
                        isNotAllowed(
                          currentPagePermissions,
                          BUTTON_CODES.hscxd_doi_chieu
                        )
                          ? openModalCompare(record)
                          : null
                      }
                    >
                      {record.statusEms === 1 || record.statusEms === 2
                        ? "Đối chiếu lại"
                        : "Đối chiếu HS"}
                    </span>
                    <Button
                      type="text"
                      icon={
                        <ReloadOutlined
                          style={{ fontWeight: "bold", fontSize: "16px" }}
                        />
                      }
                      onClick={() => {
                        openModalEdit();
                        setSelectedRecord(record);
                        setInternalRecording((prevState: any) => ({
                          ...prevState,
                          edit: {
                            statusEms: 6,
                          },
                          title: "Thay đổi trạng thái hồ sơ",
                        }));
                      }}
                      disabled={isNotAllowed(
                        currentPagePermissions,
                        BUTTON_CODES.hscxd_sua
                      )}
                    />
                  </>
                )}
              </Space>
            );
          },
        },
      ];
    }

    if (item.key === 12) {
      return [
        ...arr,
        {
          ...item,
          render: (_: any, record: any) => {
            const color =
              record.statusEmsStr === "Hồ sơ chưa xác định"
                ? "#FF0000"
                : record.statusEmsStr === "Hồ sơ đã đối chiếu và chưa gửi EMS"
                ? "#D96C1E"
                : record.statusEmsStr === "Hồ sơ đã xuất hóa đơn"
                ? "blue"
                : record.statusEmsStr === "Đối chiếu hồ sơ thủ công"
                ? "black"
                : record.statusEmsStr === "Hoàn tiền"
                ? "black"
                : "#2B9D70";
            return (
              <Tooltip title={record.note}>
                <span style={{ color }}>{record.statusEmsStr}</span>;
              </Tooltip>
            );
          },
        },
      ];
    }
    if (item.dataIndex === "uploadFile") {
      return [
        ...arr,
        {
          ...item,
          render: (_: any, record: any, index: number) => {
            return (
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Upload
                  {...uploadProps(index)}
                  maxCount={1}
                  showUploadList={false}
                  // disabled={record.status === 0 ? false : true}
                >
                  <ButtonCustom
                    icon={<Icons.upload />}
                    // onClick={() => {
                    //   if (record.status !== 0) {
                    //     message.error(
                    //       "Bạn không thể Upload File khi trạng thái đã là báo phí"
                    //     );
                    //   }
                    // }}
                  >
                    Chọn file
                  </ButtonCustom>
                </Upload>
                {record?.ecmId && (
                  <span>
                    <ListButtonActionUpdate
                      // downloading={dataFile.downloading || false}
                      downloadFunction={() => {
                        handleDownload(record.ecmId, record.filename);
                      }}
                    />
                    <ListButtonActionUpdate
                      viewFunction={() => {
                        handleDisplay(record.ecmId, record.filename);
                      }}
                    />
                  </span>
                )}
              </span>
            );
          },
        },
      ];
    }

    return [...arr, { ...item }];
  }, []);

  const openModalCompare = async (item: any) => {
    setIsOpenCompare(true);
    setSelectedObject((prevState: any) => ({
      ...prevState,
      ...item,
      reportCode: "",
    }));
    setTimeout(() => {
      setSelectedObject((prevState: any) => ({
        ...prevState,
        ...item,
        reportCode: item.reportCode,
      }));
    }, 100);
  };

  const onSelectChange = (record: any, selected: boolean) => {
    if (selected) {
      setSelectRowKey([...selectRowKey, record.key]);
      setSelectedListObject([...selectedListObject, record]);
    } else {
      setSelectRowKey(selectRowKey.filter((e: any) => e !== record.key));
      setSelectedListObject(
        selectedListObject.filter((e: any) => e.key !== record.key)
      );
    }
  };

  const onSelectAll = (
    selected: boolean,
    selectedRows: any,
    changeRows: any
  ) => {
    if (selected) {
      setSelectRowKey([...selectRowKey, ...changeRows.map((e: any) => e.key)]);
      setSelectedListObject([...selectedListObject, ...changeRows]);
      localStorage.setItem(
        LOCAL_STORAGE_KEY.CHECK_BOX_KEY,
        JSON.stringify([...selectRowKey, ...changeRows.map((e: any) => e.key)])
      );
    } else {
      const allRowsSelected = changeRows.every((row: any) =>
        selectRowKey.includes(row.key)
      );
      if (allRowsSelected) {
        const unSelectedRowKeys = changeRows.map((row: any) => row.key);
        let checkBoxSavedFilter: any;
        let checkBoxSaved: any = localStorage.getItem(
          LOCAL_STORAGE_KEY.CHECK_BOX_KEY
        );
        if (checkBoxSaved && checkBoxSaved !== "{}") {
          try {
            checkBoxSaved = JSON.parse(checkBoxSaved);
            checkBoxSavedFilter = checkBoxSaved.filter(
              (item: any) => !unSelectedRowKeys.includes(item)
            );
            localStorage.setItem(
              LOCAL_STORAGE_KEY.CHECK_BOX_KEY,
              JSON.stringify(checkBoxSavedFilter)
            );
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }

        setSelectRowKey(checkBoxSavedFilter);
        setSelectedListObject(
          selectedListObject.filter((item: any) =>
            checkBoxSavedFilter.includes(item.key)
          )
        );
      } else {
        setSelectedListObject(
          selectedListObject.filter((e: any) =>
            changeRows.find((ele: any) => ele.key !== e.key)
          )
        );
        setSelectRowKey(
          selectRowKey.filter((e: any) =>
            changeRows.find((ele: any) => ele.key !== e.key)
          )
        );
      }
    }
  };

  const rowSelection = {
    selectedRowKeys: selectRowKey,
    getCheckboxProps: (record: any) => ({
      // disabled: record.statusEms !== 1,
      disabled: false,
      statusEms: record.statusEms,
    }),
    onSelect: onSelectChange,
    onSelectAll: onSelectAll,
  };

  const onSendEMS = async () => {
    setIsLoading(true);
    try {
      if (!selectedListObject || selectedListObject.length === 0) {
        message.warning("Vui lòng chọn hồ sơ");
        return;
      }
      const res = await appraisalFilesApi.sendProfilesToEms(
        selectedListObject.map((ele) => {
          return {
            accDataId: ele.accDataId,
            feeContentId: ele.feeContentId,
            reportCode: ele.reportCode,
            proposalCode: ele.proposalCode,
            content: ele.content,
          };
        })
      );
      if (res.status === 200) {
        if (res.data?.statusCode === 500) {
          message.error(res.data?.message);
        } else {
          if (
            res.data?.data?.successList &&
            res.data?.data?.successList.length > 0
          ) {
            message.success(
              "Gửi EMS hồ sơ thành công: " +
                res.data?.data?.successList.join(", ")
            );
          }
          if (
            res.data?.data?.failedList &&
            res.data?.data?.failedList.length > 0
          ) {
            message.error(
              "Gửi EMS hồ sơ thất bại: " + res.data?.data?.failedList.join(", ")
            );
          }
          setSelectedListObject([]);
          setSelectRowKey([]);
          dispatch(reloadTable());
        }
      }
    } catch (e) {
      message.error("Lỗi hệ thống");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="card-container" size="small">
        <div
          className="btn-group"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <CardTitleCustomUpdate title="Danh sách hồ sơ chưa xác định" />
          <Space>
            <Button
              type="primary"
              loading={exporting}
              onClick={() => {
                syncEMS();
              }}
              style={{
                background: "#ff4d4f",
                marginBottom: "7px",
                // color: "#fff",
              }}
              icon={<Icons.reload />}
              // icon={
              //   exporting && (
              //     <div className="spin-overlay">
              //       <Spin className="spin" />
              //     </div>
              //   )
              // }
              className={`button-Report ${exporting ? "exporting" : ""}`}
              disabled={
                exporting ||
                isNotAllowed(
                  currentPagePermissions,
                  BUTTON_CODES.hscxd_dong_bo_ems
                )
              }
            >
              Đồng bộ từ EMS
            </Button>
            <Button
              type="primary"
              loading={isLoading}
              onClick={onSendEMS}
              disabled={
                !selectedListObject ||
                selectedListObject.length === 0 ||
                isNotAllowed(currentPagePermissions, BUTTON_CODES.hscxs_gui_ems)
              }
              style={{
                // background: "rgba(40, 98, 175, 1)",
                marginBottom: "7px",
                // color: "#fff",
              }}
              className="button-custom btn-create"
            >
              Gửi EMS
            </Button>
          </Space>
        </div>
        <TableCustom
          dataSource={dataTable.data.sort((a: any, b: any) => {
            // Sắp xếp theo năm, tháng, ngày giảm dần
            const dateA = new Date(a.refDate);
            const dateB = new Date(b.refDate);

            // So sánh năm
            if (dateB.getFullYear() !== dateA.getFullYear()) {
              return dateB.getFullYear() - dateA.getFullYear();
            }

            // Nếu năm bằng nhau, so sánh tháng
            if (dateB.getMonth() !== dateA.getMonth()) {
              return dateB.getMonth() - dateA.getMonth();
            }

            // Nếu tháng bằng nhau, so sánh ngày
            return dateB.getDate() - dateA.getDate();
          })}
          columns={columns}
          bordered={true}
          isLoading={isLoading}
          limit={dataTable.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={dataTable.total || 0}
          onLimitChange={(limit) => {
            setFilters({ ...filters, limit });
          }}
          onPageChange={(page) => {
            setFilters({ ...filters, page });
          }}
          page={dataTable.page || 1}
          scroll={{ x: "1980px" }}
          isCustomRowSelect={true}
          isRowSelection={!isContainRole(ROLES.CVTD) ? true : false}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
        />
      </Card>
      <CompareFile
        isOpen={isOpenCompare}
        closeModal={closeEdit}
        selectedAcc={selectedObject}
        setFilter={setFilterAppraisal}
        filter={filterAppraisal}
        dataSource={dataTable.data}
      />
      <ModalEdit
        internalRecording={internalRecording}
        isOpen={isOpenModal.isOpenModalEdit}
        closeModal={closeModalEdit}
        selectedRecord={selectedRecord}
      />
      {pdfUrl ? (
        <Modal
          className="custom-modal"
          open={openViewFile}
          onCancel={() => {
            setOpenViewFile(false);
            setPdfUrl("");
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
      ) : null}
    </>
  );
};

export default Table;
