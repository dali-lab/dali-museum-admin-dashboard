import React from "react";
import { Link } from "react-router-dom";
import {
  BsBell,
  BsBellFill,
  BsGear,
  BsGearFill,
  BsHouse,
  BsHouseFill,
} from "react-icons/bs";
import "./styles.scss";
import { ROUTES } from "@/utils/constants";

interface PageHeaderProps {
  title?: string;
  children?: React.ReactNode;
  selected?: string; // one of ROUTES
}

const PageHeader = ({ title, children, selected }: PageHeaderProps) => {
  const props = { className: "header-icon", size: 30 };
  return (
    <div className="page-header">
      <div className="absolute-container">
        {selected == ROUTES.SETTINGS ? (
          <BsGearFill {...props} style={{ color: "#AAEAE5" }} />
        ) : (
          <Link to={ROUTES.SETTINGS}>
            <BsGear {...props} />
          </Link>
        )}
        {selected == ROUTES.DASHBOARD ? (
          <BsHouseFill {...props} style={{ color: "#AAEAE5" }} />
        ) : (
          <Link to={ROUTES.DASHBOARD}>
            <BsHouse {...props} />
          </Link>
        )}
        {selected == ROUTES.ADMIN_REQUESTS ? (
          <BsBellFill {...props} style={{ color: "#AAEAE5" }} />
        ) : (
          <Link to={ROUTES.ADMIN_REQUESTS}>
            <BsBell {...props} />
          </Link>
        )}

        <h1 className="title">{title}</h1>

        {children}
      </div>
    </div>
  );
};

export default PageHeader;
