import { Empty, Form, Typography } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { randomId } from "utils/string";
import { DynamicTable } from "components/DynamicTable";
import { TablePPType } from "constant/types/appraisalFile";
import { ColumnsType } from "antd/es/table";
import { TYPE_FIELD } from "constant/enums";
import FormItem from "components/InputFields/FormItem";
import { APPENDIX_METHODS } from "routes/route.constant";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

const { SELECT, INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  tablePP: Array<TablePPType>;
};
type RefProps = {
  updateExpertiseLandMethod: () => void;
};
export const ExpertiseLandMethod = forwardRef<RefProps, Props>(
  ({ tablePP }, ref) => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState<TablePPType[]>([]);

    useImperativeHandle(ref, () => ({
      updateExpertiseLandMethod: () => dataSource,
    }));

    const { startProcessReportDate } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );

    useEffect(() => {
      if (tablePP) {
        setDataSource(tablePP.map((item) => ({ ...item, key: randomId() })));
      }
    }, [tablePP]);

    const handleChangeValuationMethod = (
      valuationMethodId: number,
      key?: string
    ) => {
      const tmpDataSource = [...dataSource];
      const foundIndex = tmpDataSource.findIndex((el) => el.key === key);
      if (foundIndex === -1) return;

      tmpDataSource[foundIndex].valuationMethodDetails.forEach((el) => {
        if (el.isCurrent) el.isCurrent = false;
        if (el.valuationMethodId === valuationMethodId) el.isCurrent = true;
      });

      setDataSource(tmpDataSource);
    };

    const columns: ColumnsType<TablePPType> = [
      {
        key: 1,
        title: "STT",
        width: "5%",
        render: (_, record, index) => index + 1,
      },
      {
        key: 2,
        title: "Tài sản",
        dataIndex: "assetName",
      },
      {
        key: 3,
        title: "Căn hộ",
        dataIndex: "assetChildName",
      },
      {
        key: 5,
        title: "Phương pháp định giá",
        dataIndex: "assetValuationMethodId",
        render: (assetValuationMethodId, record) => {
          let val = null;
          const obj: any = record.valuationMethodDetails.find(
            (el) => el.isCurrent
          );
          if (obj) val = obj.valuationMethod.valuationMethodId;

          const options = record.valuationMethodDetails?.map((item) => ({
            label: item.valuationMethod.valuationMethodName,
            value: item.valuationMethod.valuationMethodId,
          }));

          return (
            <FormItem
              type={SELECT}
              options={options}
              value={val}
              onChange={(value: number) =>
                handleChangeValuationMethod(value, record.key)
              }
            />
          );
        },
      },
      {
        key: 6,
        title: "Đơn giá (đồng/m²)",
        render: (_, record) => {
          let val = null;
          const obj: any = record.valuationMethodDetails.find(
            (el) => el.isCurrent
          );
          if (obj) val = obj.unitPrice;
          return (
            <FormItem
              disable
              align="right"
              type={INPUT_NUMBER}
              currencable
              isRounded
              value={val}
            />
          );
        },
      },
      {
        key: 7,
        title: "",
        render: (_, record) => {
          return (
            <Typography.Link
              underline
              onClick={() =>
                navigate(APPENDIX_METHODS, {
                  state: {
                    appraisalFileId: record.appraisalFileId,
                    assetLevelTwoId: record.assetLevelTwoId,
                    assetId: record.assetId,
                    assetChildId: record.assetChildId,
                    assetGrandChildId: record.assetGrandChildId,
                    valuationMethodDetailId: record.valuationMethodDetails.find(
                      (el) => el.isCurrent
                    )?.valuationMethodDetailId,
                    valuationMethodId: record.valuationMethodDetails.find(
                      (el) => el.isCurrent
                    )?.valuationMethodId,
                    startProcessReportDate,
                  },
                })
              }
            >
              Chi tiết phụ lục PPĐG
            </Typography.Link>
          );
        },
      },
    ];
    if (tablePP.length === 0)
      return (
        <Empty
          style={{ minHeight: "200px" }}
          description={
            <Typography.Text style={{ fontWeight: 500, fontSize: "16px" }}>
              Vui lòng thêm mục đích sử dụng đất ở Thông tin tài sản
            </Typography.Text>
          }
        />
      );
    return (
      <Form labelWrap labelAlign="left" size="small">
        <DynamicTable
          columns={columns}
          dataSource={dataSource}
          onAddRow={() => {}}
          onRemoveRow={() => {}}
        />
      </Form>
    );
  }
);
