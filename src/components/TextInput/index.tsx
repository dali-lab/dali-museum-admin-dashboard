import { useMemo } from "react";
import "./styles.scss";

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  onChange: (value: string) => void;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  type,
  label,
  value,
  onChange,
  error,
  ...props
}) => {
  // unique id for this text input
  const id = useMemo(
    () => "text-input-" + label.toLowerCase().replace(/\s+/g, "-"),
    [label]
  );

  const isError = useMemo(() => error && error !== "", [error]);

  return (
    <div className="text-input">
      <div className="labels-container">
        <label htmlFor={id} className="label">
          {label}
        </label>
        {isError && <span className="error">{error}</span>}
      </div>
      <input
        type={type ?? "text"}
        id={id}
        className={"field" + (isError ? " error" : "")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
};

export default TextInput;
