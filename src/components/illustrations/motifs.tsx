interface MotifProps {
  className?: string;
}

const strokeProps = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

// Invoice sheet outline.
export const SheetMotif = ({ className }: MotifProps) => (
  <svg viewBox="0 0 84 104" aria-hidden="true" focusable="false" className={className}>
    <g {...strokeProps}>
      <rect x="6" y="6" width="72" height="92" rx="10" />
      <path d="M22 30h30M22 46h40M22 60h34M22 74h22" />
    </g>
  </svg>
);

// Rupee coin.
export const CoinMotif = ({ className }: MotifProps) => (
  <svg viewBox="0 0 72 72" aria-hidden="true" focusable="false" className={className}>
    <g {...strokeProps}>
      <circle cx="36" cy="36" r="28" />
      <circle cx="36" cy="36" r="21" strokeDasharray="4 6" />
      <path d="M29 27h14M29 34h14M40 27c0 7-5 7-11 7l11 11" />
    </g>
  </svg>
);

// Receipt with a torn edge.
export const ReceiptMotif = ({ className }: MotifProps) => (
  <svg viewBox="0 0 72 96" aria-hidden="true" focusable="false" className={className}>
    <g {...strokeProps}>
      <path d="M8 10a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v72l-8-6-8 6-8-6-8 6-8-6-8 6-8-6z" />
      <path d="M22 30h28M22 44h28M22 58h16" />
    </g>
  </svg>
);

// Calculator keypad.
export const CalculatorMotif = ({ className }: MotifProps) => (
  <svg viewBox="0 0 72 88" aria-hidden="true" focusable="false" className={className}>
    <g {...strokeProps}>
      <rect x="6" y="6" width="60" height="76" rx="9" />
      <rect x="18" y="18" width="36" height="14" rx="4" />
      <path d="M22 46h0M36 46h0M50 46h0M22 60h0M36 60h0M50 60h0M22 72h0M36 72h0M50 72h0" strokeWidth="5" />
    </g>
  </svg>
);

// Percentage badge.
export const PercentMotif = ({ className }: MotifProps) => (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
    <g {...strokeProps}>
      <rect x="6" y="6" width="52" height="52" rx="16" />
      <path d="M24 40l16-16" />
      <circle cx="25" cy="25" r="4" />
      <circle cx="39" cy="39" r="4" />
    </g>
  </svg>
);

// Bar chart.
export const ChartMotif = ({ className }: MotifProps) => (
  <svg viewBox="0 0 80 72" aria-hidden="true" focusable="false" className={className}>
    <g {...strokeProps}>
      <path d="M10 62h60" />
      <path d="M22 62V44M38 62V28M54 62V36M68 62V20" strokeWidth="4" />
    </g>
  </svg>
);

// Four point sparkle.
export const SparkleMotif = ({ className }: MotifProps) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" className={className}>
    <g {...strokeProps}>
      <path d="M20 5c1.6 8.4 6 12.8 14.4 14.4C26 21 21.6 25.4 20 33.8 18.4 25.4 14 21 5.6 19.4 14 17.8 18.4 13.4 20 5z" />
    </g>
  </svg>
);
