import {
  Card,
  Row,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import "pages/Prices/subcomponents/AssetsTable/style.scss";
import { columnsTableAssets, DataItem } from "./config";
import PopupCreateAssset from "../PopupCreateAsset";
import { useDispatch, useSelector } from "react-redux";
import { getAssetLv1 } from "../PriceMenu/store/PriceMenuSlice";
import { useParams } from "react-router-dom";
import { RootState } from "configs/configureStore";
import PricesFilter from "../PricesFilter";
import TableCustom from "components/TableCustom";

const AssetsTable = () => {
  const dispatch = useDispatch();
  const listAsset = useSelector((state: RootState) => state.getMenuPrice)
  const params = useParams();
  const [dataTable, setDataTable] = useState<Array<DataItem>>();
  let id: number = params.id ? Number(params.id) : 1;
  useEffect(() => {
    dispatch(getAssetLv1(id))
  }, [id])

  useEffect(() => {
    if (listAsset.assetLv1.data) {
      const listData = listAsset.assetLv1?.data?.map((item: any, index: number) => {
        return {
          key: index,
          code: item?.assetCode,
          type: item?.assetLevelOneName,
          author: item?.valueRiskDescribe,
          paperNumber: item?.legalInformationNumber,
          tranhChap: item?.isDispute === 1 ? true : false,
          status: item?.status,
        }
      })
      setDataTable(listData)
    }
  }, [listAsset.assetLv1])
  return (
    <Card className="card-asset-table">
      <Space direction="vertical" className="asset-table-space" size={"middle"}>
        <Row justify={"space-between"}>
          <Typography style={{ fontWeight: "bold", fontSize: "16px" }}>
            QSDĐ và tài sản gắn liền với đất
          </Typography>
          <PopupCreateAssset />
        </Row>
        <PricesFilter />
        <TableCustom
          bordered={true}
          columns={columnsTableAssets}
          dataSource={dataTable || []}
          isLoading={false}
          page={listAsset.assetLv1.limit || 1}
          total={listAsset.assetLv1.limit || 0}
          onLimitChange={(limit) => {
          }}
          onPageChange={(page) => {
          }}
          limit={10}
        />
      </Space>
    </Card>
  );
};

export default AssetsTable;
