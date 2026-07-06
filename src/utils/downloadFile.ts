const downLoadFile = (res: any, name: string) => {
  let blob = new Blob([res.data]);
  let url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `FileName.docx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { downLoadFile };
