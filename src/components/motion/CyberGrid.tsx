const nodes = [
  { x: 120, y: 140 }, { x: 340, y: 90 }, { x: 560, y: 210 }, { x: 260, y: 340 },
  { x: 780, y: 120 }, { x: 940, y: 260 }, { x: 700, y: 400 }, { x: 1120, y: 160 },
  { x: 1280, y: 340 }, { x: 1020, y: 480 }, { x: 460, y: 520 }, { x: 160, y: 560 },
]

const links: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 0], [1, 4], [4, 5], [5, 6], [6, 2],
  [4, 7], [7, 8], [8, 9], [9, 6], [3, 11], [11, 10], [10, 6],
]

// A decorative, ambient network-and-radar vector behind the dashboard shell — pure
// CSS-driven loops (no per-frame JS) so it stays cheap to render continuously.
export function CyberGrid({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <g className="cyber-grid-radar" style={{ transformOrigin: "1220px 180px" }}>
        <circle cx="1220" cy="180" r="90" className="cyber-grid-ring" />
        <circle cx="1220" cy="180" r="150" className="cyber-grid-ring" style={{ animationDelay: "-1.5s" }} />
        <circle cx="1220" cy="180" r="210" className="cyber-grid-ring" style={{ animationDelay: "-3s" }} />
        <line x1="1220" y1="180" x2="1220" y2="0" className="cyber-grid-sweep" />
      </g>

      {links.map(([a, b], index) => {
        const from = nodes[a]
        const to = nodes[b]
        return (
          <line
            key={`${a}-${b}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className="cyber-grid-link"
            style={{ animationDelay: `${-(index % 7)}s` }}
          />
        )
      })}

      {nodes.map((node, index) => (
        <circle
          key={index}
          cx={node.x}
          cy={node.y}
          r="2.5"
          className="cyber-grid-node"
          style={{ animationDelay: `${-(index % 5) * 0.7}s` }}
        />
      ))}
    </svg>
  )
}
