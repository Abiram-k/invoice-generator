interface CardArtProps {
  className?: string;
}

const strokeProps = {
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

// Watermark for the app header: an invoice sheet with a rupee coin.
export const InvoiceCardArt = ({ className }: CardArtProps) => (
  <svg viewBox="0 0 160 140" aria-hidden="true" focusable="false" className={className}>
    <g {...strokeProps}>
      <rect x="14" y="12" width="84" height="112" rx="12" />
      <path d="M32 40h48M32 58h48M32 76h34M32 94h24" />
      <circle cx="118" cy="86" r="30" />
      <path d="M107 74h22M107 82h22M122 74c0 9-7 9-15 9l15 16" />
      <path d="M132 30v12M126 36h12" opacity="0.7" />
    </g>
  </svg>
);

// Watermark for the general information card: a receiver card with a location pin.
export const ReceiverCardArt = ({ className }: CardArtProps) => (
  <svg viewBox="0 0 160 140" aria-hidden="true" focusable="false" className={className}>
    <g {...strokeProps}>
      <rect x="12" y="26" width="102" height="76" rx="12" />
      <circle cx="42" cy="56" r="12" />
      <path d="M26 84c2-9 8-13 16-13s14 4 16 13" />
      <path d="M72 50h30M72 64h30M72 78h20" />
      <path d="M128 42c11 0 20 9 20 20 0 14-20 32-20 32s-20-18-20-32c0-11 9-20 20-20z" />
      <circle cx="128" cy="62" r="7" />
    </g>
  </svg>
);

// Watermark for the invoice details card: a line item table with a pen.
export const LineItemsCardArt = ({ className }: CardArtProps) => (
  <svg viewBox="0 0 160 140" aria-hidden="true" focusable="false" className={className}>
    <g {...strokeProps}>
      <rect x="10" y="20" width="110" height="100" rx="12" />
      <path d="M10 46h110M46 46v74" />
      <path d="M26 66h8M60 66h44M26 88h8M60 88h32M26 110h8M60 110h38" />
      <path d="M150 24l-8-8-44 44-4 14 14-4 44-44z" />
      <path d="M138 20l8 8" />
    </g>
  </svg>
);
