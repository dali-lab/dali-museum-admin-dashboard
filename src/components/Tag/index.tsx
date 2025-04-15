import { contrastingColor } from "@/utils";
import "./styles.scss";

interface TagProps {
  label: string;
  color: string;
}

const Tag: React.FC<TagProps> = ({ label, color }) => {
  return (
    <div
      className="tag"
      style={{ backgroundColor: color, color: contrastingColor(color) }}
    >
      {label}
    </div>
  );
};

export default Tag;
