import { Card, Space, Tooltip, Upload, UploadProps, message } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import ListButtonActionUpdate from "components/ListButtonActionUpdate";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesTable/style.scss";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { ColumnsType } from "antd/es/table";
import { randomId } from "utils/string";
import ButtonCustom from "components/ButtonCustom";
import { formatDate, numberUtils } from "utils";
import EditPriceFrameModal from "../EditPriceFrameModal";
import {
  FilterPriceFrameType,
  PriceFrameType,
} from "constant/types/priceFrame";
import { usePriceFrame } from "utils/request/usePriceFrame";
import { priceFrameApi } from "apis/framePrice";
import ComponentsError from "pages/ComponentsError";
import { BUTTON_CODES } from "constant/common";
import saveAs from "file-saver";
import { FileExcelTwoTone } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";

type Props = {
  filter: FilterPriceFrameType;
  setFilter: (filter: FilterPriceFrameType) => void;
};
const PriceFrameTable: FC<Props> = ({ filter, setFilter }) => {
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const [editPriceFrameItem, setEditPriceFrameItem] = useState<PriceFrameType>(
    {}
  );
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);

  const handleCreate = () => {
    setOpenAddModal(true);
    setModalType("add");
  };
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setModalType(null);
  };
  const handleEdit = (
    roadInPriceRangeId: number,
    provinceCode: string,
    districtsCode: string,
    road: string,
    doanDuongTu: string,
    doanDuongDen: string,
    giaNhaNuoc: number,
    giaThiTruongTu: number,
    giaThiTruongDen: number,
    effectiveFrom: string,
    effectiveTo: string
  ) => {
    setOpenAddModal(true);
    setModalType("edit");
    const priceFrameItem: PriceFrameType = {
      roadInPriceRangeId: roadInPriceRangeId,
      provinceCode: provinceCode,
      districtsCode: districtsCode,
      road: road,
      doanDuongTu: doanDuongTu,
      doanDuongDen: doanDuongDen,
      giaNhaNuoc: giaNhaNuoc,
      giaThiTruongTu: giaThiTruongTu,
      giaThiTruongDen: giaThiTruongDen,
      effectiveFrom: effectiveFrom,
      effectiveTo: effectiveTo,
    };
    setEditPriceFrameItem(priceFrameItem);
  };

  const { data, isLoading, error, mutate } = usePriceFrame(params, filter);
  const handleDelete = async (id: number) => {
    const res = await priceFrameApi.deletePriceFrame(id);
    if (res.data.body.code === 200) {
      message.success(res.data.body.message);
      mutate();
    } else {
      message.error(res.data.body.message);
    }
  };
  const dataTable = data
    ? data.data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    if (filter.isFiltering) {
      setParams({ ...params, page: 1 });
      setFilter({
        ...filter,
        isFiltering: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useLayoutEffect(() => {
    if (
      params?.page !== undefined &&
      params?.page > 1 &&
      params?.limit !== undefined &&
      params?.limit >= 5 &&
      params.limit !== prevParamsRef.current.limit
    ) {
      setParams({
        ...params,
        limit: params.limit,
        page: 1,
      });
    }
  }, [params]);

  useEffect(() => {
    prevParamsRef.current = params;
  }, [params]);

  const columns: ColumnsType<PriceFrameType> = [
    {
      key: 1,
      title: "STT",
      align: "center",
      render: (_, record, index) => {
        return (Number(params.page) - 1) * Number(params.limit) + index + 1;
      },
      width: "75px",
    },
    {
      key: 2,
      title: "Tỉnh/TP",
      dataIndex: "province",
      align: "left",
      render: (province) => (
        <Tooltip title={province}>
          <div className="inline-text">{province}</div>
        </Tooltip>
      ),
      width: "200px",
    },
    {
      key: 3,
      title: "Quận/Huyện/Thị xã",
      dataIndex: "districts",
      align: "left",
      render: (districts) => (
        <Tooltip title={districts}>
          <div className="inline-text">{districts}</div>
        </Tooltip>
      ),
    },
    {
      key: 4,
      title: "Tên đường",
      dataIndex: "road",
      align: "left",
      render: (road) => (
        <Tooltip title={road}>
          <div className="tooltip-text">{road}</div>
        </Tooltip>
      ),
    },
    {
      key: 5,
      title: "Từ",
      dataIndex: "doanDuongTu",
      align: "left",
      render: (doanDuongTu) => (
        <Tooltip title={doanDuongTu}>
          <div className="inline-text">{doanDuongTu}</div>
        </Tooltip>
      ),
    },
    {
      key: 6,
      title: "Đến",
      dataIndex: "doanDuongDen",
      align: "left",
      render: (doanDuongDen) => (
        <Tooltip title={doanDuongDen}>
          <div className="inline-text">{doanDuongDen}</div>
        </Tooltip>
      ),
    },
    {
      key: 7,
      title: "Giá NN hiện hành",
      dataIndex: "giaNhaNuoc",
      align: "right",
      render: (giaNhaNuoc) => (
        <Tooltip title={giaNhaNuoc}>
          <div className="inline-text">
            {numberUtils.formatNumber(giaNhaNuoc)}
          </div>
        </Tooltip>
      ),
    },
    {
      key: 8,
      title: "Giá TT thấp nhất",
      dataIndex: "giaThiTruongTu",
      align: "right",
      render: (giaThiTruongTu) => (
        <Tooltip title={giaThiTruongTu}>
          <div className="inline-text">
            {numberUtils.formatNumber(giaThiTruongTu)}
          </div>
        </Tooltip>
      ),
    },
    {
      key: 9,
      title: "Giá TT cao nhất",
      dataIndex: "giaThiTruongDen",
      align: "right",
      render: (giaThiTruongDen) => (
        <Tooltip title={giaThiTruongDen}>
          <div className="inline-text">
            {numberUtils.formatNumber(giaThiTruongDen)}
          </div>
        </Tooltip>
      ),
    },
    {
      key: 10,
      title: "Hiệu lực từ",
      dataIndex: "effectiveFrom",
      align: "right",
      render: (value: string) => {
        return value ? formatDate(value) : "";
      },
    },
    {
      key: 11,
      title: "Hiệu lực đến",
      dataIndex: "effectiveTo",
      align: "right",
      render: (value: string) => {
        return value ? formatDate(value) : "";
      },
    },
    {
      key: 12,
      title: "Hành động",
      align: "center",
      render: (_, record: any) => (
        <>
          <ListButtonActionUpdate
            editFunction={() =>
              handleEdit(
                record.roadInPriceRangeId,
                record.provinceCode,
                record.districtsCode,
                record.road,
                record.doanDuongTu,
                record.doanDuongDen,
                record.giaNhaNuoc,
                record.giaThiTruongTu,
                record.giaThiTruongDen,
                record.effectiveFrom,
                record.effectiveTo
              )
            }
            removeFunction={() => handleDelete(record.roadInPriceRangeId)}
            removeButtonCode={BUTTON_CODES.kgdctt_xoa}
            editButtonCode={BUTTON_CODES.kgdctt_sua}
          />
        </>
      ),
    },
  ];

  const handleDownloadTemplate = async () => {
    try {
      const filePath = require("assets/files/DoanDuongTrongKhungGia.xlsx");
      const response = await fetch(filePath);
      if (!response.ok) {
        message.error("Không tìm thấy file mẫu!");
      }

      const blob = await response.blob();
      saveAs(blob, "DoanDuongTrongKhungGia.xlsx");
    } catch (error) {
      message.error("Không thể tải xuống file mẫu!");
    }
  };

  const handleAddFileExcel = async (file: RcFile) => {
    try {
      setIsLoadingUpload(true);
      const formData: FormData = new FormData();
      formData.append("file", file);
      const res = await priceFrameApi.addFromExcel(formData);
      if (res.data?.code === 200) {
        message.success("Thêm dữ liệu từ file excel thành công!");
        mutate();
      } else {
        message.error(
          res.data?.message || "Thêm dữ liệu từ file excel thất bại!"
        );
      }
    } catch (error) {
      message.error(
        "Lỗi không xác định! Thêm dữ liệu khung giá không thành công"
      );
    } finally {
      setIsLoadingUpload(false);
    }
  };

  const props: UploadProps = {
    onRemove: () => {},
    beforeUpload: async (file) => {
      await handleAddFileExcel(file);
      return false;
    },
    showUploadList: false,
    fileList: [],
    accept: ".xlsx",
  };

  if (error) return <ComponentsError />;
  return (
    <Card className="card-container" size="small">
      <CardTitleCustomUpdate title="Danh sách khung giá tài sản" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "start",
            alignItems: "baseline",
          }}
        >
          <span style={{ color: "#808080" }}>
            Lưu ý: để sử dụng tính năng Thêm từ file excel hãy tải xuống
          </span>{" "}
          <ButtonCustom
            label="file mẫu"
            type="link"
            textColor="rgba(40, 98, 175, 1)"
            onClick={handleDownloadTemplate}
          />
        </div>
        <Space>
          <Upload {...props} maxCount={1}>
            <ButtonCustom
              label="Thêm từ file excel"
              icon={<FileExcelTwoTone twoToneColor="#21A366" />}
              style={{
                background: "transparent",
                borderColor: "#21A366",
                color: "#21A366",
              }}
              loading={isLoadingUpload}
              code={BUTTON_CODES.kgdctt_them}
            />
          </Upload>
          <ButtonCustom
            label="Thêm khung giá"
            type="primary"
            onClick={handleCreate}
            bgColor="rgba(40, 98, 175, 1)"
            code={BUTTON_CODES.kgdctt_them}
          />
        </Space>
      </div>
      <TableCustom
        dataSource={dataTable}
        columns={columns}
        bordered={true}
        isLoading={!data && isLoading}
        limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
        total={data ? data.total : 0}
        onLimitChange={(limit) => {
          setParams({ ...params, limit });
        }}
        onPageChange={(page) => {
          setParams({ ...params, page });
        }}
        page={params.page || 1}
        scroll={{ x: 1600, y: "70vh" }}
      />
      <EditPriceFrameModal
        isOpenModal={openAddModal}
        closeModal={handleCloseAddModal}
        modalType={modalType}
        priceFrame={editPriceFrameItem}
        mutate={mutate}
      />
    </Card>
  );
};

export default PriceFrameTable;
