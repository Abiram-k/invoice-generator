interface ArtProps {
  className?: string;
}

// Decorative scene for the not found page.
export const NotFoundArt = ({ className }: ArtProps) => (
  <svg
    viewBox="0 0 220 170"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <circle cx="110" cy="88" r="66" className="fill-brand/10" />

    <g transform="rotate(-7 108 86)">
      <rect
        x="62"
        y="30"
        width="96"
        height="118"
        rx="10"
        className="fill-card stroke-line"
        strokeWidth="2"
      />
      <g className="fill-line">
        <rect x="78" y="52" width="52" height="7" rx="3.5" />
        <rect x="78" y="68" width="64" height="7" rx="3.5" />
        <rect x="78" y="84" width="40" height="7" rx="3.5" />
      </g>
      <rect x="78" y="104" width="64" height="22" rx="7" className="fill-brand/10" />
    </g>

    {/* Magnifier */}
    <g className="text-brand">
      <circle
        cx="146"
        cy="112"
        r="27"
        className="fill-card/80"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M166 132l16 16"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M140 105a6 6 0 0 1 11 3c0 4-5 4.5-5 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="146" cy="123" r="1.8" fill="currentColor" />
    </g>

    <g className="fill-brand/40">
      <circle cx="34" cy="52" r="4" />
      <circle cx="196" cy="46" r="3" />
      <circle cx="46" cy="132" r="3" />
    </g>
  </svg>
);

export default NotFoundArt;
