// adapted from Alan Zucconi's unity shader
// www.alanzucconi.com

precision mediump float;

uniform sampler2D u_HeatTex;  // heatmap texture: color gradient

uniform vec2 u_CanvasSize;

uniform int u_PointsLength;
uniform vec2 u_Points[2000]; // (x, y) = position
uniform vec2 u_Properties[2000]; // x = radius, y = intensity
// TODO ^ make these a texture (webgl doesn't like being given 4000 uniforms)

varying vec2 v_uv;  // position of this vertex in the canvas

void main() {
    // Loops over all the points
    float h = 0.0;

    // glsl won't let you loop to a non-constant number (like u_PointsLength)
    for (int i = 0; i < 2000; i++) {
        if (i >= u_PointsLength) break;

        // Calculates the contribution of each point
        float di = distance(v_uv, u_Points[i].xy);

        float ri = u_Properties[i].x;  // radius
        float hi = 1.0 - clamp(di / ri, 0.0, 1.0);

        h += hi * u_Properties[i].y;  // multiply by intensity
    }

    // Converts (0-1) according to the heat texture
    h = clamp(h, 0.0, 1.0);
    vec4 color = texture2D(u_HeatTex, vec2(h, 0.5));

    gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}