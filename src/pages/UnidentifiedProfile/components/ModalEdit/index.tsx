/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal, Row, Space, message } from "antd";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { initDataTable } from "pages/UnidentifiedProfile";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { appraisalFilesApi } from "../../../../apis/appraisalFiles";
import { AppraisalFilesCompareFilter } from "../../../../constant/types/appraisalFilesDetail";
import { reloadTable } from "../../../App/store/appSlice";
import FeeContentTable from "./components/FeeContentTable";
import Table from "./components/Table";
import { randomId } from "utils";
import "./style.scss";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  dataSource: any;
  filter: AppraisalFilesCompareFilter;
  setFilter: (filter: AppraisalFilesCompareFilter) => void;
  selectedAcc: any;
};

const CompareFile: React.FC<Props> = ({
  isOpen,
  closeModal,
  dataSource,
  filter,
  setFilter,
  selectedAcc,
}) => {
  const dispatch = useDispatch()
  const [dataTableAppraisal, setDataTableAppraisal] = useState(initDataTable);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedRowKey, setSelectedRowKey] = useState<any>([]);
  const [selectedObject, setSelectedObject] = useState<any>([]);
  const [selectedObjectHasFeeContents, setSelectedObjectHasFeeContents] =
    useState<any>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const onSelectChange = (newSelectedRowKeys: any, selectedRow: any) => {

    setSelectedRowKey(newSelectedRowKeys);
    setSelectedObject(selectedRow);
    // setSelectedObject(selectedRow[0]);
  };

  useEffect(() => {
    setSelectedObjectHasFeeContents((prevState: any) => {
      return selectedObject.map((item: any) => ({
        feeNotificationId: item.feeContents[0].feeNotificationId,
        feeContents: item.feeContents,
      }));
    });
  }, [selectedObject]);

  // useEffect(() => {
  //   let matchedAccDataIds = [];
  //   if (selectedObject) {
  //     for (let i = 0; i < selectedObject.length; i++) {
  //       for (let j = 0; j < dataSource.length; j++) {
  //         if (selectedObject[i].reportCode === dataSource[j].reportCode) {
  //           matchedAccDataIds.push({
  //             accDataId: dataSource[j].accDataId,
  //             feeNotificationId: dataSource[j].feeNotificationId,
  //             feeContentId: dataSource[j].feeContentId,
  //             reportCode: dataSource[j].reportCode,
  //           });
  //         }
  //       }
  //     }
  //   } else {
  //     matchedAccDataIds = [];
  //   }
  //   console.log(matchedAccDataIds);
  // }, [selectedObject]);

  const handleCompare = async () => {
    if (!selectedObject) {
      message.warning("Vui lòng chọn hồ sơ");
      return;
    }
    try {
      // const sleep = (ms: number) => {
      //   return new Promise((resolve) => setTimeout(resolve, ms));
      // };

      // for (const obj of selectedObject) {
      //   const res = await appraisalFilesApi.joinFeeNotification({
      //     accDataId: selectedAcc.accDataId,
      //     feeNotificationId: obj.feeNotificationId,
      //     feeContentId: obj.feeContentId,
      //   });
      //   if (res.data.message.startsWith("Không thể thực hiện")) {
      //     message.error(res.data?.message);
      //   } else if (res.data.message.startsWith("Khớp hồ sơ thành")) {
      //     message.success(res.data?.message);
      //   }
      //   await sleep(1000);
      // }

      const sendData: any[] = [];
      // selectedObject.forEach((item: any) => {
      //   item.feeContents.forEach((feeContent: any) => {
      //     sendData.push({
      //       accDataId: selectedAcc.accDataId,
      //       feeNotificationId: feeContent.feeNotificationId,
      //       feeContentId: feeContent.feeContentId,
      //     })
      //   })
      // })
      selectedObjectHasFeeContents.forEach((item: any) => {
        item.feeContents.map((item: any) => {
          sendData.push({
            accDataId: selectedAcc.accDataId,
            feeNotificationId: item.feeNotificationId,
            feeContentId: item.feeContentId,
          });
        });
      });

      // console.log(sendData);

      const res = await appraisalFilesApi.joinFeeNotification(sendData);

      if (res.data.message.startsWith("Không thể thực hiện")) {
        message.error(`${res.data?.message}!`);
      } else if (res.data.message.startsWith("Khớp hồ sơ thành")) {
        message.success(`${res.data?.message}!`);
      }

      setTimeout(() => {
        dispatch(reloadTable());
        handleCloseModal();
      }, 2000);
    } catch (error) {
      message.error("Không có thông tin hồ sơ chưa xác định!");
    }
  };

  const handleCloseModal = () => {
    setSelectedRowKey([]);
    setSelectedObject([]);
    setSelectedObjectHasFeeContents([]);
    setExpandedRowKeys([]);
    closeModal();
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys: selectedRowKey,
    onChange: onSelectChange,
    // onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
    //   // setSelectedRowKey([...selectedRowKey, ...changeRows.map((e: any) => e.key)]);
    //   // setSelectedObjectHasFeeContents((prevState: any) => {});
    // },
  };

  const handleExpandRow = (expanded: boolean, record: any) => {
    if (expanded) {
      setExpandedRowKeys((prevKeys) => [...prevKeys, record.key]);
    } else {
      setExpandedRowKeys((prevKeys) =>
        prevKeys.filter((key) => key !== record.key)
      );
    }
  };

  const handleSelectAllRows = (
    selected: boolean,
    selectedRows: any[],
    selectedObjectHasFeeContents: any
  ) => {
    if (selectedObjectHasFeeContents.feeContents.length > 0) {
      setSelectedRowKey((prevState: any) => [
        ...prevState,
        selectedObjectHasFeeContents.keyParent,
      ]);
    } else {
      setSelectedRowKey((prevSelectedRowKey: any[]) => {
        return prevSelectedRowKey.filter(
          (key) => key !== selectedObjectHasFeeContents.keyParent
        );
      });
    }
  };

  const fetchCompareAppraisal = async () => {
    setIsLoading(true);
    const res = await appraisalFilesApi.getAppraisalFromEMS(filter);
    try {
      if (res.status) {
        let data = res.data.data?.map((item: any, index: number) => {
          return {
            ...item,
            key: randomId(),
            // feeContents: item.feeContents.map((itemChild: any, index: number) => {
            //   return {
            //     ...itemChild,
            //     key: randomId()
            //   }
            // })
            // key: item.appraisalFileId,
          };
        });
        setDataTableAppraisal({ ...res.data, data: data });
      }
    } catch (error) {
      message.error("Lỗi hệ thống");
    } finally {
      setIsLoading(false);
    }
    return res;
  };

  return (
    <Modal
      closeIcon={null}
      open={isOpen}
      closable={false}
      onCancel={handleCloseModal}
      footer={null}
      className="undefined-profile-modal-edit-container"
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Row
          justify={"space-between"}
          className="modal-header"
          align={"middle"}
        >
          <CardTitleCustomUpdate title="Đối chiếu hồ sơ thẩm định" />
          <Button
            size="small"
            shape="circle"
            icon={<Icons.close />}
            onClick={handleCloseModal}
          />
        </Row>
        <Table
          selectedAcc={selectedAcc}
          filter={filter}
          isLoading={isLoading}
          fetchData={fetchCompareAppraisal}
          rowSelection={rowSelection}
          setFilter={setFilter}
          dataTable={dataTableAppraisal}
          expandable={{
            columnWidth: 40,
            expandRowByClick: true,
            indentSize: 0,
            expandedRowKeys: expandedRowKeys,
            expandedRowRender: (record: any) => {
              return (
                <FeeContentTable
                  keyParent={record.key}
                  feeContents={record?.feeContents}
                  rowSelectionFeeContent={rowSelection?.selectedRowKeys?.includes(
                    record?.key
                  )}
                  onSelectedRows={(selectedObject) => {
                    setSelectedObjectHasFeeContents((prevState: any) => {
                      // Lọc bỏ mục { feeNotificationId: null, feeContents: [] } khỏi mảng prevState nếu có
                      const filteredPrevState = prevState.filter(
                        (item: any) => item.feeNotificationId !== null
                      );

                      // Tiến hành thêm selectedObject vào mảng prevState hoặc cập nhật một phần tử đã có cùng feeNotificationId
                      let updated = false;
                      let updatedState = filteredPrevState.map(
                        (prevItem: any) => {
                          if (
                            prevItem.feeNotificationId ===
                            selectedObject.feeNotificationId
                          ) {
                            updated = true;
                            return {
                              ...prevItem,
                              feeContents: selectedObject.feeContents,
                            };
                          }
                          return prevItem;
                        }
                      );

                      // Nếu không có phần tử nào trong prevState có cùng feeNotificationId với selectedObject,
                      // thêm selectedObject vào mảng prevState
                      if (!updated) {
                        updatedState.push(selectedObject);
                        updatedState = updatedState.filter(
                          (item: any) => item.feeNotificationId !== undefined
                        );
                      }

                      return updatedState.filter(
                        (item: any) => item.feeContents.length > 0
                      );
                    });
                  }}
                  onSelectAllRows={(
                    selected: boolean,
                    selectedRows: any,
                    selectedObjectHasFeeContents: any
                  ) =>
                    handleSelectAllRows(
                      selected,
                      selectedRows,
                      selectedObjectHasFeeContents
                    )
                  }
                />
              );
            },
            onExpand: handleExpandRow,
          }}
        />
        <Row
          justify="end"
          style={{ padding: "0 16px", paddingBottom: "16px" }}
          align={"middle"}
        >
          <Space>
            <ButtonCustom
              label="Hủy bỏ"
              size="small"
              onClick={handleCloseModal}
              className="my-button"
            />
            <ButtonCustom
              label="Khớp hồ sơ"
              type="primary"
              size="small"
              htmlType="button"
              disabled={
                selectedObjectHasFeeContents === null ||
                selectedObjectHasFeeContents?.length === 0
              }
              onClick={handleCompare}
            />
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};

export default CompareFile;
