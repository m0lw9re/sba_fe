import TableInputAdd, {
  ColumnsEdit,
} from 'components/TableInputAddCustom/TableInputAddCustom';
import { ConstructionFutureInforsType } from 'constant/types/appraisalFile';
import { useFormik } from 'formik';
import { forwardRef, memo, useEffect, useImperativeHandle } from 'react';
import { randomId } from 'utils/string';
import './style.scss';
import { isDeepEqual } from 'utils';
type RefProps = {
  getData: () => ConstructionFutureInforsType[];
};
type Props = {
  data: ConstructionFutureInforsType[];
};
const columns: ColumnsEdit = [
  {
    key: 'key',
    dataIndex: 'key',
    title: 'STT',
    width: '3%',
    align: 'center',
    render: (key, record, index) => {
      return index + 1;
    },
    editable: false,
  },
  {
    key: 1,
    dataIndex: 'name',
    title: 'Tên chỉ tiêu',
    width: '30%',
    editable: true,
  },
  {
    key: 2,
    dataIndex: 'basicDesign',
    title: 'Thiết kế cơ sở/Quy hoạch',
    width: '30%',
    editable: true,
  },
  {
    key: 3,
    dataIndex: 'decision',
    title: 'Quyết định',
    width: '30%',
    editable: true,
  },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    width: '5%',
  },
];

const ConstructionFutureInfors = forwardRef<RefProps, Props>(
  ({ data = [] }, ref) => {
    const form = useFormik({
      initialValues: {
        constructionFutureInfors: [],
      } as {
        constructionFutureInfors: ConstructionFutureInforsType[];
      },
      onSubmit: () => {},
    });

    const handleAddRow = () => {
      const newItem: ConstructionFutureInforsType = {
        key: randomId(),
        contructionFutureInforId: null,
        assetLandInforId: null,
        name: null,
        basicDesign: null,
        decision: null,
      };
      handleChange([...form.values?.constructionFutureInfors, newItem]);
    };
    const handleRemoveRow = (key: string) => {
      handleChange(
        form.values?.constructionFutureInfors?.filter(item => item.key !== key),
      );
    };
    const handleCopyRow = (index: number) => {
      const newData = [...form.values?.constructionFutureInfors];
      const newItem = {
        ...newData[index],
        contructionFutureInforId: null,
        key: randomId(),
      };
      newData.splice(index + 1, 0, newItem);
      handleChange(newData);
    };
    const handleChange = (newData: Array<ConstructionFutureInforsType>) => {
      form.setValues({
        constructionFutureInfors: newData,
      });
    };

    useImperativeHandle(ref, () => ({
      getData: () => form.values.constructionFutureInfors?.map((item, index) => ({ ...item, orderBy: index })) || [],
    }));

    useEffect(() => {
      handleChange(data.map(item => ({ ...item, key: randomId() })));
    }, [data]);

    return (
      <TableInputAdd
        style={{ margin: '12px 0' }}
        data={form.values.constructionFutureInfors || []}
        column={columns}
        setData={handleChange}
        handleAdd={handleAddRow}
        handleRemove={record => handleRemoveRow(record)}
        handleCopy={handleCopyRow}
        isCheckbox={false}
      />
    );
  },
);

export default memo(ConstructionFutureInfors, (prevProps, nextProps) => {
  return isDeepEqual(prevProps.data, nextProps.data)
})
