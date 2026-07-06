import { message } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { assignmentApi } from "apis/asignment";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import TableCustom from "components/TableCustom";
import { AssignmentType } from "constant/types/assignment";
import ComponentsError from "pages/ComponentsError";
import { FC, memo, useState } from "react";
import { formatDateWithHour } from "utils/date";
import { useAssignments } from "utils/request";
import EditAssignmentModal from "../EditAssignmentModal";
import "./style.scss"

type Props = {
  appraisalFileId: string;
  appraisalUnit: number | null;
  fileStatus: number;
};

const AssignmentTable: FC<Props> = ({ appraisalFileId, appraisalUnit, fileStatus }) => {
  const { data, isLoading, error, mutate } = useAssignments(appraisalFileId);
  const userName = localStorage.getItem("username");
  const [showEditAssignemntModal, setShowEditAssignmentModal] = useState(false);
  const [assingmentSelected, setAssignmentSelected] = useState<AssignmentType>({
    appraisalFileId: "",
    assignmentId: 0,
    companyBranch: {
      companyBranchId: 0,
      companyBranchName: "",
      address: "",
      code: "",
    },
    companyBranchId: 0,
    jobAssigner: "",
    jobType: {
      jobTypeId: 0,
      jobTypeName: "",
    },
    jobTypeId: 0,
    priorityLevel: 0,
    staffs: [],
    status: 0,
    timeAssigned: null,
    timeEnd: null,
  });

  // const columns = defaultColumns.map((item) => {
  //   if (item.key === 7) {
  //     return {
  //       ...item,
  //       render: (_: any, record: any) => (
  //         <>
  //           <ListButtonActionUpdate
  //             editFunction={() => {}}
  //             removeFunction={() => {}}
  //           />
  //         </>
  //       ),
  //     };
  //   } else return { ...item };
  // });
  const handleEditAssignment = (record: AssignmentType) => {
    setAssignmentSelected(record);
    setShowEditAssignmentModal(true);
  };
  const closeEditAssignmentModal = () => {
    setShowEditAssignmentModal(false);
  };
  const handleCheckUserCanEdit = (record: AssignmentType) => {
    // trạng thái khởi tạo, tiếp nhận thì k dc edit
    const checkJobType = record.jobTypeId !== 0 && record.jobTypeId !== 1;
    if (userName && record.jobAssigner?.includes(userName) && checkJobType && fileStatus < 12) return true;
    return false;
  }
  const columns: ColumnsType<AssignmentType> = [
    {
      key: 1,
      title: "Bước thực hiện",
      align: "center",
      width: '12.8%',
      render: (_, record) => record.jobType?.jobTypeName,
    },
    {
      key: 2,
      title: "Chi nhánh SBA",
      dataIndex: "branch",
      align: "center",
      width: '10.6%',
      render: (_, record) => record.companyBranch?.companyBranchName,
    },
    {
      key: 3,
      title: "Người được phân công",
      dataIndex: "staffs",
      width: '25.5%',
      render: (staffs, record) => {
        return staffs?.map((el: string, index: number) => (
          <div key={index}>{el}</div>
        ));
      },
      align: "center",
    },
    {
      key: 4,
      title: "Ngày phân công",
      dataIndex: "timeAssigned",
      align: "center",
      width: '15.5%',
      render: (timeAssigned) => {
        if (timeAssigned) {
          return <>{formatDateWithHour(timeAssigned)}</>;
        }
      },
    },
    {
      key: 5,
      title: "Người phân công",
      dataIndex: "jobAssigner",
      width: '19.6%',
      align: "center",
    },
    {
      key: 6,
      title: "Độ ưu tiên",
      dataIndex: "priorityLevel",
      align: "center",
      width: '8%',
      render: (priorityLevel) => (priorityLevel === 1 ? "Cao" : "Thấp"),
    },
    {
      key: 7,
      title: "Hành động",
      dataIndex: "0",
      align: "center",
      width: '8%',
      render: (_, record, index) => {
        const canEdit = handleCheckUserCanEdit(record) && index === 0;
        return (
          <>
            <ListButtonActionUpdate
              editFunction={() => {
                handleEditAssignment(record);
              }}
              removeFunction={() => handleDeleteAssignment(record.assignmentId)}
              disable={!canEdit}
            />
          </>
        )
      },
    },
  ];

  const handleDeleteAssignment = async (assignmentId: number) => {
    try {
      const res = await assignmentApi.delete(assignmentId);
      if (res.data.code === 200) message.success(res.data.message);
      else message.error(res.data.message);
      mutate();
    } catch (error: any) {
      message.error("Xóa phân công không thành công");
    }
  };

  if (error) return <ComponentsError />;

  return (
    <>
      <TableCustom
        bordered={true}
        columns={columns}
        dataSource={data ? data : []}
        isLoading={!data && isLoading}
        limit={data?.limit}
        page={data?.page}
        total={data?.total}
        scroll={{ 
          y: 600
        }}
        onLimitChange={(limit) => {}}
        onPageChange={(page) => {}}
        paginationConditional={false}
      />
      <EditAssignmentModal
        isOpenModal={showEditAssignemntModal}
        closeModal={closeEditAssignmentModal}
        appraisalFileId={appraisalFileId}
        appraisalUnit={appraisalUnit}
        assignment={assingmentSelected}
        mutate={mutate}
      />
    </>
  );
};

export default memo(AssignmentTable);
