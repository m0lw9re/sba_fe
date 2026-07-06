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
  fileStatus?: number;
};
type RefProps = {
  updateExpertiseLandMethod: () => void;
};
export const ExpertiseLandMethod = forwardRef<RefProps, Props>(
  ({ tablePP, fileStatus }, ref) => {
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
        title: "Thửa đất",
        dataIndex: "assetChildName",
      },
      {
        key: 4,
        title: "Chi tiết tài sản",
        dataIndex: "assetGrandChildName",
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
        title: "Đơn giá PHQH (đồng/m²)",
        render: (_, record) => {
          let val = null;
          const obj: any = record.valuationMethodDetails.find(
            (el) => el.isCurrent
          );
          if (obj)
            val =
              record.assetGrandChildId >= 0
                ? obj.unitPriceInPlan
                : obj.unitPriceAreaNotConsiderValue;
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
        title: "Đơn giá KPHQH (đồng/m²)",
        render: (_, record) => {
          let val = null;
          const obj: any = record.valuationMethodDetails.find(
            (el) => el.isCurrent
          );
          if (obj) val = obj.unitPriceUnPlan;
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
        key: 8,
        title: "",
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
                    fileStatus: fileStatus,
                    startProcessReportDate,
                  },
                  replace: true,
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
