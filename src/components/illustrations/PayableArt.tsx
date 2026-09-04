interface PayableArtProps {
  className?: string;
}

// Decorative coin stack drawn inside the payable card.
export const PayableArt = ({ className }: PayableArtProps) => (
  <svg
    viewBox="0 0 132 120"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <g
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Coin stack */}
      <ellipse cx="46" cy="92" rx="30" ry="11" />
      <path d="M16 92v-13M76 92v-13" />
      <ellipse cx="46" cy="79" rx="30" ry="11" />
      <path d="M16 79v-13M76 79v-13" />
      <ellipse cx="46" cy="66" rx="30" ry="11" />

      {/* Rupee coin */}
      <circle cx="93" cy="40" r="25" />
      <path d="M84 30h18M84 37h18M98 30c0 8-6 8-14 8l14 14" />

      {/* Sparkles */}
      <path d="M26 30v10M21 35h10" opacity="0.7" />
      <path d="M120 76v7M116.5 79.5h7" opacity="0.5" />
    </g>
  </svg>
);

export default PayableArt;
