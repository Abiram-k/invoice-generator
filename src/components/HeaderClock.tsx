import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const pad = (value: number): string => String(value).padStart(2, "0");

// Formats the time as hh:mm:ss with a meridiem, keeping a fixed width.
const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const meridiem = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${pad(displayHours)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${meridiem}`;
};

const formatDate = (date: Date): string =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

// Live clock shown in the app header.
export const HeaderClock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface/70 px-3 py-1.5">
      <Clock className="h-4 w-4 shrink-0 text-brand" />

      <div className="leading-tight">
        <p className="text-sm font-semibold text-ink tabular-nums">
          {formatTime(now)}
        </p>
        <p className="text-xs text-muted tabular-nums">{formatDate(now)}</p>
      </div>
    </div>
  );
};

export default HeaderClock;
