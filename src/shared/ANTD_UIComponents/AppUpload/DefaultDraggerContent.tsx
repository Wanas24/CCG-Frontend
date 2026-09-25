import { CloudUpload } from "lucide-react";
import { useTranslation } from "react-i18next";

const DefaultDraggerContent = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="ant-upload-drag-icon">
        <CloudUpload size={30} />
      </p>
      <p className="ant-upload-text">{t("upload.dragText")}</p>
      <p className="ant-upload-hint">{t("upload.dragHint")}</p>
    </div>
  );
};

export default DefaultDraggerContent;
