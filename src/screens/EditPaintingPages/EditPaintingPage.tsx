import Tabs from "@/components/Tabs";
import { ROUTES } from "@/utils/constants";
import { useMemo } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";
import "./styles.scss";

const EditPaintingPage: React.FC = () => {
  const { paintingId } = useParams();
  const location = useLocation();

  // remove the parent part of url to get just the child
  const selectedRoute = useMemo(
    () =>
      location.pathname
        .replace(`${ROUTES.PAINTINGS}/${paintingId}`, "")
        .replace(/^\/+|\/+$/g, ""), // remove slahes at beginning and end
    [location]
  );

  // if my path is just /paintings/:paintingId, redirect to the basic info route
  if (selectedRoute === "") {
    return <Navigate to={ROUTES.EDIT_BASIC_INFO} />;
  }

  return (
    <div className="edit-painting-container">
      <div className="nav-container">
        <Link to={ROUTES.PAINTINGS}>
          <h3>{"<"} Back</h3>
        </Link>
        <Tabs
          tabs={[
            { name: "Basic Info", route: ROUTES.EDIT_BASIC_INFO },
            { name: "Annotations", route: ROUTES.EDIT_ANNOTATIONS },
            { name: "Curator Heatmap", route: ROUTES.EDIT_CURATOR_HEATMAP },
            { name: "Postview Image", route: ROUTES.EDIT_POSTVIEW_IMAGE },
          ]}
          selectedTab={selectedRoute}
        />
      </div>
      <div className="child-container">
        {/* render child component based on route. see App.tsx */}
        <Outlet />
      </div>
    </div>
  );
};

export default EditPaintingPage;
