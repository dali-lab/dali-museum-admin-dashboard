import { Link } from "react-router-dom";
import "./styles.scss";

interface NavWidgetProps {
  to: string;
  children: React.ReactNode;
}

const NavWidget = ({ to, children }: NavWidgetProps) => {
  return (
    <Link to={to}>
      <div className="nav-widget">{children}</div>
    </Link>
  );
};

export default NavWidget;
