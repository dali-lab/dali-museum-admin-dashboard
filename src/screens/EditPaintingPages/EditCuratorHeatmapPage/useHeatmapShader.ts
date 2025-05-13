import { useCallback, useEffect, useState } from "react";
import vertShaderSource from "./heatmap-vertex.glsl?raw";
import fragShaderSource from "./heatmap-fragment.glsl?raw";

const useHeatmapShader = (
  canvas: HTMLCanvasElement | null,
  texturePath: string,
  points: number[][],
  properties: number[][]
) => {
  const [GL, setGL] = useState<{
    gl: WebGLRenderingContext | null;
    program: WebGLProgram | null;
  }>({ gl: null, program: null });

  const createShader = useCallback(
    (gl: WebGLRenderingContext, type: number, source: string) => {
      // create shader
      const newShader = gl.createShader(type);
      if (!newShader) throw new Error("could not create shader");

      gl.shaderSource(newShader, source);
      gl.compileShader(newShader);

      if (!gl.getShaderParameter(newShader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(newShader);
        gl.deleteShader(newShader);
        throw new Error(
          `could not compile the ${type == gl.VERTEX_SHADER ? "vertex" : "fragment"} shader: ${error}`
        );
      }

      return newShader;
    },
    []
  );

  const createTexture = useCallback(
    (gl: WebGLRenderingContext, path: string) => {
      // load image
      const image = new Image();
      image.src = path;
      image.onload = () => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texImage2D(
          gl.TEXTURE_2D, // target
          0, // level
          gl.RGBA, // internalFormat
          gl.RGBA, // srcFormat
          gl.UNSIGNED_BYTE, // srcType
          image
        );

        // set texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      };
    },
    []
  );

  useEffect(() => {
    try {
      if (!canvas) return;

      // create webgl context
      const gl = canvas.getContext("webgl");
      if (!gl) throw new Error("could not initialize webGL context");

      // create shaders
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSource);
      const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragShaderSource
      );

      // create shader program
      const shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error(
          "could not create shader program: " +
            gl.getProgramInfoLog(shaderProgram)
        );
      }

      // create and bind texture
      createTexture(gl, texturePath);
      const uHeatTexLoc = gl.getUniformLocation(shaderProgram, "u_HeatTex");
      gl.uniform1i(uHeatTexLoc, 0); // texture 0
      gl.activeTexture(gl.TEXTURE0);

      // attach other constant uniforms
      const uCanvasSize = gl.getUniformLocation(shaderProgram, "u_CanvasSize");
      gl.uniform2f(uCanvasSize, canvas.width, canvas.height);

      setGL({ gl, program: shaderProgram });
    } catch (error) {
      console.error("webgl error:", (error as Error).message);
      alert("Failed to load heatmap shader.");
    }
  }, [canvas, createShader, createTexture, texturePath]);

  // attach points and properties every time they change
  useEffect(() => {
    if (!GL.gl || !GL.program) return;
    const { gl, program } = GL;

    const uPointsLength = gl.getUniformLocation(program, "u_PointsLength");
    const uPoints = gl.getUniformLocation(program, "u_Points");
    const uProperties = gl.getUniformLocation(program, "u_Properties");

    const pointsLength = points.length;
    const flattenedPoints = new Float32Array(points.flat());
    const flattenedProperties = new Float32Array(properties.flat());

    gl.uniform1i(uPointsLength, pointsLength);
    gl.uniform2fv(uPoints, flattenedPoints);
    gl.uniform1fv(uProperties, flattenedProperties);
  }, [GL, points, properties]);

  return GL;
};

export default useHeatmapShader;
