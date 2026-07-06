import { Radio, Space } from "antd";
import { contructionApi } from "apis/contruction";
import TableInputAdd from "components/TableInputAddCustom/TableInputAddCustom";
import { RootState } from "configs/configureStore";
import { ConstructionType, ContructionNameType } from "constant/types";
import { useFormik } from "formik";
import "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/FeatureLandItemTab/component/Contruction/style.scss";
import {
  ConstructionOptions,
  setConstructionOptions,
} from "pages/AppraisalFileDetail/store/appraisalFileDetailSlice";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { randomId } from "utils";
import { getUsernameFromToken } from "utils/common";
import { isDeepEqual } from "utils/validate";
import * as Yup from "yup";
import { defaultColumns } from "./config";

type Props = {
  contructionLandInfor: Array<ConstructionType>;
  visible: boolean;
  assetLandInforId: number | null;
  setVisible: (value: boolean) => void;
  index: number;
};
type RefProps = {
  getData: () => void;
};

const formSchema = Yup.object().shape({
  constructions: Yup.array()
    .of(
      Yup.object().shape({
        remainingQuality: Yup.number()
          .nullable()
          .required("Vui lòng nhập CLCL"),
        constructionLegalTypeId: Yup.number()
          .nullable()
          .required("Vui lòng chọn loại pháp lý"),
        constructionNameId: Yup.number()
          .nullable()
          .required("Vui lòng chọn loại công trình"),
        constructionTypeId: Yup.number()
          .nullable()
          .required("Vui lòng chọn đặc tính"),
        constructionArea: Yup.number()
          .nullable()
          .required("Vui lòng nhập diện tích"),
        furnitures: Yup.string()
          .nullable()
          .required("Vui lòng nhập nội thất"),
      })
    )
    .notRequired(),
});
const currentDate = new Date().toISOString();

const Contruction = forwardRef<RefProps, Props>(
  (
    { visible, setVisible, index, contructionLandInfor, assetLandInforId },
    ref
  ) => {
    const { constructionTypeOptions } = useSelector(
      (state: RootState) => state.globalSlice
    );

    const dispatch = useDispatch();
    const { constructionOptions } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );
    const { constructionLegalTypeOptions } = useSelector(
      (state: RootState) => state.globalSlice
    );

    const form = useFormik({
      initialValues: {
        constructions: contructionLandInfor || [],
      } as {
        constructions: ConstructionType[];
      },
      validationSchema: formSchema,
      onSubmit: (data: any): any => {
        return {
          constructions: visible ? data?.constructions : [],
        };
      },
    });
    const constructionsFormData: ConstructionType[] = form.values.constructions;

    const [contructionNameOptions, setContructionNameOption] = useState<
      Array<Array<{ label: string; value: number }>>
    >([]);

    const handleChange = useCallback(
      (data: ConstructionType[]) => {
        form.setValues({
          constructions:
            data?.map((el: any, index: number) => ({
              ...el,
              constructionYear: Number(el.constructionYear) || null,
              repairYear: Number(el.repairYear) || null,
            })) || [],
        });
      },
      [form.values.constructions]
    );
    const handleAdd = () => {
      const tmpArr = [...form.values.constructions];
      const newItem: ConstructionType = {
        key: randomId(),
        assetLandInforId: assetLandInforId,
        baseFloors: null,
        constructionArea: null,
        constructionLegalTypeId: null,
        constructionNameId: null,
        constructionTypeId: null,
        constructionYear: null,
        dateCreate: currentDate,
        dateModify: currentDate,
        describe: null,
        floors: null,
        furnitures: null,
        mdht: null,
        remainingQuality: null,
        repairYear: null,
        whoCreate: getUsernameFromToken(),
      };
      tmpArr.push(newItem);
      form.setValues({
        constructions: tmpArr,
      });
    };

    const handleGetConstructionsTypeOptions = async (id: number) => {
      if (!constructionOptions) return [];

      const options = constructionOptions.find((item: ConstructionOptions) => {
        return item[id];
      })?.[id];
      // get from api
      if (!options) {
        const response = await contructionApi.getContructionName(id);
        const newItemOption = response?.data?.map(
          (ele: ContructionNameType) => {
            return {
              value: ele.constructionNameId,
              label: ele.constructionName,
            };
          }
        );
        dispatch(
          setConstructionOptions([
            {
              [id]: newItemOption,
            },
          ])
        );
        return newItemOption || [];
      }
      return options || [];
    };

    const handleReplaceContructionNameOptions = (
      index: number,
      newItemOptions: [{ value: number; label: string }]
    ) => {
      const newOptions = [...contructionNameOptions];
      newOptions.splice(index, 1, newItemOptions);
      setContructionNameOption(newOptions);
    };

    const changeContructionType = (key: string, value: number | null) => {
      if (constructionsFormData) {
        const foundIndex = constructionsFormData.findIndex(
          (el) => el.key === key
        );
        if (foundIndex === -1) return -1;
        const newData = [...constructionsFormData];
        newData[foundIndex] = {
          ...constructionsFormData[foundIndex],
          constructionTypeId: value,
          constructionNameId: null,
        };
        handleChange(newData);
        return foundIndex;
      }
      return -1;
    };

    const handleChangeContructionType = async (
      key: string,
      value: number | null
    ) => {
      const foundIndex = changeContructionType(key, value);
      if (foundIndex === -1 || !value) return;
      const newItemOption = await handleGetConstructionsTypeOptions(value);
      handleReplaceContructionNameOptions(foundIndex, newItemOption);
    };

    const columns = defaultColumns.map((column) => {
      if (column.key === 2) {
        return {
          ...column,
          error: form.errors.constructions,
          touched: form.touched.constructions,
          options: constructionTypeOptions,
          handleChangeSelect: handleChangeContructionType,
        };
      } else if (column.key === 3) {
        return {
          ...column,
          error: form.errors.constructions,
          touched: form.touched.constructions,
          optionsDynamic: contructionNameOptions,
        };
      } else if (column.key === 4) {
        return {
          ...column,
          error: form.errors.constructions,
          touched: form.touched.constructions,
        };
      } else if (column.key === 5) {
        return {
          ...column,
          error: form.errors.constructions,
          touched: form.touched.constructions,
          options: constructionLegalTypeOptions,
        };
      } else if (column.key === 11 ||  column.key === 8) {
        return {
          ...column,
          error: form.errors.constructions,
          touched: form.touched.constructions,
        };
      } else
        return {
          ...column,
        };
    });

    const handleRemove = (key: string) => {
      const foundIndex = constructionsFormData?.findIndex(
        (el) => el?.key === key
      );
      if (foundIndex === -1) return -1;
      const newData = [...constructionsFormData];
      newData.splice(foundIndex, 1);
      handleChange(newData);
      const newOptions = [...contructionNameOptions];
      newOptions.splice(foundIndex, 1);
      setContructionNameOption(newOptions);
    };
    const handleCopyRow = (index: number) => {
      const newData = [...constructionsFormData];
      const newItem = {
        ...newData[index],
        constructionId: null,
        key: randomId(),
      };
      newData.push(newItem);
      handleChange(newData);
      const newOptions = [...contructionNameOptions];
      newOptions.push(newOptions[index]);
      setContructionNameOption(newOptions);
    };

    useImperativeHandle(ref, () => ({
      getData: async () => {
        await form.submitForm();
        const constructionData = {
          constructions:
            form.values.constructions?.map((el: any, index: number) => ({
              ...el,
              orderBy: index,
            })) || [],
        };
        const validate =
          JSON.stringify(form.errors) === "{}" ? false : form.errors;
        return [constructionData, validate];
      },
    }));

    useEffect(() => {
      if (!visible) form.setValues({ constructions: [] });
    }, [visible]);
    useEffect(() => {
      if (contructionLandInfor) {
        const ids = contructionLandInfor?.map(
          (item) => item.constructionTypeId
        );

        const contructionNameOptions = ids?.map((id) => {
          if (id === null || !constructionOptions) return [];
          const options = constructionOptions.find(
            (item: ConstructionOptions) => {
              return item[id];
            }
          )?.[id];
          return options || [];
        }) as { label: string; value: number }[][];
        Promise.all(contructionNameOptions).then((values) => {
          setContructionNameOption(values);
        });
        handleChange(contructionLandInfor);
      }
    }, [JSON.stringify(contructionLandInfor)]);

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
            data={form.values.constructions}
            setData={handleChange}
            handleAdd={handleAdd}
            column={columns}
            handleRemove={handleRemove}
            handleCopy={handleCopyRow}
            isCheckbox={false}
            scroll={{ x: 1980 }}
          />
        )}
      </Space>
    );
  }
);

export default memo(
  Contruction,
  (prevProps, nextProps): boolean =>
    isDeepEqual(
      prevProps?.contructionLandInfor,
      nextProps?.contructionLandInfor
    ) && prevProps.visible === nextProps.visible
);
