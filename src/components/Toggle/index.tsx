import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import "./styles.scss";

interface ToggleProps {
  label: string;
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  title?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  value,
  onChange,
  disabled,
  title,
}) => {
  const props = {
    size: 25,
    className: "toggle-button" + (disabled ? " disabled" : ""),
  };
  return (
    <div
      className="toggle"
      title={title}
      onClick={() => onChange && !disabled && onChange(!value)}
    >
      <label>{label}</label>
      {value ? <BsToggleOn {...props} /> : <BsToggleOff {...props} />}
    </div>
  );
};

export default Toggle;
