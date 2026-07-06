/* eslint-disable react/jsx-pascal-case */
import { Checkbox } from "antd";
import { ColumnsType } from "antd/es/table";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { FilterSpecificPricesType } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { addMonthsToDate, numberUtils } from "utils";
import { usePriceAssets } from "utils/request";
import ListTSSSFilter from "./PriceSpecificFilter";
import "./style.scss";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import ButtonCustom from "components/ButtonCustom";
import Icons from "assets/icons";

type Props = {
  selectedTSSS: any[];
  setSelectedTSSS: (data: any[]) => void;
  tabIndex: string;
  assetType: number;
  filters: FilterSpecificPricesType;
  setFilters: (filters: FilterSpecificPricesType) => void;
  setAssetForCopy: (data: any) => void;
};

const CompareAssetModalTable = (props: Props) => {
  const {
    selectedTSSS,
    setSelectedTSSS,
    tabIndex,
    assetType,
    setAssetForCopy,
  } = props;

  const filterRef = useRef<any>(null);
  const [filters, setFilters] = useState<FilterSpecificPricesType>({
    assetType,
    approved: true,
    dateFrom: null,
    dateTo: null,
  });
  const [params, setParams] = useState<CommonGetAllParams>({
    count: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const { data, isLoading, mutate } = usePriceAssets(
    { ...params, page: params?.page ? params.page - 1 : 0 },
    { ...filters, approved: true }
  );

  const dataIndexForUnitPrice = () => {
    switch (assetType) {
      // Căn hộ chung cư
      case ASSET_PRICES_SHARED_TYPE.APARTMENT:
        return "unitPrice";
      default:
        return "landUnitPrice";
    }
  };

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    setParams({ ...params, page: 1 });
    props.setFilters({
      ...props.filters,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.filters)]);

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

  const renderTotalArea = (): any => {
    if (assetType === ASSET_PRICES_SHARED_TYPE.PLAN_USING) {
      return {
        key: 6,
        title: "Diện tích khuôn viên (m²)",
        dataIndex: "areaWidth",
        render: (areaWidth: any) =>
          areaWidth ? numberUtils.formatNumber(areaWidth) : areaWidth,
        align: "right",
        width: 80,
      };
    } else if (assetType === ASSET_PRICES_SHARED_TYPE.APARTMENT) {
      return {
        key: 6,
        title: "Diện tích sử dụng riêng (m²)",
        dataIndex: "privateUseArea",
        render: (privateUseArea: any) =>
          privateUseArea
            ? numberUtils.formatNumber(privateUseArea)
            : privateUseArea,
        align: "right",
        width: 80,
      };
    } else {
      return {
        key: 6,
        title: "Diện tích khuôn viên (m²)",
        dataIndex: "areaWidth",
        render: (areaWidth: any) =>
          areaWidth ? numberUtils.formatNumber(areaWidth) : areaWidth,
        align: "right",
        width: 80,
      };
    }
  };

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: "#",
      width: 30,
      align: "center",
      fixed: "left",
      dataIndex: "assetId",
      render: (assetId) => (
        <Checkbox
          checked={selectedTSSS.includes(assetId)}
          onClick={(e) => {
            e.stopPropagation();
            if (selectedTSSS.includes(assetId)) {
              setSelectedTSSS(selectedTSSS.filter((item) => item !== assetId));
            } else {
              setSelectedTSSS([...selectedTSSS, assetId]);
            }
          }}
        />
      ),
    },
    {
      key: 2,
      title: "Mã tài sản",
      dataIndex: "assetCode",
      width: 120,
    },
    {
      key: 4,
      title: "Địa chỉ",
      dataIndex: "address",
      width: 250,
    },
    {
      ...renderTotalArea(),
    },
    {
      key: 7,
      title: "Đơn giá (đồng/m²)",
      dataIndex: dataIndexForUnitPrice(),
      align: "right",
      render: (landUnitPrice) => (
        <>{landUnitPrice ? numberUtils.formatNumber(landUnitPrice) : ""}</>
      ),
      width: 70,
    },
    {
      key: 8,
      title: "Giá rao bán (đồng)",
      dataIndex: "estimatePrice",
      align: "right",
      render: (estimatePrice) => (
        <>{estimatePrice ? numberUtils.formatNumber(estimatePrice) : ""}</>
      ),
      width: 100,
    },
    {
      key: 10,
      title: "Thông tin liên hệ",
      dataIndex: "contact",
      width: 100,
    },
    {
      key: 11,
      title: "Ngày tạo",
      align: "center",
      dataIndex: "dateCreate",
      render: (dateCreate: string) => (
        <>{dateCreate ? addMonthsToDate(dateCreate, 0) : null}</>
      ),
      width: 80,
    },
    {
      key: 12,
      title: "Giá thương lượng (đồng)",
      dataIndex: "transactionPrice",
      align: "right",
      fixed: "right",
      render: (transactionPrice) => numberUtils.formatNumber(transactionPrice),
      width: 100,
    },
    {
      key: 13,
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
                  record?.provinces?.code || record?.addressProvince,
                addressDistrict:
                  record?.districts?.code || record?.addressDistrict,
                addressWard: record?.wards?.code || record?.addressWard,
                remainQuality: record?.remainQuality * 100,
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
        <ListTSSSFilter
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
        dataSource={data?.data || []}
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
        scroll={{
          x: 1400,
        }}
        page={params.page || 1}
      />
    </div>
  );
};

export default CompareAssetModalTable;
