import { Card, message } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultColumns } from "./config";
import { randomId } from "utils";
import {
  FAST_EXPERTISE_LAND_TOWNHOUSE_CREATE,
  FAST_EXPERTISE_LAND_TOWNHOUSE_EDIT,
  FAST_EXPERTISE_LAND_TOWNHOUSE_VIEW,
} from "routes/route.constant";
import { useFastValuation } from "utils/request/useFastValuation";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { fastExpertiseApi } from "apis/fastExpertise";
import { useAppDispatch } from "configs/hooks";
import { setType } from "pages/FastExpertise/Store/fastExpertise";
import { ASSET_PRICES_SHARED_TYPE, BUTTON_CODES } from "constant/common";
import BlockUser from "pages/BlockUser";

const LandTownHouseTable = ({ filters }: any) => {
  const navigate = useNavigate();
  const [params, setParams] = useState<any>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const dispatch = useAppDispatch();
  const { data, isLoading, mutate } = useFastValuation(
    { ...params, page: params.page },
    {
      ...filters,
      isFastValuation: true,
      assetType: ASSET_PRICES_SHARED_TYPE.PLAN_USING,
      page: params.page,
    }
  );

  const prevParamsRef = useRef<any>(params);

  useLayoutEffect(() => {
    if (
      params?.page !== undefined &&
      params?.page > 1 &&
      params?.limit !== undefined &&
      params?.limit >= 5 &&
      params.limit !== prevParamsRef.current.limit
    ) {
      setParams({
        ...params,
        limit: params.limit,
        page: 1,
      });
    }
  }, [params]);

  useEffect(() => {
    prevParamsRef.current = params;
  }, [params]);

  const removeRecord = async (id: any) => {
    try {
      const res = await fastExpertiseApi.deleteDoc(
        id,
        ASSET_PRICES_SHARED_TYPE.PLAN_USING
      );
      if (res?.data?.code !== 200) {
        message.error(res?.data?.message);
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

  const columns = defaultColumns.map((item) => {
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
                  FAST_EXPERTISE_LAND_TOWNHOUSE_EDIT.replace(
                    ":id",
                    _record?.assetId
                  )
                );
              }}
              removeFunction={() => {
                removeRecord(_record?.assetId);
              }}
            />
          </>
        ),
      };
    } else return { ...item };
  });
  if (data?.code === 403) {
    return <BlockUser />;
  }
  return (
    <div>
      <Card className="card-container" size="small">
        <div style={{ marginBottom: "4px" }}>
          <CardTitleCustomUpdate
            title="Danh sách định giá nhanh nhà phố - đất ở"
            addFunction={() => {
              dispatch(setType("create"));
              navigate(FAST_EXPERTISE_LAND_TOWNHOUSE_CREATE);
            }}
            addButtonCode={BUTTON_CODES.dgn_bds_them}
          />
        </div>
        <TableCustom
          dataSource={dataTable}
          columns={columns as any[]}
          bordered={true}
          isLoading={isLoading}
          limit={params?.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={data?.totalCount || 0}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page: page });
          }}
          onSorterChange={(sorter) => {
            setParams((prev: any) => ({
              ...prev,
              sortField: sorter?.sortBy,
              direction: sorter?.sortType === "ASC" ? 0 : 1,
            }));
          }}
          page={params.page ?? 1}
          scroll={{ x: 1600, y: "70vh" }}
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: (event) => {
                navigate(
                  FAST_EXPERTISE_LAND_TOWNHOUSE_VIEW.replace(
                    ":id",
                    record?.assetId
                  )
                );
              },
            };
          }}
        />
      </Card>
    </div>
  );
};
export default LandTownHouseTable;
