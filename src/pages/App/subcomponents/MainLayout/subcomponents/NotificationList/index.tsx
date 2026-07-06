import useOutsideClick from "hooks/useOutsideClick";
import { FC, SetStateAction, useEffect, useState } from "react";
import "./style.scss";
import {
  Affix,
  Badge,
  Button,
  Divider,
  Dropdown,
  MenuProps,
  Space,
  Spin,
  Typography,
} from "antd";
import { NotifyType } from "constant/types/notity";
import { renderAppraisalStatus } from "utils";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "constant/enums";
import { useNavigate } from "react-router-dom";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";
import { notifyApi } from "apis/notify";
import ButtonCustom from "components/ButtonCustom";
import { useDispatch, useSelector } from "react-redux";
import { getNotifyList, setNotifyAllSeen } from "pages/App/store/appSlice";
import { RootState } from "configs/configureStore";
import Icons from "assets/icons";
import { GetNotifyParams } from "constants/types/notify.type";

type Props = {
  setShowNotiClass: React.Dispatch<SetStateAction<string>>;
};

const defaultParams: GetNotifyParams = {
  page: 0,
  limit: 10,
};

export const NotificationList: FC<Props> = ({ setShowNotiClass }) => {
  const [styleAffixed, setStyleAffixed] = useState<string | "">("");
  let changedPage: number = 0;

  const dispatch = useDispatch();

  const { notifyList, error, totalPages, isNotifyLoading } = useSelector(
    (state: RootState) => state.appSlice.notifyData
  );

  const ref = useOutsideClick(() => setShowNotiClass("notify-list-hide"));

  const getNotifyListWrapper: () => HTMLElement = () => {
    return document.getElementsByClassName(
      "notify-list-wrapper"
    )[0] as HTMLElement;
  };

  const handleClickAllSeen = () => {
    dispatch(setNotifyAllSeen());
    setShowNotiClass("notify-list-show");
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <div onClick={() => handleClickAllSeen()}>
          <Icons.check /> Đánh dấu thông báo đã đọc
        </div>
      ),
      key: 0,
    },
  ];

  const handleInfiniteScroll = () => {
    try {
      const notifyListElem = ref.current;
      if (notifyListElem) {
        if (
          notifyListElem.scrollTop + notifyListElem.offsetHeight >=
          notifyListElem.scrollHeight
        ) {
          changedPage = changedPage + 1;
          if (changedPage <= totalPages - 1 && totalPages !== 0) {
            dispatch(getNotifyList({ page: changedPage }));
          }
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    dispatch(getNotifyList(defaultParams));
  }, []);

  useEffect(() => {
    const notifyList = ref.current;
    if (notifyList) {
      notifyList.addEventListener("scroll", handleInfiniteScroll, true);
      return () => {
        notifyList.removeEventListener("scroll", handleInfiniteScroll, true);
      };
    }
  }, [totalPages, changedPage]);

  if (error)
    return (
      <div ref={ref} className="notify-list-wrapper">
        Lỗi khi tải dữ liệu
      </div>
    );
  return (
    <>
      <div ref={ref} className="notify-list-wrapper">
        <Affix
          target={getNotifyListWrapper}
          onChange={(affixed?: boolean) =>
            affixed ? setStyleAffixed("affixed") : setStyleAffixed("")
          }
        >
          <div className={`title ${styleAffixed}`}>
            <div className="flex-space-between">
              <Typography.Title
                level={3}
                style={{ margin: 0 }}
                onClick={() => {
                }}
              >
                Thông báo
              </Typography.Title>
              <Dropdown menu={{ items }} trigger={["click"]}>
                <ButtonCustom
                  icon={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 3,
                        width: 25,
                        height: 25,
                      }}
                    >
                      <Dot />
                      <Dot />
                      <Dot />
                    </div>
                  }
                  bgColor="none"
                  className="option-button"
                />
              </Dropdown>
            </div>

            <Divider style={{ margin: "0.5rem 0" }} />
          </div>
        </Affix>

        <Space direction="vertical" size="middle">
          {notifyList?.map((item: NotifyType, index: number) => (
            <NotifyItem
              notify={item}
              key={index}
              setShowNotiClass={setShowNotiClass}
            />
          ))}
        </Space>
        {isNotifyLoading && (
          <Spin
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5px",
              marginBottom: "5px",
            }}
            indicator={<Icons.loadingOutlined size={30} />}
          />
        )}
      </div>
    </>
  );
};

const NotifyItem: any = ({
  notify,
  setShowNotiClass,
}: {
  notify: NotifyType;
  setShowNotiClass: React.Dispatch<SetStateAction<string>>;
}) => {
  const navigate = useNavigate();
  const handleClickItem = () => {
    notifyApi.updateStatus(notify.appraisalFileStatusHistoryId);
    setShowNotiClass("notify-list-show");
    navigate(APPRAISAL_FILE_DETAIL.replace(":id", notify.appraisalFileId));
  };
  return (
    <div className="notify-item-wrapper" onClick={() => handleClickItem()}>
      <div className={`content ${notify.status === 1 ? "gray" : ""}`}>
        <div className={`message `}>
          <b>{notify.modifyStaffDisplayName}</b> đã thay đổi hồ sơ{" "}
          <b>{notify.proposalCode}</b> có số tờ trình{" "}
          <span className="blue">{notify.reportCode}</span> từ{" "}
          <span className="blue">
            {renderAppraisalStatus(notify.fromStatus)}
          </span>{" "}
          thành{" "}
          <span className="blue">{renderAppraisalStatus(notify.toStatus)}</span>
        </div>
        <div className="footer">
          <span className="bold">
            {dayjs(notify.changeDate).format(DATE_TIME_FORMAT.dateTimeFull)}
          </span>
        </div>
      </div>
      {!notify.status ? <Badge color="blue" size="small" /> : null}
    </div>
  );
};

const Dot: any = () => {
  return <div className="notify-item-dot"></div>;
};
