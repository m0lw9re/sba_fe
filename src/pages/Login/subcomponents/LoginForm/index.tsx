import Icon from "@ant-design/icons";
import { useMsal } from "@azure/msal-react";
import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import authApi from "apis/auth";
import MicrosoftLogo from "assets/images/png/Microsoft_logo.svg.png";
import LogoDemo from "assets/images/svg/logo-demo.svg";
import Logo from "assets/images/png/Sacombank_SBA_Nen_Xanh-02.png";
import { ReactComponent as UserSVG } from "assets/images/svg/account_circle.svg";
import { ReactComponent as LockSVG } from "assets/images/svg/lock.svg";
import { loginRequest } from "configs/authConfig";
import { LOCAL_STORAGE_KEY } from "constant/enums";
import { LoginData } from "constants/types/auth.type";
import { useFormik } from "formik";
import { login, logout } from "pages/App/store/appSlice";
import "pages/Login/subcomponents/LoginForm/style.scss";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { isDevEnv, isLiveEnv } from "utils/common";

type FormLoginData = {
  email: string;
  password: string;
  roles: [];
};

const loginSchema = Yup.object().shape({
  email: Yup.string().required("Email không được để trống."),
  password: Yup.string().required("Vui lòng nhập mật khẩu."),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initFormLoginData: FormLoginData = {
    email: "",
    password: "",
    roles: [],
  };
  const showManualLoginForm = Boolean(
    Number(process.env.REACT_APP_SHOW_MANUAL_LOGIN_FORM) || 0,
  );
  const [clickedCount, setClickedCount] = useState(0);

  const { instance } = useMsal();
  const handleLoginWithMsal = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      const msalToken = response.idToken;
      const msalAccessToken = response.accessToken;
      const getToken = await authApi.loginWithMsal(msalToken, msalAccessToken);
      if (!getToken.data.accessToken) {
        message.error(
          getToken.data.message ||
            "Có lỗi xảy ra khi đăng nhập bằng Azure. Vui lòng thử lại!",
        );
        setTimeout(() => {
          dispatch(logout());
          instance.logout();
          window.location.href = "/login";
          window.location.reload();
        }, 1500);
        return;
      }
      localStorage.setItem(
        LOCAL_STORAGE_KEY.ACCESS_TOKEN,
        getToken.data.accessToken,
      );
      localStorage.setItem(LOCAL_STORAGE_KEY.USER_ID, getToken.data.id);
      localStorage.setItem(
        LOCAL_STORAGE_KEY.USERNAME,
        getToken.data.username ||
          response.account.name ||
          response.account.username,
      );
      dispatch(
        login({
          username:
            getToken.data.username ||
            response.account.name ||
            response.account.username,
          accessToken: getToken.data.accessToken,
        }),
      );
      navigate("/", { replace: true });
    } catch (error: any) {
      console.log("error login azure:", error);
    }

    // instance.acquireTokenSilent(loginRequest).then(tokenResponse => {
    //   console.log('tokenResponse:', tokenResponse)
    //   // Do something with the tokenResponse
    // }).catch(async (error) => {
    //     if (error instanceof InteractionRequiredAuthError) {
    //         // fallback to interaction when silent call fails
    //         return instance.acquireTokenPopup(loginRequest);
    //     }
    //     // handle other errors
    // })
  };

  const formLogin = useFormik({
    initialValues: initFormLoginData,
    validationSchema: loginSchema,
    onSubmit: async (data) => {
      const loginData: LoginData = {};
      loginData.username = data.email.toLocaleLowerCase().trim();
      loginData.password = data.password;
      try {
        const response = await authApi.login(loginData);
        if (!response.data.accessToken) {
          message.error(response.data.message);
          return;
        }
        localStorage.setItem(
          LOCAL_STORAGE_KEY.ACCESS_TOKEN,
          response.data.accessToken,
        );
        localStorage.setItem(LOCAL_STORAGE_KEY.USER_ID, response.data.id);
        localStorage.setItem(
          LOCAL_STORAGE_KEY.USERNAME,
          response.data.username,
        );
        dispatch(login(response.data));
        navigate("/", { replace: true });
      } catch (error: any) {
        message.error("Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại!");
      }
    },
  });

  return (
    <div className="login-form-container">
      <div className="login-form-wrapper">
        <Space direction="vertical" size={"large"} className="login-form-space">
          <Space direction="vertical" size={"small"}>
            {isDevEnv ? (
              <>
                <Image
                  preview={false}
                  src={LogoDemo}
                  width={350}
                  height={50}
                  alt="Demo Logo"
                  onClick={() => {
                    setClickedCount((prev) => prev + 1);
                  }}
                />
              </>
            ) : (
              <>
                <Image
                  preview={false}
                  src={Logo}
                  width={"80%"}
                  // height={30}
                  alt="SBA Logo"
                  onClick={() => {
                    setClickedCount((prev) => prev + 1);
                  }}
                />
                {/* <Typography className="subtittle">
                  CÔNG TY QUẢN LÝ NỢ & KHAI THÁC TÀI SẢN
                </Typography> */}
              </>
            )}
          </Space>
          <div className="inner-title">
            HỆ THỐNG PHẦN MỀM THẨM ĐỊNH GIÁ - SACOMBANK
          </div>
          <div className="inner-form">
            <Form
              className="main-login-form"
              onFinish={formLogin.handleSubmit}
              size="small"
            >
              {/* live => always hide manual login */}
              {!isLiveEnv && (
                <>
                  {(showManualLoginForm || clickedCount === 10) && (
                    <>
                      <Form.Item
                        validateStatus={
                          formLogin.errors.email && formLogin.touched.email
                            ? "error"
                            : ""
                        }
                        help={formLogin.touched.email && formLogin.errors.email}
                      >
                        <Input
                          size="large"
                          placeholder="Email"
                          name="email"
                          value={formLogin.values.email}
                          onChange={formLogin.handleChange}
                          allowClear
                          prefix={
                            <Icon
                              className="icon-input-login"
                              component={UserSVG}
                            />
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        name="Password"
                        validateStatus={
                          formLogin.errors.password &&
                          formLogin.touched.password
                            ? "error"
                            : ""
                        }
                        help={
                          formLogin.touched.password &&
                          formLogin.errors.password
                        }
                      >
                        <Input.Password
                          size="large"
                          placeholder="Password"
                          name="password"
                          value={formLogin.values.password}
                          onChange={formLogin.handleChange}
                          prefix={
                            <Icon
                              className="icon-input-login"
                              component={LockSVG}
                            />
                          }
                        />
                      </Form.Item>
                      <Form.Item name="remember" valuePropName="checked">
                        <Row justify={"space-between"}>
                          <Checkbox className="checkbox-login">
                            <Typography className="checkbox-tittle">
                              Lưu đăng nhập
                            </Typography>
                          </Checkbox>
                          {/* <Link>
                      <Typography className="forget-text-login">
                        Quên mật khẩu
                      </Typography>
                    </Link> */}
                        </Row>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="submit-button"
                        >
                          <Typography className="submit-button-tittle">
                            Đăng nhập
                          </Typography>
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </>
              )}
              <Form.Item>
                <Button
                  type="default"
                  htmlType="button"
                  className="submit-button-microsoft"
                  onClick={handleLoginWithMsal}
                >
                  <div className="submit-button-microsoft-content">
                    <Image
                      preview={false}
                      src={MicrosoftLogo}
                      width={20}
                      height={20}
                      alt="Microsoft Logo"
                    />
                    <Typography className="submit-button-tittle">
                      Đăng nhập bằng Microsoft
                    </Typography>
                  </div>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Space>
        {/* <Space>
          <Link>
            <Typography className="account-already-text">
              Chưa có tài khoản?
            </Typography>
          </Link>
          <Link>
            <Typography className="register-text">Đăng ký</Typography>
          </Link>
        </Space> */}
      </div>
    </div>
  );
};

export default LoginForm;
