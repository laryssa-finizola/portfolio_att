'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

/**
 * Robô de argila em WebGL2, sem bibliotecas: o corpo inteiro é um campo de
 * distância (SDF) renderizado por ray marching em um único fragment shader.
 * - Cabeça, olhos e corpo seguem o ponteiro com molas criticamente amortecidas.
 * - Pisca, acena ao aparecer e pula (com olhos felizes) quando recebe um toque.
 * - Só desenha enquanto está visível; movimento reduzido = um quadro estático.
 * - Sem WebGL2 (ou se o shader falhar), fica a imagem estática de fallback.
 */

const VERT = `#version 300 es
in vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uTime;
uniform vec2 uLook; uniform float uBodyYaw; uniform vec2 uEye;
uniform float uBlink; uniform float uHappy; uniform float uHop; uniform float uWave; uniform float uSquash;
out vec4 outColor;

const vec3 C_HELMET = vec3(0.722, 0.612, 0.941);
const vec3 C_BODY   = vec3(0.808, 0.718, 0.973);
const vec3 C_VISOR  = vec3(0.118, 0.067, 0.212);
const vec3 C_EYE    = vec3(1.000, 0.690, 0.890);
const vec3 C_ACCENT = vec3(0.976, 0.647, 0.859);
const vec3 C_SHADOW = vec3(0.235, 0.141, 0.373);

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float sdRoundBox(vec3 p, vec3 b, float r){ vec3 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r; }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r){ vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
float sdCylX(vec3 p, float r, float h, float rr){ vec2 d = vec2(length(p.yz) - r + rr, abs(p.x) - h + rr); return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - rr; }
float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }

float bob(){ return 0.022 * sin(uTime * 2.1); }

vec3 headSpace(vec3 p){
  vec3 q = p - vec3(0.0, 0.06 + uHop + bob(), 0.0);
  q.xz = rot(uLook.x) * q.xz;
  q.yz = rot(uLook.y) * q.yz;
  return q;
}

// x = distância, y = material (1 capacete, 2 viseira, 3 corpo, 4 detalhe)
vec2 map(vec3 p){
  vec3 b = p - vec3(0.0, uHop + bob() * 0.5, 0.0);
  b.y /= (1.0 - uSquash);
  b.xz /= (1.0 + uSquash * 0.6);
  b.xz = rot(uBodyYaw) * b.xz;
  float body = sdRoundBox(b - vec3(0.0, -0.76, 0.0), vec3(0.33, 0.30, 0.27), 0.25);
  float feet = min(sdRoundBox(b - vec3(-0.17, -1.13, 0.05), vec3(0.12, 0.07, 0.15), 0.07),
                   sdRoundBox(b - vec3( 0.17, -1.13, 0.05), vec3(0.12, 0.07, 0.15), 0.07));
  vec3 shL = vec3(-0.35, -0.62, 0.0), shR = vec3(0.35, -0.62, 0.0);
  vec3 hL = shL + vec3(-0.13, -0.31, 0.05);
  vec3 hR = shR + mix(vec3(0.13, -0.31, 0.05), vec3(0.25, 0.28 + 0.07 * sin(uTime * 11.0), 0.08), uWave);
  float arms = min(sdCapsule(b, shL, hL, 0.085), sdCapsule(b, shR, hR, 0.085));
  float neck = sdCapsule(b, vec3(0.0, -0.5, 0.0), vec3(0.0, -0.32, 0.0), 0.13);
  float bodyAll = smin(smin(smin(body, arms, 0.07), feet, 0.04), neck, 0.08);
  vec2 res = vec2(bodyAll, 3.0);

  vec3 q = headSpace(p);
  float helmet = sdRoundBox(q, vec3(0.60, 0.48, 0.48), 0.40);
  float visor  = sdRoundBox(q - vec3(0.0, -0.02, 0.21), vec3(0.46, 0.33, 0.30), 0.27);
  float ears   = sdCylX(vec3(abs(q.x) - 0.61, q.y, q.z), 0.16, 0.06, 0.04);
  float stick  = sdCapsule(q, vec3(0.0, 0.42, 0.0), vec3(0.0, 0.70, 0.0), 0.026);
  float ball   = length(q - vec3(0.0, 0.74, 0.0)) - 0.075;
  if (helmet < res.x) res = vec2(helmet, 1.0);
  if (stick < res.x) res = vec2(stick, 1.0);
  if (visor < res.x) res = vec2(visor, 2.0);
  float acc = min(ears, ball);
  if (acc < res.x) res = vec2(acc, 4.0);
  return res;
}

vec3 calcNormal(vec3 p){
  const vec2 k = vec2(1.0, -1.0); const float h = 0.0015;
  return normalize(k.xyy * map(p + k.xyy * h).x + k.yyx * map(p + k.yyx * h).x + k.yxy * map(p + k.yxy * h).x + k.xxx * map(p + k.xxx * h).x);
}
float softShadow(vec3 ro, vec3 rd){
  float res = 1.0, t = 0.02;
  for (int i = 0; i < 28; i++){ float h = map(ro + rd * t).x; res = min(res, 10.0 * h / t); t += clamp(h, 0.02, 0.25); if (res < 0.002 || t > 4.0) break; }
  return clamp(res, 0.0, 1.0);
}
float calcAO(vec3 p, vec3 n){
  float occ = 0.0, sca = 1.0;
  for (int i = 0; i < 5; i++){ float h = 0.02 + 0.07 * float(i); occ += (h - map(p + n * h).x) * sca; sca *= 0.8; }
  return clamp(1.0 - 1.6 * occ, 0.0, 1.0);
}

float eyeField(vec3 q){
  vec2 e = vec2(abs(q.x - uEye.x) - 0.155, q.y + 0.02 - uEye.y);
  vec2 sz = vec2(0.055, max(0.085 * (1.0 - uBlink), 0.012));
  vec2 d2 = abs(e) - sz + 0.04; float open = length(max(d2, 0.0)) + min(max(d2.x, d2.y), 0.0) - 0.04;
  float happy = abs(length(e - vec2(0.0, -0.05)) - 0.075) - 0.016; happy = max(happy, -(e.y + 0.03));
  return mix(open, happy, uHappy);
}

vec3 shade(vec3 pos, vec3 rd, float m){
  vec3 n = calcNormal(pos);
  vec3 L = normalize(vec3(-0.55, 0.8, 0.7));
  float wrap = clamp((dot(n, L) + 0.35) / 1.35, 0.0, 1.0);
  float sh = softShadow(pos + n * 0.01, L);
  float ao = calcAO(pos, n);
  float sky = 0.5 + 0.5 * n.y;
  float fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.0);
  vec3 base = m < 1.5 ? C_HELMET : m < 2.5 ? C_VISOR : m < 3.5 ? C_BODY : C_ACCENT;
  base = pow(base, vec3(2.2));
  vec3 col;
  if (m > 1.5 && m < 2.5) {
    vec3 r = reflect(rd, n);
    col = base * (0.35 + 0.25 * sky) * ao;
    col += pow(max(dot(r, L), 0.0), 36.0) * 0.55 * sh + fres * 0.18 * vec3(0.8, 0.7, 1.0);
    float d = eyeField(headSpace(pos));
    vec3 eye = pow(C_EYE, vec3(2.2));
    col = mix(col, eye * 1.6, smoothstep(0.006, -0.004, d));
    col += eye * 0.35 * exp(-max(d, 0.0) * 38.0);
  } else {
    col = base * (1.2 * wrap * mix(0.5, 1.0, sh) * vec3(1.05, 0.98, 0.95) + 0.42 * sky * vec3(0.86, 0.84, 1.0)) * ao;
    col += fres * 0.22 * vec3(1.0, 0.86, 1.0) * ao;
  }
  return col;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 ro = vec3(0.0, -0.15, 5.0), ta = vec3(0.0, -0.3, 0.0);
  vec3 cw = normalize(ta - ro), cu = normalize(cross(cw, vec3(0.0, 1.0, 0.0))), cv = cross(cu, cw);
  const float fl = 1.75;
  vec3 rd = normalize(uv.x * cu + uv.y * cv + fl * cw);
  float px = 1.0 / (uRes.y * fl);

  float t = 0.5, m = 0.0, best = 1e9, tBest = 0.0; bool hit = false;
  for (int i = 0; i < 96; i++){
    vec2 h = map(ro + rd * t);
    float ratio = h.x / (t * px);
    if (ratio < best) { best = ratio; tBest = t; m = h.y; }
    if (h.x < 0.0008 * t) { hit = true; m = h.y; break; }
    t += h.x;
    if (t > 8.0) break;
  }

  vec3 col = vec3(0.0); float alpha = 0.0;
  if (hit) { col = shade(ro + rd * t, rd, m); alpha = 1.0; }
  else if (best < 1.5) { col = shade(ro + rd * tBest, rd, m); alpha = clamp(1.0 - best / 1.5, 0.0, 1.0); }

  // Sombra de contato no chão (transparente fora dela).
  float floorY = -1.205;
  if (rd.y < 0.0) {
    float tf = (floorY - ro.y) / rd.y;
    if (!hit || tf < t) {
      vec3 g = ro + rd * tf;
      float sh = softShadow(g + vec3(0.0, 0.002, 0.0), normalize(vec3(-0.3, 1.0, 0.45)));
      float contact = 1.0 - smoothstep(0.0, 0.35, map(g).x);
      float fade = 1.0 - smoothstep(0.6, 1.5, length(g.xz));
      float a = max((1.0 - sh) * 0.32, contact * 0.4) * fade;
      vec3 sc = pow(C_SHADOW, vec3(2.2));
      col = col * alpha + sc * a * (1.0 - alpha);
      alpha = alpha + a * (1.0 - alpha);
      if (alpha > 0.0) col /= alpha;
    }
  }
  col = col / (1.0 + col * 0.12);
  col = pow(col, vec3(1.0 / 2.2));
  outColor = vec4(col * alpha, alpha);
}`;

type Spring = { x: number; v: number };
const step = (s: Spring, target: number, k: number, dt: number) => {
  s.v += ((target - s.x) * k - 2 * Math.sqrt(k) * s.v) * dt;
  s.x += s.v * dt;
};

export function ClayRobot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;
    // O primeiro quadro desenhado troca a imagem estática pelo canvas.
    const markReady = () => wrapRef.current?.classList.add('is-ready');

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
      return s;
    };
    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'link');
    } catch (error) {
      console.warn('ClayRobot: usando imagem estática.', error);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = Object.fromEntries(['uRes', 'uTime', 'uLook', 'uBodyYaw', 'uEye', 'uBlink', 'uHappy', 'uHop', 'uWave', 'uSquash']
      .map((n) => [n, gl.getUniformLocation(program, n)])) as Record<string, WebGLUniformLocation | null>;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scale = Math.min(window.devicePixelRatio || 1, 1.75);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * scale));
      canvas.height = Math.max(1, Math.round(r.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const state = {
      yaw: { x: 0, v: 0 }, pitch: { x: 0, v: 0 }, body: { x: 0, v: 0 }, wave: { x: 0, v: 0 }, happy: { x: 0, v: 0 },
      hop: reduced ? 0 : 1.6, hopV: 0, squash: 0,
      target: { yaw: 0, pitch: 0 }, lastPointer: -1e9, waveUntil: reduced ? 0 : 2.6, happyUntil: 0,
      blinkAt: 2.2, blinkT: -1, time: 0,
    };

    const draw = (blink: number) => {
      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform1f(u.uTime, state.time);
      gl.uniform2f(u.uLook, state.yaw.x, state.pitch.x);
      gl.uniform1f(u.uBodyYaw, state.body.x);
      gl.uniform2f(u.uEye, state.yaw.x * 0.07, -state.pitch.x * 0.06);
      gl.uniform1f(u.uBlink, blink);
      gl.uniform1f(u.uHappy, Math.min(1, Math.max(0, state.happy.x)));
      gl.uniform1f(u.uHop, state.hop);
      gl.uniform1f(u.uWave, Math.min(1, Math.max(0, state.wave.x)));
      gl.uniform1f(u.uSquash, state.squash);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduced) {
      draw(0); markReady();
      const onResize = () => { resize(); draw(0); };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.36;
      const dx = (e.clientX - cx) / Math.max(window.innerWidth * 0.5, 1);
      const dy = (e.clientY - cy) / Math.max(window.innerHeight * 0.5, 1);
      // No shader, yaw positivo vira o rosto para a esquerda da tela; por isso o sinal negativo.
      state.target.yaw = Math.max(-0.55, Math.min(0.55, -dx * 0.7));
      state.target.pitch = Math.max(-0.3, Math.min(0.3, dy * 0.45));
      state.lastPointer = state.time;
    };
    const onTap = () => {
      if (state.hop > 0.02) return;
      state.hopV = 2.6; state.happyUntil = state.time + 1.4; state.waveUntil = state.time + 1.2;
    };

    let raf = 0, last = performance.now(), visible = true, slow = 0;
    const loop = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 1 / 20); last = now;
      state.time += dt;
      // Olhar sozinho quando ninguém aponta.
      if (state.time - state.lastPointer > 3) {
        state.target.yaw = 0.35 * Math.sin(state.time * 0.45);
        state.target.pitch = 0.08 * Math.sin(state.time * 0.7);
      }
      step(state.yaw, state.target.yaw, 60, dt);
      step(state.pitch, state.target.pitch, 60, dt);
      step(state.body, state.target.yaw * 0.3, 18, dt);
      step(state.wave, state.time < state.waveUntil ? 1 : 0, 40, dt);
      step(state.happy, state.time < state.happyUntil ? 1 : 0, 70, dt);
      // Queda/pulo com gravidade e um pouco de achatamento ao tocar o chão.
      if (state.hop > 0 || state.hopV > 0) {
        state.hopV -= 9 * dt; state.hop += state.hopV * dt;
        if (state.hop <= 0) { state.squash = Math.min(0.14, -state.hopV * 0.04); state.hop = 0; state.hopV = 0; }
      }
      state.squash *= Math.exp(-dt * 9);
      if (state.time > state.blinkAt) { state.blinkT = 0; state.blinkAt = state.time + 2.5 + Math.random() * 3; }
      let blink = 0;
      if (state.blinkT >= 0) { state.blinkT += dt; blink = Math.sin(Math.min(state.blinkT / 0.16, 1) * Math.PI); if (state.blinkT > 0.16) state.blinkT = -1; }

      const t0 = performance.now();
      draw(blink);
      // Se a GPU atrasar, reduz a resolução (uma vez por vez).
      if (performance.now() - t0 > 22 && ++slow > 20 && scale > 0.75) { scale *= 0.8; slow = 0; resize(); }
      markReady();
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); }, { threshold: 0 });
    observer.observe(canvas);
    const onVisibility = () => start();
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('pointerdown', onTap);
    start();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onTap);
      // Não forçar perda de contexto: o StrictMode remonta o efeito no mesmo canvas.
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div ref={wrapRef} className="robot" role="img" aria-label="Robô de argila lilás que acompanha o cursor e pula quando recebe um toque.">
      <Image className="robot__fallback" src="/portfolio/assets/clay-robot.webp" alt="" width={720} height={720} sizes="(max-width: 1000px) 80vw, 520px" priority />
      <canvas ref={canvasRef} className="robot__canvas" aria-hidden="true" />
    </div>
  );
}
