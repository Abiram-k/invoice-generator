interface ArtProps {
  className?: string;
}

// Decorative invoice scene used in the app header.
export const InvoiceArt = ({ className }: ArtProps) => (
  <svg
    viewBox="0 0 260 200"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <circle cx="196" cy="70" r="58" className="fill-brand/10" />
    <circle cx="70" cy="150" r="34" className="fill-brand/5" />

    {/* Sheet */}
    <g className="text-card" >
      <rect x="42" y="22" width="132" height="156" rx="12" fill="currentColor" />
    </g>
    <g className="text-line" stroke="currentColor" strokeWidth="2">
      <rect x="42" y="22" width="132" height="156" rx="12" />
    </g>

    {/* Header block */}
    <rect x="60" y="44" width="58" height="9" rx="4.5" className="fill-brand/70" />
    <rect x="60" y="61" width="34" height="7" rx="3.5" className="fill-muted/40" />

    {/* Line items */}
    <g className="fill-line">
      <rect x="60" y="86" width="96" height="7" rx="3.5" />
      <rect x="60" y="102" width="72" height="7" rx="3.5" />
      <rect x="60" y="118" width="84" height="7" rx="3.5" />
    </g>

    {/* Total band */}
    <rect x="60" y="136" width="96" height="26" rx="8" className="fill-brand/10" />
    <rect x="70" y="146" width="30" height="6" rx="3" className="fill-brand/50" />
    <rect x="118" y="146" width="28" height="6" rx="3" className="fill-brand/30" />

    {/* Coin */}
    <g className="text-brand">
      <circle
        cx="200"
        cy="74"
        r="26"
        className="fill-brand/15"
        stroke="currentColor"
        strokeWidth="2"
      />
      <text
        x="200"
        y="82"
        textAnchor="middle"
        fontSize="24"
        fontWeight="600"
        fill="currentColor"
      >
        ₹
      </text>

      <circle
        cx="214"
        cy="132"
        r="15"
        className="fill-brand/10"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M209 132h10M211 127h6M211 137l6-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>

    {/* Check mark badge */}
    <g className="text-positive">
      <circle cx="52" cy="150" r="16" className="fill-positive/15" />
      <path
        d="M45 150.5l4.5 4.5 9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Sparkles */}
    <g className="text-brand" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M28 46v12M22 52h12" opacity="0.6" />
      <path d="M232 30v8M228 34h8" opacity="0.45" />
    </g>
  </svg>
);

export default InvoiceArt;
