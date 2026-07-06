import { Radio, Space } from "antd";
import TableInputAdd from "components/TableInputAddCustom/TableInputAddCustom";
import { RootState } from "configs/configureStore";
import { TreeAssetType } from "constant/types";
import "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/FeatureLandItemTab/component/TreeInLand/style.scss";
import { memo, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { convertToJson } from "utils/json";
import { isDeepEqual } from "utils/validate";
import { defaultColumns } from "./config";

type Props = {
  treeLandInfor: {
    assetTrees: Array<TreeAssetType>;
  };
  visible: boolean;
  setVisible: (value: boolean) => void;
  onChange: (data: any) => void;
  handleAdd: () => void;
  errors: any;
  touched: any;
};

const TreeInLand: React.FC<Props> = ({
  errors,
  visible,
  setVisible,
  handleAdd,
  onChange,
  touched,
  treeLandInfor,
}) => {
  const { treeTypeOptions } = useSelector((state: RootState) => state.globalSlice)
  const handleChange = useCallback(
    (data: Array<TreeAssetType>) => {
      const tmp = data
        ? data.map((item) => {
            const element: any = { ...item };
            for (const key in element) {
              element[key] =
                !element[key] && element[key] !== 0 ? null : element[key];
            }

            return element;
          })
        : [];
      onChange({ assetTrees: tmp });
    },
    [TreeInLand, onChange]
  );

  const columns = defaultColumns.map((column) => {
    if (column.key === 2) {
      return {
        ...column,
        options: treeTypeOptions,
      };
    } else
      return {
        ...column,
      };
  });
  useEffect(() => {
    if (!visible) {
      onChange({ assetTrees: [] });
    }
  }, [visible])

  return (
    <Space
      direction={"vertical"}
      style={{ width: "100%", padding: 0 }}
      size={10}
      className="tree-feature-land-container"
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
          data={treeLandInfor.assetTrees}
          setData={handleChange}
          handleAdd={handleAdd}
          column={columns}
          isCheckbox={false}
          scroll={{ x: 1366 }}
        />
      )}
    </Space>
  );
};

export default memo(TreeInLand, (prevProps, nextProps): boolean => {
  if (
    prevProps?.treeLandInfor?.assetTrees &&
    nextProps?.treeLandInfor?.assetTrees
  ) {
    const preObjJson = convertToJson(prevProps.treeLandInfor.assetTrees);
    const nextObjJson = convertToJson(nextProps.treeLandInfor.assetTrees);
    return (
      prevProps.visible === nextProps.visible &&
      preObjJson === nextObjJson &&
      isDeepEqual(prevProps.errors, nextProps.errors) &&
      isDeepEqual(prevProps.touched, nextProps.touched) &&
      prevProps.onChange === nextProps.onChange
    );
  }
  return false;
});
