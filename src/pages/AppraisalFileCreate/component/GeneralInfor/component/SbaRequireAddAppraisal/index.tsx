import {Button, message, Row, Typography} from "antd";
import { ColumnsType } from "antd/es/table";
import Icons from "assets/icons";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import TableCustom from "components/TableCustom";
import { RootState } from "configs/configureStore";
import { APPRAISAL_LEGAL_DOCUMENT_TYPE } from "constant/enums";
import { AppraisalFileLegalDocumentCreateType } from "constant/types";
import { useFormik } from "formik";
import EditLegalModal from "pages/AppraisalFileCreate/component/GeneralInfor/component//EditLegalModal";
import CreateNewAppraisalFileModal from "pages/AppraisalFileCreate/component/GeneralInfor/component/CreateNewAppraisalFileModal";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "utils";

type RefProps = {
  addSbaRequireAppraisalInfor: () => void;
};

type FormDataType = {
  legalDocuments: Array<AppraisalFileLegalDocumentCreateType>;
};

const initialValue: FormDataType = {
  legalDocuments: [],
};

const SbaRequireAddAppraisal = forwardRef<RefProps>(({}, ref) => {
  const form = useFormik({
    initialValues: initialValue,
    onSubmit: (data: FormDataType): any => {
      return data;
    },
  });

  const appraisalFileState = useSelector(
    (state: RootState) => state.appraisalFileCreateSlice
  );


  useImperativeHandle(ref, () => ({
    addSbaRequireAppraisalInfor: form.submitForm,
  }));

  const handleRemove = (record: any) => {
    const tmpArr = [...form.values.legalDocuments];
    const fonudIndex = tmpArr.findIndex((el) => el.key === record.key);

    if (fonudIndex === -1) return;
    tmpArr.splice(fonudIndex, 1);
    form.setValues({ legalDocuments: [...tmpArr] });
  };

  const handleAdd = (data: AppraisalFileLegalDocumentCreateType) => {
    form.setValues({
      legalDocuments: [
        ...form.values.legalDocuments,
        { ...data, type: APPRAISAL_LEGAL_DOCUMENT_TYPE.SBA_REQUIRED },
      ],
    });
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

  const [isOpenModal, setIsOpenModal] = useState({
    isOpenModalCreate: false,
    isOpenModalEdit: false,
  });

  const [
    apraisalFileLegalDocumentTypeUpdate,
    setApraisalFileLegalDocumentTypeUpdate,
  ] = useState<AppraisalFileLegalDocumentCreateType | undefined>(undefined);

  const handleEdit = (key: string) => {
    const foundIndex = form.values.legalDocuments.findIndex(
      (item) => item.key === key
    );
    if (foundIndex === -1) return;
    setApraisalFileLegalDocumentTypeUpdate(
      form.values.legalDocuments[foundIndex]
    );
    openModalEdit();
  };

  const openModalCreate = () => {
    if (!appraisalFileState.assetLevelTwoId) {
      message.error('Vui lòng chọn loại và loại hình tài sản.')
    } else {
      setIsOpenModal({
        ...isOpenModal,
        isOpenModalCreate: true,
      });
    }
  };

  const openModalEdit = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalEdit: true,
    });
  };

  const closeModalCreate = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalCreate: false,
    });
  };

  const closeModalEdit = () => {
    setIsOpenModal({
      ...isOpenModal,
      isOpenModalEdit: false,
    });
  };

  const columns: ColumnsType<AppraisalFileLegalDocumentCreateType> = [
    {
      title: "STT",
      width: "3%",
      align: "center",
      render: (value, record, index) => index + 1,
    },
    {
      title: "Loại tài liệu",
      dataIndex: "typeAppraisal",
      width: "36%",
      align: "left",
      render: (_: any, record) => {
        return (
          <Typography.Link className="type-appraisal" underline>
            {record.legalDocumentType.name}
          </Typography.Link>
        );
      },
    },
    {
      title: "Ngày đưa lên",
      align: "center",
      render: (dateUpload: string) => (
        <>{dateUpload ? formatDate(dateUpload) : null}</>
      ),
    },
    {
      title: "Người đưa lên",
      dataIndex: "whoUpload",
    },
    // {
    //   title: "Mức độ tài liệu",
    //   align: "center",
    //   render: (_, record) =>
    //     !record.legalDocumentType.isRequired ? "Không bắt buộc" : "Bắt buộc",
    // },
    {
      key: "action",
      dataIndex: "",
      align: "center",
      width: "5%",
      title: (
        <Row justify={"center"}>
          <Button
            icon={<Icons.add />}
            style={{ backgroundColor: "#2862af" }}
            size="small"
            type="primary"
            onClick={openModalCreate}
          />
        </Row>
      ),
      render: (_: any, record: any) => (
        <ListButtonActionUpdate
          editFunction={() => {
            handleEdit(record.key);
          }}
          substractFunction={() => {
            handleRemove(record);
          }}
        />
      ),
    },
  ];
  return (
    <div>
      <CreateNewAppraisalFileModal
        assetLevelTwoId={appraisalFileState.assetLevelTwoId}
        addNew={handleAdd}
        closeModal={closeModalCreate}
        isOpen={isOpenModal.isOpenModalCreate}
      />
      <EditLegalModal
        assetLevelTwoId={appraisalFileState.assetLevelTwoId}
        closeModal={closeModalEdit}
        dataInit={apraisalFileLegalDocumentTypeUpdate}
        edit={handlechange}
        isOpen={isOpenModal.isOpenModalEdit}
      />
      <TableCustom
        bordered
        columns={columns}
        dataSource={form.values.legalDocuments}
        onLimitChange={() => {}}
        onPageChange={() => {}}
        limit={10}
        page={1}
        total={0}
        scroll={{ x: 1200 }}
        isLoading={false}
      />
    </div>
  );
});

export default SbaRequireAddAppraisal;
