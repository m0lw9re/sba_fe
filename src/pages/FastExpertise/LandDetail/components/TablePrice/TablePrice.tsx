import {Table} from "antd";
import {useAppSelector} from "configs/hooks";
import React, {useEffect, useState} from "react";
import {columns, dataSource1Init, dataSource3Init} from "./config";
import {toNumber} from "utils/format";
import {randomId} from "utils/string";
const TablePrice = () => {
  const [dataSource1, setDataSource1] = useState<any[]>(dataSource1Init);
  const [dataSource3, setDataSource3] = useState<any[]>(dataSource3Init);
  const [dataSource, setDataSource] = useState<any[]>([...dataSource1]);
  const [dataSource2, setDataSource2] = useState<any[]>([]);
  const assetInfo = useAppSelector(state => state.fastExpertiseSlice.assetInfo);
  useEffect(() => {
    const _setDataSource2 = (constructions: any) => {
      let _dataSource2 = constructions.map((e: any) => ({
        key: randomId(),
        type: `${e?.type || "-"}${e?.name ? `/${e?.name}` : ""} ${
          e?.clcl != null ? `(CLCL: ${e.clcl} %)` : ""
        }`,
        area: e?.area,
        price: e?.unitPrice,
        value: e?.value,
      }));
      if (constructions.length > 0) {
        _dataSource2 = [
          ..._dataSource2?.filter((e: any) => e?.type !== "null "),
          {
            type: "Tổng giá trị công trình xây dựng (đồng)",
            area: null,
            price: null,
            value: toNumber(assetInfo?.constructionPrice),
          },
        ];
      }

      setDataSource2([..._dataSource2]);
    };
    _setDataSource2(assetInfo?.constructions || []);
  }, [assetInfo]);
  useEffect(() => {
    const _setDataSource1 = (assetInfo: any) => {
      dataSource1Init[0].area = assetInfo?.areaInplan;
      dataSource1Init[0].price = assetInfo?.estimatePrice;
      dataSource1Init[0].value =
        toNumber(assetInfo?.areaInplan) * toNumber(assetInfo?.estimatePrice);
      dataSource1Init[1].area = assetInfo?.areaUnplan;
      dataSource1Init[1].price = assetInfo?.unPlanPrice;
      dataSource1Init[1].value =
        toNumber(assetInfo?.areaUnplan) * toNumber(assetInfo?.unPlanPrice);
      dataSource1Init[2].value = assetInfo?.landPrice;

      setDataSource1([...dataSource1Init]);
    };
    _setDataSource1(assetInfo);
  }, [assetInfo]);

  useEffect(() => {
    const _setDataSource3 = () => {
      dataSource3Init[0].value = assetInfo?.totalValue;

      setDataSource3([...dataSource3Init]);
    };
    _setDataSource3();
  }, [assetInfo]);

  useEffect(() => {
    const _setDataSource = () => {
      setDataSource([...dataSource1, ...dataSource2, ...dataSource3]);
    };
    _setDataSource();
  }, [dataSource1, dataSource2, dataSource3]);

  return (
    <div>
      <Table
        className="table-value-fast"
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      ></Table>
    </div>
  );
};
export default TablePrice;
