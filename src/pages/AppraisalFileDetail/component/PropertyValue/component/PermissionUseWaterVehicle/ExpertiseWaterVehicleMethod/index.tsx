import { Form, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
import renderRequired from "components/RenderRequire";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { TablePPType } from "constant/types/appraisalFile";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APPENDIX_METHODS } from "routes/route.constant";
import { randomId } from "utils/string";

const { SELECT, INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  tablePP: Array<TablePPType>;
};
type RefProps = {
  updateExpertiseWaterVehicleMethod: () => void;
};
export const ExpertiseWaterVehicleMethod = forwardRef<RefProps, Props>(
  ({ tablePP }, ref) => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState<TablePPType[]>([]);

    useImperativeHandle(ref, () => ({
      updateExpertiseWaterVehicleMethod: () => dataSource,
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
        align: "center",
        render: (_, record, index) => index + 1,
      },
      {
        key: 2,
        title: "Tài sản",
        dataIndex: "assetName",
      },
      {
        key: 3,
        title: "Chi tiết",
        dataIndex: "assetGrandChildName",
      },
      {
        key: 4,
        title: renderRequired("Phương pháp định giá"),
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
              allowClear={false}
              onChange={(value: number) =>
                handleChangeValuationMethod(value, record.key)
              }
            />
          );
        },
      },
      {
        key: 5,
        title: "Đơn giá (đồng)",
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
        key: 6,
        title: "Xem chi tiết phụ lục PPĐG",
        render: (_, record) => {
          return (
            <Typography.Link
              underline
              onClick={() => {
                localStorage.setItem("RELOAD", "true");
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
                });
              }}
            >
              Xem chi tiết phụ lục PPĐG
            </Typography.Link>
          );
        },
      },
    ];
    return (
      <Form labelWrap labelAlign="left" size="small">
        <Table
          columns={columns}
          bordered
          dataSource={dataSource}
          pagination={false}
        />
      </Form>
    );
  }
);
