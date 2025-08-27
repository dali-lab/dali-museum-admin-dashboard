import { useState } from "react";
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
  const [isHover, setIsHover] = useState(false);

  const props = {
    size: 25,
    className: "toggle-button" + (disabled ? " disabled" : ""),
    onMouseEnter: () => setIsHover(true),
    onMouseLeave: () => setIsHover(false),
  };

  return (
    <div
      className="toggle"
      onClick={() => onChange && !disabled && onChange(!value)}
    >
      <label>{label}</label>
      {value ? <BsToggleOn {...props} /> : <BsToggleOff {...props} />}
      {title && isHover && <div className="tooltip">{title}</div>}
    </div>
  );
};

export default Toggle;
