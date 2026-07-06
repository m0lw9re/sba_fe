import { Button, Checkbox, Col, Row, Space, Typography } from "antd";
import "./style.scss";
import { memo, useEffect, useState } from "react";
import FormItem from "components/InputFields/FormItem";
import TableCustom from "components/TableCustom";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import Icons from "assets/icons";
import UploadCell from "components/TableAddColEdit/component/UploadCell";
import LocationCell from "components/TableAddColEdit/component/LocationCell";
import { numberUtils } from "utils";
import dayjs from "dayjs";
import LocationCoordinateCell from "./component/LocationCoordinateCell";

const {
  INPUT,
  SELECT,
  IMAGE,
  LOCAL,
  INPUT_NUMBER,
  DATE_PICKER,
  PERCENT,
  CALCULATE_INPUT,
  LOCAL_COORDINATE,
  DAY_PICKER,
  CHECKBOX_GROUP,
  MULTI_ITEMS,
  INPUT_NUMBER_ONLY,
  POPUP_INPUT,
} = TYPE_FIELD;

interface TableAddCol {
  columns: any[];
  dataSource: any[];
  handleAddCol?: () => void;
  handleSubCol?: (data: any) => void;
  handleCoppyCol?: (data: any) => void;
  imageList?: Array<any>;
}

const TableAddColEdit = ({
  columns,
  dataSource,
  handleAddCol,
  handleSubCol,
  handleCoppyCol,
  imageList,
}: TableAddCol) => {
  const [colTable, setColTable] = useState<any[]>([]);

  const renderTitle = (title: string, index: number) => {
    return (
      <Space align="center" size={"small"} style={{ width: "fit-content" }}>
        <Typography.Title
          style={{
            fontSize: "14px",
            margin: 0,
            textAlign: "center",
            width: "50px",
            marginRight: "10px",
          }}
        >
          {title}
        </Typography.Title>
        {title !== "TSTĐ" && title !== "TSSS" ? (
          <>
            {handleSubCol && (
              <Button
                danger
                type="primary"
                size="small"
                // eslint-disable-next-line react/jsx-pascal-case
                icon={<Icons.sub />}
                onClick={() => handleSubCol(index)}
              />
            )}
            {handleCoppyCol && (
              <Button
                type="primary"
                size="small"
                icon={<Icons.copy />}
                style={{ marginLeft: "0px" }}
                onClick={() => handleCoppyCol(index)}
              />
            )}
          </>
        ) : null}
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
              children: <b>{value}</b>,
              props: {
                rowSpan: 0,
              },
            };
            if (index >= 1 && value === dataSource[index - 1]?.name) {
              obj.props.rowSpan = 0;
            } else {
              for (
                let i = 0;
                index + i !== dataSource.length &&
                value === dataSource[index + i]?.name;
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
            const onChange = record?.onChange ? record.onChange : undefined;
            const error =
              record?.errorsNotify?.length > index - 2
                ? record?.errorsNotify[index - 2]?.[record?.key]
                : "";
            const touched =
              record?.touchedNotify?.length > index - 2
                ? record?.touchedNotify[index - 2]?.[record?.key]
                : "";
            if (record.typeFiled) {
              if (record.typeFiled === INPUT) {
                const disable = record?.disableDynamic
                  ? record.disableDynamic[index - 2]
                  : record.typeFiled.length === "0" || record.disable;
                return (
                  <FormItem
                    type={INPUT}
                    disable={disable}
                    value={itemValue ? itemValue : ""}
                    onChange={(e: any) => {
                      if (onChange) {
                        onChange(index - 2, record?.key || "", e.target.value);
                      }
                    }}
                    touched={touched}
                    error={error}
                  />
                );
              } else if (record.typeFiled === POPUP_INPUT) {
                const disable = record?.disableDynamic
                  ? record.disableDynamic[index - 2]
                  : record.typeFiled.length === "0" || record.disable;
                return (
                  <FormItem
                    type={POPUP_INPUT}
                    maxLength={record?.maxLength || 500}
                    disable={disable}
                    value={itemValue ? itemValue : ""}
                    onChange={(e: any) => {
                      if (onChange) {
                        onChange(index - 2, record?.key || "", e.target.value);
                      }
                    }}
                    touched={touched}
                    error={error}
                  />
                );
              } else if (record.typeFiled === SELECT) {
                const options = record?.options
                  ? record.options
                  : record?.optionsDynamic
                  ? record.optionsDynamic[index - 2]
                  : [];
                const disable = record?.disableDynamic
                  ? record.disableDynamic[index - 2]
                  : record.typeFiled.length === "0" || record.disable;
                return (
                  <FormItem
                    type={SELECT}
                    value={itemValue ? itemValue : null}
                    disable={disable}
                    options={options}
                    onChange={(value: number | string) => {
                      if (onChange) {
                        const label = options.find(
                          (item: any) => item.value === value
                        )?.label;
                        onChange(
                          index - 2,
                          record?.key || "",
                          value ?? "",
                          label
                        );
                      }
                    }}
                    touched={touched}
                    error={error}
                  />
                );
              } else if (record.typeFiled === MULTI_ITEMS) {
                const options = record?.options
                  ? record.options
                  : record?.optionsDynamic
                  ? record.optionsDynamic[index - 2]
                  : [];
                const disable = !record.disable
                  ? record.disableDynamic[index - 2]
                  : record.typeFiled.length === "0" || record.disable;
                return (
                  <FormItem
                    type={SELECT}
                    style={{
                      maxWidth: "370px",
                    }}
                    value={itemValue ? itemValue : []}
                    disable={disable}
                    options={options}
                    onChange={(value: number | string) => {
                      if (onChange) {
                        onChange(index - 2, record?.key || "", value);
                      }
                    }}
                    selectMultiple
                    touched={touched}
                    error={error}
                  />
                );
              } else if (record.typeFiled === IMAGE) {
                return (
                  <UploadCell
                    maxCount={5}
                    imageList={imageList?.[index - 2]?.image || []}
                    disabled={record.typeFiled.length === "0" || record.disable}
                    onChange={(value: any) => {
                      if (onChange) {
                        onChange(index - 2, record?.key || "", value);
                      }
                    }}
                  />
                );
              } else if (record.typeFiled === LOCAL) {
                return <LocationCell coordinate={itemValue} />;
              } else if (record.typeFiled === LOCAL_COORDINATE) {
                return (
                  <LocationCoordinateCell
                    searchingAddress={record?.address}
                    coordinate={itemValue}
                    onChange={(value: any) => {
                      if (onChange) {
                        onChange(index - 2, record?.key || "", value);
                      }
                    }}
                  />
                );
              } else if (record.typeFiled === "CURRENCY") {
                return <span>{numberUtils.formatNumber(itemValue)}</span>;
              } else if (record.typeFiled === DATE_PICKER) {
                return (
                  <FormItem
                    error={error}
                    touched={touched}
                    type={DATE_PICKER}
                    value={
                      itemValue
                        ? dayjs(itemValue, DATE_TIME_FORMAT.momentTime)
                        : null
                    }
                    disable={record.typeFiled.length === "0" || record.disable}
                    showTime={true}
                    formatDatetime={DATE_TIME_FORMAT.momentTime}
                    placeholder="DD/MM/YYYY"
                    onChange={(value: any) => {
                      if (onChange) {
                        onChange(
                          index - 2,
                          record?.key || "",
                          value ? dayjs(value).toISOString() : null
                        );
                      }
                    }}
                  />
                );
              } else if (record.typeFiled === DAY_PICKER) {
                return (
                  <FormItem
                    error={error}
                    touched={touched}
                    type={DATE_PICKER}
                    value={
                      itemValue ? dayjs(itemValue, DATE_TIME_FORMAT.day) : null
                    }
                    disable={record.typeFiled.length === "0" || record.disable}
                    formatDatetime={DATE_TIME_FORMAT.day}
                    placeholder="DD/MM/YYYY"
                    onChange={(value: any) => {
                      if (onChange) {
                        onChange(
                          index - 2,
                          record?.key || "",
                          value ? dayjs(value).toISOString() : null
                        );
                      }
                    }}
                  />
                );
              } else if (record.typeFiled === INPUT_NUMBER) {
                return (
                  <FormItem
                    error={error}
                    touched={touched}
                    type={INPUT_NUMBER}
                    value={itemValue ?? ""}
                    disable={record.typeFiled.length === "0" || record.disable}
                    currencable
                    onChange={(value: number) => {
                      if (onChange) {
                        onChange(index - 2, record?.key || "", value);
                      }
                    }}
                  />
                );
              } else if (record.typeFiled === PERCENT) {
                return (
                  <FormItem
                    error={error}
                    touched={touched}
                    type={INPUT_NUMBER}
                    percentable
                    disable={record.typeFiled.length === "0" || record.disable}
                    value={itemValue ?? ""}
                    onChange={(value: number) => {
                      if (onChange) {
                        onChange(index - 2, record?.key || "", value);
                      }
                    }}
                  />
                );
              } else if (record.typeFiled === CALCULATE_INPUT) {
                return (
                  <FormItem
                    error={error}
                    touched={touched}
                    type={INPUT_NUMBER}
                    currencable
                    disable={record.typeFiled.length === "0" || record.disable}
                    value={itemValue}
                  />
                );
              } else if (record.typeFiled === CHECKBOX_GROUP) {
                let checkedValue = [];
                // Kiểm tra có dấu phẩy hay không, nếu có thì
                // tách thành chuỗi string
                if (itemValue && itemValue.includes(",")) {
                  checkedValue = itemValue.split(",");
                }
                // Nếu không có dấu phẩy thì thêm vào array
                else if (itemValue) {
                  checkedValue.push(itemValue);
                }
                return (
                  <Checkbox.Group
                    value={checkedValue}
                    disabled={record.typeFiled.length === "0" || record.disable}
                    onChange={(checkedValues: (string | number)[]) => {
                      if (onChange) {
                        onChange(index - 2, record?.key || "", checkedValues);
                      }
                    }}
                  >
                    <Row>
                      {record?.options?.map((item: any, index: any) => (
                        <Col key={index} span={item.span}>
                          <Checkbox
                            value={item.value}
                            style={{
                              width: "100%",
                            }}
                          >
                            {item.label}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                );
              } else if (record.typeFiled === INPUT_NUMBER_ONLY) {
                return (
                  <FormItem
                    error={error}
                    touched={touched}
                    type={INPUT_NUMBER}
                    value={itemValue ?? ""}
                    disable={record.typeFiled.length === "0" || record.disable}
                    onChange={(value: number) => {
                      if (onChange) {
                        onChange(index - 2, record?.key || "", value);
                      }
                    }}
                  />
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
  };

  const renderTitleCol = (groupCol: any[]) => {
    const colTitle = groupCol.map((item, index) => {
      let checkDataIndex = item?.dataIndex !== "name";
      let checkKey = item?.key !== "name";
      if (checkDataIndex || checkKey) {
        return {
          ...item,
          title: renderTitle(item?.title ? item?.title : "", index - 2),
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
        if (handleAddCol) {
          item.title = (
            <Button
              type="primary"
              size="small"
              // eslint-disable-next-line react/jsx-pascal-case
              icon={<Icons.add />}
              onClick={handleAddCol}
            />
          );
        }
      }
      return null;
    });
    setColTable(newCol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, JSON.stringify(imageList)]);

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
      scroll={{
        x: 400,
      }}
      onPageChange={() => 0}
    />
  );
};

export default memo(TableAddColEdit);
