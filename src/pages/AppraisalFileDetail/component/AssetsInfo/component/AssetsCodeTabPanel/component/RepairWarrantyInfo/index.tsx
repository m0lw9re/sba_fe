import { RepairHistoryType } from "constant/types";
import { useFormik } from "formik";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { randomId } from "utils";
import { defaultColumns } from "./config";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { Row, Button, message } from "antd";
import TableCustom from "components/TableCustom";
import MediaTypeModal from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/RepairWarrantyInfo/MediaTypeModal";
import Icons from "assets/icons";
import { saveAs } from "file-saver";
import { ecmFileApi } from "apis/ecmFile";

type Props = {
  repairHistories: Array<RepairHistoryType>;
  assetId: string | null;
};

type RefProps = {
  updateRepairHistory: () => void;
};

type FormDataType = {
  repairHistories: Array<RepairHistoryType>;
};

const initialValue: FormDataType = {
  repairHistories: [],
};

type ModalType = "add" | "edit";

const RepairWarrantyInfo = forwardRef<RefProps, Props>(
  ({ repairHistories, assetId }, ref) => {
    const [modalType, setModalType] = useState<ModalType>("add");

    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const [record, setRecord] = useState<RepairHistoryType>();

    const form = useFormik({
      initialValues: initialValue,
      onSubmit: (data: FormDataType): any => {
        return data;
      },
    });

    const handleCloseModal = useCallback(() => {
      setIsOpenModal(false);
    }, [setIsOpenModal]);

    // Mở modal sửa
    const handleOpenEditModal = (key: React.Key) => {
      // Tìm phần tử dựa vào key
      const foundIndex = form.values.repairHistories.findIndex(
        (el) => el.key === key
      );
      if (foundIndex === -1) return;
      const foundItem = form.values.repairHistories[foundIndex];

      setRecord(foundItem);
      setModalType("edit");
      setIsOpenModal(true);
    };

    const handleRemoveRow = (record: RepairHistoryType) => {
      const tmpArr = [...form.values.repairHistories];
      const foundIndex = tmpArr.findIndex((el) => el.key === record.key);

      if (foundIndex === -1) return;

      tmpArr.splice(foundIndex, 1);
      // setLegalInfoList([...tmpArr]);
      form.setValues({
        repairHistories: [...tmpArr],
      });
    };

    // Mở modal thêm mới
    const handleOpenAddModal = () => {
      setModalType("add");
      setIsOpenModal(true);
    };

    // Thay đổi thuộc tính của 1 dòng (record)
    const handlechangeRowProperty = (data: any, key: string) => {
      const foundIndex = form.values.repairHistories.findIndex(
        (item) => item.key === key
      );
      if (foundIndex === -1) return;

      const newData = [...form.values.repairHistories];
      newData.splice(foundIndex, 1, {
        ...form.values.repairHistories[foundIndex],
        ...data,
      });
      form.setValues({ repairHistories: newData });
    };

    // Truyền hàm này vào modal cho button submit
    const handleChange = (record: RepairHistoryType, type: "add" | "edit") => {
      // Chỉnh sửa lịch sử sửa chữa
      if (type === "edit") {
        const tmpArr = [...form.values.repairHistories];
        const foundIndex = tmpArr.findIndex((el) => el.key === record.key);

        if (foundIndex === -1) return;

        tmpArr[foundIndex] = record;

        form.setValues({
          repairHistories: [...tmpArr],
        });
      }
      // Thêm lịch sử sửa chữa
      else {
        const tmpArr = [...form.values.repairHistories];
        form.setValues({
          repairHistories: [...tmpArr, record],
        });
      }
    };

    useEffect(() => {
      if (repairHistories) {
        form.setValues({
          repairHistories: repairHistories.map((item) => {
            return {
              ...item,
              key: randomId(),
              dowloading: false,
            };
          }),
        });
      }
    }, []);

    // Tải xuống tài liệu
    const handleDownload = async (
      ecmId: string,
      filename: string,
      key: string
    ) => {
      if (ecmId && filename) {
        try {
          // Chuyển trạng thái loading cho button tải xuống
          handlechangeRowProperty({ downloading: true }, key || "");
          const res = await ecmFileApi.downloadECMFileFromNotification({
            ecmId,
            filename,
            mediaType: "application/pdf",
          });
          saveAs(res.data, filename);
          handlechangeRowProperty({ downloading: false }, key || "");
        } catch {
          message.error("Tải file thất bại");
          handlechangeRowProperty({ downloading: false }, key || "");
        }
      } else message.error("Tải file thất bại");
    };

    useImperativeHandle(ref, () => ({
      updateRepairHistory: form.submitForm,
    }));

    const columns = defaultColumns.map((column) => {
      if (column.key === "action") {
        return {
          ...column,
          title: (
            <Row justify={"center"}>
              <Button
                icon={<Icons.add />}
                size="small"
                type="primary"
                style={{ backgroundColor: "#2862af" }}
                onClick={handleOpenAddModal}
              />
            </Row>
          ),
          render: (_: any, record: any, index: number) => (
            <>
              <ListButtonActionUpdate
                editFunction={() => {
                  handleOpenEditModal(record.key);
                }}
                downloading={record.downloading || false}
                downloadFunction={() => {
                  handleDownload(record.ecmId, record.filename, record.key);
                }}
                removePopupPlacement="leftTop"
                substractFunction={() => {
                  handleRemoveRow(record);
                }}
                downloadTooltip={
                  record.ecmId ? record.filename : "Đang nhận dữ liệu"
                }
              />
            </>
          ),
        };
      } else
        return {
          ...column,
        };
    });

    return (
      <div>
        <MediaTypeModal
          assetId={assetId || ""}
          onChange={handleChange}
          isOpen={isOpenModal}
          modalType={modalType}
          onClose={handleCloseModal}
          record={record}
        />
        <TableCustom
          bordered
          columns={columns}
          onLimitChange={() => {}}
          onPageChange={() => {}}
          limit={100}
          page={1}
          total={0}
          scroll={{ x: 1200 }}
          isLoading={false}
          dataSource={form.values.repairHistories}
        />
      </div>
    );
  }
);

export default memo(RepairWarrantyInfo);
