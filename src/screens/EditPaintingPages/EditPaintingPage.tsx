import Tabs from "@/components/Tabs";
import { ROUTES } from "@/utils/constants";
import { useEffect, useMemo } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./styles.scss";
import { getPainting } from "@/api/paintings";

const EditPaintingPage: React.FC = () => {
  const navigate = useNavigate();
  const { paintingId } = useParams();
  const location = useLocation();

  // remove the parent part of url to get just the child
  const selectedRoute = useMemo(
    () =>
      location.pathname
        .replace(`${ROUTES.PAINTINGS}/${paintingId}`, "")
        .replace(/^\/+|\/+$/g, ""), // remove slahes at beginning and end
    [location.pathname, paintingId]
  );

  // if my path is just /paintings/:paintingId, redirect to the basic info route
  useEffect(() => {
    if (selectedRoute === "") {
      navigate(ROUTES.EDIT_BASIC_INFO, { replace: true });
    }
  }, [navigate, selectedRoute]);

  // ensure painting exists by fetching from db
  const { data: painting, isFetched } = getPainting(paintingId ?? "", {
    retry: false,
  });
  useEffect(() => {
    if (isFetched && !painting) {
      navigate(ROUTES.NOT_FOUND, { replace: true });
    }
  }, [isFetched, navigate, painting]);

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
