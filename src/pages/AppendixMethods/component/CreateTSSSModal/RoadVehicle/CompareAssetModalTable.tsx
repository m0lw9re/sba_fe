import { Checkbox } from "antd";
import { ColumnsType } from "antd/es/table";
import TableCustom from "components/TableCustom";
import {
  ASSET_LV2,
  LOCAL_STORAGE_KEY,
  PAGE_SIZE_OPTIONS,
} from "constant/enums";
import { FilterAssetMoveableEstateType } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import CompareAssetFilter from "pages/AppendixMethods/component/CreateTSSSModal/AssetMoveableEstateFilter";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { addMonthsToDate, numberUtils } from "utils";
import { usePriceAssets } from "utils/request";
import "./style.scss";
import ButtonCustom from "components/ButtonCustom";
import Icons from "assets/icons";

type Props = {
  selectedTSSS: any[];
  setSelectedTSSS: any;
  tabIndex: string;
  assetType: number;
  assetLevelThreeId?: number;
  setAssetForCopy: (data: any) => void;
};

const RoadVehicleCompareAssetModalTable = (props: Props) => {
  const location = useLocation();
  const assetLevelTwoId = location.state?.assetLevelTwoId;
  const {
    selectedTSSS,
    setSelectedTSSS,
    tabIndex,
    assetType,
    assetLevelThreeId,
    setAssetForCopy,
  } = props;

  const filterRef = useRef<any>(null);
  const [filters, setFilters] = useState<FilterAssetMoveableEstateType>({
    assetType,
    approved: true,
    dateFrom: null,
    dateTo: null,
    assetLevelThreeId:
      assetLevelTwoId === ASSET_LV2.VEHICLE ||
      assetLevelTwoId === ASSET_LV2.WATER_VEHICLE
        ? assetLevelThreeId
        : undefined,
  });
  const [params, setParams] = useState<CommonGetAllParams>({
    count: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  // useEffect(() => {
  //   setParams({ ...params, page: 1 });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [filters]);
  const { data, isLoading, mutate } = usePriceAssets(
    { ...params, page: params?.page ? params.page - 1 : 0 },
    { ...filters, approved: true }
  );

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: " ",
      width: 30,
      align: "center",
      dataIndex: "assetId",
      render: (assetId) => (
        <Checkbox
          checked={selectedTSSS.includes(assetId)}
          onClick={(e: any) => {
            e.stopPropagation();
            if (selectedTSSS.includes(assetId)) {
              setSelectedTSSS(selectedTSSS.filter((item) => item !== assetId));
            } else {
              setSelectedTSSS((prev: any[]) => [...prev, assetId]);
            }
          }}
        />
      ),
    },
    {
      key: 2,
      title: "Mã tài sản",
      dataIndex: "assetCode",
    },
    {
      key: 3,
      title: "Số loại",
      dataIndex: "",
    },
    {
      key: 4,
      title: "Năm sản xuất",
      dataIndex: "yearMfg",
    },
    {
      key: 5,
      title: "Nước sản xuất",
      dataIndex: "countryMfg",
    },
    {
      key: 7,
      title: "Đơn giá (đồng)",
      dataIndex: "landUnitPrice",
      align: "right",
      render: (landUnitPrice) => (
        <>{landUnitPrice ? numberUtils.formatNumber(landUnitPrice) : ""}</>
      ),
    },
    {
      key: 8,
      title: "Giá thương lượng (đồng)",
      dataIndex: "estimatePrice",
      align: "right",
      render: (estimatePrice) => (
        <>{estimatePrice ? numberUtils.formatNumber(estimatePrice) : ""}</>
      ),
    },
    {
      key: 9,
      title: "Giá rao bán (đồng)",
      dataIndex: "transactionPrice",
      align: "right",
      render: (transactionPrice) => numberUtils.formatNumber(transactionPrice),
    },
    {
      key: 10,
      title: "Ngày tạo",
      align: "center",
      dataIndex: "dateCreate",
      render: (dateCreate: string) => (
        <>{dateCreate ? addMonthsToDate(dateCreate, 0) : null}</>
      ),
    },
    {
      key: 11,
      title: "",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            justifyItems: "center",
          }}
        >
          <ButtonCustom
            bgColor="#00b335"
            size="small"
            icon={<Icons.copy style={{ color: "#FFFFFF" }} />}
            onClick={() => {
              const newConvertedData = {
                ...record,
                assetCode: null,
                assetId: null,
                approved: false,
                addressProvince:
                  record?.provinces?.code ||
                  record?.addressProvince ||
                  record.provinceId,
                addressWard:
                  record?.wards?.code || record?.addressWard || record.wardId,
                addressDistrict:
                  record?.districts?.code ||
                  record?.addressDistrict ||
                  record.districtId,
                remainQuality: record.remainQuality * 100,
              };
              setAssetForCopy(newConvertedData);
            }}
          />
        </div>
      ),
      width: 40,
    },
  ];
  const onKeyDown = (e: any) => {
    filterRef?.current?.onKeyDown(e);
  };
  useEffect(() => {
    if (tabIndex === "1") {
      // reload data
      mutate();
    }
  }, [tabIndex]);

  return (
    <div
      style={{
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div style={{ marginBottom: "4px" }}>
        <CompareAssetFilter
          filters={filters}
          setFilters={(filterValue) => {
            setFilters({ ...filters, ...filterValue });
            setParams({ ...params, page: 1 });
          }}
          assetType={assetType}
          ref={filterRef}
        />
      </div>
      <TableCustom
        columns={columns}
        dataSource={data?.data}
        bordered={true}
        isLoading={!data && isLoading}
        limit={params.count || PAGE_SIZE_OPTIONS.OPTION_10}
        total={data ? data.totalCount : 0}
        onLimitChange={(limit) => {
          setParams({ ...params, count: limit });
        }}
        onPageChange={(page) => {
          setParams({ ...params, page });
        }}
        page={params.page || 1}
      />
    </div>
  );
};

export default RoadVehicleCompareAssetModalTable;
