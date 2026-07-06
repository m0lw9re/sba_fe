import { Empty, Form, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
import renderRequired from "components/RenderRequire";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { TablePPType } from "constant/types/appraisalFile";
import { useFormik } from "formik";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APPENDIX_METHODS } from "routes/route.constant";
import { randomId } from "utils/string";
import * as Yup from "yup";

const { SELECT, INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  tablePP: Array<TablePPType>;
  fileStatus?: number;
};
type RefProps = {
  updateExpertiseLandMethod: () => void;
};

const formSchema = Yup.array().of(
  Yup.object().shape({
    assetValuationMethodId: Yup.string()
      .required("Vui lòng nhập phương pháp ĐG")
      .typeError("Vui lòng nhập phương pháp ĐG"),
  })
);
export const ExpertiseLandMethod = forwardRef<RefProps, Props>(
  ({ tablePP, fileStatus }, ref) => {
    const navigate = useNavigate();

    const formControl = useFormik({
      initialValues: tablePP || ([] as TablePPType[]),
      validationSchema: formSchema,
      onSubmit: (data: any): any => {
        return data;
      },
    });

    useImperativeHandle(ref, () => ({
      updateExpertiseLandMethod: async () => await formControl.submitForm(),
    }));

    const { startProcessReportDate } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );

    useEffect(() => {
      if (tablePP) {
        const tmpArr = tablePP.map((item) => ({ ...item, key: randomId() }));
        formControl.setValues(tmpArr);
      }
    }, [tablePP]);

    const handleChangeValuationMethod = (
      valuationMethodId: number,
      key?: string
    ) => {
      const tmpDataSource = [...formControl.values];
      const foundIndex = tmpDataSource.findIndex((el) => el.key === key);
      if (foundIndex === -1) return;

      tmpDataSource[foundIndex].valuationMethodDetails.forEach((el: any) => {
        if (el.isCurrent) el.isCurrent = false;
        if (el.valuationMethodId === valuationMethodId) el.isCurrent = true;
      });

      formControl.setValues(tmpDataSource);
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
        title: renderRequired("Tài sản"),
        dataIndex: "assetName",
      },
      {
        key: 3,
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
              error={formControl.errors}
              value={val}
              onChange={(value: number) =>
                handleChangeValuationMethod(value, record.key)
              }
            />
          );
        },
      },
      {
        key: 4,
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
          dataSource={formControl.values}
          pagination={false}
        />
      </Form>
    );
  }
);
