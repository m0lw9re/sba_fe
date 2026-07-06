import { Button, Row, message } from "antd";
import { ecmFileApi } from "apis/ecmFile";
import Icons from "assets/icons";
import FormItem from "components/InputFields/FormItem";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import TableCustom from "components/TableCustom";
import { APPRAISAL_LEGAL_DOCUMENT_TYPE, TYPE_FIELD } from "constant/enums";
import { AppraisalFileLegalDocumentType } from "constant/types";
import { saveAs } from "file-saver";
import { useFormik } from "formik";
import CreateNewModal from "pages/AppraisalFileDetail/component/GeneralInfo/component/CreateNewModal";
import EditLegalModal from "pages/AppraisalFileDetail/component/GeneralInfo/component/EditLegalModal";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { transformToOptions } from "utils/common";
import { useCustomerDocumentType } from "utils/request";
import { randomId } from "utils/string";
import { defaultColumns } from "./config";
import "./style.scss";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  sbaAppraisalFileInfor: {
    legalDocuments: Array<AppraisalFileLegalDocumentType>;
  };
  disableEdit?: boolean;
  assetLevelTwoId: number | null;
};

type FormDataType = {
  legalDocuments: Array<AppraisalFileLegalDocumentType>;
};

const initialValue: FormDataType = {
  legalDocuments: [],
};

type RefProps = {
  updateSbaAppraisalFileInfor: () => void;
};
const { SELECT } = TYPE_FIELD;

const SbaAppraisalFiles = forwardRef<RefProps, Props>(
  ({ sbaAppraisalFileInfor, disableEdit, assetLevelTwoId }, ref) => {
    const { documentOfParentAppraisalFile } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );

    const form = useFormik({
      initialValues: initialValue,
      onSubmit: (data: FormDataType): any => {
        return data;
      },
    });
    const { data: legalDocumentData } = useCustomerDocumentType({
      assetLevelTwoId,
    });
    const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);

    const [
      apraisalFileLegalDocumentTypeUpdate,
      setApraisalFileLegalDocumentTypeUpdate,
    ] = useState<AppraisalFileLegalDocumentType | undefined>(undefined);

    const [isOpenModalCreate, setIsOpenModalCreate] = useState<boolean>(false);

    const openModalCreate = () => {
      setIsOpenModalCreate(true);
    };

    const closeModalCreate = () => {
      setIsOpenModalCreate(false);
    };

    const closeModalEdit = () => {
      setIsOpenEdit(false);
    };

    useImperativeHandle(ref, () => ({
      updateSbaAppraisalFileInfor: form.submitForm,
    }));

    useEffect(() => {
      if (sbaAppraisalFileInfor) {
        const formData: FormDataType = {
          legalDocuments:
            sbaAppraisalFileInfor?.legalDocuments?.map((item) => {
              return {
                ...item,
                key: randomId(),
              };
            }) || [],
        };
        form.setValues({ ...formData });
      }
    }, [JSON.stringify(sbaAppraisalFileInfor)]);

    const handleEdit = (key: string) => {
      const foundIndex = form.values.legalDocuments.findIndex(
        (item) => item.key === key
      );
      if (foundIndex === -1) return;
      setApraisalFileLegalDocumentTypeUpdate(
        form.values.legalDocuments[foundIndex]
      );
      setIsOpenEdit(true);
    };

    const columns = defaultColumns.map((column) => {
      if (column.key === "action") {
        return {
          ...column,
          title: !disableEdit ? (
            <Row justify={"center"}>
              <Button
                icon={<Icons.add />}
                size="small"
                type="primary"
                style={{ backgroundColor: "#2862af" }}
                onClick={openModalCreate}
              />
            </Row>
          ) : (
            <></>
          ),
          render: (_: any, record: any, index: number) => (
            <>
              <ListButtonActionUpdate
                editFunction={() => {
                  handleEdit(record.key);
                }}
                downloading={record.downloading || false}
                downloadFunction={() => {
                  handleDownload(record.ecmId, record.filename, record.key);
                }}
                removePopupPlacement="leftTop"
                substractFunction={() => {
                  handleRemove(record);
                }}
                downloadTooltip={
                  record.ecmId ? record.filename : "Đang nhận dữ liệu"
                }
                isLockRePricing={documentOfParentAppraisalFile.includes(
                  record.ecmId
                )}
              />
            </>
          ),
        };
      } else if (column.key === "legalDocumentTypeName") {
        return {
          ...column,
          render: (_: any, record: any, index: number) => {
            return (
              <FormItem
                type={SELECT}
                options={transformToOptions(
                  legalDocumentData || [],
                  "name",
                  "legalDocumentTypeId"
                )}
                placeholder="Chọn loại tài liệu"
                className="appraisal-legal-documents-select"
                value={record.legalDocumentTypeId}
                style={{
                  maxWidth: "400px",
                }}
                onChange={(value: number) => {
                  const newData = [...form.values.legalDocuments];
                  newData.splice(index, 1, {
                    ...form.values.legalDocuments[index],
                    legalDocumentTypeId: value,
                  });
                  form.setValues({ legalDocuments: newData });
                }}
              ></FormItem>
            );
          },
        };
      } else
        return {
          ...column,
        };
    });

    const handleDownload = async (
      ecmId: string,
      filename: string,
      key?: string
    ) => {
      if (ecmId && filename) {
        try {
          handlechange({ downloading: true }, key || "");
          const res = await ecmFileApi.downloadECMFile("legalDocument", ecmId);
          saveAs(res.data, filename);
          handlechange({ downloading: false }, key || "");
        } catch {
          message.error("Tải file thất bại");
          handlechange({ downloading: false }, key || "");
        }
      } else message.error("Tải file thất bại");
    };

    const handleRemove = (record: any) => {
      const tmpArr = [...form.values.legalDocuments];
      const fonudIndex = tmpArr.findIndex((el) => el.key === record.key);

      if (fonudIndex === -1) return;
      tmpArr.splice(fonudIndex, 1);
      form.setValues({ legalDocuments: [...tmpArr] });
    };

    const handleAdd = (data: AppraisalFileLegalDocumentType) => {
      form.setValues({ legalDocuments: [...form.values.legalDocuments, data] });
    };

    const handlechange = (data: any, key: string) => {
      const foundIndex = form.values.legalDocuments.findIndex(
        (item) => item.key === key
      );
      if (foundIndex === -1) return;

      const newData = [...form.values.legalDocuments];
      newData.splice(foundIndex, 1, {
        ...form.values.legalDocuments[foundIndex],
        ...data,
      });
      form.setValues({ legalDocuments: newData });
    };

    const datasource = form.values.legalDocuments.map((item) => {
      return {
        ...item,
        legalDocumentTypeName: item.legalDocumentType.name,
        isRequired: item.legalDocumentType.isRequired,
      };
    });

    return (
      <div>
        <CreateNewModal
          addNew={handleAdd}
          // Loại cho hồ sơ SBA
          type={APPRAISAL_LEGAL_DOCUMENT_TYPE.SBA}
          closeModal={closeModalCreate}
          isOpen={isOpenModalCreate}
        />
        <EditLegalModal
          closeModal={closeModalEdit}
          dataInit={apraisalFileLegalDocumentTypeUpdate}
          handleEdit={handlechange}
          isOpen={isOpenEdit}
        />
        <TableCustom
          bordered
          columns={columns}
          dataSource={
            datasource?.sort(
              (a, b) => Number(a.dateUpload) - Number(b.dateUpload)
            ) || []
          }
          onLimitChange={() => {}}
          onPageChange={() => {}}
          limit={100}
          page={1}
          total={0}
          scroll={{ x: 1200 }}
          isLoading={false}
        />
      </div>
    );
  }
);

export default memo(SbaAppraisalFiles);
