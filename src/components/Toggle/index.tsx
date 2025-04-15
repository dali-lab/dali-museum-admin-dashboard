import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import "./styles.scss";

interface ToggleProps {
  label: string;
  value: boolean;
  onChange?: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, value, onChange }) => {
  const props = { size: 25 };
  return (
    <div className="toggle" onClick={() => onChange && onChange(!value)}>
      <label>{label}</label>
      {value ? <BsToggleOn {...props} /> : <BsToggleOff {...props} />}
    </div>
  );
};

export default Toggle;
