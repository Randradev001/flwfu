"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { experience, type FlowerKind } from "./experience";

type Stage = "intro" | "garden" | "final" | "closing";

const flowers: Array<{ id: number; kind: FlowerKind; x: number; y: number; scale: number; delay: number; depth: string; rotation: number }> = [
  { id: 0, kind: "higanbana", x: 32, y: 50, scale: .82, delay: .2, depth: "back", rotation: -11 },
  { id: 1, kind: "camellia", x: 65, y: 56, scale: .84, delay: .7, depth: "mid", rotation: 9 },
  { id: 2, kind: "rose", x: 50, y: 44, scale: 1.06, delay: 1.05, depth: "front", rotation: -2 },
  { id: 3, kind: "sakura", x: 73, y: 43, scale: .68, delay: 1.35, depth: "back", rotation: 13 },
  { id: 4, kind: "wisteria", x: 27, y: 42, scale: .72, delay: 1.55, depth: "mid", rotation: -10 },
  { id: 5, kind: "higanbana", x: 41, y: 64, scale: .96, delay: .9, depth: "front", rotation: 7 },
  { id: 6, kind: "higanbana", x: 59, y: 66, scale: 1.05, delay: 1.2, depth: "front", rotation: -6 },
];

function PetalShape({ rotate = 0 }: { rotate?: number }) {
  return <path d="M0 0 C -8 -19,-7 -40,0 -54 C 7 -40,8 -19,0 0Z" transform={`rotate(${rotate})`} />;
}

function Higanbana() {
  return <svg viewBox="-85 -105 170 210" aria-hidden="true" className="flowerSvg higanbanaSvg">
    <defs><radialGradient id="redBloom"><stop stopColor="#ff667a"/><stop offset=".45" stopColor="#ef233c"/><stop offset="1" stopColor="#690e1b"/></radialGradient></defs>
    <path className="stem" d="M0 102 C-4 55 7 9 0-35" />
    <g className="bloom" fill="url(#redBloom)">{[0,60,120,180,240,300].map(r => <PetalShape key={r} rotate={r}/>)}</g>
    <g className="stamens">{[-70,-46,-22,2,26,50,74].map(x=><g key={x} transform={`rotate(${x})`}><path d="M0 -3 Q 25 -45 54 -59"/><circle cx="54" cy="-59" r="2.8"/></g>)}</g>
    <g className="sideBloom" transform="translate(16 -13) scale(.54) rotate(31)">{[0,60,120,180,240,300].map(r => <PetalShape key={r} rotate={r}/>)}</g>
  </svg>;
}

function RoundFlower({ kind }: { kind: FlowerKind }) {
  const count = kind === "rose" ? 11 : kind === "sakura" ? 5 : 8;
  return <svg viewBox="-75 -105 150 210" aria-hidden="true" className={`flowerSvg ${kind}Svg`}>
    <path className="stem" d="M0 103 C 8 59 -7 15 1 -31" />
    <g className="roundBloom">{Array.from({length: count},(_,i)=><ellipse key={i} cx="0" cy="-52" rx={kind === "sakura" ? 15 : 19} ry={kind === "rose" ? 28 : 22} transform={`rotate(${i*360/count})`} />)}<circle r="9" /></g>
  </svg>;
}

function Wisteria() {
  return <svg viewBox="-70 -100 140 200" aria-hidden="true" className="flowerSvg wisteriaSvg"><path className="stem" d="M-8 -100 Q 20 -35 2 86"/><g>{Array.from({length: 12},(_,i)=><path key={i} d="M0 0 C-11 -7 -11 10 0 16 C11 10 11 -7 0 0Z" transform={`translate(${(i%2?1:-1)*(9+i)} ${-60+i*12}) scale(${1-i*.035})`}/>)}</g></svg>;
}

function FlowerArt({ kind }: { kind: FlowerKind }) {
  if (kind === "higanbana") return <Higanbana/>;
  if (kind === "wisteria") return <Wisteria/>;
  return <RoundFlower kind={kind}/>;
}

function Flower({ item, discovered, onDiscover, onInfo }: { item: typeof flowers[number]; discovered: boolean; onDiscover: () => void; onInfo: () => void }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didHold = useRef(false);
  const hold = () => { didHold.current = false; timer.current = setTimeout(() => { didHold.current = true; onInfo(); }, 650); };
  const cancel = () => { if (timer.current) clearTimeout(timer.current); };
  const select = () => { if (didHold.current) { didHold.current = false; return; } onDiscover(); };
  return <button
    className={`flower flower--${item.depth} ${discovered ? "is-discovered" : ""}`}
    style={{ "--x": `${item.x}%`, "--y": `${item.y}%`, "--scale": item.scale, "--delay": `${item.delay}s`, "--rotation": `${item.rotation}deg` } as React.CSSProperties}
    onClick={select} onPointerDown={hold} onPointerUp={cancel} onPointerCancel={cancel} onPointerLeave={cancel}
    aria-label={`${discovered ? "Descubierta" : "Descubrir"} ${experience.flowerMessages[item.id % 5].name}`}
  ><span className="flowerHit"><FlowerArt kind={item.kind}/></span>{discovered && <span className="pulse"/>}</button>;
}

function Atmosphere() {
  return <div className="atmosphere" aria-hidden="true"><div className="mist mistA"/><div className="mist mistB"/><div className="ash">{Array.from({length:18},(_,i)=><i key={i} style={{"--i":i} as React.CSSProperties}/>)}</div><div className="grain"/></div>;
}

function BlueButterfly() {
  return <span className="butterfly" aria-hidden="true"><span className="wing wingLeft"/><span className="butterflyBody"/><span className="wing wingRight"/></span>;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [found, setFound] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [info, setInfo] = useState<number | null>(null);
  const [sound, setSound] = useState(false);
  const complete = found.length === 5;

  const discover = useCallback((id: number) => {
    const key = id % 5;
    setActive(key);
    setFound(prev => prev.includes(key) ? prev : [...prev, key]);
  }, []);

  useEffect(() => {
    if (stage === "garden" && complete) {
      const t = setTimeout(() => { setActive(null); setStage("final"); }, 1800);
      return () => clearTimeout(t);
    }
  }, [complete, stage]);

  useEffect(() => {
    if (stage === "final") { const t = setTimeout(() => setStage("closing"), 11500); return () => clearTimeout(t); }
  }, [stage]);

  const restart = () => { setFound([]); setActive(null); setInfo(null); setStage("intro"); };

  return <main className={`experience stage-${stage}`}>
    <Atmosphere/>
    <button className="sound" onClick={() => experience.audioPath && setSound(!sound)} aria-label={experience.audioPath ? `Sonido ${sound ? "desactivado" : "activado"}` : "Sonido no disponible"} aria-disabled={!experience.audioPath}>
      <span className={`soundIcon ${sound ? "on" : ""}`}/><span>{sound ? "Sonido activo" : "Sin sonido"}</span>
    </button>

    <section className={`introScene ${stage !== "intro" ? "is-gone" : ""}`} aria-hidden={stage !== "intro"}>
      <h1>{experience.introText}</h1><div className="redLine"/>
      <button className="enterButton" onClick={() => setStage("garden")} tabIndex={stage === "intro" ? 0 : -1}>Echar un vistazo :) <span>↗</span></button>
    </section>

    <section className={`gardenScene ${stage === "garden" ? "is-visible" : ""}`} aria-label="Interactive night garden" aria-hidden={stage !== "garden"}>
      <div className="gardenGround"/>
      <div className="bouquet" aria-label="Ramo de flores interactivo">
        <div className="bouquetGlow" aria-hidden="true"/>
        <div className="bouquetPaper bouquetPaperBack" aria-hidden="true"/>
        {flowers.map(item => <Flower key={item.id} item={item} discovered={found.includes(item.id % 5)} onDiscover={() => discover(item.id)} onInfo={() => setInfo(item.id % 5)}/>) }
        <div className="bouquetPaper bouquetPaperFront" aria-hidden="true"><span className="paperFold"/></div>
        <div className="bouquetTie" aria-hidden="true"><i/><b/><span/></div>
      </div>
      <div className="gengarWatcher" aria-hidden="true"><div className="gengarAura"/><img src="/gengar.png" alt="" /></div>
      <div className="discoveryHeader"><p className="franMark">{complete ? "El jardín lo recuerda." : <><BlueButterfly/><span>Fran SC</span></>}</p><b>{String(found.length).padStart(2,"0")} / 05</b></div>
      {active !== null && <aside className="messagePanel" key={active}><p>“{experience.gardenMessage}”</p></aside>}
      <p className="holdHint">Pon tu dedo en la flor.</p>
    </section>

    <section className={`finalScene ${stage === "final" ? "is-visible" : ""}`} aria-hidden={stage !== "final"}>
      <div className="finalHalo"/><div className="finalFlower"><Higanbana/></div>
      <div className="finalCopy">{experience.finalMessages.map((line,i)=><p key={line} style={{"--line-delay": `${3.2 + i*2.05}s`} as React.CSSProperties}>{line}</p>)}</div>
    </section>

    <section className={`closingScene ${stage === "closing" ? "is-visible" : ""}`} aria-hidden={stage !== "closing"}>
      <p className="eyebrow">El jardín está escuchando</p><h2>{experience.closingText}</h2><button className="enterButton" onClick={restart}>Florecer otra vez <span>↻</span></button>{experience.signature && <small>{experience.signature}</small>}
    </section>

    {info !== null && <div className="infoBackdrop" role="presentation" onClick={() => setInfo(null)}><aside className="infoCard nameOnlyCard" role="dialog" aria-modal="true" aria-label={`Nombre de la flor: ${experience.flowerMessages[info].name}`} onClick={e=>e.stopPropagation()}><button onClick={()=>setInfo(null)} aria-label="Cerrar">×</button><h2>{experience.flowerMessages[info].name}</h2></aside></div>}
  </main>;
}
