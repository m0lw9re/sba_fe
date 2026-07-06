import { Col, Row, Typography } from 'antd';
import Loading from 'components/common/Loading';
import { AppraisalFileType } from 'constant/types';
import { useParams } from 'react-router-dom';
import { formatDateWithHour } from 'utils';
import { useAppraisalFileDetail } from 'utils/request';
import './styles.scss';

const css = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8 };

const AppraisalImageTabInfo = () => {
  let { id }: { id?: string } = useParams();
  const {
    data: appraisalFileDetail,
    isLoading,
  }: {
    data: AppraisalFileType;
    isLoading: boolean;
  } = useAppraisalFileDetail(id || '');
  const fixData = [
    {
      label: 'Mã đề nghị',
      value: appraisalFileDetail?.proposalCode,
    },
    {
      label: 'Số tờ trình',
      value: appraisalFileDetail?.reportCode,
    },
    {
      label: 'Thời gian gửi yêu cầu',
      value: appraisalFileDetail?.proposalDate
        ? formatDateWithHour(appraisalFileDetail.proposalDate)
        : null,
    },
  ];
  if (isLoading) return <Loading />;

  return (
    <Row gutter={[8, 8]} className='info-wrapper'>
      {fixData.map((item, index: number) => (
        <Col
          xl={css.xl}
          lg={css.lg}
          md={css.md}
          sm={css.sm}
          xs={css.xs}
          key={index}
          className='infor-item-container'
        >
          <Row>
            <Col span={11}>
              <Typography color='#000' style={{ opacity: 0.6 }}>
                {item.label}:
              </Typography>
            </Col>
            <Col span={13}>
              <Typography color='#000'>{item.value}</Typography>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
};

export default AppraisalImageTabInfo;
