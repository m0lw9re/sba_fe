import TableInputAdd, {
  ColumnsEdit,
} from "components/TableInputAddCustom/TableInputAddCustom";
import { ConstructionCheckListType } from "constant/types/appraisalFile";
import { useFormik } from "formik";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import { randomId } from "utils/string";
import "./style.scss";
import { isDeepEqual } from "utils";
type RefProps = {
  getData: () => ConstructionCheckListType[];
};
type Props = {
  data: ConstructionCheckListType[];
};
const columns: ColumnsEdit = [
  {
    key: "key",
    dataIndex: "key",
    title: "STT",
    width: "3%",
    align: "center",
    render: (key, record, index) => {
      return index + 1;
    },
    editable: false,
  },
  {
    key: 1,
    dataIndex: "name",
    title: "Tên công trình",
    width: "11.5%",
    editable: true,
  },
  {
    key: 2,
    dataIndex: "groundFloorArea",
    title: "DT xây dựng tầng trệt (m²)",
    width: "11.5%",
    editableNumber: true,
  },
  {
    key: 3,
    dataIndex: "totalFloorArea",
    title: "Tổng DT sàn (m²)",
    width: "11.5%",
    editableNumber: true,
  },
  {
    key: 4,
    dataIndex: "height",
    title: "Chiều cao công trình (m)",
    width: "11.5%",
    editableNumber: true,
  },
  {
    key: 5,
    dataIndex: "numOfFloor",
    title: "Số tầng",
    width: "11.5%",
    editableNumber: true,
  },
  {
    key: 6,
    dataIndex: "length",
    title: "Chiều dài (m)",
    width: "11.5%",
    editableNumber: true,
  },
  {
    key: 7,
    dataIndex: "depth",
    title: "Chiều sâu công trình (m)",
    width: "11.5%",
    editableNumber: true,
  },
  {
    key: 8,
    dataIndex: "note",
    title: "Ghi chú",
    width: "11.5%",
    popupInput: true,
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    align: "center",
    width: "5%",
  },
];

const ConstructionChecklists = forwardRef<RefProps, Props>(
  ({ data = [] }, ref) => {
    const form = useFormik({
      initialValues: {
        constructionChecklists: [],
      } as {
        constructionChecklists: ConstructionCheckListType[];
      },
      onSubmit: () => {},
    });

    const handleAddRow = () => {
      const newItem: ConstructionCheckListType = {
        key: randomId(),
        assetLandInforId: null,
        contructionFutureInforId: null,
        depth: null,
        groundFloorArea: null,
        height: null,
        length: null,
        name: null,
        numOfFloor: null,
        totalFloorArea: null,
      };
      handleChange([...form.values?.constructionChecklists, newItem]);
    };
    const handleRemoveRow = (key: string) => {
      handleChange(
        form.values?.constructionChecklists?.filter((item) => item.key !== key)
      );
    };
    const handleCopyRow = (index: number) => {
      const newData = [...form.values?.constructionChecklists];
      const newItem = {
        ...newData[index],
        contructionFutureInforId: null,
      };
      newItem.key = randomId();
      newData.splice(index + 1, 0, newItem);
      handleChange(newData);
    };
    const handleChange = (newData: Array<ConstructionCheckListType>) => {
      form.setValues({
        constructionChecklists: newData,
      });
    };

    useImperativeHandle(ref, () => ({
      getData: () =>
        form.values.constructionChecklists?.map((item, index) => ({
          ...item,
          orderBy: index,
        })) || [],
    }));

    useEffect(() => {
      handleChange(data.map((item) => ({ ...item, key: randomId() })));
    }, [data]);

    return (
      <TableInputAdd
        style={{ margin: "12px 0" }}
        data={form.values.constructionChecklists || []}
        column={columns}
        setData={handleChange}
        handleAdd={handleAddRow}
        handleRemove={(record) => handleRemoveRow(record)}
        handleCopy={handleCopyRow}
        isCheckbox={false}
      />
    );
  }
);
export default memo(ConstructionChecklists, (prevProps, nextProps) => {
  return isDeepEqual(prevProps.data, nextProps.data);
});
