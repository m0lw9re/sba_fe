import { LOCAL_STORAGE_KEY } from "constant/enums";

const getUsername = (): string => {
  const username = localStorage.getItem(LOCAL_STORAGE_KEY.USERNAME);
  return username ? username : "";
};


export {
  getUsername,
};
