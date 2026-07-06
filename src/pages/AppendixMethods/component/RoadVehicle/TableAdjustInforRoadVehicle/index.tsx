import { Form, message } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import TableFooterCustom from "components/TableFooterCustom";
import TableInputAdd, {
  ColumnsEdit,
} from "components/TableInputAddCustom/TableInputAddCustom";
import useOutsideClick from "hooks/useOutsideClick";
import AddAdjustCriteriaModal from "pages/AppendixMethods/component/RoadVehicle/TableAdjustInforRoadVehicle/component/AddAdjustCriteriaModal";
import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { isDeepEqual, numberUtils } from "utils";
import { randomId } from "utils/string";
import { defaultColumns2, summaryMockData } from "./config";
import { BUSINESS_ADVANTAGE_OPTIONS } from "constant/common";
import { useDispatch } from "react-redux";
import { setUnitPrice } from "pages/AppendixMethods/store/appendixMethodsSlice";

type Props = {
  adjustTable: any[];
  storedAssets: any[];
  handleUpdateAdjustTable: (data: any[]) => void;
  disabledActions?: boolean;
};

const TableAdjustInforRoadVehicle: FC<Props> = ({
  adjustTable,
  storedAssets,
  handleUpdateAdjustTable,
  disabledActions,
}) => {
  const dispatch = useDispatch();

  const location = useLocation();
  const [columnsMainTable, setColumnsMainTable] = useState<any[]>([]);
  const [columnsSummaryTable, setColumnsSummaryTable] = useState<any[]>([]);

  const [typingTimeout, setTypingTimeout] = useState<any>(0);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [dataSummaryTable, setSummaryDataTable] = useState<any[]>([]);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [localAdjustTable, setLocalAdjustTable] = useState<any[]>([]);

  const removeRow = (key: string, record: any) => {
    const tmp = [...adjustTable];
    tmp.forEach((el: any) => {
      el.adjustTable = el.adjustTable.filter(
        (item: any) => item.adjustCriteriaId !== record.adjustCriteriaId
      );
    });
    handleUpdateAdjustTable(tmp);
  };

  const handleAddRow = async (data: Array<any>) => {
    try {
      const params = {
        assetLevelTwoId: location.state.assetLevelTwoId,
        assetId: location.state.assetId,
        assetChildId: location.state.assetChildId,
        assetGrandChildId: location.state.assetGrandChildId,
      };

      const dataBody = {
        assetIds: adjustTable.slice(1).map((el: any) => el.storedAssetId),
        adjustCriteriaIds: data,
      };

      const res = await appraisalFilesApi.getAdjustTableCriteria(
        params,
        dataBody
      );
      const tmp = [...adjustTable];
      const newArrCriteria = res.data || [];

      if(res.data.length == 0){
        message.error("Lỗi khi thêm phương thức điều chỉnh! không có tài sản để so sánh")
        return
      }

      tmp.forEach((el: any, index) => {
        if (index === 0) {
          const _tmpAdjustTable = [...el.adjustTable];
          res.data[index].content.forEach((_el: any) => {
            const foundIndex = _tmpAdjustTable.findIndex(
              (el) => el.adjustCriteriaId === _el.adjustCriteriaId
            );
            if (foundIndex === -1) _tmpAdjustTable.push(_el);
          });
          el.adjustTable = _tmpAdjustTable;
        } else {
          const foundCriteria = newArrCriteria.find(
            (item: any) => item.assetId === el.storedAssetId
          );
          if (foundCriteria) {
            const _tmpAdjustTable = [...el.adjustTable];
            foundCriteria.content.forEach((_el: any) => {
              const foundIndex = _tmpAdjustTable.findIndex(
                (el) => el.adjustCriteriaId === _el.adjustCriteriaId
              );
              if (foundIndex === -1) _tmpAdjustTable.push(_el);
            });

            el.adjustTable = _tmpAdjustTable;
          }
        }
      });

      handleUpdateAdjustTable(tmp);
      setIsOpenModal(false);
    } catch (error: any) {
      message.error(error)
    }
  };

  useEffect(() => {
    const mergeCellMainTable = (key: any) => {
      if (key % 2 === 0) {
        return { rowSpan: 2 };
      }
      // These two are merged into above cell
      if (key % 2 !== 0) {
        return { rowSpan: 0 };
      }
      return {};
    };
    const mergeCellSummaryTable = (key: any) => {
      const rowLength = summaryMockData.length;
      if (key === 0) {
        return { rowSpan: rowLength };
      }
      // if(key === rowLength-1) {

      // }
      return { rowSpan: 0 };
    };

    if (defaultColumns2) {
      const columnsTb: ColumnsEdit | any = [
        {
          key: 1,
          disable: true,
          title: "STT",
          dataIndex: "stt",
          width: "5%",
          align: "center",
        },
        {
          key: 2,
          title: "Nội dung điều chỉnh",
          dataIndex: "adjustContent",
          align: "center",
          width: "20%",
        },
        ...adjustTable.map((_, index) => ({
          key: index.toString(),
          title: index === 0 ? "TSTĐ" : `TSSS ${index}`,
          dataIndex: index.toString(),
          align: "center",
          width: `${70 / adjustTable.length}%`,
          editableNumber: index === 0 ? false : true,
          onCell: (_: any, index: any) => ({
            //colSpan: index === 3 ? 2 : 1,
            disabled: true,
          }),
        })),
        {
          key: "action",
          title: "",
          dataIndex: "action",
          width: "5%",
          align: "center",
        },
      ];

      // for main table
      let listCol = columnsTb.map((col: any) => {
        if (col.dataIndex === "stt" || col.dataIndex === "action") {
          return {
            ...col,
            onCell: (_: any, key: any) => mergeCellMainTable(key),
          };
        } else {
          return col;
        }
      });
      setColumnsMainTable(listCol);
      // for summary table
      let listColSummaryTable = columnsTb.map((col: any) => {
        if (col.dataIndex === "stt" || col.dataIndex === "action") {
          return {
            ...col,
            onCell: (_: any, key: any) => mergeCellSummaryTable(key),
          };
        }
        if (col.dataIndex === "0") {
          return {
            ...col,
            onCell: (_: any, index: any) => ({
              colSpan: index === 3 ? adjustTable.length : 1,
            }),
          };
        }
        if (Number(col.dataIndex) > 0) {
          return {
            ...col,
            onCell: (_: any, index: any) => ({
              colSpan: index === 3 ? 0 : null,
            }),
          };
        }
        return col;
      });

      setColumnsSummaryTable(listColSummaryTable);
    }
  }, [adjustTable]);

  const forRow = (arrAdjustTable: any[]) => {
    let arr: any = [];
    arrAdjustTable.forEach((el: any, index: number) => {
      el.adjustTable.forEach((item: any) => {
        const foundIndex = arr.findIndex(
          (element: any) => element.adjustCriteriaId === item.adjustCriteriaId
        );

        if (foundIndex !== -1) {
          arr.forEach((el: any) => {
            if (el.adjustCriteriaId === item.adjustCriteriaId) {
              // 09/01/2024 - haipham - #983 - fix format number
              if (el.isView) {
                if (
                  item.adjustCriteriaName.toString().toLowerCase() ===
                  "lợi thế kinh doanh"
                ) {
                  const businessAdvantageIndex =
                    BUSINESS_ADVANTAGE_OPTIONS.findIndex(
                      //compare number vs string should ==
                      (x) => x.value == item.adjustContent
                    );

                  el[index] =
                    businessAdvantageIndex !== -1
                      ? BUSINESS_ADVANTAGE_OPTIONS[businessAdvantageIndex].label
                      : item.adjustContent;
                } else {
                  el[index] = item.adjustContent;
                  // el[index] = isNaN(item.adjustContent)
                  //   ? item.adjustContent
                  //   : numberUtils.formatNumber(Number(item.adjustContent));
                }
              }

              //end
              else el[index] = item.ratio;
            }
          });
        } else {
          let objView: any = {
            isView: true,
            adjustCriteriaId: item.adjustCriteriaId,
            adjustCriteriaName: item.adjustCriteriaName,
            adjustContent: item.adjustCriteriaName,
          };

          if (
            objView.adjustCriteriaName.toString().toLowerCase() ===
            "lợi thế kinh doanh"
          ) {
            const businessAdvantageIndex = BUSINESS_ADVANTAGE_OPTIONS.findIndex(
              //compare number vs string should ==
              (x) => x.value == item.adjustContent
            );

            objView[index] =
              businessAdvantageIndex !== -1
                ? BUSINESS_ADVANTAGE_OPTIONS[businessAdvantageIndex].label
                : item.adjustContent;
          } else {
            objView[index] = item.adjustContent
            // objView[index] = isNaN(item.adjustContent)
            //   ? item.adjustContent
            //   : numberUtils.formatNumber(Number(item.adjustContent));
          }
          //end

          let obj: any = {
            adjustCriteriaId: item.adjustCriteriaId,
            adjustCriteriaName: item.adjustCriteriaId,
            adjustContent: "Tỷ lệ điều chỉnh %",
          };

          obj[index] = item.ratio;

          arr.push(objView);
          arr.push(obj);
        }
      });
    });
    return arr.map((item: any, index: number) => {
      let sttValue = Math.floor(index / 2) + 1;
      return {
        ...item,
        key: randomId(),
        stt: sttValue?.toString(),
      };
    });
  };

  useEffect(() => {
    if (adjustTable) {
      const sData = forRow(adjustTable);
      setDataTable(sData);

      setLocalAdjustTable([...adjustTable]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adjustTable]);

  useEffect(() => {
    if (localAdjustTable) {
      renderSummaryDataTable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localAdjustTable]);

  const renderSummaryDataTable = () => {
    const dataSummaryTable: any[] = [];
    const totalRatios = CalTotalRatio();
    const dataSummary = CalSummaryTable();

    const objTotalRatios = {
      key: 1,
      stt: "",
      adjustContent: "Tổng tỷ lệ điều chỉnh (%)",
      ...[...totalRatios.map((el) => numberUtils.formatNumber(el))],
    };

    const objPriceChenhLech = {
      key: 2,
      stt: "",
      adjustContent: "Mức giá chênh lệch (đồng)",
      ...dataSummary.totalChenhLenh,
    };

    const objPriceDanChieu = {
      key: 3,
      stt: "",
      adjustContent: "Mức giá dẫn chiếu (đồng)",
      ...dataSummary.totalDanChieu,
    };

    const objUnitPrice = {
      key: 4,
      stt: "",
      adjustContent: "Đơn giá thẩm định (đồng)",
      ...dataSummary.unitPrice,
    };

    dataSummaryTable.push(objTotalRatios);
    dataSummaryTable.push(objPriceChenhLech);
    dataSummaryTable.push(objPriceDanChieu);
    dataSummaryTable.push(objUnitPrice);

    setSummaryDataTable(dataSummaryTable);
    dispatch(
      setUnitPrice(Number(dataSummary.unitPrice[0].replaceAll(".", "")))
    );
  };

  const CalTotalRatio = (isAbs = false) => {
    let totalRatios: any[] = [];
    localAdjustTable.forEach((el: any) => {
      const totalRatio = el.adjustTable?.reduce((sum: number, a: any) => {
        const _ratio = a.ratio ? Number(a.ratio) : 0;

        return sum + (isAbs ? Math.abs(_ratio) : _ratio);
      }, 0);
      totalRatios.push(totalRatio);
    });

    return totalRatios;
  };

  const CalSummaryTable = () => {
    const totalRatios = CalTotalRatio(false);
    const totalChenhLenh: any[] = [];
    const totalDanChieu: any[] = [];
    const unitPrice: any[] = [];
    localAdjustTable.forEach((el: any, index) => {
      const foundStoredAsset = storedAssets.find(
        (item: any) => item.assetId === el.storedAssetId
      );

      const estimatedPrice = foundStoredAsset
        ? foundStoredAsset.estimatedPrice
        : 0;

      const PriceChenhLech = Math.round(
        (totalRatios[index] * estimatedPrice) / 100
      );

      const PriceDanChieu = Math.round(estimatedPrice + PriceChenhLech);

      totalChenhLenh.push(Math.abs(PriceChenhLech));
      totalDanChieu.push(PriceDanChieu);
    });

    const _tmpDanChieu = totalDanChieu.slice(1);
    unitPrice.push(
      _tmpDanChieu.length > 0
        ? numberUtils.roundNumber(
            _tmpDanChieu.reduce((sum, a) => sum + a, 0) / _tmpDanChieu.length
          )
        : 0
    );

    return {
      totalChenhLenh: totalChenhLenh.map((el) => numberUtils.formatNumber(el)),
      totalDanChieu: totalDanChieu.map((el) => numberUtils.formatNumber(el)),
      unitPrice: unitPrice.map((el) => numberUtils.formatNumber(el)),
    };
  };

  const handleUpdateAdjustTableFnc = useCallback(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const tmpDataSource = [...adjustTable];

    const newData = dataTable.filter((el: any) => !el.isView);

    let isChange = false;

    tmpDataSource.forEach((el: any, index: number) => {
      el.adjustTable.forEach((item: any) => {
        const foundIndex = newData.findIndex(
          (element: any) => element.adjustCriteriaId === item.adjustCriteriaId
        );
        if (foundIndex !== -1) {
          const value = newData[foundIndex];
          item.ratio = value[index.toString()];
          isChange = true;
        }
      });
    });

    if (isChange) {
      handleUpdateAdjustTable(tmpDataSource);
    } else return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTable, adjustTable, typingTimeout]);

  const ref = useOutsideClick(handleUpdateAdjustTableFnc);

  return (
    <Fragment>
      <div ref={ref}>
        <Form
          labelWrap
          labelAlign="left"
          size="small"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (typingTimeout) {
                clearTimeout(typingTimeout);
              }
              handleUpdateAdjustTableFnc();
            }
          }}
        >
          <TableInputAdd
            disabledActions={disabledActions}
            column={columnsMainTable}
            data={dataTable}
            setData={
              (data) => {
                const updateLocalFnc = () => {
                  const tmpDataSource = [...localAdjustTable];

                  const newData = data.filter((el: any) => !el.isView);

                  tmpDataSource.forEach((el: any, index: number) => {
                    el.adjustTable.forEach((item: any) => {
                      const foundIndex = newData.findIndex(
                        (element: any) =>
                          element.adjustCriteriaId === item.adjustCriteriaId
                      );
                      if (foundIndex !== -1) {
                        const value = newData[foundIndex];
                        item.ratio = value[index.toString()];
                      }
                    });
                  });

                  return tmpDataSource;
                };

                if (!isDeepEqual(data, dataTable)) {
                  const localAdjustNew = updateLocalFnc();
                  setLocalAdjustTable(localAdjustNew);

                  setDataTable(data);
                  if (typingTimeout) {
                    clearTimeout(typingTimeout);
                  }

                  setTypingTimeout(
                    setTimeout(() => {
                      const tmpDataSource = updateLocalFnc();

                      handleUpdateAdjustTable(tmpDataSource);
                    }, 30000)
                  );
                }
              }

              //setDataSource
            }
            handleAdd={() => setIsOpenModal(true)}
            isCheckbox={false}
            handleRemove={removeRow}
          />
          <TableFooterCustom
            columns={columnsSummaryTable}
            dataSource={dataSummaryTable}
            isLoading={false}
          />
        </Form>
      </div>
      <button
        style={{
          height: 0,
          padding: 0,
          margin: 0,
          border: "none",
          display: "flex",
        }}
        onFocus={() => {
          if (typingTimeout) {
            clearTimeout(typingTimeout);
          }
          handleUpdateAdjustTableFnc();
        }}
      />

      <AddAdjustCriteriaModal
        isOpenModal={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        onSave={handleAddRow}
        selectedCriteriaIds={
          adjustTable.length > 0
            ? adjustTable[0].adjustTable.map(
                (item: any) => item.adjustCriteriaId
              )
            : []
        }
      />
    </Fragment>
  );
};
export default TableAdjustInforRoadVehicle;
