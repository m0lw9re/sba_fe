import { message } from "antd";
import { ColumnsType } from "antd/es/table";
import { ecmFileApi } from "apis/ecmFile";
import FormItem from "components/InputFields/FormItem";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import TableCustom from "components/TableCustom";
import { TYPE_FIELD } from "constant/enums";
import { AppraisalFileLegalDocumentType } from "constant/types";
import { saveAs } from "file-saver";
import { useFormik } from "formik";
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
import ButtonCustom from "components/ButtonCustom";
import Icons from "assets/icons";
const { SELECT } = TYPE_FIELD;
type Props = {
  legalDocuments: Array<AppraisalFileLegalDocumentType>;
  assetLevelTwoId: number | null;
};

type FormDataType = {
  legalDocuments: Array<AppraisalFileLegalDocumentType>;
};
type RefProps = {
  updateSacombankAppraisalFileInfor: () => void;
};
const initialValue: FormDataType = {
  legalDocuments: [],
};

const SacombankApraisalFile = forwardRef<RefProps, Props>(
  ({ legalDocuments, assetLevelTwoId }, ref) => {
    const [isDownloadingAll, setIsDownloadingAll] = useState<boolean>(false);
    const form = useFormik({
      initialValues: initialValue,
      onSubmit: (data: FormDataType): any => {
        return data;
      },
    });
    const { data: legalDocumentData } = useCustomerDocumentType({
      assetLevelTwoId,
    });

    useEffect(() => {
      if (legalDocuments) {
        const formData: FormDataType = {
          legalDocuments: legalDocuments.map((item) => {
            return {
              ...item,
              key: randomId(),
            };
          }),
        };
        form.setValues({ ...formData });
      }
    }, [JSON.stringify(legalDocuments)]);

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
        key: 1,
        title: "STT",
        width: "5%",
        align: "center",
        render: (value, record, index) => index + 1,
      },
      {
        key: 2,
        title: "Loại tài liệu",
        dataIndex: "typeAppraisal",
        width: "30%",
        align: "center",
        render: (_: any, record, index: number) => {
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
        key: 3,
        title: "Tên file",
        dataIndex: "filename",
        align: "left",
        width: "25%",
      },
      {
        key: 3.1,
        title: "Ngày đưa lên",
        dataIndex: "dateUpload",
        align: "center",
        width: "15%",
        render: (dateUpload: string) => (
          <>{dateUpload ? formatDateWithHour(dateUpload) : null}</>
        ),
      },
      {
        key: 4,
        title: "Người đưa lên",
        dataIndex: "whoUpload",
        align: "left",
        width: "20%",
      },
      // {
      //   key: 5,
      //   title: "Mức độ tài liệu",
      //   align: "left",
      //   width: "12%",
      //   render: (_, record) =>
      //     !record.legalDocumentType.isRequired ? "Không bắt buộc" : "Bắt buộc",
      // },
      {
        key: 6,
        title: "Hành động",
        dataIndex: "action",
        align: "center",
        width: "5%",
        render: (_: any, record: any, index: number) => {
          return (
            <ListButtonActionUpdate
              downloading={record.downloading || false}
              downloadFunction={() => {
                handleDownload(record.ecmId, record.filename, record.key);
              }}
              disable={!record.ecmId}
              downloadTooltip={
                record.ecmId ? record.filename : "Đang nhận dữ liệu"
              }
            />
          );
        },
      },
    ];

    useImperativeHandle(ref, () => ({
      updateSacombankAppraisalFileInfor: form.submitForm,
    }));

    const handleDownloadAll = () => {
      try {
        setIsDownloadingAll(true);
        const arrData = [...form.values.legalDocuments];
        for (let i = 0; i < arrData.length; i++) {
          const item = arrData[i];
          if (i === arrData.length - 1) {
            ecmFileApi
              .downloadECMFile("legalDocument", item.ecmId)
              .then((res) => saveAs(res.data, item.filename))
              .catch((err) => message.error(`Lỗi tải file ${item.filename}`))
              .finally(() => setIsDownloadingAll(false));
          } else {
            ecmFileApi
              .downloadECMFile("legalDocument", item.ecmId)
              .then((res) => saveAs(res.data, item.filename))
              .catch((err) => message.error(`Lỗi tải file ${item.filename}`));
          }
        }
      } catch (error) {}
    };

    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingBottom: "0.5rem",
          }}
        >
          <ButtonCustom
            loading={isDownloadingAll}
            type="primary"
            size="small"
            icon={<Icons.download />}
            onClick={handleDownloadAll}
          >
            Tải xuống tất cả
          </ButtonCustom>
        </div>
        <TableCustom
          dataSource={
            form.values.legalDocuments?.sort(
              (a, b) => Number(a.dateUpload) - Number(b.dateUpload)
            ) || []
          }
          columns={columns}
          bordered
          pagination={false}
          size="small"
          isLoading={false}
          page={1}
          total={0}
          limit={100}
          scroll={{ x: 1200 }}
          onLimitChange={() => 0}
          onPageChange={() => 0}
        />
      </>
    );
  }
);

export default memo(SacombankApraisalFile);
