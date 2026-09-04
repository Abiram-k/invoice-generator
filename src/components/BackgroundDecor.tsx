import {
  CalculatorMotif,
  ChartMotif,
  CoinMotif,
  PercentMotif,
  ReceiptMotif,
  SheetMotif,
  SparkleMotif,
} from "./illustrations/motifs";

type Motif = {
  key: string;
  node: React.ReactNode;
  style: React.CSSProperties;
  className: string;
};

// Line art scattered down the page, sized and rotated so no two repeat the same way.
const motifs: Motif[] = [
  { key: "sheet-1", node: <SheetMotif />, style: { top: "3%", left: "2%", rotate: "-9deg" }, className: "w-24 text-brand" },
  { key: "coin-1", node: <CoinMotif />, style: { top: "9%", right: "3%", rotate: "12deg" }, className: "w-20 text-brand" },
  { key: "sparkle-1", node: <SparkleMotif />, style: { top: "17%", left: "8%" }, className: "w-8 text-brand" },
  { key: "receipt-1", node: <ReceiptMotif />, style: { top: "22%", right: "6%", rotate: "-7deg" }, className: "w-20 text-muted" },
  { key: "percent-1", node: <PercentMotif />, style: { top: "31%", left: "3%", rotate: "8deg" }, className: "w-16 text-brand" },
  { key: "chart-1", node: <ChartMotif />, style: { top: "43%", right: "2%", rotate: "-5deg" }, className: "w-24 text-muted" },
  { key: "calc-1", node: <CalculatorMotif />, style: { top: "52%", left: "4%", rotate: "-12deg" }, className: "w-20 text-brand" },
  { key: "sparkle-2", node: <SparkleMotif />, style: { top: "60%", right: "9%" }, className: "w-7 text-brand" },
  { key: "coin-2", node: <CoinMotif />, style: { top: "66%", right: "4%", rotate: "-14deg" }, className: "w-16 text-muted" },
  { key: "sheet-2", node: <SheetMotif />, style: { top: "74%", left: "5%", rotate: "10deg" }, className: "w-20 text-brand" },
  { key: "percent-2", node: <PercentMotif />, style: { top: "84%", right: "7%", rotate: "-6deg" }, className: "w-14 text-brand" },
  { key: "sparkle-3", node: <SparkleMotif />, style: { top: "91%", left: "10%" }, className: "w-6 text-muted" },
  { key: "receipt-2", node: <ReceiptMotif />, style: { top: "94%", right: "3%", rotate: "9deg" }, className: "w-16 text-brand" },

  // A few sit under the cards so the art carries across the middle of the page too.
  { key: "coin-3", node: <CoinMotif />, style: { top: "14%", left: "34%", rotate: "-10deg" }, className: "w-28 text-brand" },
  { key: "chart-2", node: <ChartMotif />, style: { top: "36%", left: "62%", rotate: "6deg" }, className: "w-32 text-brand" },
  { key: "sheet-3", node: <SheetMotif />, style: { top: "58%", left: "28%", rotate: "12deg" }, className: "w-28 text-muted" },
  { key: "percent-3", node: <PercentMotif />, style: { top: "78%", left: "58%", rotate: "-8deg" }, className: "w-24 text-brand" },
  { key: "sparkle-4", node: <SparkleMotif />, style: { top: "46%", left: "46%" }, className: "w-10 text-brand" },
];

// Page wide backdrop: dotted grid, soft glows and scattered invoice line art.
export const BackgroundDecor = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div
      className="absolute inset-0 opacity-60 dark:opacity-35"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, var(--color-line) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    />

    <div className="absolute -top-40 -left-28 h-96 w-96 rounded-full bg-brand/10 blur-3xl dark:bg-brand/15" />
    <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-brand/10 blur-3xl" />
    <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-positive/5 blur-3xl" />

    {motifs.map(({ key, node, style, className }) => (
      <div
        key={key}
        style={style}
        className={`absolute opacity-25 dark:opacity-30 ${className}`}
      >
        {node}
      </div>
    ))}
  </div>
);

export default BackgroundDecor;
