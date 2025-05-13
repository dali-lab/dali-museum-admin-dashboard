attribute vec2 a_position;  // -1 to 1
varying vec2 v_uv;

void main() {
    v_uv = a_position * 0.5 + 0.5;  // map from -1, 1 to 0, 1
    gl_Position = vec4(a_position, 0.0, 1.0);
}