import { Button, Row, Typography, message } from "antd";
import { ColumnsType } from "antd/es/table";
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
import { formatDateWithHour, randomId } from "utils";
import { transformToOptions } from "utils/common";
import { useCustomerDocumentType } from "utils/request";
import "./style.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  sbaAppraisalFileInfor: {
    legalDocuments: Array<AppraisalFileLegalDocumentType>;
  };
  disableEdit: boolean;
  assetLevelTwoId: number | null;
};

type FormDataType = {
  legalDocuments: Array<AppraisalFileLegalDocumentType>;
};

const initialValue: FormDataType = {
  legalDocuments: [],
};

type RefProps = {
  updateSbaAppraisalFileRequireInfor: () => void;
};
const { SELECT } = TYPE_FIELD;
const SBARequireAddAppraisal = forwardRef<RefProps, Props>(
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
      updateSbaAppraisalFileRequireInfor: form.submitForm,
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

    const columns: ColumnsType<AppraisalFileLegalDocumentType> = [
      {
        key: 0,
        title: "STT",
        width: "3%",
        align: "center",
        render: (value, record, index) => index + 1,
      },
      {
        key: 1,
        title: "Loại tài liệu",
        dataIndex: "typeAppraisal",
        width: "25%",
        align: "left",
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
      },
      {
        key: 2,
        title: "Nội dung",
        dataIndex: "documentContent",
        align: "left",
        width: "12%",
        render: (documentContent) => {
          // Kiểm tra nếu trường là một URL
          if (/^(ftp|http|https):\/\/[^ "]+$/.test(documentContent)) {
            return (
              <Link
                to={documentContent}
                target="_blank"
                className="link-underline"
              >
                {documentContent}
              </Link>
            );
          } else {
            return <Typography.Text>{documentContent}</Typography.Text>;
          }
        },
      },
      {
        key: 3,
        title: "Tên file",
        dataIndex: "filename",
        align: "left",
        width: "20%",
      },
      {
        key: 4,
        title: "Ngày đưa lên",
        dataIndex: "dateUpload",
        align: "center",
        width: "10%",
        render: (dateUpload: string) => (
          <>{dateUpload ? formatDateWithHour(dateUpload) : null}</>
        ),
      },
      {
        key: 5,
        title: "Người đưa lên",
        dataIndex: "whoUpload",
        align: "left",
        width: "12%",
      },
      // {
      //   key: 6,
      //   title: "Mức độ tài liệu",
      //   dataIndex: "levelAppraisal",
      //   align: "left",
      //   width: "12%",
      //   render: (_, record) =>
      //     !record.legalDocumentType.isRequired ? "Không bắt buộc" : "Bắt buộc",
      // },
      {
        key: "action",
        dataIndex: "action",
        align: "center",
        width: "5%",
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
              substractFunction={() => {
                handleRemove(record);
              }}
              disable={!record.ecmId}
              isLockRePricing={documentOfParentAppraisalFile.includes(
                record.ecmId
              )}
              downloadTooltip={
                record.ecmId ? record.filename : "Đang nhận dữ liệu"
              }
            />
          </>
        ),
      },
    ];

    const datasource = form.values.legalDocuments.map((item) => {
      return {
        ...item,
        legalDocumentTypeName: item?.legalDocumentType?.name,
        isRequired: item?.legalDocumentType?.isRequired,
      };
    });

    return (
      <div>
        <CreateNewModal
          addNew={handleAdd}
          closeModal={closeModalCreate}
          isOpen={isOpenModalCreate}
          // Loại cho hồ sơ yêu cầu bổ sung
          type={APPRAISAL_LEGAL_DOCUMENT_TYPE.SBA_REQUIRED}
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
          scroll={{ x: 1200 }}
          page={1}
          total={0}
          isLoading={false}
        />
      </div>
    );
  }
);

export default memo(SBARequireAddAppraisal);
