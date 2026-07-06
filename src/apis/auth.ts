import { SBAAxiosClient } from "./base";
import { LoginData } from "../constants/types/auth.type";
import axios from "axios";

const authApi = {
  login: (data: LoginData) => {
    return SBAAxiosClient(`/authentication/api/v1/login`, {
      method: "POST",
      data,
    });
  },
  checkToken: () => {
    return SBAAxiosClient("/auth/check-token", {
      method: "GET",
    });
  },
  refesh: async () => {
    return await SBAAxiosClient(
      `${process.env.REACT_APP_SERVER_URL}/authentication/api/v1/refreshtoken`,
      {
        method: "GET",
      }
    );
  },
  loginWithMsal: async (tokenId: string, accessToken: string) => {
    return await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/authentication/api/v1/loginToken`,
      {
        tokenId,
        accessToken,
      }
    );
  },
  logout: () => {
    return SBAAxiosClient("/authentication/api/v1/logout", {
      method: "POST",
    });
  },
};

export default authApi;
