import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { randomId } from "utils/string";
import { DynamicTable } from "components/DynamicTable";
import { AssetRiskType } from "constant/types/appraisalFile";
import { ColumnsType } from "antd/es/table";
import SelectCustom from "components/SelectCustom";
import { categoryApi } from "apis/category";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import { message } from "antd";
import { RootState } from "configs/configureStore";
import { useSelector } from "react-redux";

type Props = {
  assetRisk: Array<AssetRiskType>;
  assetLevelTwoId: string | number;
};

type RefProps = {
  updateRisks: () => void;
};

const { POPUP_INPUT } = TYPE_FIELD;

const TableRiskWarn = forwardRef<RefProps, Props>(
  ({ assetRisk, assetLevelTwoId }, ref) => {
    const { riskTypeOptions } = useSelector(
      (state: RootState) => state.globalSlice
    );

    const { isCompleteSurvey } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );

    const [riskList, setRiskList] = useState<Array<AssetRiskType>>([]);
    const [categoryData, setCategoryData] = useState<{
      riskAssetOptions: any[];
    }>({
      riskAssetOptions: [],
    });

    const handleValidateRiskTypeItem = (riskList: AssetRiskType[]) => {
      for (let index = 0; index < riskList.length; index++) {
        const item = riskList[index];
        if (!item.riskAssetId && !item.riskTypeId && !item.description) {
          message.error(
            "Vui lòng nhập thông tin cảnh báo rủi ro hoặc xoá những hàng không có dữ liệu!"
          );
          return false;
        }
      }
      return true;
    };

    useImperativeHandle(ref, () => ({
      updateRisks: () => {
        if (!handleValidateRiskTypeItem(riskList)) return null;
        return riskList?.map((item, index) => ({ ...item, orderBy: index }));
      },
    }));

    useEffect(() => {
      if (assetRisk) {
        setRiskList(assetRisk.map((item) => ({ ...item, key: randomId() })));
      }
    }, [assetRisk]);

    useEffect(() => {
      const getCategoryData = async () => {
        try {
          const resRiskAssets = await categoryApi.getRiskTypesByAssetLevelTwo(
            assetLevelTwoId
          );
          setCategoryData({
            riskAssetOptions: resRiskAssets.data || [],
          });
        } catch (error) {
          console.log(error);
        }
      };
      getCategoryData();
    }, [assetLevelTwoId]);

    const handleAddRow = () => {
      const newItem: AssetRiskType = {
        key: randomId(),
        riskDetailId: null,
        assetId: null,
        riskAssetId: categoryData.riskAssetOptions[0]?.riskAssetId || null,
        riskTypeId: riskTypeOptions[0]?.value || null,
        description: "",
        riskAsset: {
          riskAssetId: categoryData.riskAssetOptions[0]?.riskAssetId || null,
          riskContent: "",
          assetLevelTwoId: null,
          description: "",
          riskLevel: null,
        },
      };
      setRiskList((prev) => [...prev, newItem]);
    };

    const handleRemoveRow = (record: any) => {
      const tmpArr = [...riskList];
      const foundIndex = tmpArr.findIndex((el) => el.key === record.key);

      if (foundIndex === -1) return;

      tmpArr.splice(foundIndex, 1);
      setRiskList([...tmpArr]);
    };

    const handleChangeRow = (key: string, data: any) => {
      const tmpArr = [...riskList];
      const foundIndex = tmpArr.findIndex((el) => el.key === key);
      if (foundIndex === -1) return;

      tmpArr[foundIndex] = { ...tmpArr[foundIndex], ...data };
      setRiskList([...tmpArr]);
    };

    const columns: ColumnsType<AssetRiskType> = [
      {
        key: 1,
        title: "Loại CBRR",
        dataIndex: "riskTypeId",
        render: (riskTypeId, record) => {
          return (
            <SelectCustom
              options={riskTypeOptions}
              value={riskTypeId}
              onChange={(value) =>
                handleChangeRow(record.key || "", { riskTypeId: value })
              }
              disabled={isCompleteSurvey}
            />
          );
        },
        width: "18%",
      },
      {
        key: 2,
        title: "Nội dung CBRR",
        dataIndex: "riskAssetId",
        render: (riskAssetId, record) => {
          return (
            <SelectCustom
              showSearch
              options={categoryData.riskAssetOptions.map((item: any) => ({
                value: item.riskAssetId,
                label: item.riskContent,
              }))}
              placement="topRight"
              value={riskAssetId}
              onChange={(value) => {
                if (value) {
                  const _riskAsset = categoryData.riskAssetOptions.find(
                    (el: any) => el.riskAssetId === value
                  );
                  if (_riskAsset)
                    handleChangeRow(record.key || "", {
                      riskAssetId: value,
                      riskAsset: _riskAsset,
                    });
                } else
                  handleChangeRow(record.key || "", {
                    riskAssetId: null,
                    riskAsset: null,
                  });
              }}
              style={{
                maxWidth: "350px",
              }}
              dropdownStyle={{
                maxWidth: "350px",
              }}
              disabled={isCompleteSurvey}
            />
          );
        },
        width: "18%",
      },
      {
        key: 3,
        title: "Cấp độ",
        render: (_, record) => {
          return (
            <SelectCustom
              disabled
              options={[]}
              value={record.riskAsset?.riskLevel || null}
              onChange={(value) =>
                handleChangeRow(record.key || "", {
                  riskAsset: { ...record.riskAsset, riskDetailId: value },
                })
              }
            />
          );
        },
        width: "18%",
      },
      {
        key: 4,
        title: "Mô tả chi tiết CBRR",
        dataIndex: "description",
        render: (description, record) => {
          return (
            <FormItem
              type={POPUP_INPUT}
              value={description || ""}
              onChange={(e: any) =>
                handleChangeRow(record.key || "", {
                  description: e.target.value,
                })
              }
              maxLength={1000}
              disable={isCompleteSurvey}
            />
          );
        },
        width: "44%",
      },
    ];

    return (
      <DynamicTable
        columns={columns}
        dataSource={riskList}
        onAddRow={!isCompleteSurvey ? handleAddRow : undefined}
        onRemoveRow={
          !isCompleteSurvey ? (record) => handleRemoveRow(record) : undefined
        }
      />
    );
  }
);

export default TableRiskWarn;
