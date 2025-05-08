import { Link } from "react-router-dom";
import "./styles.scss";

interface TabsProps {
  tabs: { name: string; route: string }[];
  selectedTab: string; // route of selected tab
}

const Tabs: React.FC<TabsProps> = ({ tabs, selectedTab }) => {
  return (
    <div className="tabs">
      {tabs.map(({ name, route }) =>
        route === selectedTab ? (
          <div key={route} className="tab selected">
            {name}
          </div>
        ) : (
          <Link key={route} to={route}>
            <div className="tab">{name}</div>
          </Link>
        )
      )}
    </div>
  );
};

export default Tabs;
