/* eslint-disable react-hooks/exhaustive-deps */
import { Radio, Space } from "antd";
import TableInputAdd from "components/TableInputAddCustom/TableInputAddCustom";
import { useFormik } from "formik";
import "./style.scss";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { randomId } from "utils";
import { isDeepEqual, validLengthInput } from "utils/validate";
import * as Yup from "yup";
import { defaultColumns } from "./config";
import { DescribeProjectType } from "constant/types/asset";

type Props = {
  detailDescribes: Array<DescribeProjectType>;
  visible: boolean;
  assetLandInforId: number | string | null;
  setVisible: (value: boolean) => void;
};
type RefProps = {
  getData: () => void;
};

const formSchema = Yup.object().shape({
  describes: Yup.array()
    .of(
      Yup.object().shape({
        categoryName: Yup.string()
          .nullable()
          .required("Vui lòng nhập tên")
          .test("categoryNameFormSchema", "Chỉ nhập được 2000 ký tự", (val) =>
            validLengthInput(val, 2000)
          ),
        feature: Yup.string()
          .nullable()
          .required("Vui lòng nhập mô tả")
          .test("featureFormSchema", "Chỉ nhập được 2000 ký tự", (val) =>
            validLengthInput(val, 2000)
          ),
        area: Yup.string()
          .required("Vui lòng nhập diện tích sử dụng")
          .typeError("Vui lòng nhập diện tích sử dụng")
          .test("areaFormSchema", "Chỉ nhập được 200 ký tự", (val) =>
            validLengthInput(val, 200)
          ),
      })
    )
    .notRequired(),
});

const Describe = forwardRef<RefProps, Props>(
  ({ visible, setVisible, detailDescribes, assetLandInforId }, ref) => {
    const form = useFormik({
      initialValues: {
        describes: detailDescribes || [],
      } as {
        describes: DescribeProjectType[];
      },
      validationSchema: formSchema,
      onSubmit: (data: any): any => {
        return {
          describes: visible ? data?.describes : [],
        };
      },
    });

    const handleChange = useCallback(
      (data: DescribeProjectType[]) => {
        form.setValues({
          describes: data,
        });
      },
      [form.values.describes]
    );
    const handleAdd = () => {
      const tmpArr = [...form.values.describes];
      const newItem: DescribeProjectType = {
        key: randomId(),

        assetLandInforId: assetLandInforId,
        detailDescribeId: null,
        categoryName: null,
        feature: null,
        area: null,
      };
      tmpArr.push(newItem);
      form.setValues({
        describes: tmpArr,
      });
    };

    const columns = defaultColumns.map((column) => {
      if (column.key === 2) {
        return {
          ...column,
          error: form.errors.describes,
          touched: form.touched.describes,
        };
      } else if (column.key === 3) {
        return {
          ...column,
          error: form.errors.describes,
          touched: form.touched.describes,
        };
      } else if (column.key === 4) {
        return {
          ...column,
          error: form.errors.describes,
          touched: form.touched.describes,
        };
      } else
        return {
          ...column,
        };
    });

    const handleRemove = (key: string) => {
      const tmpArr = [...form.values.describes];
      const foundIndex = tmpArr?.findIndex((el) => el?.key === key);
      if (foundIndex === -1) return -1;
      const newData = [...tmpArr];
      newData.splice(foundIndex, 1);
      handleChange(newData);
    };

    const handleCopyRow = (index: number) => {
      const newData = [...form.values.describes];
      const newItem = {
        ...newData[index],
        detailDescribeId: null,
        key: randomId(),
      };
      newData.push(newItem);
      handleChange(newData);
    };

    useImperativeHandle(ref, () => ({
      getData: async () => {
        await form.submitForm();
        const detailDescribesData = {
          detailDescribes:
            form.values.describes?.map((el: any, index: number) => ({
              ...el,
              orderBy: index,
            })) || [],
        };
        const validate =
          JSON.stringify(form.errors) === "{}" ? false : form.errors;
        return [detailDescribesData, validate];
      },
    }));

    useEffect(() => {
      if (!visible) form.setValues({ describes: [] });
      if (visible && detailDescribes)
        form.setValues({ describes: [...detailDescribes] });
    }, [visible, detailDescribes]);

    return (
      <Space
        direction={"vertical"}
        style={{ width: "100%", padding: 0 }}
        size={10}
        className="contruction-land-item-container"
      >
        <div style={{ marginBottom: "2px" }}>
          <Radio.Group
            onChange={(e) => setVisible(e.target.value)}
            value={visible}
          >
            <Radio value={true}>Có</Radio>
            <Radio value={false}>Không</Radio>
          </Radio.Group>
        </div>
        {visible && (
          <TableInputAdd
            data={form.values.describes}
            setData={handleChange}
            handleAdd={handleAdd}
            column={columns}
            handleRemove={handleRemove}
            handleCopy={handleCopyRow}
            isCheckbox={false}
            // scroll={{ x: 1980 }}
          />
        )}
      </Space>
    );
  }
);

export default memo(
  Describe,
  (prevProps, nextProps): boolean =>
    isDeepEqual(prevProps?.detailDescribes, nextProps?.detailDescribes) &&
    prevProps.visible === nextProps.visible
);
