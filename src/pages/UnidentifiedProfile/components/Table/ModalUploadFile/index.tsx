import {
    Button,
    Col,
    Divider,
    Form,
    Modal,
    Row,
    Space,
    Typography,
    Upload,
    message,
  } from "antd";
  import type { RcFile } from "antd/es/upload/interface";
  import { appraisalFilesApi } from "apis/appraisalFiles";
  import { ecmFileApi } from "apis/ecmFile";
  import Icons from "assets/icons";
  import ButtonCustom from "components/ButtonCustom";
  import InputFields from "components/InputFields";
  import ListButtonActionUpdate from "components/ListButtonActionUpdate";
  import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
  import { AppraisalFileLegalDocumentCreateType } from "constant/types";
  import { InputFiledParams } from "constants/types/Form_Field_type";
  import { saveAs } from "file-saver";
  import { useFormik } from "formik";
  import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
  import "./style.scss";
  import dayjs from "dayjs";
  
  type Props = {
    isOpen: boolean;
    closeModal: () => void;
    dataInit?: AppraisalFileLegalDocumentCreateType | undefined;
    dataFile: any;
    dataAll: any;
    mutateFeeModalTable: any;
  };
  
  // const validationSchema = Yup.object().shape({
  //   fileName: Yup.string().required('Vui lòng chọn "Ghi nhận nội bộ"').nullable(),
  // });
  
  const { TEXT_AREA, SELECT, DATE_PICKER } = TYPE_FIELD;
  
  const ModalUploadFileUnknown: React.FC<Props> = ({
    isOpen,
    closeModal,
    dataFile,
    dataAll,
    mutateFeeModalTable,
  }) => {
    const formEditData = useFormik({
      initialValues: {
        fileName: "",
        ecmId: "",
        noteFile: "",
        filesLength: 0,
        dateUpload: "",
      },
      // validationSchema: validationSchema,
      validateOnChange: true,
      onSubmit: async (data: any) => {
        try {
          let resultFile = await handleUploadFileEcm();
          if (resultFile.length === 0 && !dataFile.fileName) {
            message.error("Vui lòng upload file tài liệu!");
            return;
          }
          // if (
          //   (resultFile && resultFile.length > 0) ||
          //   data.noteFile
          // ) {
          let body = {
            ...dataAll,
            // noteFile: data.noteFile || dataFile.noteFile,
            noteFile: data.noteFile,
            dateUpload: data.dateUpload,
            fileName:
              resultFile.length > 0 ? resultFile[0].filename : dataFile.fileName,
            ecmId: resultFile.length > 0 ? resultFile[0].ecmId : dataFile.ecmId,
            feeContents: dataAll.feeContents.map((item: any) => {
              return {
                ...item,
                dateUpload: data.dateUpload,
              };
            }),
          };
          let res = await appraisalFilesApi.updateFeeNotificationInfo(body);
          if (res.data.body.code === 200) {
            message.success("Cập nhật tài liệu thành công!");
            mutateFeeModalTable();
          } else {
            throw new Error();
          }
          // }
          setTimeout(() => {
            handleCloseModal();
          }, 500);
        } catch (error) {
          message.error("Cập nhật thông tin thất bại!");
        }
      },
    });
  
    const [fileList, setFileList] = useState<any[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string>("");
  
    useEffect(() => {
      if (
        (dataFile.fileName && dataFile.ecmId) ||
        dataFile.noteFile ||
        dataFile.dateUpload
      ) {
        formEditData.setValues({
          ...formEditData.values,
          ecmId: dataFile.ecmId,
          fileName: dataFile.filename,
          noteFile: dataFile.noteFile,
          dateUpload: dataFile.dateUpload,
        });
        setFileList([]);
      } else {
        formEditData.setValues({
          ...formEditData.values,
          ecmId: "",
          fileName: "",
          noteFile: "",
          dateUpload: "",
        });
        setFileList([]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataFile]);
  
    const handleDownload = async (ecmId: string, filename: string) => {
      if (ecmId && filename) {
        try {
          const res = await ecmFileApi.downloadECMFileFromNotification({
            ecmId,
            filename,
            mediaType: "application/pdf",
          });
  
          saveAs(res.data, filename);
        } catch {
          message.error("Tải file thất bại!");
        }
      } else message.error("Tải file thất bại!");
    };
  
    const handleDisplay = async (ecmId: string, filename: string) => {
      if (ecmId && filename) {
        try {
          const res = await ecmFileApi.downloadECMFileFromNotification({
            ecmId,
            filename,
            mediaType: "application/pdf",
          });
  
          const pdfUrl = URL.createObjectURL(res.data);
          setPdfUrl(pdfUrl);
        } catch {
          message.error("Xem file thất bại!");
        }
      } else message.error("Xem file thất bại!");
    };
  
    const handleUploadFileEcm = async () => {
      const fileUploadedInfo = [];
  
      const handleUpload = async (item: any) => {
        const formDataFile = new FormData();
        formDataFile.append("file", item as RcFile);
  
        let res;
        let success = false;
        let retryCount = 0;
        const maxRetries = 3;
  
        while (!success && retryCount < maxRetries) {
          try {
            res = await ecmFileApi.uploadECMFile(formDataFile, {
              fileType: "legalDocument",
            });
  
            if (res.data?.statusCodeValue === 200 && res.data?.body?.ecmId) {
              message.success(`Upload file ${item.name} thành công!`);
              success = true;
            } else {
              throw new Error(`Lỗi server: ${JSON.stringify(res.data)}`);
            }
          } catch (error) {
            retryCount++;
  
            // if (retryCount > 1) {
            // Chỉ hiển thị thông báo lỗi từ lần thứ hai trở đi
            // message.error(`Lỗi khi upload file ${item.fileList[0].name}!`);
            // }
  
            // Thêm cơ chế giảm tần suất gọi API ở đây nếu cần (delay, backoff, ...)
          }
        }
  
        if (!success) {
          // message.error(
          //   `Upload file ${item.fileList[0].name} thất bại sau ${maxRetries} lần thử!`
          // );
          message.error(`Upload file ${item.name} thất bại!`);
          return null;
        }
  
        return { ...res?.data?.body, key: item.key };
      };
  
      for (let i = 0; i < fileList.length; i++) {
        if (fileList && fileList.length > 0) {
          const result = await handleUpload(fileList[i]);
          fileUploadedInfo.push(result);
        }
      }
  
      return fileUploadedInfo;
    };
  
    const handleCloseModal = () => {
      formEditData.setValues({
        ...formEditData.values,
        noteFile: "",
        filesLength: 0,
        dateUpload: "",
      });
      setFileList([]);
      closeModal();
    };
  
    const uploadResult = {
      onRemove: (file: any) => {
        const newFileList = fileList.filter((item: any) => item.uid !== file.uid);
        setFileList(newFileList);
      },
      beforeUpload: (file: any) => {
        const isPDF = file.type === "application/pdf";
        if (!isPDF) {
          message.error("Chỉ chấp nhận tệp PDF!");
          return false;
        }
        formEditData.setValues({
          ...formEditData.values,
          filesLength: 1,
        });
        setFileList([...fileList, file]);
        return false;
      },
      fileList,
      accept: ".pdf",
    };
  
    const handleChangeContent = (event: ChangeEvent<HTMLInputElement>) => {
      formEditData.setFieldValue("noteFile", event.target.value);
    };
  
    const handleChangeValue = (data: any) => {
      formEditData.setValues({
        ...formEditData.values,
        ...data,
      });
    };
  
    const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
    const labelCol = { xs: 5, sm: 5, md: 8, lg: 8, xl: 8 };
    const wrapperCol = { xs: 19, sm: 19, md: 16, lg: 16, xl: 16 };
  
    const inputs: InputFiledParams[] = [
      {
        key: 1,
        type: TEXT_AREA,
        span: 24,
        error: formEditData.errors.noteFile,
        labelCol: labelCol,
        wrapperCol: wrapperCol,
        css: css,
        label: "Nội dung",
        value: formEditData.values.noteFile,
        onChange: handleChangeContent,
      },
      {
        key: 2,
        label: "Ngày upload TB đã XN",
        type: DATE_PICKER,
        showTime: true,
        placeholder: DATE_TIME_FORMAT.dateTimeFull,
        formatDatetime: DATE_TIME_FORMAT.dateTimeFull,
        css: css,
        labelCol: labelCol,
        wrapperCol: wrapperCol,
        value: formEditData.values.dateUpload
          ? dayjs(formEditData.values.dateUpload)
          : null,
        error: formEditData.errors.dateUpload,
        touched: formEditData.touched.dateUpload,
        onChange: (value: any) => {
          handleChangeValue({ dateUpload: value ? dayjs(value).toISOString() : null });
        },
      },
    ];
    return (
      <>
        {!pdfUrl && (
          <Modal
            open={isOpen}
            onCancel={closeModal}
            title={
              <Typography.Text className="modal-title">
                Cập nhật tài liệu
              </Typography.Text>
            }
            footer={
              <Row justify={"end"}>
                <Space>
                  <ButtonCustom
                    type="default"
                    size="middle"
                    style={{ width: "100px" }}
                    label="Hủy"
                    onClick={handleCloseModal}
                  />
                  <ButtonCustom
                    type="primary"
                    size="middle"
                    style={{ width: "100px" }}
                    label="Lưu"
                    onClick={() => {
                      formEditData.submitForm();
                    }}
                    htmlType="submit"
                  />
                </Space>
              </Row>
            }
          >
            <Divider style={{ margin: "10px" }} />
            <Form
              size="small"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 8 }}
              labelAlign="left"
              requiredMark={false}
              labelWrap
              colon={false}
            >
              <Row gutter={[24, 16]} style={{ width: "100%" }}>
                <InputFields data={inputs} />
                <Col xs={css.xs} sm={css.sm} lg={css.lg} md={css.md} xl={css.xl}>
                  <Form.Item
                    label="File tài liệu"
                    required
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    name="filesLength"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập thông tin tài liệu",
                      },
                    ]}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Upload {...uploadResult} maxCount={1} name="file">
                        <Button icon={<Icons.upload />}>Chọn file</Button>
                      </Upload>
                      {dataFile && dataFile.fileName && dataFile.ecmId && (
                        <span>
                          <ListButtonActionUpdate
                            downloading={dataFile.downloading || false}
                            downloadFunction={() => {
                              handleDownload(dataFile.ecmId, dataFile.fileName);
                              // handleDownload(
                              //   "a61307ce-18d1-437c-b50b-16c5da98d22a",
                              //   "cbth1-sba@sacombank.com_1705150286985.pdf"
                              // );
                            }}
                          />
                          <ListButtonActionUpdate
                            viewFunction={() => {
                              handleDisplay(dataFile.ecmId, dataFile.fileName);
                              // handleDisplay(
                              //   "a61307ce-18d1-437c-b50b-16c5da98d22a",
                              //   "cbth1-sba@sacombank.com_1705150286985.pdf"
                              // );
                            }}
                          />
                        </span>
                      )}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        )}
        {pdfUrl && (
          <Modal
            className="custom-modal"
            open={isOpen}
            onCancel={() => {
              setPdfUrl("");
            }}
            footer={false}
            title={
              <Typography.Text className="modal-title">
                Xem chi tiết tài liệu
              </Typography.Text>
            }
          >
            <iframe src={pdfUrl} className="custom-iframe"></iframe>
          </Modal>
        )}
      </>
    );
  };
  
  export default ModalUploadFileUnknown;
  