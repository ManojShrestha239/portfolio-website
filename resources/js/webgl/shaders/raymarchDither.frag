precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uScroll;
uniform float uReducedMotion;

// Smooth procedural value noise for domain-warped raymarch elevation
float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

float noise2d(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);

    for (int i = 0; i < 4; i++) {
        value += amp * noise2d(p);
        p = rot * p * 2.02;
        amp *= 0.5;
    }

    return value;
}

// Signed distance field for an undulating topographic industrial plane
float fieldSdf(vec3 pos, float t) {
    vec2 warp = vec2(
        fbm(pos.xz * 0.48 + vec2(t * 0.14, -t * 0.09)),
        fbm(pos.xz * 0.48 + vec2(-t * 0.11, t * 0.12) + 3.7)
    );
    float ridge = fbm(pos.xz * 0.62 + warp * 1.45 - vec2(0.0, uScroll * 0.35));
    float elevation = (ridge - 0.5) * 1.15;
    return pos.y - elevation;
}

// Analytic 8x8 Ordered Bayer threshold matrix (0..1) via recursive 2x2 quadrant subdivision
float bayer8x8(vec2 fragCoord) {
    vec2 p = mod(floor(fragCoord), 8.0);
    float acc = 0.0;
    float scale = 32.0;

    for (int level = 0; level < 3; level++) {
        vec2 bit = mod(floor(p / exp2(float(2 - level))), 2.0);
        float quad = 0.0;
        if (bit.x < 0.5 && bit.y < 0.5) {
            quad = 0.0;
        } else if (bit.x > 0.5 && bit.y > 0.5) {
            quad = 1.0;
        } else if (bit.x < 0.5 && bit.y > 0.5) {
            quad = 2.0;
        } else {
            quad = 3.0;
        }
        acc += quad * scale;
        scale *= 0.25;
    }

    return (acc + 0.5) / 64.0;
}

void main() {
    float t = mix(uTime * 0.12, 1.35, uReducedMotion);

    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 uv = (vUv - 0.5) * aspect;

    // Subtle pointer parallax camera offset
    vec2 pointerShift = (uPointer - 0.5) * 0.28 * (1.0 - uReducedMotion);

    vec3 rayOrigin = vec3(pointerShift.x, 2.35, 3.1 + pointerShift.y);
    vec3 rayDir = normalize(vec3(uv.x, uv.y - 0.52, -1.35));

    // Compact raymarch against the topographic SDF
    float travel = 0.0;
    float hitDensity = 0.0;

    for (int stepIdx = 0; stepIdx < 28; stepIdx++) {
        vec3 samplePos = rayOrigin + rayDir * travel;
        float dist = fieldSdf(samplePos, t);

        if (dist < 0.015) {
            hitDensity = clamp(1.0 - travel / 11.0, 0.0, 1.0);
            break;
        }

        travel += max(dist * 0.65, 0.12);
        if (travel > 11.0) {
            break;
        }
    }

    // Secondary tonal gradient field for smooth industrial depth
    vec2 gradCoord = uv * 1.45 + vec2(t * 0.18, -uScroll * 0.18);
    float tonalWave = fbm(gradCoord + fbm(gradCoord * 1.35));
    float radialAttenuation = 1.0 - smoothstep(0.15, 1.15, length(uv - pointerShift * 0.4));

    float luminance = clamp(
        hitDensity * 0.52 + tonalWave * 0.34 + radialAttenuation * 0.18,
        0.0,
        1.0
    );

    // 8x8 Ordered Bayer dithering quantized into crisp tonal steps
    float threshold = bayer8x8(gl_FragCoord.xy);
    float levels = 5.0;
    float dithered = floor(luminance * levels + threshold) / levels;

    // Strictly near-monochrome Industrial Editorial Dark palette (#0C0D0F -> #181B20)
    // with restrained Industrial Amber (#D97706) warmth capped well below 18% luminance
    vec3 obsidian = vec3(0.047, 0.051, 0.059);   // #0C0D0F
    vec3 graphite = vec3(0.118, 0.133, 0.161);   // #1E2229
    vec3 amberTint = vec3(0.851, 0.467, 0.024);  // #D97706

    vec3 baseColor = mix(obsidian, graphite, dithered * 0.82);

    // Subtle amber highlight strictly on peak dither ridges
    float amberMask = smoothstep(0.68, 1.0, dithered) * radialAttenuation * 0.14;
    vec3 color = mix(baseColor, amberTint, amberMask);

    // Procedural animated film grain (0.04 amplitude)
    float grainTime = mix(floor(uTime * 24.0), 0.0, uReducedMotion);
    float grain = (hash21(gl_FragCoord.xy + grainTime * 17.13) - 0.5) * 0.042;
    color = clamp(color + grain, obsidian * 0.92, vec3(0.32));

    gl_FragColor = vec4(color, 1.0);
}
