"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import "./lab.css";

const layers = [
  { id: "ui", number: "01", name: "Interface", detail: "A camada que transforma complexidade em uma experiência intuitiva." },
  { id: "api", number: "02", name: "API", detail: "Regras de negócio e serviços conectados por interfaces bem definidas." },
  { id: "data", number: "03", name: "Dados", detail: "Informações estruturadas, persistência confiável e evolução do produto." },
] as const;
type Layer = (typeof layers)[number]["id"];
type Rotation = { x: number; z: number };
const initialRotation: Rotation = { x: 56, z: -28 };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function prefersSimpleScene() {
  const device = navigator as Navigator & { deviceMemory?: number };
  return window.matchMedia(motionQuery).matches || (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 2) || (device.deviceMemory !== undefined && device.deviceMemory <= 2);
}

export function ArchitectureScene() {
  const [selected, setSelected] = useState<Layer>("ui");
  const [rotation, setRotation] = useState<Rotation>(initialRotation);
  const simple = useSyncExternalStore(subscribeToMotion, prefersSimpleScene, () => false);
  const position = useRef(initialRotation);
  const frame = useRef<number | null>(null);
  const pending = useRef(initialRotation);
  const drag = useRef<{ id: number; startX: number; startY: number; rotation: Rotation; touch: boolean } | null>(null);

  useEffect(() => () => { if (frame.current !== null) cancelAnimationFrame(frame.current); }, []);

  function rotate(next: Rotation) {
    pending.current = { x: clamp(next.x, 37, 72), z: clamp(next.z, -60, 5) };
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => { position.current = pending.current; setRotation(pending.current); frame.current = null; });
  }
  function beginDrag(event: PointerEvent<HTMLDivElement>) {
    if (simple || event.button !== 0 || !event.isPrimary) return;
    drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, rotation: position.current, touch: event.pointerType === "touch" };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const active = drag.current;
    if (simple || !active || event.pointerId !== active.id) return;
    const dx = event.clientX - active.startX;
    const dy = event.clientY - active.startY;
    // Vertical touch gestures retain the browser's natural page scrolling.
    if (active.touch && Math.abs(dy) > Math.abs(dx)) return;
    rotate({ x: active.touch ? active.rotation.x : active.rotation.x - dy * .12, z: active.rotation.z + dx * .13 });
  }
  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    const keyLayer: Record<string, Layer> = { "1": "ui", "2": "api", "3": "data" };
    if (keyLayer[event.key]) { setSelected(keyLayer[event.key]); event.preventDefault(); return; }
    if (simple) return;
    const current = position.current;
    const directions: Record<string, Rotation> = {
      ArrowLeft: { x: current.x, z: current.z - 4 }, ArrowRight: { x: current.x, z: current.z + 4 },
      ArrowUp: { x: current.x - 4, z: current.z }, ArrowDown: { x: current.x + 4, z: current.z }, Home: initialRotation,
    };
    if (directions[event.key]) { event.preventDefault(); rotate(directions[event.key]); }
  }
  const sceneStyle = { "--scene-rx": `${rotation.x}deg`, "--scene-rz": `${rotation.z}deg` } as CSSProperties;

  return (
    <div className={`hero-right${simple ? " scene-simple" : ""}`}>
      <div className="scene-label scene-label-top"><span className="tiny-label">EXPERIÊNCIA 3D / 001</span><span aria-hidden="true" className="scene-arrow">↘</span></div>
      <div aria-label="Modelo das três camadas de um sistema" aria-describedby="sceneHelp layerDescription" className="architecture-scene" role="group" tabIndex={0} onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} onKeyDown={handleKeys}>
        <div aria-hidden="true" className="scene-halo halo-one" /><div aria-hidden="true" className="scene-halo halo-two" /><div aria-hidden="true" className="scene-scanline" />
        <div aria-hidden="true" className="stack-model" style={sceneStyle}>
          <div className="connection-rod rod-a" /><div className="connection-rod rod-b" />
          <div className={`stack-plate layer-data${selected === "data" ? " is-selected" : ""}`}><div className="plate-inner"><div className="plate-serial">LAYER / 03</div><div className="database-ui"><div className="db-cylinder" /><div className="db-cylinder" /><div className="db-cylinder" /></div><div className="plate-name">DADOS</div><span className="plate-node node-one" /><span className="plate-node node-two" /></div></div>
          <div className={`stack-plate layer-api${selected === "api" ? " is-selected" : ""}`}><div className="plate-inner"><div className="plate-serial">LAYER / 02</div><div className="api-flow"><span>{"{ }"}</span><i /><span>↔</span><i /><span>∿</span></div><div className="plate-name">API</div><span className="plate-node node-three" /></div></div>
          <div className={`stack-plate layer-ui${selected === "ui" ? " is-selected" : ""}`}><div className="plate-inner"><div className="plate-serial">LAYER / 01</div><div className="mini-ui-window"><div className="mini-ui-header"><b /><b /><b /></div><div className="mini-ui-layout"><div><i /><i /><i /></div><div><strong /><em /><em /></div></div></div><div className="plate-name">INTERFACE</div><span className="plate-node node-four" /></div></div>
        </div>
        <span aria-hidden="true" className="scene-glint glint-a">✦</span><span aria-hidden="true" className="scene-glint glint-b">✧</span>
      </div>
      <div className="scene-bottom"><div className="scene-description"><span aria-hidden="true" className="hint-icon">↔</span><span id="sceneHelp">{simple ? "Explore as camadas abaixo" : "Arraste ou use as setas para girar"}<br /><small>Teclas 1, 2 e 3 selecionam as camadas</small></span></div><span aria-hidden="true" className="scene-degree">{simple ? "2D" : `${Math.round(rotation.z)}°`}</span></div>
      {!simple && <div className="scene-rotation-controls" aria-label="Controles de rotação" role="group"><button type="button" aria-label="Girar modelo para a esquerda" onClick={() => rotate({ ...position.current, z: position.current.z - 8 })}>←</button><button type="button" onClick={() => rotate(initialRotation)}>Restaurar vista</button><button type="button" aria-label="Girar modelo para a direita" onClick={() => rotate({ ...position.current, z: position.current.z + 8 })}>→</button></div>}
      <div aria-label="Escolher camada do sistema" className="layer-controls" role="group">{layers.map(layer => <button key={layer.id} type="button" aria-pressed={selected === layer.id} aria-controls="layerDescription" className={`layer-button${selected === layer.id ? " active" : ""}`} onClick={() => setSelected(layer.id)}><span className="layer-num">{layer.number}</span><span>{layer.name}</span></button>)}</div>
      <p aria-live="polite" className="layer-description" id="layerDescription">{layers.find(layer => layer.id === selected)?.detail}</p>
    </div>
  );
}
