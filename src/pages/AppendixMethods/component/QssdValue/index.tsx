import TableInputAdd from "components/TableInputAddCustom/TableInputAddCustom";
import { TableKQDatProjectType } from "constant/types/appraisalFile";
import { useFormik } from "formik";
import { TYPE_FIELD } from "constant/enums";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import * as Yup from "yup";
import { randomId } from "utils";
import {
  defaultColumns,
  renderTotalLandValues,
  defaultColumnsValuationResult,
} from "./config";
import "./index.scss";

type Props = {
  data: Array<TableKQDatProjectType>;
  appraisalFileId: string;
  assetId: string;
  assetChildId: number;
};

type RefProps = {
  updateQssdValue: () => void;
};

type FormType = {
  tableKQDat: Array<TableKQDatProjectType>;
  valuationResult: Array<TableKQDatProjectType>;
};

const formSchema = Yup.object().shape({
  tableKQDat: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required("Vui lòng nhập tên tài sản")
        .typeError("Vui lòng nhập tên tài sản"),
      totalArea: Yup.number()
        .required("Vui lòng nhập diện tích")
        .typeError("Vui lòng nhập diện tích"),
      unitPrice: Yup.number()
        .required("Vui lòng nhập giá trị")
        .typeError("Vui lòng nhập giá trị"),
      totalValue: Yup.number()
        .required("Vui lòng nhập giá trị")
        .typeError("Vui lòng nhập giá trị"),
    })
  ),
  valuationResult: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required("Vui lòng nhập tên tài sản")
        .typeError("Vui lòng nhập tên tài sản"),
    })
  ),
});

const QssdValue = forwardRef<RefProps, Props>(
  ({ data, appraisalFileId, assetChildId, assetId }, ref) => {
    const formControl = useFormik({
      initialValues: {
        tableKQDat: [],
        valuationResult: [],
      } as FormType,
      validationSchema: formSchema,
      onSubmit: (data: FormType): any => {
        return { tableKQDat: [...data.tableKQDat, ...data.valuationResult] };
      },
    });

    useImperativeHandle(ref, () => ({
      updateQssdValue: async () => {
        await formControl.submitForm();
        if (
          formControl.errors.tableKQDat ||
          formControl.errors.valuationResult
        ) {
          return [
            [
              ...formControl.values.tableKQDat,
              ...formControl.values.valuationResult,
            ],
            false,
          ];
        }
        return [
          [
            ...formControl.values.tableKQDat,
            ...formControl.values.valuationResult,
          ],
          true,
        ];
      },
    }));

    useEffect(() => {
      if (data) {
        const tableKQDat = data.filter(
          (item) => !item.isValuationResultProject
        );
        const valuationResult = data.filter(
          (item) => item.isValuationResultProject
        );
        formControl.setValues({
          ...formControl.values,
          tableKQDat,
          valuationResult,
        });
      }
    }, [data]);

    const handleChange = useCallback(
      (data: TableKQDatProjectType[]) => {
        formControl.setValues({
          ...formControl.values,
          tableKQDat: data?.map((el: any) => ({
            ...el,
            totalValue: Math.round(el.totalArea * el.unitPrice),
          })),
        });
      },
      [formControl.values]
    );

    const handleChangeValuationResult = useCallback(
      (data: TableKQDatProjectType[]) => {
        formControl.setValues({
          ...formControl.values,
          valuationResult: data,
        });
      },
      [formControl.values]
    );

    const handleAdd = (typeChange: number) => {
      const tmpArr =
        typeChange === 1
          ? [...formControl.values.tableKQDat]
          : [...formControl.values.valuationResult];
      const newItem: TableKQDatProjectType = {
        key: randomId(),
        appraisalFileId: appraisalFileId,
        assetId: assetId,
        assetChildId: assetChildId,
        name: null,
        totalArea: null,
        unitPrice: null,
        totalValue: null,
        assetGrandChildId: null,
        isValuationResultProject: typeChange === 1 ? null : true,
      };

      tmpArr.push(newItem);
      typeChange === 1
        ? formControl.setValues({
            ...formControl.values,
            tableKQDat: tmpArr,
          })
        : formControl.setValues({
            ...formControl.values,
            valuationResult: tmpArr,
          });
    };

    const handleRemove = (key: string, typeChange: number) => {
      const formData =
        typeChange === 1
          ? formControl.values.tableKQDat
          : formControl.values.valuationResult;
      const foundIndex = formData?.findIndex((el: any) => el?.key === key);
      if (foundIndex === -1) return -1;
      const newData = [...formData];
      newData.splice(foundIndex, 1);
      typeChange === 1
        ? handleChange(newData)
        : handleChangeValuationResult(newData);
    };

    const handleCopyRow = (index: number, typeChange: number) => {
      const formData =
        typeChange === 1
          ? formControl.values.tableKQDat
          : formControl.values.valuationResult;
      const newData = [...formData];
      const newItem = {
        ...newData[index],
        appraisalFileId: appraisalFileId,
        assetId: assetId,
        assetChildId: assetChildId,
        valuationResultLandEstateId: null,
        key: randomId(),
      };
      newData.push(newItem);
      typeChange === 1
        ? handleChange(newData)
        : handleChangeValuationResult(newData);
    };

    const projectFormErr = formControl.errors.tableKQDat;
    const projectFormTouched = formControl.touched.tableKQDat;
    const valuationResultProjectFormErr = formControl.errors.valuationResult;
    const valuationResultProjectFormTouched =
      formControl.touched.valuationResult;

    const columns = defaultColumns.map((column) => {
      if (column.key === 2) {
        return {
          ...column,
          error: projectFormErr,
          touched: projectFormTouched,
        };
      } else if (column.key === 3) {
        return {
          ...column,
          error: projectFormErr,
          touched: projectFormTouched,
        };
      } else if (column.key === 4) {
        return {
          ...column,
          error: projectFormErr,
          touched: projectFormTouched,
        };
      } else {
        return {
          ...column,
        };
      }
    });

    const columnsValuationResult = defaultColumnsValuationResult.map(
      (column) => {
        if (column.key === 2) {
          return {
            ...column,
            error: valuationResultProjectFormErr,
            touched: valuationResultProjectFormTouched,
          };
        } else {
          return {
            ...column,
          };
        }
      }
    );

    return (
      <>
        <TableInputAdd
          data={formControl.values.tableKQDat}
          setData={handleChange}
          handleAdd={() => handleAdd(1)}
          column={columns}
          handleRemove={(key) => handleRemove(key, 1)}
          isCheckbox={false}
          handleCopy={(index) => handleCopyRow(index, 1)}
        />
        <br />
        <TableInputAdd
          data={formControl.values.valuationResult}
          setData={handleChangeValuationResult}
          handleAdd={() => handleAdd(0)}
          column={columnsValuationResult}
          handleRemove={(key) => handleRemove(key, 0)}
          isCheckbox={false}
          handleCopy={(index) => handleCopyRow(index, 0)}
        />

        <div className="total-land-value">
          {renderTotalLandValues([
            ...formControl.values?.tableKQDat?.map((el: any) => el.totalValue),
            ...formControl.values?.valuationResult?.map(
              (el: any) => el.totalValue
            ),
          ])}
        </div>
      </>
    );
  }
);

export default QssdValue;
