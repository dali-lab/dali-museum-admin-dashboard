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

  const [isHeatmapTexLoaded, setIsHeatmapTexLoaded] = useState(false);

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

  const createHeatmapTexture = useCallback(
    (gl: WebGLRenderingContext, program: WebGLProgram, path: string) => {
      // load image
      const image = new Image();
      image.src = path;
      image.onload = () => {
        gl.activeTexture(gl.TEXTURE0);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        //this vvv fixes a weird transparency issue
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(
          gl.TEXTURE_2D, // target
          0, // mipmap level (?)
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

        const uHeatTexLoc = gl.getUniformLocation(program, "u_HeatTex");
        gl.uniform1i(uHeatTexLoc, 0); // texture 0

        setIsHeatmapTexLoaded(true);
      };
    },
    []
  );

  const attachUniforms = useCallback(
    (gl: WebGLRenderingContext, program: WebGLProgram) => {
      // enable floating point textures
      gl.getExtension("OES_texture_float");

      // add vertices
      const vertices = new Float32Array([
        ...[-1, -1], // bottom left
        ...[1, -1], // bottom right
        ...[-1, 1], // top left
        ...[1, 1], // top right
      ]);
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      const positionLoc = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      // create and bind heatmap texture
      createHeatmapTexture(gl, program, texturePath);

      // can attach any other constant uniforms here
    },
    [createHeatmapTexture, texturePath]
  );

  const createPointTexture = useCallback(
    (gl: WebGLRenderingContext, program: WebGLProgram) => {
      // opengl doesn't like big arrays so i'll attach them as a texture instead
      const pointData = new Float32Array(points.length * 4);
      for (let i = 0; i < points.length; i++) {
        pointData[i * 4] = points[i][0]; // x
        pointData[i * 4 + 1] = 1 - points[i][1]; // y (inverted because i think webgl y axis is inverted)
        pointData[i * 4 + 2] = properties[i][0]; // radius
        pointData[i * 4 + 3] = properties[i][1]; // intensity
      }

      // create texture
      gl.activeTexture(gl.TEXTURE1);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // need to turn it off again after i turned it on for the heatmap texture
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(
        gl.TEXTURE_2D, // target
        0, // mipmap level (?)
        gl.RGBA, // internal format
        points.length, // width
        1, // height
        0, // border
        gl.RGBA, // format
        gl.FLOAT, // type
        pointData
      );

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      // attach texture to sampler
      const uPointsTexLoc = gl.getUniformLocation(program, "u_PointTex");
      gl.uniform1i(uPointsTexLoc, 1); // texture 1
    },
    [canvas, points, properties]
  );

  const draw = useCallback(() => {
    if (!GL.gl || !GL.program || !canvas) return;
    const { gl } = GL;

    // first, clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // set the viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    // finally, draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, [GL, canvas]);

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
      if (!shaderProgram) throw new Error("could not create shader program");

      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error(
          "could not link shader program: " +
            gl.getProgramInfoLog(shaderProgram)
        );
      }

      gl.useProgram(shaderProgram);

      gl.validateProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
        throw new Error(
          "could not validate shader program: " +
            gl.getProgramInfoLog(shaderProgram)
        );
      }

      setGL({ gl, program: shaderProgram });

      attachUniforms(gl, shaderProgram);
    } catch (error) {
      console.error("webgl error:", (error as Error).message);
      alert("Failed to load heatmap shader.");
    }
  }, [attachUniforms, canvas, createShader, texturePath]);

  // attach points and properties every time they change
  // and also redraw
  useEffect(() => {
    if (!GL.gl || !GL.program || !isHeatmapTexLoaded) return;
    const { gl, program } = GL;

    const uPointsLength = gl.getUniformLocation(program, "u_PointsLength");
    const pointsLength = points.length;
    gl.uniform1i(uPointsLength, pointsLength);

    createPointTexture(gl, program);

    // finally, redraw
    draw();
  }, [
    GL,
    canvas,
    createPointTexture,
    draw,
    isHeatmapTexLoaded,
    points,
    properties,
    texturePath,
  ]);

  return GL;
};

export default useHeatmapShader;
