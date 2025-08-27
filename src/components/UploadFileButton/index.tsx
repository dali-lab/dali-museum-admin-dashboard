import { useCallback } from "react";

interface UploadFileButtonProps {
  handleUpload: (file: File) => void;
  type?: "" | "primary";
  accept?: string;
  children?: React.ReactNode;
}

const UploadFileButton: React.FC<UploadFileButtonProps> = ({
  handleUpload,
  type = "",
  accept,
  children,
}) => {
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || event.target.files.length !== 1) {
        alert("Please select a single file.");
        return;
      }

      handleUpload(event.target.files[0]);
    },
    [handleUpload]
  );

  return (
    <>
      <label htmlFor="upload-image" className={`button ${type}`}>
        {children ?? "Upload Image"}
      </label>
      <input
        type="file"
        onChange={onChange}
        id="upload-image"
        style={{ display: "none" }}
        accept={accept}
      />
    </>
  );
};

export default UploadFileButton;
