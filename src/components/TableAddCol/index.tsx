import { Button, Image, Space, TableProps, Typography } from "antd";
import Icons from "assets/icons";
import FormItem from "components/InputFields/FormItem";
import TableCustom from "components/TableCustom";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { setDistanceToAssets } from "pages/AppendixMethods/store/appendixMethodsSlice";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { numberUtils } from "utils";
import LocationCell from "./component/LocationCell";
import "./style.scss";
const { INPUT, SELECT, INPUT_NUMBER } = TYPE_FIELD;
interface TableAddColProps extends TableProps<any> {
  columns: any[];
  dataSource: any[];
  handleAddCol: () => void;
  handleEditCol?: (data: any) => void;
  handleSubCol: (data: any) => void;
  disabledActions?: boolean;
  //handleCoppyCol: (data: any) => void;
}
const TableAddCol = ({
  columns,
  dataSource,
  handleAddCol,
  handleEditCol,
  handleSubCol,
  disabledActions = false,
  ...props
}: TableAddColProps) => {
  const dispatch = useDispatch();
  const { distanceToAssets } = useSelector(
    (state: RootState) => state.appendixMethodsSlice
  );
  const distanceToAssetsRef = useRef(distanceToAssets);
  distanceToAssetsRef.current = distanceToAssets;

  const [colTable, setColTable] = useState<any[]>([]);

  const renderTitle = (title: string, item: any) => {
    return (
      <Space align="center">
        <Typography.Title
          style={{ fontSize: "14px", margin: 0, textAlign: "center" }}
        >
          {title}
        </Typography.Title>
        {title !== "TSTĐ" && title !== "TSSS" ? (
          <>
            <Button
              danger
              type="primary"
              size="small"
              icon={<Icons.sub />}
              onClick={() => handleSubCol(item)}
              disabled={disabledActions}
            />
            {handleEditCol && (
              <Button
                type="primary"
                size="small"
                icon={<Icons.edit />}
                onClick={() => handleEditCol(item)}
                disabled={disabledActions}
              />
            )}
          </>
        ) : null}
      </Space>
    );
  };

  const renderFieldGroup = useCallback(
    (columns: any[]) => {
      const newCol = columns.map((item, index) => {
        if (item.key === "name") {
          return {
            ...item,
            render: (value: string, row: any, index: any) => {
              const obj = {
                children: value,
                props: {
                  rowSpan: 0,
                },
              };
              if (
                index >= 1 &&
                dataSource[index - 1]?.name &&
                value === dataSource[index - 1].name
              ) {
                obj.props.rowSpan = 0;
              } else {
                for (
                  let i = 0;
                  index + i !== dataSource.length &&
                  dataSource[index + i]?.name &&
                  value === dataSource[index + i].name;
                  i += 1
                ) {
                  obj.props.rowSpan = i + 1;
                }
              }
              return obj;
            },
          };
        } else if (item.key !== "lable" && item.key !== "action") {
          return {
            ...item,
            render: (_: any, record: any) => {
              const itemValue = record[`${index - 2}`];
              if (record.typeFiled) {
                if (record.typeFiled === "INPUT_DISTANCE") {
                  const val = distanceToAssetsRef.current[`${index - 2}`]?.distance;

                  return index > 2 ? (
                    <FormItem
                    type={INPUT}
                    disable={record.typeFiled.length === "0"}
                    value={val ? val : ""}
                    onChange={(e: any) => {
                      let cloneArr: any = JSON.parse(JSON.stringify(distanceToAssetsRef.current));
                      if (Array.isArray(cloneArr) && cloneArr[index - 2]) {
                        cloneArr[index - 2].distance = e.target.value;
                        dispatch(setDistanceToAssets(cloneArr));
                      }
                    }}
                  />
                  ) : null;
                }
                if (record.typeFiled === INPUT || record.typeFiled === SELECT) {
                  return index > 2 ? (
                    <FormItem
                      type={record.typeFiled > 0 ? record.typeFiled : INPUT}
                      disable={record.typeFiled.length === "0"}
                      value={itemValue ? itemValue : ""}
                    />
                  ) : null;
                } else if (record.typeFiled === "IMAGE") {
                  return typeof itemValue === "string" ? (
                    <Image
                      src={
                        !itemValue
                          ? `${process.env.REACT_APP_SERVER_URL}/bussiness/api/v1/loadECMImage/e97b325d-1e4a-4aba-a0c3-0af9ee1e032a`
                          : `${itemValue[0]}`
                      }
                      height={80}
                      width={80}
                    />
                  ) : itemValue?.length > 0 ? (
                    <>
                      <Image.PreviewGroup items={itemValue}>
                        <Image src={itemValue[0]} height={80} width={80} />
                      </Image.PreviewGroup>
                    </>
                  ) : (
                    <Image
                      src={`${process.env.REACT_APP_SERVER_URL}/bussiness/api/v1/loadECMImage/e97b325d-1e4a-4aba-a0c3-0af9ee1e032a`}
                      height={80}
                      width={80}
                    />
                  );
                } else if (record.typeFiled === "LOCAL") {
                  return <LocationCell coordinate={itemValue} />;
                } else if (record.typeFiled === "CURRENCY") {
                  return (
                    <span>
                      {!isNaN(itemValue)
                        ? numberUtils.formatNumber(Number(itemValue))
                        : itemValue}
                    </span>
                  );
                } else if (record.typeFiled === "PERCENT") {
                  return (
                    <span>
                      {itemValue
                        ? numberUtils.formatNumber(itemValue) + "%"
                        : ""}
                    </span>
                  );
                }
              } else {
                return <span>{itemValue}</span>;
              }
            },
          };
        } else {
          return item;
        }
      });
      return newCol;
    },
    [distanceToAssets, dispatch, dataSource]
  );

  const renderTitleCol = (groupCol: any[]) => {
    const colTitle = groupCol.map((item, index) => {
      let checkDataIndex = item?.dataIndex !== "name";
      let checkKey = item?.key !== "name";
      if (checkDataIndex || checkKey) {
        return {
          ...item,
          title: renderTitle(item?.title ? item?.title : "", item),
        };
      } else {
        return item;
      }
    });
    return colTitle;
  };

  useEffect(() => {
    const groupCol = renderFieldGroup(columns);
    const newCol = renderTitleCol(groupCol);
    newCol.some((item: any) => {
      if (item?.key === "action") {
        item.title = (
          <Button
            type="primary"
            size="small"
            icon={<Icons.add />}
            onClick={handleAddCol}
            disabled={disabledActions}
            style={{
              borderColor: disabledActions ? "#d9d9d9" : "#2862af",
              color: disabledActions ? "rgba(0, 0, 0, 0.25)" : "#fff",
              backgroundColor: disabledActions
                ? "rgba(0, 0, 0, 0.04)"
                : "#2862af",
            }}
          />
        );
      }
      return 0;
    });
    setColTable(newCol);
  }, [columns, renderFieldGroup]);

  return (
    <TableCustom
      columns={colTable}
      dataSource={dataSource.length > 0 ? dataSource : []}
      pagination={false}
      bordered={true}
      isLoading={!(colTable.length > 0)}
      page={0}
      total={0}
      limit={1000}
      onLimitChange={() => 0}
      onPageChange={() => 0}
      {...props}
    />
  );
};

export default memo(TableAddCol);
