import { Navigate, useNavigate, useParams } from "react-router-dom";
import { BsEraser, BsEraserFill, BsPencil, BsPencilFill } from "react-icons/bs";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles.scss";
import {
  HEATMAP_POINT_FREQUENCY,
  MAX_HEATMAP_POINTS,
  ROUTES,
  MIN_BRUSH_SIZE,
  MAX_BRUSH_SIZE,
  MIN_POINTS_ADDED,
  MAX_POINTS_ADDED,
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
      properties.push([0.4, value / 100]); // TODO the radius is hardcoded per painting in unity. why
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

  const [isErasing, setIsErasing] = useState(false);
  const [brushSize, setBrushSize] = useState(MIN_BRUSH_SIZE);
  const [isDragging, setIsDragging] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [idleMousePosition, setIdleMousePosition] = useState({ x: 0, y: 0 });
  const drawIntervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDraw = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (!canvasRef.current) return;
      if (pointsArray.length >= MAX_HEATMAP_POINTS) return;
      if (isErasing) return;

      const { left, top, width, height } =
        canvasRef.current.getBoundingClientRect();

      const clickLoc = { x: x - left, y: y - top };

      // how many points to add depends on brush size
      const numPointsToAdd =
        MIN_POINTS_ADDED +
        ((brushSize - MIN_BRUSH_SIZE) / (MAX_BRUSH_SIZE - MIN_BRUSH_SIZE)) *
          (MAX_POINTS_ADDED - MIN_POINTS_ADDED);

      const points = Array.from({ length: numPointsToAdd }, () => {
        // add jitter in a circle around the point
        // TODO i think it works better without but maybe i'll add it back in later
        // const angle = Math.random() * 2 * Math.PI;
        // const radius = Math.random() * (brushSize / 20);
        // clickLoc.x += Math.cos(angle) * radius;
        // clickLoc.y += Math.sin(angle) * radius;

        const normalizedPoint = {
          x: clickLoc.x / width,
          y: clickLoc.y / height,
        };

        return normalizedPoint;
      });

      // add the points
      addPoints(points);
    },
    [addPoints, brushSize, isErasing, pointsArray.length]
  );

  const handleErase = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (!canvasRef.current) return;
      if (!isErasing) return;

      const { left, top, width, height } =
        canvasRef.current.getBoundingClientRect();

      const clickLoc = { x: x - left, y: y - top };
      setHeatmapPoints((prev) => {
        const newHeatmapPoints = { ...prev };
        Object.keys(newHeatmapPoints).forEach((key) => {
          const pointPercentage = JSON.parse(key);
          const pointLoc = {
            x: pointPercentage.x * width,
            y: pointPercentage.y * height,
          };
          if (
            Math.hypot(pointLoc.x - clickLoc.x, pointLoc.y - clickLoc.y) <=
            brushSize / 2
          ) {
            delete newHeatmapPoints[key];
          }
        });
        return newHeatmapPoints;
      });
    },
    [brushSize, isErasing]
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

      if (isErasing) handleErase(mousePosition.current);
      else {
        // start interval
        drawIntervalId.current = setInterval(() => {
          handleDraw(mousePosition.current);
        }, 1000 / HEATMAP_POINT_FREQUENCY);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
      if (isErasing && isDragging) {
        handleErase(mousePosition.current);
      }
      if (!isDragging) {
        setIdleMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
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
  }, [
    addPoints,
    handleDraw,
    handleErase,
    isDragging,
    isErasing,
    mousePosition,
  ]);

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
        <div
          className="size-indicator"
          style={{
            width: brushSize,
            height: brushSize,
            left:
              (isDragging ? mousePosition.current.x : idleMousePosition.x) -
              (canvasRef.current?.getBoundingClientRect().left ?? 0),
            top:
              (isDragging ? mousePosition.current.y : idleMousePosition.y) -
              (canvasRef.current?.getBoundingClientRect().top ?? 0),
          }}
        />
      </div>
      <div className="buttons-row">
        <button onClick={clearCanvas}>Clear canvas</button>
        <div
          className="button switch"
          onClick={() => setIsErasing((prev) => !prev)}
        >
          {isErasing ? (
            <BsPencil className="icon" />
          ) : (
            <BsPencilFill className="icon selected" />
          )}
          {isErasing ? (
            <BsEraserFill className="icon selected" />
          ) : (
            <BsEraser className="icon" />
          )}
        </div>

        <div style={{ flexGrow: 1 }}>
          Brush size
          <Slider
            style={{ maxWidth: "300px" }}
            min={MIN_BRUSH_SIZE}
            max={MAX_BRUSH_SIZE}
            value={brushSize}
            onChange={(value) => setBrushSize(value as number)}
          />
        </div>

        <button className="danger" onClick={loadPoints}>
          Discard changes
        </button>
        <button className="primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditCuratorHeatmapPage;
