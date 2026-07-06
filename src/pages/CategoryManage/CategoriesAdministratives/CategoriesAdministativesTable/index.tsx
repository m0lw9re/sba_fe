import { Card, Tooltip } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesTable/style.scss";
import { FC, useEffect, useState } from "react";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { ColumnsType } from "antd/es/table";
import { randomId } from "utils/string";
import {
  CategoriesAdministrativesType,
  FilterCategoriesAdministrativesType,
} from "constant/types/categories";
import ButtonCustom from "components/ButtonCustom";

type Props = {
  filter: FilterCategoriesAdministrativesType;
  onAddNew: () => void;
  onEdit: (
    province: string,
    district: string,
    ward: string,
    road: string
  ) => void;
};
const CategoriesAdministrativesTable: FC<Props> = ({
  filter,
  onAddNew,
  onEdit,
}) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  //const { data, isLoading, error } = useAppraisalFiles(params, filter);

  useEffect(() => {
    setParams({ ...params, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const data = [
    {
      province: "Hà Nội",
      district: "Ba Đình",
      ward: "Quán Thánh",
      road: "Quán Thánh",
    },
    {
      province: "Hà Nội",
      district: "Đống Đa",
      ward: "Kim Liên",
      road: "Phạm Ngọc Thạch",
    },
  ];
  const dataTable = data
    ? data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const columns: ColumnsType<CategoriesAdministrativesType> = [
    {
      key: 1,
      title: "STT",
      align: "center",
      render: (_, record, index) => {
        return (Number(params.page) - 1) * Number(params.limit) + index + 1;
      },
    },
    {
      key: 2,
      title: "Tỉnh/Thành phố",
      dataIndex: "province",
      align: "left",
      render: (province) => (
        <Tooltip title={province}>
          <div className="inline-text">{province}</div>
        </Tooltip>
      ),
    },
    {
      key: 3,
      title: "Quận/Huyện/Thị xã",
      dataIndex: "district",
      align: "left",
      render: (district) => (
        <Tooltip title={district}>
          <div className="inline-text">{district}</div>
        </Tooltip>
      ),
    },
    {
      key: 4,
      title: "Xã phường/Thị trấn",
      dataIndex: "ward",
      align: "left",
      render: (ward) => (
        <Tooltip title={ward}>
          <div className="inline-text">{ward}</div>
        </Tooltip>
      ),
    },
    {
      key: 5,
      title: "Tuyến đường",
      dataIndex: "road",
      render: (road) => (
        <Tooltip title={road}>
          <div className="inline-text">{road}</div>
        </Tooltip>
      ),
    },
    {
      key: 6,
      title: "Hành động",
      align: "center",
      render: (_, record: any) => (
        <>
          <ListButtonActionUpdate
            editFunction={() =>
              onEdit(record.province, record.district, record.ward, record.road)
            }
            removeFunction={() => {}}
          />
        </>
      ),
    },
  ];

  //if (error) return <div><ComponentsError />liệu</div>;

  return (
    <div className="categories-administratives-table-container">
      <Card className="card-container" size="small">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <CardTitleCustomUpdate title="Danh sách địa bàn hành chính" />
          <ButtonCustom
            label="Thêm địa bàn"
            type="primary"
            onClick={() => onAddNew()}
            bgColor="rgba(40, 98, 175, 1)"
          />
        </div>
        <TableCustom
          dataSource={dataTable}
          columns={columns}
          bordered={true}
          //isLoading={!data && isLoading}
          isLoading={false}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          //total={data ? data.total : 0}
          total={5}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page });
          }}
          page={params.page || 1}
        />
      </Card>
    </div>
  );
};

export default CategoriesAdministrativesTable;
