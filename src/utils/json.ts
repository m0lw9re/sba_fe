const convertToJson = (obj: any): string => {
  if (obj) {
    return JSON.stringify(obj);
  }
  return "";
};

export { convertToJson };
