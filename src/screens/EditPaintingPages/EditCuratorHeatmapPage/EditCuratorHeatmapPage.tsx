import { Navigate, useParams } from "react-router-dom";
import "../styles.scss";
import { ROUTES } from "@/utils/constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPainting, updatePainting } from "@/api/paintings";
import { IPoint } from "@/types/painting";
import useHeatmapShader from "./useHeatmapShader";

const EditCuratorHeatmapPage: React.FC = () => {
  const { paintingId } = useParams();

  const {
    data: painting,
    isLoading,
    isFetched,
  } = getPainting(paintingId ?? "");

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

  // transform points into a format usable by heatmap
  const [pointsArray, propertiesArray] = useMemo(() => {
    const points: number[][] = [];
    const properties: number[][] = [];

    // construct points and properties arrays
    Object.entries(heatmapPoints).forEach(([key, value]) => {
      const { x, y } = JSON.parse(key);
      points.push([x, y]);
      properties.push([value, 1]); // TODO check how unity experience constructs this array
    });

    return [points, properties];
  }, [heatmapPoints]);

  // set up webgl shader for canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gl, program } = useHeatmapShader(
    canvasRef.current,
    "", // TODO add texture
    pointsArray,
    propertiesArray
  );

  const clearCanvas = useCallback(() => {
    if (!gl || !program) return;

    // gl.clearColor(0.0, 0.0, 0.0, 0.0); // clear canvas
    // gl.clear(gl.COLOR_BUFFER_BIT); // clear color buffer

    // setHeatmapPoints({}); // clear heatmap points
    // console.log(heatmapPoints);
  }, [gl, program]);

  // when painting is loaded, set heatmap points
  useEffect(() => {
    if (painting) {
      setHeatmapPoints({});
      addPoints(painting.curatorHeatmapPoints);
    }
  }, [addPoints, painting]);

  const { mutate: mutateUpdatePainting } = updatePainting();

  const handleSave = useCallback(() => {
    // convert heatmap points from dictionary of counts to array of points
    const points: IPoint[] = [];
    Object.entries(heatmapPoints).forEach(([key, value]) => {
      const { x, y } = JSON.parse(key);
      points.push(...Array(value).fill({ x, y }));
    });

    // mutateUpdatePainting(
    //   {
    //     id: paintingId,
    //     curatorHeatmapPoints: points,
    //   },
    //   {
    //     onError: (error) => {
    //       alert(error.message);
    //     },
    //     onSuccess: () => {
    //       alert("Saved successfully!");
    //     },
    //   }
    // );
  }, [heatmapPoints]);

  if (isLoading) return <p>Loading...</p>;
  if (isFetched && !painting) return <Navigate to={ROUTES.NOT_FOUND} />;
  if (!painting) return null;

  return (
    <div className="heatmap-page">
      <div className="heatmap-container">
        <img src={painting.url} width="100%" height="100%" />
        <canvas className="heatmap-canvas" ref={canvasRef} />
      </div>
      <div
        className="buttons-row"
        style={{
          width: canvasRef.current?.getBoundingClientRect().width ?? "auto",
        }}
      >
        <button onClick={clearCanvas}>Clear</button>
        <button className="primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditCuratorHeatmapPage;
