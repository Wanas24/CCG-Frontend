import { CloudUpload } from "lucide-react";

const DefaultDraggerContent = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="ant-upload-drag-icon">
        <CloudUpload size={30} />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </div>
  );
};

export default DefaultDraggerContent;
