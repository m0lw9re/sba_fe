import { Row, Space } from "antd";
import InputFields from "components/InputFields";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { TYPE_FIELD, UTILITIES_APARTMENT } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
const { CHECKBOX_GROUP } = TYPE_FIELD;
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 20, xl: 20 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 };

type DataType = {
  utilities: string | null;
};

type Props = {
  data: DataType;
};

type RefProps = {
  updateUtilitiesAppartment: () => void;
};

const UtilitiesAppartment = forwardRef<RefProps, Props>(({ data }, ref) => {
  const [ultilitiesValue, setUtilitiesValue] = useState<Array<string>>([]);

  const handleUpdateUtilities = async () => {
    return {
      utilities: ultilitiesValue.join(","),
    };
  };

  useImperativeHandle(ref, () => ({
    updateUtilitiesAppartment: handleUpdateUtilities,
  }));

  useEffect(() => {
    if (data) {
      if (data.utilities && data.utilities.includes(",")) {
        const utilities = data.utilities.split(",");
        // Sắp xếp các utility theo thứ tự từ a => z
        const sortedUtilities = [...utilities].sort();
        setUtilitiesValue(sortedUtilities);
      } else if (data.utilities) {
        setUtilitiesValue([data.utilities]);
      }
    }
  }, [JSON.stringify(data)]);

  const fields: InputFiledParams[] = [
    {
      key: 1,
      type: CHECKBOX_GROUP,
      css: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      onChange: (checkedValues: any[]) => {
        // Sắp xếp các dịch vụ theo thứ tự từ a => z
        const sortedCheckedValues = [...checkedValues].sort();
        setUtilitiesValue(sortedCheckedValues);
      },
      options: [
        { value: UTILITIES_APARTMENT.GARAGE, label: "Hầm để xe" },
        { value: UTILITIES_APARTMENT.POOL, label: "Hồ bơi" },
        { value: UTILITIES_APARTMENT.INNER_PARK, label: "Công viên nội khu" },
        {
          value: UTILITIES_APARTMENT.COMMERCIALSERVICEAREA,
          label: "Khu thương mại/Dịch vụ",
        },
        {
          value: UTILITIES_APARTMENT.ELEVATOR,
          label: "Thang máy",
        },
        {
          value: UTILITIES_APARTMENT.HOSPITAL_SCHOOL_PRESCHOOL,
          label: "Bệnh viện/Trường học/Trường mầm non",
        },
        { value: UTILITIES_APARTMENT.RECEPTIONHALL, label: "Sảnh lễ tân" },
      ],
      value: ultilitiesValue,
    },
  ];

  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"small"}
      className="utilities-appartment-container"
    >
      <Row gutter={[16, 4]}>
        <InputFields data={fields}></InputFields>
      </Row>
    </Space>
  );
});

export default UtilitiesAppartment;
