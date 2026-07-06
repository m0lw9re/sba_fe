import {Card, message} from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import {LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS} from "constant/enums";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {defaultColumns} from "./config";
import {randomId} from "utils";
import {
  FAST_EXPERTISE_VEHICLE_CREATE,
  FAST_EXPERTISE_VEHICLE_EDIT,
  FAST_EXPERTISE_VEHICLE_VIEW,
} from "routes/route.constant";
import {useFastValuation} from "utils/request/useFastValuation";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import {fastExpertiseApi} from "apis/fastExpertise";
import {useAppDispatch} from "configs/hooks";
import {setType} from "pages/FastExpertise/Store/fastExpertise";
const VehicleTable = ({filters}: any) => {
  const navigate = useNavigate();
  const [params, setParams] = useState<any>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const dispatch = useAppDispatch();
  const {data, isLoading, mutate} = useFastValuation(
    {...params, page: params.page},
    {
      ...filters,
      isFastValuation: true,
      assetType: 2,
      // customerName: filters?.customerName ?? null,
      // customerIdentity: filters?.customerIdentity ?? null,
      // codeBook: filters?.codeBook ?? null,
    }
  );
  const removeRecord = async (id: any) => {
    try {
      const res = await fastExpertiseApi.deleteDoc(id, 2);
      if (res?.data?.code !== 200) {
        message.error(res?.data?.message);
        // throw {message: res?.data?.message};
      }
      mutate();
    } catch (error: any) {
      message.error(error?.message ?? "Đã có lỗi xảy ra");
    }
  };
  const dataTable = data
    ? data?.data?.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];
  const columns = defaultColumns.map(item => {
    if (item.key === 1) {
      return {
        ...item,

        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 10) {
      return {
        ...item,

        render: (_: any, _record: any) => (
          <>
            <ListButtonActionUpdate
              editFunction={() => {
                navigate(
                  FAST_EXPERTISE_VEHICLE_EDIT.replace(":id", _record?.assetId)
                );
                // handleOpenEditModal(_record);
              }}
              removeFunction={() => {
                removeRecord(_record?.assetId);
              }}
            />
          </>
        ),
      };
    } else return {...item};
  });

  return (
    <div>
      <Card className="card-container" size="small">
        <div style={{marginBottom: "4px"}}>
          <CardTitleCustomUpdate
            title="Danh sách định giá nhanh xe"
            addFunction={() => {
              dispatch(setType("create"));
              navigate(FAST_EXPERTISE_VEHICLE_CREATE);
            }}
          />
        </div>
        <TableCustom
          dataSource={dataTable}
          columns={columns as any[]}
          bordered={true}
          isLoading={isLoading}
          limit={params?.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={data?.totalCount || 0}
          onLimitChange={limit => {
            setParams({...params, limit});
          }}
          onPageChange={page => {
            setParams({...params, page: page});
          }}
          page={params.page ?? 1}
          scroll={{ x: 1600, y: "70vh" }}
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: event => {
                navigate(
                  FAST_EXPERTISE_VEHICLE_VIEW.replace(":id", record?.assetId)
                );
                // handleOpenEditModal(_record);
              },
            };
          }}
        />
      </Card>
    </div>
  );
};
export default VehicleTable;
