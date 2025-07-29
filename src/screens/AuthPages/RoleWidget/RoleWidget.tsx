import { BsPersonFill } from "react-icons/bs";
import "./RoleWidget.scss";
import { Link } from "react-router-dom";
import { readableScope, UserScopes } from "@/types/users";

interface RoleWidgetProps {
  to: string;
  role: UserScopes;
  subtitle?: string;
}

const RoleWidget: React.FC<RoleWidgetProps> = ({ to, role, subtitle }) => {
  return (
    <Link className="role-widget" to={to}>
      <BsPersonFill className="person-icon" />

      <h2>{readableScope(role)}</h2>
      <p>{subtitle}</p>
    </Link>
  );
};

export default RoleWidget;
