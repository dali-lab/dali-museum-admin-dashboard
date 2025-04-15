import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const props = { className: "header-icon", size: 30 };
  return (
    <div className="page-header">
      {selected == ROUTES.SETTINGS ? (
        <BsGearFill {...props} style={{ color: "#AAEAE5" }} />
      ) : (
        <BsGear {...props} onClick={() => navigate(ROUTES.SETTINGS)} />
      )}
      {selected == ROUTES.DASHBOARD ? (
        <BsHouseFill {...props} style={{ color: "#AAEAE5" }} />
      ) : (
        <BsHouse {...props} onClick={() => navigate(ROUTES.DASHBOARD)} />
      )}
      {selected == ROUTES.ADMIN_REQUESTS ? (
        <BsBellFill {...props} style={{ color: "#AAEAE5" }} />
      ) : (
        <BsBell {...props} onClick={() => navigate(ROUTES.ADMIN_REQUESTS)} />
      )}

      <h1 className="title">{title}</h1>
      {<>{children}</>}
    </div>
  );
};

export default PageHeader;
