import { Card } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import "./style.scss";
import { FC, useEffect, useState } from "react";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { randomId } from "utils/string";
import { FilterCreateCollectSpent } from "constant/types";
import ButtonCustom from "components/ButtonCustom";
import { defaultColumns } from "./config";

type Props = {
  filter: FilterCreateCollectSpent;
  onAddNew: () => void;
  onEdit: () => void;
};
const PhieuChiTable: FC<Props> = ({ filter, onAddNew, onEdit }) => {
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

  const columns = defaultColumns.map((item) => {
    if (item.key === 1) {
      return {
        ...item,
        width: "5%",
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 7) {
      return {
        ...item,
        render: (_: any, record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={onEdit}
              removeFunction={() => {}}
              viewFunction={() => {}}
            />
          </>
        ),
      };
    }
    return { ...item };
  });

  const data = [
    {
      documentId: "PT/00001",
      documentDate: "28/10/2022",
      staffName: "Admin",
      btNumber: "12983781923",
      status: "Bình thường",
    },
    {
      documentId: "PT/00001",
      documentDate: "28/10/2022",
      staffName: "Admin",
      btNumber: "12983781923",
      status: "Bình thường",
    },
    {
      documentId: "PT/00001",
      documentDate: "28/10/2022",
      staffName: "Admin",
      btNumber: "12983781923",
      status: "Bình thường",
    },
    {
      documentId: "PT/00001",
      documentDate: "28/10/2022",
      staffName: "Admin",
      btNumber: "12983781923",
      status: "Bình thường",
    },
    {
      documentId: "PT/00001",
      documentDate: "28/10/2022",
      staffName: "Admin",
      btNumber: "12983781923",
      status: "Bình thường",
    },
    {
      documentId: "PT/00001",
      documentDate: "28/10/2022",
      staffName: "Admin",
      btNumber: "12983781923",
      status: "Bình thường",
    },
    {
      documentId: "PT/00001",
      documentDate: "28/10/2022",
      staffName: "Admin",
      btNumber: "12983781923",
      status: "Bình thường",
    },
    {
      documentId: "PT/00001",
      documentDate: "28/10/2022",
      staffName: "Admin",
      btNumber: "12983781923",
      status: "Bình thường",
    },
    {
      documentId: "PT/00001",
      documentDate: "28/10/2022",
      staffName: "Admin",
      btNumber: "12983781923",
      status: "Bình thường",
    },
    {
      documentId: "PT/00001",
      documentDate: "28/10/2022",
      staffName: "Admin",
      btNumber: "12983781923",
      status: "Bình thường",
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

  return (
    <div className="phieu-thu-container">
      <Card className="card-container" size="small">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <CardTitleCustomUpdate title="Danh sách phiếu chi" />
          <ButtonCustom
            label="Thêm mới"
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

export default PhieuChiTable;
