import { Col, Tooltip } from "antd";
import { InputFiledParams } from "constants/types/Form_Field_type";
import React from "react";
import FormItem from "./FormItem";

type Props = {
  data: InputFiledParams[];
};

const InputFields: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.map(
        (
          {
            span,
            css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 },
            labelCol,
            wrapperCol,
            toolTip,
            ...rest
          },
          index
        ) => {
          if (css && !span) {
            const { xs, sm, md, lg, xl } = css;
            return (
              <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={index}>
                {toolTip ? (
                  <Tooltip title={toolTip}>
                    <FormItem
                      {...rest}
                      labelCol={labelCol ?? { xs: 10, md: 10, lg: 10, xl: 12 }}
                      wrapperCol={
                        wrapperCol ?? { xs: 14, md: 14, lg: 14, xl: 12 }
                      }
                    />
                  </Tooltip>
                ) : (
                  <FormItem
                    {...rest}
                    labelCol={labelCol ?? { xs: 10, md: 10, lg: 10, xl: 12 }}
                    wrapperCol={
                      wrapperCol ?? { xs: 14, md: 14, lg: 14, xl: 12 }
                    }
                  />
                )}
              </Col>
            );
          }
          return (
            <Col span={span}>
              {toolTip ? (
                <Tooltip title={toolTip}>
                  <FormItem
                    {...rest}
                    labelCol={labelCol ?? { xs: 10, md: 10, lg: 10, xl: 12 }}
                    wrapperCol={
                      wrapperCol ?? { xs: 14, md: 14, lg: 14, xl: 12 }
                    }
                  />
                </Tooltip>
              ) : (
                <FormItem
                  {...rest}
                  labelCol={labelCol ?? { xs: 10, md: 10, lg: 10, xl: 12 }}
                  wrapperCol={wrapperCol ?? { xs: 14, md: 14, lg: 14, xl: 12 }}
                />
              )}
            </Col>
          );
        }
      )}
    </>
  );
};

export default InputFields;
