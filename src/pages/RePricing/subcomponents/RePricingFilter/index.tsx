import { Col, Form, Row, Space, Typography } from "antd";
import { addressApi } from "apis/adress";
import { assetCommonApi } from "apis/assetCommon";
import ButtonCustom from "components/ButtonCustom";
import InputFields from "components/InputFields";
import { APPRAISAL_REPRICING_STATUS_OPTIONS } from "constant/common";
import { LOCAL_STORAGE_KEY, TYPE_FIELD } from "constant/enums";
import { FilterAppraisalFileType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesFilter/style.scss";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DownOutlined } from "@ant-design/icons";
import { CollapseCustom } from "components/CollapseCustom";
import { RootState } from "configs/configureStore";
import { useSelector } from "react-redux";
import { FilterAppraisalFileRePricing } from "constant/types/appraisalFile";

type Props = {
  filters: FilterAppraisalFileType;
  setFilters: (filters: FilterAppraisalFileType) => void;
};

const { INPUT, SELECT, DATE_PICKER } = TYPE_FIELD;

const AppraisalFilesReceiveFilter: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const globalState = useSelector((state: RootState) => state.globalSlice);
  const [filterData, setFilterData] = useState<FilterAppraisalFileRePricing>({
    startDate: null,
    endDate: null,
    approveEndDate: null,
    approveStartDate: null,
  });
  const [filtersStorage, setFiltersStorage] = useState<FilterAppraisalFileType>(
    {}
  );

  const [assetsData, setAssetsData] = useState<{
    levelTwo: Array<any>;
    levelThree: Array<any>;
  }>({ levelTwo: [], levelThree: [] });

  const [addressData, setAddressData] = useState<{
    districts: Array<any>;
    wards: Array<any>;
  }>({ districts: [], wards: [] });

  const getAssetLevelTwo = async (levelOneValue: any) => {
    if (levelOneValue) {
      try {
        const res = await assetCommonApi.getAssetLevel2(levelOneValue);
        setAssetsData((prevAssetsData) => ({
          ...prevAssetsData,
          levelTwo: res.data?.map((item: any) => ({
            value: item.assetLevelTwoId.toString(),
            label: item.assetLevelTwoName,
          })),
        }));
        await getAssetLevelThree(filterData.assetLevelTwoId);
      } catch (error) {}
    }
  };

  const getAssetLevelThree = async (levelTwoValue: any) => {
    if (levelTwoValue) {
      try {
        const res = await assetCommonApi.getAssetLevel3(levelTwoValue);
        setAssetsData((prevAssetsData) => ({
          ...prevAssetsData,
          levelThree: res.data?.map((item: any) => ({
            value: item.assetLevelThreeId.toString(),
            label: item.assetLevelThreeName,
          })),
        }));
      } catch (error) {}
    }
  };

  const getDistricts = async (districtValue: any) => {
    try {
      const res = await addressApi.getDistricts({
        code: districtValue,
      });
      setAddressData((prevAddressData) => ({
        ...prevAddressData,
        districts: res.data?.map((item: any) => ({
          value: item.code,
          label: item.fullName,
        })),
      }));

      await getWards(filterData.district);
    } catch (error) {}
  };

  const getWards = async (wardValue: any) => {
    try {
      const res = await addressApi.getWards({
        code: wardValue,
      });
      setAddressData((prevAddressData) => ({
        ...prevAddressData,
        wards: res.data?.map((item: any) => ({
          value: item.code,
          label: item.fullName,
        })),
      }));
    } catch (error) {}
  };

  useEffect(() => {
    if (filtersStorage) {
      setFilterData((prevFilterData: any) => ({
        ...prevFilterData,
        isFiltering: true,
        ...filtersStorage,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersStorage]);

  useEffect(() => {
    const fetchData = async () => {
      const storedParams = localStorage.getItem(
        LOCAL_STORAGE_KEY.APPRAISAL_RECEIVE
      );

      let currentKey = window.history.state?.key;
      let prevKey;

      // Set prevKey in the first run
      if (!localStorage.getItem(LOCAL_STORAGE_KEY.APPRAISAL_KEY)) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.APPRAISAL_KEY,
          JSON.stringify({ prevKey: null })
        );
      }

      // Get prevKey from localStorage and parse it as JSON
      prevKey = localStorage.getItem(LOCAL_STORAGE_KEY.APPRAISAL_KEY);
      prevKey = prevKey !== null ? JSON.parse(prevKey) : null;

      // Log previous key and current key
      // console.log("Prev key: ", prevKey?.prevKey);
      // console.log("Current key: ", currentKey);

      // Update prevKey with currentKey
      localStorage.setItem(
        LOCAL_STORAGE_KEY.APPRAISAL_KEY,
        JSON.stringify({ prevKey: currentKey })
      );

      if (currentKey && currentKey === prevKey?.prevKey) {
        if (storedParams && storedParams !== "{}") {
          try {
            const parsedParams = JSON.parse(storedParams);
            setFiltersStorage((prevFilterData) => ({
              ...prevFilterData,
              ...parsedParams,
              isFiltering: false,
            }));
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY.APPRAISAL_RECEIVE);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.APPRAISAL_RECEIVE);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (filterData.assetLevelOneId) {
      getAssetLevelTwo(filterData.assetLevelOneId);
    } else {
      // setFilterData({
      //   ...filterData,
      //   assetLevelTwoId: undefined,
      //   assetLevelThreeId: undefined,
      // });
      setFilterData((prevFilterData) => ({
        ...prevFilterData,
        assetLevelTwoId: undefined,
        assetLevelThreeId: undefined,
      }));
      setAssetsData((prevState: any) => ({
        ...prevState,
        levelTwo: [],
        levelThree: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.assetLevelOneId]);

  useEffect(() => {
    if (filterData.assetLevelTwoId) {
      getAssetLevelThree(filterData.assetLevelTwoId);
    } else {
      // setFilterData({
      //   ...filterData,
      //   assetLevelThreeId: undefined,
      // });
      setFilterData((prevFilterData) => ({
        ...prevFilterData,
        assetLevelThreeId: undefined,
      }));
      setAssetsData((prevState: any) => ({
        ...prevState,
        levelThree: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.assetLevelTwoId]);

  useEffect(() => {
    if (filterData.province) {
      getDistricts(filterData.province);
    } else {
      // setFilterData({ ...filterData, district: undefined, ward: undefined });
      setFilterData((prevFilterData) => ({
        ...prevFilterData,
        district: undefined,
        ward: undefined,
      }));
      setAddressData((prevState: any) => ({
        ...prevState,
        districts: [],
        wards: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.province]);

  useEffect(() => {
    if (filterData.district) {
      getWards(filterData.district);
    } else {
      // setFilterData({ ...filterData, ward: undefined });
      setFilterData((prevFilterData) => ({
        ...prevFilterData,
        ward: undefined,
      }));
      setAddressData((prevState: any) => ({
        ...prevState,
        wards: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.district]);

  useEffect(() => {
    const handleDebouncedChange = (value: any) => {
      setFilters({
        ...filters,
        ...value,
      });
      localStorage.setItem(
        LOCAL_STORAGE_KEY.APPRAISAL_RECEIVE,
        JSON.stringify({
          ...filters,
          ...value,
        })
      );
    };
    const timer = setTimeout(() => {
      handleDebouncedChange(filterData);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 3,
      label: "Đơn vị đề nghị",
      type: SELECT,
      options: globalState.sacombankUnitOptions,
      css: css,
      value: filterData.proposalUnit || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          proposalUnit: value,
        }));
      },
    },
    {
      key: 6,
      label: "Đơn vị định giá",
      type: SELECT,
      options: globalState.branchOptions,
      css: css,
      value: filterData.appraisalUnit || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          appraisalUnit: value,
        }));
      },
    },
    {
      key: 6.5,
      label: "",
      css: css,
    },
    {
      key: 7,
      label: "Tỉnh/Thành phố",
      type: SELECT,
      options: globalState.provinceOptions,
      css: css,
      showSearch: true,
      value: filterData.province || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          province: value,
          district: undefined,
          ward: undefined,
        }));
      },
    },
    {
      key: 8,
      label: "Quận/Huyện/Thị xã",
      type: SELECT,
      options: addressData.districts,
      css: css,
      showSearch: true,
      value: filterData.district || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          district: value,
          ward: undefined,
        }));
      },
    },
    {
      key: 9,
      label: "Xã/Phường/Thị trấn",
      type: SELECT,
      options: addressData.wards,
      css: css,
      showSearch: true,
      value: filterData.ward || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          ward: value,
        }));
      },
    },
    {
      key: 10,
      label: "Đường phố",
      type: INPUT,
      //options: [],
      css: css,
      value: filterData.street || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          street: e.target.value,
        }));
      },
    },
    {
      key: 11,
      label: "Tên khách hàng",
      type: INPUT,
      css: css,
      value: filterData.customerName || null,
      allowClear: true,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          customerName: e.target.value,
        }));
      },
    },
    {
      key: 12,
      label: "Trạng thái hồ sơ",
      type: SELECT,
      options: APPRAISAL_REPRICING_STATUS_OPTIONS,
      css: css,
      value: filterData.fileStatusId || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          fileStatusId: value,
        }));
      },
    },
    // {
    //   key: 13,
    //   label: "Trạng thái phí",
    //   type: SELECT,
    //   options: feeNotificationStatus,
    //   css: css,
    //   value: filterData.feeStatus || null,
    //   allowClear: true,
    //   onChange: (value: string) => {
    //     setFilterData((prevFilterData) => ({
    //       ...prevFilterData,
    //       isFiltering: true,
    //       feeStatus: value,
    //     }));
    //   },
    // },

    // {
    //   key: "climsCode",
    //   label: "Mã Clims",
    //   type: INPUT,
    //   css: css,
    //   value: filterData.climsCode || null,
    //   onChange: (e: any) => {
    //     setFilterData((prevFilterData) => ({
    //       ...prevFilterData,
    //       isFiltering: true,
    //       climsCode: e.target.value.trim(),
    //     }));
    //   },
    // },
    // {
    //   key: 14,
    //   label: "Mã đề nghị",
    //   type: INPUT,
    //   css: css,
    //   value: filterData.proposalCode || null,
    //   onChange: (e: any) => {
    //     setFilterData((prevFilterData) => ({
    //       ...prevFilterData,
    //       isFiltering: true,
    //       proposalCode: e.target.value.trim(),
    //     }));
    //   },
    // },
    {
      key: 15,
      label: "Mã tài sản",
      type: INPUT,
      css: css,
      value: filterData.assetCode || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          assetCode: e.target.value.trim(),
        }));
      },
    },
    {
      key: 16,
      label: "Số tờ trình",
      type: INPUT,
      css: css,
      value: filterData.reportCode || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          reportCode: e.target.value.trim(),
        }));
      },
    },
    {
      key: 17,
      label: "Mục đích thẩm định",
      type: SELECT,
      options: globalState.appraisalPurposeOptions,
      css: css,
      value: filterData.appraisalPurposeId || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          appraisalPurposeId: value,
        }));
      },
    },
    {
      key: 18,
      label: "Loại tài sản",
      type: SELECT,
      options: globalState.assetLevelOneOptions,
      css: css,
      value: filterData.assetLevelOneId || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          assetLevelOneId: value,
          assetLevelTwoId: undefined,
          assetLevelThreeId: undefined,
        }));
      },
    },
    {
      key: 19,
      label: "Loại hình tài sản",
      type: SELECT,
      options: assetsData.levelTwo,
      css: css,
      value: filterData.assetLevelTwoId || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          assetLevelTwoId: value,
          assetLevelThreeId: undefined,
        }));
      },
    },
    {
      key: 20,
      label: "Phân loại tài sản",
      type: SELECT,
      options: assetsData.levelThree,
      css: css,
      value: filterData.assetLevelThreeId || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          assetLevelThreeId: value,
        }));
      },
    },
    {
      key: 21,
      label: "Người gửi",
      type: INPUT,
      css: css,
      value: filterData.rmName,
      allowClear: true,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          rmName: e.target.value,
        }));
      },
    },
    {
      key: 22,
      label: "CV khảo sát",
      type: INPUT,
      css: css,
      value: filterData.surveyer,
      allowClear: true,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          surveyer: e.target.value,
        }));
      },
    },
    {
      key: 23,
      label: "",
      css: css,
    },
  ];

  return (
    <CollapseCustom
      expandIcon={({ isActive }) => (
        <Space>
          <Typography style={{ color: "#2862af" }}>
            {isActive ? "Ẩn tìm kiếm" : "Hiển thị tìm kiếm"}
          </Typography>
          <DownOutlined
            rotate={isActive ? 180 : 0}
            style={{ color: "#2862af" }}
          />
        </Space>
      )}
      itemList={[
        {
          label: "Tìm kiếm",
          forceRender: true,
          children: (
            <Form labelAlign="left" labelWrap size="small">
              <Row gutter={[16, 4]}>
                <InputFields data={inputSearchBasic} />
                <Row
                  style={{
                    width: "100%",
                    justifyContent: "end",
                    display: "flex",
                  }}
                >
                  <Space>
                    <ButtonCustom
                      label="Xóa"
                      onClick={() => {
                        setFilters({});
                        setFilterData({
                          startDate: null,
                          endDate: null,
                          approveEndDate: null,
                          approveStartDate: null,
                          isFiltering: true,
                        });
                      }}
                    />
                    <ButtonCustom
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => {
                        setFilterData({ ...filterData });
                      }}
                    />
                  </Space>
                </Row>
              </Row>
            </Form>
          ),
        },
      ]}
    />
  );
};
export default AppraisalFilesReceiveFilter;
