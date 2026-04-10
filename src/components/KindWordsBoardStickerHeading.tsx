import { useId } from "react";

const TITLE = "Kind words board";

/** Single closed paths (viewBox 0 0 240 80); tail shares vertices with bottom edge for a clean union. */
const BUBBLE_PATHS = [
  // Soft cloud + bottom-left tail
  "M 42 8 C 20 8 8 22 8 42 C 8 56 18 60 34 58 L 50 56 L 62 74 L 78 56 L 198 56 C 220 56 232 42 232 26 C 232 10 210 6 192 8 L 48 8 C 44 8 42 8 42 8 Z",
  // Rounded panel + tail slightly left of center
  "M 32 10 L 208 10 C 218 10 224 16 224 26 L 224 40 C 224 50 216 54 204 54 L 112 54 L 100 72 L 88 54 L 36 54 C 26 54 18 48 18 38 L 18 22 C 18 14 24 10 32 10 Z",
  // Wider body + bottom-right tail
  "M 36 10 C 22 10 14 18 14 30 L 14 40 C 14 52 24 56 40 54 L 160 54 L 176 74 L 192 54 L 200 54 C 218 54 228 44 228 28 L 228 22 C 228 12 214 8 198 10 L 40 10 Z",
] as const;

const BUBBLE_GRADIENTS = [
  { stops: ["#ffd699", "#ff9f40", "#ea580c"] as const },
  { stops: ["#ecfccb", "#bef264", "#65a30d"] as const },
  { stops: ["#bae6fd", "#38bdf8", "#0284c7"] as const },
] as const;

/** Six rainbow pin heads (left-to-right across the title) */
const RAINBOW_PINS = ["rb0", "rb1", "rb2", "rb3", "rb4", "rb5"] as const;

type Props = { id: string };

/**
 * Per-word speech bubbles as one SVG path each (unified outline + gradient + white stroke).
 */
export function KindWordsBoardStickerHeading({ id }: Props) {
  const words = TITLE.split(" ");
  const uid = useId().replace(/:/g, "");

  return (
    <h1 id={id} className="m-0">
      <span className="sr-only">{TITLE}</span>
      <span aria-hidden className="kind-words-board-bubble-row">
        {words.map((word, wi) => {
          const shape = wi % 3;
          const tone = wi % 3;
          const gradId = `${uid}-kwb-grad-${wi}`;
          const g = BUBBLE_GRADIENTS[tone];

          const i0 = wi * 2;
          const pinA = RAINBOW_PINS[i0];
          const pinB = RAINBOW_PINS[i0 + 1];

          return (
            <span
              key={wi}
              className={`kind-words-speech-bubble kind-words-speech-bubble--shape-${shape} kind-words-speech-bubble--ink-${tone} kind-words-speech-bubble--idx-${wi}`}
            >
              <span
                className={`kind-words-speech-bubble__pin kind-words-speech-bubble__pin--first kind-words-speech-bubble__pin--${pinA}`}
                aria-hidden
              />
              <span
                className={`kind-words-speech-bubble__pin kind-words-speech-bubble__pin--second kind-words-speech-bubble__pin--${pinB}`}
                aria-hidden
              />
              <svg
                className="kind-words-speech-bubble__svg"
                viewBox="0 0 240 80"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor={g.stops[0]} />
                    <stop offset="45%" stopColor={g.stops[1]} />
                    <stop offset="100%" stopColor={g.stops[2]} />
                  </linearGradient>
                </defs>
                <path
                  d={BUBBLE_PATHS[shape]}
                  fill={`url(#${gradId})`}
                  stroke="#ffffff"
                  strokeWidth={2.75}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="nonScalingStroke"
                />
              </svg>
              <span className="kind-words-speech-bubble__text">{word}</span>
            </span>
          );
        })}
      </span>
    </h1>
  );
}
