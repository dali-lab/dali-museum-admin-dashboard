import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import "./styles.scss";

interface ToggleProps {
  label: string;
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  value,
  onChange,
  disabled, // this is a fake disabled because it still allows you to toggle
  // it expects the backend to throw an error if you try to toggle when disabled
}) => {
  const props = {
    size: 25,
    className: "toggle-button" + (disabled ? " disabled" : ""),
  };
  return (
    <div className="toggle" onClick={() => onChange && onChange(!value)}>
      <label>{label}</label>
      {value ? <BsToggleOn {...props} /> : <BsToggleOff {...props} />}
    </div>
  );
};

export default Toggle;
