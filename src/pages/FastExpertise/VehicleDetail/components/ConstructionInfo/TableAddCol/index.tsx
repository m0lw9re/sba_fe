import {Button, Space, Typography, Image} from "antd";
import "./style.scss";
import {memo, useEffect, useState} from "react";
import FormItem from "components/InputFields/FormItem";
import TableCustom from "components/TableCustom";
import {TYPE_FIELD} from "constant/enums";
import Icons from "assets/icons";
// import UpLoadCell from "./component/UploadCell";
import LocationCell from "./component/LocationCell";
import {numberUtils} from "utils";
const {INPUT, SELECT} = TYPE_FIELD;
interface TableAddCol {
  columns: any[];
  dataSource: any[];
  handleAddCol?: () => void;
  handleSubCol?: (data: any) => void;
  //handleCoppyCol: (data: any) => void;
}
const TableAddCol = ({
  columns,
  dataSource,
  handleAddCol,
  handleSubCol,
}: TableAddCol) => {
  const [colTable, setColTable] = useState<any[]>([]);
  const renderTitle = (title: string, item: any) => {
    return (
      <Space align="center">
        <Typography.Title
          style={{fontSize: "14px", margin: 0, textAlign: "center"}}
        >
          {title}
        </Typography.Title>
        {/* {title !== "TSTĐ" && title !== "TSSS" ? (
          <Button
            danger
            type="primary"
            size="small"
            icon={<Icons.sub />}
            onClick={() => handleSubCol(item)}
          />
        ) : null} */}
      </Space>
    );
  };

  const renderFieldGroup = (columns: any[]) => {
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
            if (index >= 1 && value === dataSource[index - 1].name) {
              obj.props.rowSpan = 0;
            } else {
              for (
                let i = 0;
                index + i !== dataSource.length &&
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
              if (record.typeFiled === INPUT || record.typeFiled === SELECT) {
                return (
                  <FormItem
                    type={record.typeFiled > 0 ? record.typeFiled : INPUT}
                    disable={record.typeFiled.length === "0"}
                    value={itemValue ? itemValue : ""}
                  />
                );
              } else if (record.typeFiled === "IMAGE") {
                //return <UpLoadCell />;
                return (
                  <Image
                    src={`${process.env.REACT_APP_SERVER_URL}/bussiness/api/v1/loadECMImage/${itemValue}`}
                    width={48}
                  />
                );
              } else if (record.typeFiled === "LOCAL") {
                return <LocationCell coordinate={itemValue} />;
              } else if (record.typeFiled === "CURRENCY") {
                return <span>{numberUtils.formatNumber(itemValue)}</span>;
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
  };

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
      if (item?.key == "action") {
        item.title = (
          <Button
            type="primary"
            size="small"
            icon={<Icons.add />}
            onClick={handleAddCol}
          />
        );
      }
    });
    setColTable(newCol);
  }, [columns]);

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
    />
  );
};

export default memo(TableAddCol);
