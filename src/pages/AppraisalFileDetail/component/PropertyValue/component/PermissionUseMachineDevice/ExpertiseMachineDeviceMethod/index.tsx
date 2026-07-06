import { Empty, Form, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
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
  assetLevelThreeId: number;
};
type RefProps = {
  updateExpertiseMachineDeviceMethod: () => void;
};
export const ExpertiseMachineDeviceMethod = forwardRef<RefProps, Props>(
  ({ tablePP, assetLevelThreeId }, ref) => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState<TablePPType[]>([]);

    useImperativeHandle(ref, () => ({
      updateExpertiseMachineDeviceMethod: () => dataSource,
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
        key: 4,
        title: "Chi tiết tài sản",
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
        key: 7,
        title: "Chi tiết",
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
                    assetLevelThreeId: assetLevelThreeId,
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
