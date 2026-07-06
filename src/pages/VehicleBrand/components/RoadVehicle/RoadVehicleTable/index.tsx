import { Card, Typography, message } from "antd";
import { useState } from "react";
import TableCustom from "components/TableCustom";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import Modal from "../Modal";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { useVehicleBrands } from "utils/request";
import { brandApi } from "apis/brand";
import type { ColumnsType } from "antd/es/table";
import { FilterVehicleBrandType, VehicleBrandType } from "constant/types";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filter: FilterVehicleBrandType;
};
const RoadVehicleTable = ({ filter }: Props) => {
  const [record, setRecord] = useState<VehicleBrandType | null>(null);
  const [actionModal, setActionModal] = useState<"add" | "update" | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const openModal = (action: "add" | "update" | null) => {
    setIsOpenModal(true);
    setActionModal(action);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setActionModal(null);
  };

  const { data, isLoading, mutate } = useVehicleBrands(filter);

  const removeRecord = async (id: number | null) => {
    try {
      if (!id) return;
      const res = await brandApi.deleteVehicleBrand(id);

      if (res?.data?.code !== 200) {
        message.error(res?.data?.message);
      } else {
        message.success("Xoá nhãn hiệu thành công");
        mutate();
      }
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };
  const columns: ColumnsType<VehicleBrandType> = [
    {
      key: 1,
      title: "STT",
      dataIndex: "",
      align: "center",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 60,
    },
    {
      key: 2,
      title: "Tên nhãn hiệu",
      dataIndex: "roadVehicleBrandName",
      align: "left",
    },
    {
      key: 3,
      title: "Mô tả",
      dataIndex: "roadVehicleBranchDescription",
      align: "left",
    },
    {
      key: 4,
      title: "Hành động",
      dataIndex: "",
      align: "center",
      width: 120,
      render: (_: any, _record) => (
        <>
          <ListButtonActionUpdate
            editFunction={() => {
              openModal("update");
              setRecord(_record);
            }}
            removeFunction={() => {
              removeRecord(_record.roadVehicleBrandId);
            }}
            removeButtonCode={BUTTON_CODES.dm_nh_xoa}
            editButtonCode={BUTTON_CODES.dm_nh_sua}
          />
        </>
      ),
    },
  ];

  return (
    <Card className="card-container" size="small">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <CardTitleCustomUpdate title="Danh sách nhãn hiệu" />
        <ButtonCustom
          label="Thêm nhãn hiệu"
          type="primary"
          onClick={() => {
            setRecord(null);
            openModal("add");
          }}
          bgColor="rgba(40, 98, 175, 1)"
          code={BUTTON_CODES.dm_nh_them}
        />
      </div>

      <TableCustom
        bordered={true}
        columns={columns}
        dataSource={data?.data || []}
        isLoading={isLoading}
        limit={50}
        total={data?.total || 0}
        onLimitChange={(limit) => {}}
        onPageChange={(page) => {
          // setParams({ ...params, page });
        }}
        page={1}
      />
      <div>
        <Typography.Text
          style={{ fontSize: "14px", fontWeight: "bold", marginTop: "0.25rem" }}
          ellipsis={true}
        >
          Tổng: {data?.data?.length}
        </Typography.Text>
      </div>
      <Modal
        isOpenModal={isOpenModal}
        closeModal={closeModal}
        record={record}
        action={actionModal}
        mutate={mutate}
        type={filter.type}
      />
    </Card>
  );
};

export default RoadVehicleTable;
