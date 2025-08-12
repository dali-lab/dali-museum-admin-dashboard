import { Navigate, useNavigate, useParams } from "react-router-dom";
import "../styles.scss";
import { ROUTES } from "@/utils/constants";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getCuratorHeatmap,
  getPainting,
  updateCuratorHeatmap,
} from "@/api/paintings";
import { IPoint } from "@/types/painting";
import useHeatmapShader from "./useHeatmapShader";

const MAX_HEATMAP_POINTS = 1800; // maximum number to allow in a heatmap.
// this is the number of gaze points the tobii collects for a normal gazepath

const EditCuratorHeatmapPage: React.FC = () => {
  const navigate = useNavigate();
  const { paintingId } = useParams();
  useEffect(() => {
    if (!paintingId) {
      navigate(ROUTES.PAINTINGS);
    }
  }, [navigate, paintingId]);

  const {
    data: painting,
    isLoading: isPaintingLoading,
    isFetched: isPaintingFetched,
  } = getPainting(paintingId ?? "");

  const {
    data: curatorHeatmap,
    isLoading,
    isFetched,
  } = getCuratorHeatmap(paintingId ?? "");

  const [heatmapPoints, setHeatmapPoints] = useState<Record<string, number>>(
    {}
  );

  const addPoints = useCallback((points: IPoint[]) => {
    setHeatmapPoints((prev) => {
      // TODO vvvv this will get slow when there's 5000 points
      const newHeatmapPoints = { ...prev };

      points.forEach((point) => {
        const key = JSON.stringify(point);
        if (newHeatmapPoints[key]) {
          newHeatmapPoints[key] += 1;
        } else {
          newHeatmapPoints[key] = 1;
        }
      });

      return newHeatmapPoints;
    });
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  // add mouse click and drag event listeners
  useEffect(() => {
    const onMouseUp = () => {
      // stop dragging
      setIsDragging(false);
    };

    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [addPoints, isDragging]);

  // transform points into a format usable by heatmap
  const [pointsArray, propertiesArray] = useMemo(() => {
    const points: number[][] = [];
    const properties: number[][] = [];

    // construct points and properties arrays
    Object.entries(heatmapPoints).forEach(([key, value]) => {
      const { x, y } = JSON.parse(key);
      points.push([x, y]);
      properties.push([0.25, value]); // TODO the radius is hardcoded per painting in unity. why
    });

    return [points, properties];
  }, [heatmapPoints]);

  // TODO limit this to 60hz
  const handleDraw: MouseEventHandler = useCallback(
    (e) => {
      if (pointsArray.length >= MAX_HEATMAP_POINTS) return;

      const { left, top, width, height } =
        e.currentTarget.getBoundingClientRect();

      // add a point at the mouse position
      addPoints([
        { x: (e.clientX - left) / width, y: (e.clientY - top) / height },
      ]);
    },
    [addPoints, pointsArray.length]
  );

  // set up webgl shader for canvas
  const { gl, program } = useHeatmapShader(
    canvasRef.current,
    "/heatmap_texture.png",
    pointsArray,
    propertiesArray
  );

  const clearCanvas = useCallback(() => {
    if (!gl || !program) return;

    gl.clearColor(0.0, 0.0, 0.0, 0.0); // clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT); // clear color buffer

    setHeatmapPoints({}); // clear heatmap points
  }, [gl, program]);

  const loadPoints = useCallback(() => {
    if (!curatorHeatmap) return;
    setHeatmapPoints({});
    addPoints(curatorHeatmap.points);
  }, [addPoints, curatorHeatmap]);

  // when heatmap is loaded, set heatmap points
  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  const { mutate: mutateUpdateCuratorHeatmap } = updateCuratorHeatmap();

  const handleSave = useCallback(() => {
    if (!paintingId) return;

    // convert heatmap points from dictionary of counts to array of points
    // order doesn't matter here
    const points: IPoint[] = [];
    Object.entries(heatmapPoints).forEach(([key, value]) => {
      const { x, y } = JSON.parse(key);
      points.push(...Array(value).fill({ x, y }));
    });

    mutateUpdateCuratorHeatmap(
      {
        paintingId,
        points,
      },
      {
        onError: (error) => {
          alert(error.message);
        },
        onSuccess: () => {
          alert("Saved successfully!");
        },
      }
    );
  }, [heatmapPoints, mutateUpdateCuratorHeatmap, paintingId]);

  const reachedMax = useMemo(
    () => pointsArray.length >= MAX_HEATMAP_POINTS,
    [pointsArray]
  );

  if (isPaintingLoading || isLoading) return <p>Loading...</p>;
  if (isPaintingFetched && !painting) return <Navigate to={ROUTES.NOT_FOUND} />;
  if (!painting) return null;
  if (isFetched && !curatorHeatmap) return <p>Something went wrong.</p>;
  if (!curatorHeatmap) return null;

  return (
    <div className="heatmap-page">
      <div className="heatmap-container">
        <img src={painting.url} width="100%" height="100%" />
        <canvas
          className={"heatmap-canvas" + (reachedMax ? " error" : "")}
          ref={canvasRef}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleDraw(e); // add point on mouse down too
          }}
          onMouseMove={(e) => {
            if (!isDragging) return;
            handleDraw(e);
          }}
        />
        {reachedMax && (
          <div className="error-popup">
            You have reached the maximum number of points. Erase some points to
            add more.
          </div>
        )}
      </div>
      <div className="buttons-row">
        {/* <button>draw/erase</button> */}
        {/* <button>slider for brush size probably</button> */}
        <button onClick={clearCanvas}>Clear canvas</button>
        <button onClick={loadPoints}>Discard changes</button>
        <button className="primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditCuratorHeatmapPage;
