import type { CSSProperties, ReactNode } from "react";
import { NEEDS, STACK, type Need } from "@/lib/data/needs";

/*
 * The drawing beside the "I need…" picker: a small business drawn as a stack of layers,
 * domain and email at the bottom, ads on top. Picking a need lifts its layer clear of the
 * stack, leaves a dashed gap where it sat and labels what we'd set up on it. Support draws
 * a bracket around every layer; "not sure" lifts an empty layer.
 *
 * Plain SVG. The radio buttons drive it through CSS :has(), the same as the answers,
 * so it works on first paint and without JavaScript. Styles live in globals.css (.ns-*).
 */

// Isometric layer: a 120-unit square seen at 30 degrees, 8 units thick.
const CX = 232;
const HW = 104; // half the drawn width: 120 × cos 30
const HH = 60; // half the drawn height: 120 × sin 30
const T = 8;
const GAP = 20; // between layers in the stack
const BASE = 306; // top corner of the bottom layer
const LIFT = 30; // top corner of a lifted layer
const LABEL_X = CX + 156; // callout text column
const W = 580;
const H = 452;

const slotY = (i: number) => BASE - GAP * i;
const r = (n: number) => Math.round(n * 10) / 10;
/** A point on a layer's top face, from flat (u, v) coordinates, to the screen. */
const iso = (u: number, v: number, y0: number): [number, number] => [r(CX + 0.866 * (u - v)), r(y0 + 0.5 * (u + v))];

const faces = (y0: number) => ({
  top: `M${CX} ${y0}L${CX + HW} ${y0 + HH}L${CX} ${y0 + 2 * HH}L${CX - HW} ${y0 + HH}Z`,
  left: `M${CX - HW} ${y0 + HH}L${CX} ${y0 + 2 * HH}L${CX} ${y0 + 2 * HH + T}L${CX - HW} ${y0 + HH + T}Z`,
  right: `M${CX} ${y0 + 2 * HH}L${CX + HW} ${y0 + HH}L${CX + HW} ${y0 + HH + T}L${CX} ${y0 + 2 * HH + T}Z`,
});

function Layer({ y0, dashed }: { y0: number; dashed?: boolean }) {
  const f = faces(y0);
  const cls = dashed ? " ns-face--empty" : "";
  return (
    <g>
      <path d={f.left} className={`ns-face ns-left${cls}`} />
      <path d={f.right} className={`ns-face ns-right${cls}`} />
      <path d={f.top} className={`ns-face ns-top${cls}`} />
    </g>
  );
}

/** Draws flat artwork onto a layer's top face. */
function Face({ y0, children }: { y0: number; children: ReactNode }) {
  return (
    <g transform={`matrix(0.866 0.5 -0.866 0.5 ${CX} ${y0})`} className="ns-art">
      {children}
    </g>
  );
}

type Anchor = [u: number, v: number, lift?: number];

interface Glyph {
  art: ReactNode;
  /** One per part, in the same order as need.parts. */
  anchors: Anchor[];
  /** Anything standing up off the face, drawn in screen space. */
  standing?: (y0: number) => ReactNode;
}

const line = (x1: number, y1: number, x2: number, y2: number, cls = "ns-ink") => (
  <path d={`M${x1} ${y1}L${x2} ${y2}`} className={cls} />
);

const GLYPHS: Record<string, Glyph> = {
  email: {
    art: (
      <>
        <rect x="16" y="26" width="88" height="60" rx="1.5" className="ns-ink ns-fill-paper" />
        <path d="M16 26L60 60L104 26" className="ns-ink" />
        <path d="M16 86L48 52M104 86L72 52" className="ns-ink ns-ink--soft" />
        <text x="16" y="103" className="ns-micro">you@yourbusiness.com.au</text>
      </>
    ),
    anchors: [[94, 101], [86, 44], [104, 74]],
  },
  website: {
    art: (
      <>
        <rect x="10" y="10" width="100" height="100" rx="1.5" className="ns-ink ns-fill-paper" />
        {line(10, 24, 110, 24)}
        <circle cx="17" cy="17" r="2" className="ns-ink" />
        <circle cx="23.5" cy="17" r="2" className="ns-ink" />
        <circle cx="30" cy="17" r="2" className="ns-ink" />
        <text x="38" y="19.4" className="ns-micro">yourbusiness.com.au</text>
        <rect x="18" y="32" width="46" height="9" className="ns-fill-pine" />
        {line(18, 49, 70, 49, "ns-ink ns-ink--soft")}
        {line(18, 55, 60, 55, "ns-ink ns-ink--soft")}
        <rect x="18" y="62" width="22" height="8" className="ns-fill-claret" />
        <rect x="58" y="62" width="44" height="40" className="ns-ink ns-fill-haze" />
        <path d="M58 102L72 84L82 94L90 86L102 98" className="ns-ink" />
        <circle cx="91" cy="72" r="4" className="ns-ink" />
        {line(18, 80, 48, 80, "ns-ink ns-ink--soft")}
        {line(18, 86, 44, 86, "ns-ink ns-ink--soft")}
        {line(18, 92, 50, 92, "ns-ink ns-ink--soft")}
      </>
    ),
    anchors: [[62, 36], [100, 70], [104, 17], [108, 108]],
  },
  bookings: {
    art: (
      <>
        <rect x="12" y="12" width="96" height="96" rx="1.5" className="ns-ink ns-fill-paper" />
        <rect x="12" y="12" width="96" height="16" className="ns-ink ns-fill-haze" />
        {[0, 1, 2, 3].flatMap((row) =>
          [0, 1, 2, 3].map((col) => {
            const x = 16 + col * 23;
            const y = 33 + row * 18;
            const taken = (row + col * 3) % 5 === 0;
            const booked = row === 2 && col === 2;
            return (
              <g key={`${row}-${col}`}>
                <rect x={x} y={y} width="20" height="15" className={booked ? "ns-fill-claret" : "ns-ink ns-ink--soft"} />
                {taken ? <path d={`M${x} ${y + 15}L${x + 20} ${y}`} className="ns-ink ns-ink--soft" /> : null}
              </g>
            );
          })
        )}
      </>
    ),
    anchors: [[95, 40], [72, 77], [98, 20]],
  },
  store: {
    art: (
      <>
        {[
          [12, 12],
          [62, 12],
          [12, 62],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="46" height="46" rx="1.5" className="ns-ink ns-fill-paper" />
            <rect x={x + 5} y={y + 5} width="36" height="22" className="ns-ink ns-fill-haze" />
            {line(x + 5, y + 33, x + 32, y + 33, "ns-ink ns-ink--soft")}
            <rect x={x + 5} y={y + 37} width="16" height="5" className={x === 62 ? "ns-fill-claret" : "ns-fill-pine"} />
          </g>
        ))}
        <rect x="68" y="70" width="34" height="30" className="ns-ink ns-fill-paper" />
        <path d="M68 78H102M85 70V100" className="ns-ink" />
      </>
    ),
    anchors: [[98, 20], [80, 51], [102, 92]],
  },
  crm: {
    art: (
      <>
        {[
          [10, 12],
          [27, 40],
          [44, 68],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x} y={y} width="66" height="38" rx="1.5" className="ns-ink ns-fill-paper" />
            <circle cx={x + 11} cy={y + 12} r="5" className="ns-ink ns-fill-haze" />
            {line(x + 21, y + 10, x + 54, y + 10)}
            {line(x + 21, y + 17, x + 44, y + 17, "ns-ink ns-ink--soft")}
            {line(x + 7, y + 28, x + 36, y + 28, "ns-ink ns-ink--soft")}
          </g>
        ))}
        <circle cx="98" cy="96" r="6" className="ns-fill-claret" />
        <path d="M98 92.5V96L100.5 97.5" className="ns-ink ns-ink--paper" />
      </>
    ),
    anchors: [[72, 20], [90, 50], [104, 96]],
  },
  google: {
    art: (
      <>
        <rect x="6" y="6" width="108" height="108" rx="1.5" className="ns-ink ns-fill-paper" />
        <rect x="50" y="50" width="18" height="14" className="ns-fill-haze" />
        <rect x="82" y="56" width="20" height="16" className="ns-fill-haze" />
        <rect x="14" y="76" width="22" height="22" className="ns-fill-haze" />
        <path d="M6 44C40 48 70 32 114 38" className="ns-ink ns-road" />
        <path d="M32 6L44 114" className="ns-ink ns-road" />
        <path d="M74 6C76 50 90 80 114 94" className="ns-ink ns-road" />
        <rect x="12" y="12" width="40" height="22" rx="1" className="ns-ink ns-fill-paper" />
        {line(17, 19, 44, 19, "ns-ink")}
        {line(17, 25, 38, 25, "ns-ink ns-ink--soft")}
      </>
    ),
    anchors: [[64, 64, 30], [104, 40], [50, 14], [96, 104]],
    standing: (y0) => {
      const [x, y] = iso(64, 64, y0);
      return (
        <g transform={`translate(${x} ${y})`}>
          <ellipse cx="0" cy="0" rx="9" ry="4.5" className="ns-shadow" />
          <path d="M0 0C-3 -9 -11 -15 -11 -24A11 11 0 1 1 11 -24C11 -15 3 -9 0 0Z" className="ns-ink ns-fill-claret" />
          <circle cx="0" cy="-24" r="4" className="ns-fill-paper" />
        </g>
      );
    },
  },
  ads: {
    art: (
      <>
        <circle cx="60" cy="60" r="48" className="ns-ink ns-fill-paper" />
        <circle cx="60" cy="60" r="32" className="ns-ink ns-fill-haze" />
        <circle cx="60" cy="60" r="16" className="ns-ink ns-fill-paper" />
        <circle cx="60" cy="60" r="6" className="ns-fill-claret" />
        <path d="M104 104L66 66M66 66L78 68M66 66L68 78" className="ns-ink" />
      </>
    ),
    anchors: [[100, 36], [60, 60], [106, 104]],
  },
};

function Callouts({ need, y0, anchors }: { need: Need; y0: number; anchors: Anchor[] }) {
  const points = need.parts.map((part, k) => {
    const [u, v, up = 0] = anchors[k];
    const [x, y] = iso(u, v, y0);
    return { part, x, y: r(y - up) };
  });
  // Rows follow the anchors top to bottom, so no leader crosses another.
  const rows = [...points].sort((a, b) => a.y - b.y);
  return (
    <g className="ns-callouts">
      {rows.map((p, k) => {
        const ty = y0 + 22 + k * 22;
        return (
          <g key={p.part} style={{ "--k": k } as CSSProperties}>
            <path
              d={`M${p.x} ${p.y}L${LABEL_X - 16} ${ty}H${LABEL_X - 4}`}
              pathLength={1}
              className="ns-leader"
            />
            <circle cx={p.x} cy={p.y} r="2.2" className="ns-dot" />
            <text x={LABEL_X} y={ty + 3} className="ns-label ns-label--on">
              {p.part}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Dashed drafting lines from a layer's empty slot up to where it now floats. */
function Rails({ from }: { from: number }) {
  return (
    <g className="ns-rails">
      <path d={`M${CX - HW} ${LIFT + HH + T}V${from + HH}`} />
      <path d={`M${CX + HW} ${LIFT + HH + T}V${from + HH}`} />
      <path d={`M${CX} ${LIFT + 2 * HH + T}V${from + 2 * HH}`} />
    </g>
  );
}

function Lifted({ need, index }: { need: Need; index: number }) {
  const glyph = GLYPHS[need.slug];
  const from = slotY(index);
  return (
    <g data-lift={need.slug} className="ns-lift" style={{ "--drop": `${from - LIFT}px` } as CSSProperties}>
      <path d={faces(slotY(STACK.length - 1)).top} className="ns-shadow ns-cast" />
      <Rails from={from} />
      <g className="ns-lift-layer">
        <Layer y0={LIFT} />
        <Face y0={LIFT}>{glyph.art}</Face>
        {glyph.standing?.(LIFT)}
      </g>
      <text x={CX - HW - 14} y={LIFT + HH + 7} textAnchor="end" className="ns-name">
        {need.short}
      </text>
      <Callouts need={need} y0={LIFT} anchors={glyph.anchors} />
    </g>
  );
}

/** Support: a dimension bracket spanning every layer, with what looking after it covers. */
function SupportBracket({ need }: { need: Need }) {
  const top = slotY(STACK.length - 1) + HH;
  const bottom = BASE + HH + T;
  const x = CX + HW + 26;
  return (
    <g data-lift={need.slug} className="ns-lift">
      <g className="ns-rails ns-rails--solid">
        <path d={`M${CX + HW + 6} ${top}H${x}V${bottom}H${CX + HW + 6}`} />
      </g>
      <text x={LABEL_X} y={top - 18} className="ns-name ns-name--start">
        {need.short}
      </text>
      <g className="ns-callouts">
        {need.parts.map((part, k) => {
          const ty = top + 8 + k * 24;
          return (
            <g key={part} style={{ "--k": k } as CSSProperties}>
              <path d={`M${x} ${ty - 3}H${LABEL_X - 4}`} pathLength={1} className="ns-leader" />
              <circle cx={x} cy={ty - 3} r="2.2" className="ns-dot" />
              <text x={LABEL_X} y={ty} className="ns-label ns-label--on">
                {part}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

/** Not sure yet: an empty layer waiting above the stack, to be worked out together. */
function EmptyLayer({ need }: { need: Need }) {
  return (
    <g data-lift={need.slug} className="ns-lift">
      <Rails from={slotY(STACK.length - 1)} />
      <g className="ns-lift-layer" style={{ "--drop": "40px" } as CSSProperties}>
        <Layer y0={LIFT} dashed />
      </g>
      <text x={CX - HW - 14} y={LIFT + HH + 7} textAnchor="end" className="ns-name">
        {need.short}
      </text>
    </g>
  );
}

const STACKED = STACK.map((slug) => NEEDS.find((n) => n.slug === slug)!);
const SUPPORT = NEEDS.find((n) => n.slug === "support")!;
const UNSURE = NEEDS.find((n) => n.slug === "unsure")!;

/** Rules that turn the drawing to whichever need is picked. Wrapped in @supports by NeedPicker. */
export const STACK_CSS = [
  ...STACK.map(
    (slug) =>
      `.need-picker:has(#need-${slug}:checked) [data-slot="${slug}"] .ns-face{fill:var(--chalk);stroke:var(--claret);stroke-dasharray:3 3}` +
      `.need-picker:has(#need-${slug}:checked) [data-slot="${slug}"] .ns-label{fill:var(--claret)}` +
      `.need-picker:has(#need-${slug}:checked) [data-slot="${slug}"] .ns-faint{display:none}`
  ),
  ...[...STACK, "support", "unsure"].map((slug) => `.need-picker:has(#need-${slug}:checked) [data-lift="${slug}"]{display:inline}`),
  `.need-picker:has(#need-support:checked) .ns-slot .ns-top{fill:var(--haze)}`,
  `.need-picker:has(#need-support:checked) .ns-slot .ns-label,.need-picker:has(#need-unsure:checked) .ns-slot .ns-label{fill:var(--ink-soft)}`,
].join("");

export function NeedStack() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="need-stack"
      role="img"
      aria-labelledby="need-stack-title"
    >
      <title id="need-stack-title">
        A small business drawn as stacked layers: email, website, bookings, store, CRM, Google and ads. The one you
        pick lifts out with what we&rsquo;d set up on it.
      </title>
      <defs>
        <pattern id="ns-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M8 6.5V9.5M6.5 8H9.5" className="ns-grid-mark" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#ns-grid)" />

      {STACKED.map((need, i) => {
        const y0 = slotY(i);
        return (
          <g key={need.slug} data-slot={need.slug} className="ns-slot">
            <Layer y0={y0} />
            {/* Only the top layer's face shows in the stack, so only it gets its artwork, drawn faint. */}
            {i === STACK.length - 1 ? (
              <g className="ns-faint">
                <Face y0={y0}>{GLYPHS[need.slug].art}</Face>
              </g>
            ) : null}
            <path d={`M${CX - HW - 16} ${y0 + HH + 4}H${CX - HW - 4}`} className="ns-tick" />
            <text x={CX - HW - 20} y={y0 + HH + 7} textAnchor="end" className="ns-label">
              {need.short}
            </text>
          </g>
        );
      })}

      {STACKED.map((need, i) => (
        <Lifted key={need.slug} need={need} index={i} />
      ))}
      <SupportBracket need={SUPPORT} />
      <EmptyLayer need={UNSURE} />
    </svg>
  );
}
