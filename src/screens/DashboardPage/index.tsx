import React from "react";
import { ROUTES } from "@/utils/constants";
import { logout } from "@/api/auth";
import useBoundStore from "@/store";
import { getAuthUser } from "@/api/auth";
import NavWidget from "./NavWidget";

function DashboardPage() {
  const { authenticated, role, name } = getAuthUser().data;

  const { mutate: mutateLogout } = logout();

  return (
    <div className="container">
      <div>
        <h1>Welcome {name}</h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <NavWidget to={ROUTES.PAINTINGS}>
          <h1>See and edit paintings</h1>
        </NavWidget>
        <NavWidget to={ROUTES.HEATMAPS}>
          <h1>See heatmaps</h1>
        </NavWidget>
      </div>
      <button onClick={() => mutateLogout()}>Logout</button>
    </div>
  );
}

export default DashboardPage;
