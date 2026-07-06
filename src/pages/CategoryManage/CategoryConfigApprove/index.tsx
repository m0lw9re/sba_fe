import { Card, Space, message } from "antd";
import { ColumnsType } from "antd/es/table";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import FormItem from "components/InputFields/FormItem";
import TableCustom from "components/TableCustom";
import { TYPE_FIELD } from "constant/enums";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CATEGORY_CONFIG_APPROVE } from "routes/route.constant";
import "./style.scss";
import { useCategoryConfigApprove } from "utils/request/useCategoryConfigApprove";
import { categoryApi } from "apis/category";
import ComponentsError from "pages/ComponentsError";
import { BUTTON_CODES } from "constant/common";
import { RootState } from "configs/configureStore";
import ModalCreateApprovalConfig from "./components/ModalCreateApprovalConfig";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import { approvalConfigsApi } from "apis/approvalConfigs";
const { INPUT_NUMBER, SELECT } = TYPE_FIELD;

const CategoryConfigApprove = () => {
  const dispatch = useDispatch();
  const { listRoleOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const [editable, setEditable] = useState<boolean>(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
  const {
    data: categoryConfigApprove,
    error,
    mutate,
  }: {
    data: any;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useCategoryConfigApprove();
  const [dataTable, setDataTable] = useState<any[]>([]);

  useEffect(() => {
    if (categoryConfigApprove) setDataTable([...categoryConfigApprove]);
  }, [categoryConfigApprove]);

  const handleInputChange = (
    assetValueId: number,
    fieldName: string,
    val: number
  ) => {
    let arrArrayUpdate = [...dataTable];

    for (let item of arrArrayUpdate) {
      if (item.assetValueId === assetValueId) {
        item[fieldName] = val;
        break;
      }
    }
    setDataTable(arrArrayUpdate);
  };

  const handleSaveData = async () => {
    let checkError = false;
    dataTable.forEach((e: any) => {
      if (e.valueFrom > e.valueTo) {
        checkError = true;
      }
    });
    if (!checkError) {
      // call api
      try {
        const res = await categoryApi.updateApproveConfig(dataTable);
        if (res.data.code === 200) {
          setEditable(false);
          message.success(res.data.message);
          mutate();
        } else message.error(res.data.message);
      } catch (error) {
        message.error("Cập nhật không thành công");
      }
    } else {
      message.error(
        "Giá trị tài sản đến phải lớn hơn hoặc bằng giá trị tài sản từ"
      );
    }
  };

  const handleDeleteApprovalConfig = async (assetValueId: number) => {
    try {
      const res = await approvalConfigsApi.deleteApprovalConfig(assetValueId);
      if (res.data.code === 200) {
        message.success("Xoá cấu hình duyệt thành công");
        mutate();
      } else {
        message.error(
          res.data.message || "Xoá cấu hình duyệt không thành công"
        );
      }
    } catch (error) {
      message.error(
        "Lỗi không xác định - Chức năng xoá cấu hình duyêt không hoạt động"
      );
    }
  };

  let currentAssetValueId: any = null;
  let rowspan = 0;

  const genDataTable = () => {
    const rows: any = [];
    dataTable?.forEach((item: any) => {
      const dtoArr = item.approvalConfigDtos;
      dtoArr.forEach((e: any) => {
        const newObject = {
          assetValueId: e.assetValueId,
          valueFrom: item.valueFrom,
          valueTo: item.valueTo,
          code: e.companyBranch.code,
          companyBranchId: e.companyBranchId,
          level1: e.level1 !== null ? e.level1.join("/") : "-",
          level2: e.level2 !== null ? e.level2.join("/") : "-",
          level3: e.level3 !== null ? e.level3.join("/") : "-",
          level4: e.level4 !== null ? e.level4.join("/") : "-",
          level5: e.level5 !== null ? e.level5.join("/") : "-",
          level6: e.level6 !== null ? e.level6.join("/") : "-",
        };
        rows.push(newObject);
      });
    });

    const newData = rows.map((item: any) => {
      const assetValueId = item.assetValueId;
      if (assetValueId !== currentAssetValueId) {
        currentAssetValueId = assetValueId;
        rowspan = rows.filter(
          (record: any) => record.assetValueId === assetValueId
        ).length;
      } else {
        rowspan = 0;
      }
      return {
        ...item,
        rowSpan: rowspan,
      };
    });

    return newData;
  };

  const handleUpdateLevel = (
    assetValueId: number,
    companyBranchId: number,
    val: string[],
    fieldName: string
  ) => {
    let arrArrayUpdate = [...dataTable];

    for (let item of arrArrayUpdate) {
      if (item.assetValueId === assetValueId) {
        for (let el of item.approvalConfigDtos) {
          if (el.companyBranchId === companyBranchId) {
            el[fieldName] = val.length !== 0 ? [...val] : null;
            break;
          }
        }
      }
    }
    setDataTable(arrArrayUpdate);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Giá trị tài sản",
      children: [
        {
          title: "Từ",
          dataIndex: "valueFrom",
          key: 1,
          align: "left",
          width: "15%",
          render: (valueFrom: any, record: any) => (
            <FormItem
              type={INPUT_NUMBER}
              currencable
              value={valueFrom}
              onChange={(e: any) =>
                handleInputChange(record.assetValueId, "valueFrom", e)
              }
              disable={!editable}
              isRounded
            />
          ),
          onCell: (record: any) => {
            return { rowSpan: record.rowSpan };
          },
        },
        {
          title: "Đến",
          dataIndex: "valueTo",
          key: 2,
          width: "15%",
          align: "left",
          render: (valueTo: any, record: any) => (
            <FormItem
              type={INPUT_NUMBER}
              currencable
              value={valueTo}
              onChange={(e: any) =>
                handleInputChange(record.assetValueId, "valueTo", e)
              }
              disable={!editable}
              isRounded
            />
          ),
          onCell: (record: any) => {
            return { rowSpan: record.rowSpan };
          },
        },
      ],
    },
    {
      title: "Phân chia khu vực",
      dataIndex: "code",
      key: 3,
      width: "5%",
      align: "center",
    },
    {
      title: "Cấp 1",
      dataIndex: "level1",
      key: 4,
      width: "10%",
      render: (valueLv: any, record: any) => {
        const value = valueLv !== "-" ? valueLv.split("/") : [];
        return editable ? (
          <FormItem
            type={SELECT}
            selectMultiple
            options={listRoleOptions}
            value={value}
            onChange={(val: string[]) =>
              handleUpdateLevel(
                record.assetValueId,
                record.companyBranchId,
                val,
                "level1"
              )
            }
            // disable={!editable}
          />
        ) : (
          valueLv
        );
      },
    },
    {
      title: "Cấp 2",
      dataIndex: "level2",
      key: 5,
      width: "10%",
      render: (valueLv: any, record: any) => {
        const value = valueLv !== "-" ? valueLv.split("/") : [];
        return editable ? (
          <FormItem
            type={SELECT}
            selectMultiple
            options={listRoleOptions}
            value={value}
            onChange={(val: string[]) =>
              handleUpdateLevel(
                record.assetValueId,
                record.companyBranchId,
                val,
                "level2"
              )
            }
            // disable={!editable}
          />
        ) : (
          valueLv
        );
      },
    },
    {
      title: "Cấp 3",
      dataIndex: "level3",
      key: 6,
      width: "10%",
      render: (valueLv: any, record: any) => {
        const value = valueLv !== "-" ? valueLv.split("/") : [];

        return editable ? (
          <FormItem
            type={SELECT}
            selectMultiple
            options={listRoleOptions}
            value={value}
            onChange={(val: string[]) =>
              handleUpdateLevel(
                record.assetValueId,
                record.companyBranchId,
                val,
                "level3"
              )
            }
            // disable={!editable}
          />
        ) : (
          valueLv
        );
      },
    },
    {
      title: "Cấp 4",
      dataIndex: "level4",
      key: 7,
      width: "10%",
      render: (valueLv: any, record: any) => {
        const value = valueLv !== "-" ? valueLv.split("/") : [];

        return editable ? (
          <FormItem
            type={SELECT}
            selectMultiple
            options={listRoleOptions}
            value={value}
            onChange={(val: string[]) =>
              handleUpdateLevel(
                record.assetValueId,
                record.companyBranchId,
                val,
                "level4"
              )
            }
            // disable={!editable}
          />
        ) : (
          valueLv
        );
      },
    },
    {
      title: "Cấp 5",
      dataIndex: "level5",
      key: 8,
      width: "10%",
      render: (valueLv: any, record: any) => {
        const value = valueLv !== "-" ? valueLv.split("/") : [];

        return editable ? (
          <FormItem
            type={SELECT}
            selectMultiple
            options={listRoleOptions}
            value={value}
            onChange={(val: string[]) =>
              handleUpdateLevel(
                record.assetValueId,
                record.companyBranchId,
                val,
                "level5"
              )
            }
            // disable={!editable}
          />
        ) : (
          valueLv
        );
      },
    },
    {
      title: "Cấp 6",
      dataIndex: "level6",
      key: 9,
      width: "10%",
      render: (valueLv: any, record: any) => {
        const value = valueLv !== "-" ? valueLv.split("/") : [];
        return editable ? (
          <FormItem
            type={SELECT}
            selectMultiple
            options={listRoleOptions}
            value={value}
            onChange={(val: string[]) =>
              handleUpdateLevel(
                record.assetValueId,
                record.companyBranchId,
                val,
                "level6"
              )
            }
            disable={!editable}
          />
        ) : (
          valueLv
        );
      },
    },
    {
      title: "",
      dataIndex: "0",
      key: 10,
      render: (_, record: any) => {
        return (
          <ListButtonActionUpdate
            removeFunction={() =>
              handleDeleteApprovalConfig(record.assetValueId)
            }
          />
        );
      },
      onCell: (record: any) => {
        return { rowSpan: record.rowSpan };
      },
    },
  ];

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "#",
      },
      {
        label: "Cấu hình duyệt",
        path: CATEGORY_CONFIG_APPROVE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_CONFIG_APPROVE]);

  if (error) return <ComponentsError />;

  return (
    <div className="page-container">
      {/* table */}
      <Card className="card-container" size="small">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <CardTitleCustomUpdate title="Danh sách cấu hình duyệt" />
          {editable ? (
            <Space>
              <ButtonCustom
                label="Lưu lại"
                type="primary"
                bgColor="rgba(40, 98, 175, 1)"
                onClick={handleSaveData}
              />
              <ButtonCustom
                label="Hủy bỏ"
                onClick={() => {
                  setEditable(false);
                  mutate();
                }}
              />
            </Space>
          ) : (
            <Space>
              <ButtonCustom
                label="Chỉnh sửa"
                type="default"
                onClick={() => setEditable(true)}
                code={BUTTON_CODES.dm_chd_edit}
                // bgColor='rgba(40, 98, 175, 1)'
              />
              <ButtonCustom
                label="Thêm mới"
                type="primary"
                onClick={() => setIsOpenCreateModal(true)}
                code={BUTTON_CODES.dm_chd_them}
                bgColor="rgba(40, 98, 175, 1)"
              />
            </Space>
          )}
        </div>
        <TableCustom
          bordered={true}
          columns={columns}
          dataSource={genDataTable() || []}
          isLoading={false}
          page={0}
          total={0}
          limit={100}
          onLimitChange={() => {}}
          onPageChange={() => {}}
        />
      </Card>
      <ModalCreateApprovalConfig
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
        mutate={mutate}
      />
    </div>
  );
};

export default CategoryConfigApprove;
