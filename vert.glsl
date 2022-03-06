
attribute vec4 VertPos;
varying vec2 FragPos;
varying vec2 uv;


void main() {
    gl_Position = VertPos;
    FragPos = VertPos.xy;
    uv = (FragPos + 1.0) / 2.0;
}