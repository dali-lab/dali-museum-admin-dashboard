import { Navigate, useNavigate, useParams } from "react-router-dom";
import "../styles.scss";
import {
  HEATMAP_POINT_FREQUENCY,
  JITTER_AMOUNT,
  MAX_HEATMAP_POINTS,
  ROUTES,
} from "@/utils/constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getCuratorHeatmap,
  getPainting,
  updateCuratorHeatmap,
} from "@/api/paintings";
import { IPoint } from "@/types/painting";
import useHeatmapShader from "./useHeatmapShader";

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
  const mousePosition = useRef({ x: 0, y: 0 });
  const drawIntervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDraw = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (!canvasRef.current) return;
      if (pointsArray.length >= MAX_HEATMAP_POINTS) return;

      const { left, top, width, height } =
        canvasRef.current.getBoundingClientRect();

      const point = { x: (x - left) / width, y: (y - top) / height };

      // add jitter
      point.x += (Math.random() - 0.5) * JITTER_AMOUNT;
      point.y += (Math.random() - 0.5) * JITTER_AMOUNT;

      // add a point at the mouse position
      addPoints([point]);
    },
    [addPoints, pointsArray.length]
  );

  // add mouse click and drag event listeners
  useEffect(() => {
    const onMouseUp = () => {
      // stop dragging
      setIsDragging(false);
      // clear interval
      if (drawIntervalId.current) {
        clearInterval(drawIntervalId.current);
        drawIntervalId.current = null;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };

      // start interval
      drawIntervalId.current = setInterval(() => {
        handleDraw(mousePosition.current);
      }, 1000 / HEATMAP_POINT_FREQUENCY);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    window.addEventListener("mouseup", onMouseUp);
    if (canvasRef.current) {
      canvasRef.current.addEventListener("mousedown", onMouseDown);
      canvasRef.current.addEventListener("mousemove", onMouseMove);
    }

    const canvas = canvasRef.current;
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      if (canvas) {
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mousedown", onMouseDown);
      }
    };
  }, [addPoints, handleDraw, isDragging]);

  // stop drawing if i reach max length...
  useEffect(() => {
    if (pointsArray.length >= MAX_HEATMAP_POINTS) {
      setIsDragging(false);
      if (drawIntervalId.current) {
        clearInterval(drawIntervalId.current);
        drawIntervalId.current = null;
      }
    }
  }, [pointsArray.length]);

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
