precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform float uIntensity;
uniform float uGrain;
uniform float uAmber;
uniform float uLevels;
uniform float uDitherMode;
uniform float uDitherScale;
uniform float uSteps;
uniform float uPaper;
uniform vec3 uCanvasDark;
uniform vec3 uInkDark;
uniform vec3 uCanvasLight;
uniform vec3 uInkLight;
uniform vec3 uAccent;

const int MAX_STEPS = 96;
const float MAX_DIST = 16.0;

mat2 rotate2d(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float sdRoundBox(vec3 p, vec3 b, float r) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float smoothUnion(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float mapField(vec3 p) {
    vec3 q = p;
    q.xz = rotate2d(0.22 * sin(uTime * 0.06) + uPointer.x * 0.30) * q.xz;
    q.xy = rotate2d(0.14 * cos(uTime * 0.045) - uPointer.y * 0.20) * q.xy;
    float t = uTime * 0.11;
    float slabA = sdRoundBox(q - vec3(0.55 * sin(t), 0.30 * cos(t * 0.8) + 0.10, 0.0), vec3(1.45, 0.20, 0.95), 0.30);
    float slabB = sdRoundBox(q - vec3(-0.95, -0.45 + 0.22 * sin(t * 1.25), 0.55), vec3(0.48, 0.52, 1.25), 0.34);
    float floorWave = q.y + 1.20 + 0.20 * sin(q.x * 1.05 + t) * cos(q.z * 0.85 - t * 0.7);
    return smoothUnion(smoothUnion(slabA, slabB, 0.80), floorWave, 0.95);
}

vec3 fieldNormal(vec3 p) {
    vec2 k = vec2(1.0, -1.0);
    float e = 0.0028;
    return normalize(
        k.xyy * mapField(p + k.xyy * e) +
        k.yyx * mapField(p + k.yyx * e) +
        k.yxy * mapField(p + k.yxy * e) +
        k.xxx * mapField(p + k.xxx * e)
    );
}

float ambientOcclusion(vec3 p, vec3 n) {
    float occ = 0.0;
    float sca = 1.0;
    for (int i = 0; i < 5; i++) {
        float h = 0.02 + 0.14 * float(i);
        occ += (h - mapField(p + n * h)) * sca;
        sca *= 0.72;
    }
    return clamp(1.0 - 1.6 * occ, 0.0, 1.0);
}

float backgroundLuma(vec2 uv) {
    return 0.028 + 0.055 * smoothstep(-1.10, 1.00, uv.y) + 0.030 * exp(-pow((uv.y + 0.18) * 3.2, 2.0));
}

float marchLuma(vec2 uv, float stepBudget) {
    vec3 ro = vec3(0.10 * sin(uTime * 0.05), 0.34 + 0.08 * cos(uTime * 0.043), -4.60);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1.62));
    float travel = 0.0;
    float hit = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        if (float(i) >= stepBudget) break;
        float sceneDistance = mapField(ro + rd * travel);
        if (sceneDistance < 0.0022 * travel) {
            hit = 1.0;
            break;
        }
        travel += sceneDistance * 0.85;
        if (travel > MAX_DIST) break;
    }
    float bg = backgroundLuma(uv);
    if (hit < 0.5) return bg;

    vec3 sp = ro + rd * travel;
    vec3 sn = fieldNormal(sp);
    vec3 key = normalize(vec3(-0.58, 0.72, -0.38));
    float diffuse = clamp(dot(sn, key), 0.0, 1.0);
    float rim = pow(clamp(1.0 + dot(sn, rd), 0.0, 1.0), 2.6);
    float spec = pow(clamp(dot(reflect(rd, sn), key), 0.0, 1.0), 26.0);
    float ao = ambientOcclusion(sp, sn);
    float shaded = 0.055 + 0.70 * diffuse * ao + 0.20 * rim * ao + 0.34 * spec;
    return clamp(mix(bg, shaded, exp(-0.017 * travel * travel)), 0.0, 1.0);
}

float bayer2(vec2 a) {
    a = floor(a);
    return fract(dot(a, vec2(0.5, a.y * 0.75)));
}

float bayer4(vec2 a) {
    return bayer2(0.5 * a) * 0.25 + bayer2(a);
}

float bayer8(vec2 a) {
    return bayer4(0.5 * a) * 0.25 + bayer2(a);
}

float quantise(float v, float th, float lv) {
    float bands = max(lv - 1.0, 1.0);
    return clamp(floor(v * bands + th) / bands, 0.0, 1.0);
}

float diffusionLuma(vec2 pixel, vec2 uv, float base) {
    vec2 texel = 2.0 / uResolution;
    float dir = mod(floor(pixel.y), 2.0) < 0.5 ? 1.0 : -1.0;
    float ns = max(floor(uSteps * 0.42), 14.0);
    float n1 = marchLuma(uv + vec2(-dir, 0.0) * texel, ns);
    float n2 = marchLuma(uv + vec2(0.0, -1.0) * texel, ns);
    float n3 = marchLuma(uv + vec2(dir, -1.0) * texel, ns);
    float n4 = marchLuma(uv + vec2(-dir, -1.0) * texel, ns);
    float err =
        (n1 - quantise(n1, 0.5, uLevels)) * 0.4375 +
        (n2 - quantise(n2, 0.5, uLevels)) * 0.3125 +
        (n3 - quantise(n3, 0.5, uLevels)) * 0.1875 +
        (n4 - quantise(n4, 0.5, uLevels)) * 0.0625;
    return clamp(base + err * 0.90, 0.0, 1.0);
}

void main() {
    vec2 pixel = gl_FragCoord.xy;
    vec2 uv = (2.0 * pixel - uResolution) / max(uResolution.y, 1.0);
    float aspect = uResolution.x / max(uResolution.y, 1.0);

    float luma = marchLuma(uv, uSteps);
    luma = clamp(luma * uIntensity * mix(0.72, 1.18, smoothstep(-aspect, aspect, uv.x)), 0.0, 1.0);
    luma = clamp(luma + (hash21(pixel + fract(uTime) * vec2(91.7, 57.3)) - 0.5) * uGrain, 0.0, 1.0);

    float threshold = bayer8(pixel / max(uDitherScale, 1.0));
    float shaped = luma;
    float activeTh = threshold;

    if (uDitherMode > 1.5) {
        shaped = diffusionLuma(pixel, uv, luma);
        activeTh = 0.5;
    } else if (uDitherMode < 0.5) {
        activeTh = 0.5;
    }

    float tone = uDitherMode < 0.5 ? shaped : quantise(shaped, activeTh, uLevels);
    float seam = exp(-pow((uv.y - 0.12 * sin(uTime * 0.07)) * 5.0, 2.0));
    float accentTone = quantise(smoothstep(0.52, 0.96, luma) * (0.30 + 0.70 * seam) * uAmber, fract(threshold + 0.37), 3.0);

    vec3 canvasColour = mix(uCanvasDark, uCanvasLight, uPaper);
    vec3 inkColour = mix(uInkDark, uInkLight, uPaper);
    vec3 colour = mix(canvasColour, inkColour, tone);
    colour = mix(colour, mix(uAccent, inkColour, 0.12 * uPaper), clamp(accentTone, 0.0, 1.0) * 0.90);

    float vig = 1.0 - 0.28 * pow(clamp(length(uv * vec2(0.42, 0.62)), 0.0, 1.0), 2.2);
    colour *= mix(vig, 1.0, uPaper * 0.60);

    gl_FragColor = vec4(colour, 1.0);
}
