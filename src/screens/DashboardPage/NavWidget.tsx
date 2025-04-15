import "./styles.scss";

interface NavWidgetProps {
  children: React.ReactNode;
}

const NavWidget = ({ children }: NavWidgetProps) => {
  return <div className="nav-widget">{children}</div>;
};

export default NavWidget;
