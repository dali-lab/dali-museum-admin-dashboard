import { getExport } from "@/api/export";
import Modal from "@/components/Modal";
import TextInput from "@/components/TextInput";
import { useCallback, useState } from "react";

interface ExportPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportPopup: React.FC<ExportPopupProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
  });
  const editForm = useCallback(
    (data: { startDate?: string; endDate?: string }) =>
      setForm((prev) => ({ ...prev, ...data })),
    []
  );

  const [errors, setErrors] = useState({ startDate: "", endDate: "" });
  const getErrors = useCallback(() => {
    const newErrors = { startDate: "", endDate: "" };
    if (form.startDate && isNaN(Date.parse(form.startDate)))
      newErrors.startDate = "Start date must be a valid date";
    if (form.endDate && isNaN(Date.parse(form.endDate)))
      newErrors.endDate = "End date must be a valid date";

    return newErrors;
  }, [form]);

  const { mutate: mutateGetExport, isPending } = getExport();

  const downloadExport = useCallback(async () => {
    // verify that the information is valid
    const newErrors = getErrors();
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      alert("Please correct the errors and try again.");
      return;
    }

    // if empty string, send undefined instead
    mutateGetExport(
      {
        startDate: form.startDate == "" ? undefined : form.startDate,
        endDate: form.endDate == "" ? undefined : form.endDate,
      },
      {
        onSuccess: (blob) => {
          // fake a download button click
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "hdil_data.zip";
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        },
        onError: (error) => {
          console.error("Download export failed:", error);
          alert("Failed to download export");
        },
      }
    );
  }, [getErrors, mutateGetExport, form.startDate, form.endDate]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="export-popup">
      <p>Select dates to export</p>
      <div className="row">
        <TextInput
          label="Start Date (inclusive)"
          placeholder="YYYY-MM-DD"
          value={form.startDate}
          onChange={(v) => editForm({ startDate: v })}
          error={errors.startDate}
          onBlur={() => setErrors(getErrors())}
        />
        <TextInput
          label="End Date (exclusive)"
          placeholder="YYYY-MM-DD"
          value={form.endDate}
          onChange={(v) => editForm({ endDate: v })}
          error={errors.endDate}
          onBlur={() => setErrors(getErrors())}
        />
      </div>
      <div className="row button-row">
        <button className="primary" onClick={() => downloadExport()}>
          {isPending ? "Loading..." : "Export"}
        </button>
      </div>
    </Modal>
  );
};

export default ExportPopup;
