// adapted from Alan Zucconi's unity shader
// www.alanzucconi.com

precision mediump float;

uniform sampler2D u_HeatTex;  // heatmap texture: color gradient

uniform int u_PointsLength;
uniform sampler2D u_PointTex; // points texture (webgl doesn't like being given 4000 uniforms)

varying vec2 v_uv;  // position of this vertex in the canvas. 0-1

void main() {
    float h = 0.0;

    // glsl won't let you loop to a non-constant number (like u_PointsLength)
    for (int i = 0; i < 2000; i++) {
        if (i >= u_PointsLength) break;

        // get point from texture
        // the texture is a single row of points, 1 pixel tall.
        float x = (float(i) + 0.5) / float(u_PointsLength);
        vec4 point = texture2D(u_PointTex, vec2(x, 0.5));
        vec2 coords = vec2(point.x, point.y);
        vec2 properties = vec2(point.z, point.w);  // radius and intensity

        // Calculates the contribution of each point
        float di = distance(v_uv, coords.xy);

        float ri = properties.x/5.0;  // radius. 0-1
        float hi = 1.0 - clamp(di / ri, 0.0, 1.0);

        h += hi * properties.y;  // multiply by intensity. >1
    }

    // Converts (0-1) according to the heat texture
    h = clamp(h, 0.0, 1.0);
    vec4 color = texture2D(u_HeatTex, vec2(h, 0.5));

    gl_FragColor = color;
}