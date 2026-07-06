import { Button, message, Space, Typography } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import { ROLES } from "constant/common";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import GeneralInfo from "pages/AppraisalFileCreate/component/GeneralInfor";
import "pages/AppraisalFileCreate/style.scss";
import BlockUser from "pages/BlockUser";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  APPRAISAL_FILES_CREATE,
  APPRAISAL_FILES_RECEIVE,
  APPRAISAL_FILE_DETAIL,
} from "routes/route.constant";
import { isContainRole } from "utils/common";
export const isCanCreateAppraisalFile = isContainRole(ROLES.CBTH, ROLES.ADMIN);
const AppraisalFileCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const btnCreateRef = useRef<{ createNewAppraisalFile: () => void }>(null);
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Hồ sơ đến",
        path: APPRAISAL_FILES_RECEIVE,
      },
      {
        label: "Tạo mới hồ sơ",
        path: APPRAISAL_FILES_CREATE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, []);

  const [loading, setLoading] = useState(false);

  const createAppraisalFile = async () => {
    setLoading(true);
    try {
      const appraisalFileData: any =
        await btnCreateRef.current?.createNewAppraisalFile();
      if (appraisalFileData) {
        const response = await appraisalFilesApi.createAppraisalFileManual(
          appraisalFileData
        );
        if (response.data.code === 200) {
          message.success(response.data?.message);
          navigate(APPRAISAL_FILE_DETAIL.replace(":id", response.data.data));
        } else message.error(response.data?.message);
      } else {
        message.error("Thông tin chưa đầy đủ");
      }
    } catch (error) {
      message.error("Thêm mới hồ sơ thất bại!");
    } finally {
      setLoading(false);
    }
  };
  // if (!isCanCreateAppraisalFile)
  // return (
  //   <BlockUser
  //     message="Bạn không có quyền tạo hồ sơ."
  //   />
  // );
  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div className="header-wrapper-appraisal-file-create">
          <Space className="title-wrapper" style={{ display: "flex" }}>
            <Typography className="title">Tạo mới hồ sơ</Typography>
          </Space>
          <Space
            className="actions-wrapper"
            style={{ display: "flex", justifyContent: "end" }}
            size={4}
          >
            <Button
              className="btn-save"
              onClick={createAppraisalFile}
              loading={loading}
            >
              Lưu
            </Button>
          </Space>
        </div>
        <GeneralInfo ref={btnCreateRef} />
      </div>
    </div>
  );
};

export default AppraisalFileCreate;
