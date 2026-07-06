import { randomId } from "utils";
import "./style.scss";

type Props = {
  src: string;
};

const PdfViewer = ({ src }: Props) => {
  return (
    <div className="pdfviewer">
      <iframe
        id={randomId()}
        src={src}
        width="100%"
        style={{ border: "none", height: "80vh" }}
        title="pdf file"
      />
    </div>
  );
};

export default PdfViewer;
