import {Form, Input, InputNumber, Select} from "antd";
import {FormInstance} from "antd/lib/form/Form";
import React, {useEffect, useState} from "react";
import {TYPE_FIELD} from "constants/enums";

import {Rule} from "antd/es/form";
import {useAppDispatch, useAppSelector} from "configs/hooks";
import {getListContructionTypesAPI} from "configs/commonSlice";
import {fastExpertiseApi} from "apis/fastExpertise";
import {toNumber, toRoundNumber} from "utils/format";
type EditableRowProps = {
  index: number;
};
const {INPUT, SELECT, INPUT_NUMBER} = TYPE_FIELD;
export type EditableCellProps = {
  title: React.ReactNode;
  editable?: boolean;
  children: React.ReactNode;
  dataIndex: any;
  record: any;
  selected: boolean;
  options: any;
  name: string;
  index: number;
  type: TYPE_FIELD;
  disabled?: boolean;
  value?: any;
  onChange?: (e: any) => void;
  onFocus?: () => void;
  onPressEnter?: (e: any) => void;
  addonAfter?: any;
  rules?: Rule[];
  hidden?: boolean;
  autoFocus?: boolean;
  fields?: any[];
  percentable?: boolean;
  currencable?: boolean;
  placeholder?: string;
  form?: any;
};

export const EditableContext = React.createContext<FormInstance<any> | null>(
  null
);

export const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
  return (
    // <Form form={form} size="small" component={false}>
    //   <EditableContext.Provider value={form}>
    //     <tr {...props} />
    //   </EditableContext.Provider>
    // </Form>
    <>
      <tr {...props} />
    </>
  );
};

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  selected,
  options,
  name,
  index,
  type,
  onChange,
  onPressEnter,
  disabled,
  value,
  hidden,
  autoFocus,
  fields,
  percentable,
  currencable,
  placeholder,
  form,
  rules,
  ...restProps
}) => {
  // const form = useContext(EditableContext)!;
  const [newOptions, setNewOptions] = useState(options);
  const [listConstructor, setListConstructor] = useState<any>([]);
  const [selectedConstructor, setSelectedConstructor] = useState<any>(null);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const setFieldValue = (dataIndex: string, value: any) => {
    form?.setFieldValue([name, index, dataIndex], value);
  };
  const getFieldValue = (dataIndex: string) => {
    return form?.getFieldValue([name, index, dataIndex]);
  };
  const dispatch = useAppDispatch();
  const listContructionTypes = useAppSelector(
    state => state.commonSlice.listContructionTypes
  );
  useEffect(() => {
    if (dataIndex === "typeId") {
      dispatch(getListContructionTypesAPI());
    }
  }, []);

  useEffect(() => {
    if (dataIndex === "typeId") {
      setOptionsConstructionType(listContructionTypes);
    }
  }, [listContructionTypes]);

  // useEffect(() => {
  //   console.log("set again");
  //   if (
  //     dataIndex === "typeId" &&
  //     newOptions?.length > 0 &&
  //     (typeForm === "edit" || typeForm === "view")
  //   ) {
  //     console.log("setTypeId", index);
  //     setFieldValue(
  //       "typeId",
  //       assetInfo?.constructions?.[index]?.typeId
  //         ? assetInfo?.constructions?.[index]?.typeId
  //         : null
  //     );
  //   }
  // }, [assetInfo, newOptions]);
  // useEffect(() => {
  //   if (dataIndex === "name" && (typeForm === "edit" || typeForm === "view")) {
  //     setOptionsConstructionName(
  //       assetInfo?.constructions?.[index]?.typeId
  //         ? toNumber(assetInfo?.constructions?.[index]?.typeId)
  //         : null
  //     );
  //     setFieldValue(
  //       "name",
  //       assetInfo?.constructions?.[index]?.name
  //         ? assetInfo?.constructions?.[index]?.name
  //         : null
  //     );
  //   }
  // }, [assetInfo]);

  const setOptionsConstructionType = (listContructionTypes: any) => {
    setNewOptions(
      listContructionTypes.map((e: any) => ({
        label: e.constructionTypeName,
        value: e.constructionTypeId.toString(),
      }))
    );
  };

  let childNode = children;
  const setOptionsConstructionName = async (typeId: any) => {
    try {
      const res = await fastExpertiseApi.getListConstructNameByConstructTypeId(
        typeId
      );
      const list = res?.data || [];
      setListConstructor(list);
      setNewOptions(
        list.map((e: any) => ({
          value: e?.constructionName,
          label: e?.constructionName,
        }))
      );
    } catch (error) {}
  };
  const getSelectName = (name: any) => {
    const selected = listConstructor.find(
      (e: any) => e?.constructionName === name
    );
    setSelectedConstructor(selected);
  };
  useEffect(() => {
    if (selectedConstructor) {
      setUnitPrice(selectedConstructor);
    }
  }, [selectedConstructor]);
  const onChangeTypeId = (typeId: any) => {
    const name = listContructionTypes.find(
      e => e.constructionTypeId === typeId
    )?.constructionTypeName;
    setFieldValue("type", name);
  };
  const setUnitPrice = (selectedConstructor: any) => {
    var unitPrice;
    if (!selectedConstructor?.highPrice || !selectedConstructor?.lowPrice) {
      unitPrice =
        toNumber(selectedConstructor?.highPrice) +
        toNumber(selectedConstructor?.lowPrice);
    } else {
      unitPrice =
        (toNumber(selectedConstructor?.highPrice) +
          toNumber(selectedConstructor?.lowPrice)) /
        2;
    }
    setFieldValue("unitPrice", unitPrice);
    setValue();
  };
  const setValue = () => {
    const area = toNumber(getFieldValue("area"));
    const clcl = toNumber(getFieldValue("clcl"));
    const unitPrice = toNumber(getFieldValue("unitPrice"));
    const value = ((area * clcl) / 100) * unitPrice;
    setFieldValue("value", toRoundNumber(value));
  };
  if (type === INPUT) {
    childNode = (
      <Form.Item
        name={[name, index, dataIndex]}
        initialValue={getFieldValue(dataIndex) ?? null}
        rules={rules}
        style={{display: `${hidden ? "none" : ""}`}}
      >
        <Input
          placeholder={disabled ? "" : "Nhập"}
          disabled={disabled}
          onChange={async (e: any) => {}}
        ></Input>
      </Form.Item>
    );
  }
  if (type === SELECT) {
    childNode = (
      <Form.Item
        style={{margin: 0}}
        name={[name, index, dataIndex]}
        initialValue={getFieldValue(dataIndex) ?? null}
        rules={rules}
      >
        <Select
          showSearch
          style={{
            width: "100%",
          }}
          filterOption={(input, option) =>
            (option?.label?.toString().toLowerCase() ?? "").includes(
              input.toLowerCase()
            )
          }
          open={openDropdown}
          onFocus={() => {
            if (dataIndex === "name") {
              setOptionsConstructionName(getFieldValue("typeId"));
            }
            setOpenDropdown(true);
          }}
          onClick={e => {
            if (openDropdown === false) {
              setOpenDropdown(true);
            }
            if (dataIndex === "name") {
              setOptionsConstructionName(getFieldValue("typeId"));
            }
          }}
          onBlur={() => {
            setOpenDropdown(false);
          }}
          onSelect={() => {
            setOpenDropdown(false);
          }}
          onChange={e => {
            if (dataIndex === "typeId") {
              onChangeTypeId(e);
              setFieldValue("name", null);
            }
            if (dataIndex === "name") {
              getSelectName(e);
              setFieldValue("unitPrice", null);
              setFieldValue("value", null);
            }
          }}
          placeholder={disabled ? "" : "Chọn"}
          options={newOptions}
          disabled={disabled}
          allowClear={true}
          {...restProps}
        />
      </Form.Item>
    );
  }
  if (type === INPUT_NUMBER) {
    childNode = (
      <Form.Item style={{margin: 0}} name={[name, index, dataIndex]}>
        {percentable && (
          <InputNumber
            style={{
              width: "100%",
            }}
            disabled={disabled}
            min={0}
            max={100}
            size={"small"}
            formatter={(value) => {
              const parts = `${value}`.split(".");
              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              return parts.join(",");
            }}
            value={value}
            parser={(value) => value!.replace(/\./g, "").replace(/,/g, ".")}
            placeholder={disabled ? "" : "Nhập"}
            autoFocus={autoFocus}
            onChange={e => {
              if (dataIndex === "clcl" || dataIndex === "mdht") {
                setValue();
              }
            }}
            controls={false}
          />
        )}
        {currencable && (
          <InputNumber
            style={{
              width: "100%",
            }}
            disabled={disabled}
            size={"small"}
            value={value}
            formatter={(value) => {
              const parts = `${value}`.split(".");
              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              return parts.join(",");
            }}
            parser={(value) => value!.replace(/\./g, "").replace(/,/g, ".")}
            onChange={e => {
              if (dataIndex === "unitPrice") {
                setValue();
              }
            }}
            placeholder={!disabled ? placeholder ?? "Nhập" : ""}
            controls={false}
          />
        )}
        {!(currencable || percentable) && (
          <InputNumber
            style={{width: "100%"}}
            onChange={e => {
              if (dataIndex === "area") {
                setValue();
              }
            }}
            disabled={disabled}
            size={"small"}
            placeholder={disabled ? "" : "Nhập"}
            controls={false}
          />
        )}
      </Form.Item>
    );
  }
  // if (type === MULTI_ITEMS) {
  //   childNode = (
  //     <Row gutter={[4, 4]} justify={"space-between"}>
  //       {fields?.map(field => {
  //         return (
  //           <Col span={field?.span}>
  //             <Form.Item
  //               name={field?.dataIndex}
  //               initialValue={record ? record[field.dataIndex] : null}
  //             >
  //               {field?.type === INPUT && (
  //                 <Input
  //                   placeholder={disabled ? "--" : "Nhập"}
  //                   disabled={disabled}
  //                   onChange={async (e: any) => {
  //                     setInputValue({
  //                       ...inputValue,
  //                       [field.dataIndex]: e.target.value,
  //                     });
  //                     handleSave(form?.getFieldsValue(), index);
  //                   }}
  //                 ></Input>
  //               )}
  //               {field?.type === SELECT && (
  //                 <Select
  //                   showSearch
  //                   filterOption={(input, option) =>
  //                     (option?.label?.toString().toLowerCase() ?? "").includes(
  //                       input.toLowerCase()
  //                     )
  //                   }
  //                   placeholder={"Chọn"}
  //                   options={field?.options}
  //                   disabled={disabled}
  //                   allowClear={true}
  //                   onChange={e => {
  //                     setInputValue({...inputValue, [dataIndex]: value});
  //                     handleSave(form?.getFieldsValue(), index);
  //                   }}
  //                   onClick={e => {
  //                     if (dataIndex === "contructionType") {
  //                       setNewOptions(
  //                         listContructionTypes.map((e: any) => ({
  //                           label: e.constructionTypeName,
  //                           value: e.constructionTypeId,
  //                         }))
  //                       );
  //                     }
  //                   }}
  //                   {...restProps}
  //                 />
  //               )}
  //             </Form.Item>
  //           </Col>
  //         );
  //       })}
  //     </Row>
  //   );
  // }

  return <td {...restProps}>{childNode}</td>;
};
