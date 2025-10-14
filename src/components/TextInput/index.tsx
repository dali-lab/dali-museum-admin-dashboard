import { useMemo } from "react";
import "./styles.scss";
import { isNumber, parseNumber } from "@/utils";

interface TextInputProps<T> {
  type?: "text" | "textarea" | "password" | "number";
  value: T;
  label: string;
  placeholder?: string;
  onChange?: (value: T) => void;
  error?: string;
  onBlur?: () => void; // for setting errors
  rows?: number; // for textarea
  resize?: "none" | "vertical" | "horizontal" | "both"; // for textarea
}

function TextInput<T>({
  type,
  label,
  value,
  onChange,
  error,
  rows,
  resize,
  ...otherProps
}: TextInputProps<T>) {
  // unique id for this text input
  const id = useMemo(
    () => "text-input-" + label.toLowerCase().replace(/\s+/g, "-"),
    [label]
  );

  const isError = useMemo(() => error && error !== "", [error]);

  const props = {
    id,
    type: type === "number" ? "text" : type ?? "text",
    className: "field" + (isError ? " error" : ""),
    value: value?.toString() ?? "",
    onChange: (e: any) => {
      if (!onChange) return;
      const newval = e?.target?.value ?? "";

      if (type === "number") {
        // if number type, only onchange if value is a valid number.
        if (isNumber(newval)) onChange(parseNumber(newval) as T);
      } else onChange(newval);
    },
    rows: rows ?? 4,
    style: { resize: resize ?? "vertical" },
    ...otherProps,
  };

  return (
    <div className="text-input">
      <div className="labels-container">
        <label htmlFor={id} className="label">
          {label}
        </label>
        {isError && <span className="error">{error}</span>}
      </div>
      {type === "textarea" ? <textarea {...props} /> : <input {...props} />}
    </div>
  );
}

export default TextInput;
