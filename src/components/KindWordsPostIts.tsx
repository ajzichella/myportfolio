import { Heart } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import {
  KIND_WORDS_HEARTS,
  KIND_WORDS_POSTITS,
  kindWordsTestimonials,
} from "../data/kindWords";

type TestimonialItem = (typeof kindWordsTestimonials)[number];
type PostitPad = (typeof KIND_WORDS_POSTITS)[number];

type HeartDef = { left: string; top: string; size: number; delay: number; duration: number; color: string };

type KindWordsPostItGridProps = {
  /** Defaults to full list (Kind words board). Home passes first four only. */
  testimonials?: readonly TestimonialItem[];
  postits?: readonly PostitPad[];
};

function KindWordsHeartHalf({ layerKey, hearts }: { layerKey: string; hearts: readonly HeartDef[] }) {
  return (
    <div className="relative h-1/2 w-full min-h-[12rem]">
      {hearts.map((h, i) => (
        <Heart
          key={`${layerKey}-${i}`}
          className="peer-feedback-heart"
          style={{
            left: h.left,
            top: h.top,
            width: h.size,
            height: h.size,
            color: h.color,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          } as CSSProperties}
          fill="currentColor"
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

type KindWordsHeartsBackdropProps = {
  /** Default 0.32 matches Home section */
  opacity?: string;
  /** Override the default heart positions (e.g. pass a denser set for Home) */
  hearts?: readonly HeartDef[];
};

export function KindWordsHeartsBackdrop({
  opacity = "opacity-[0.32]",
  hearts = KIND_WORDS_HEARTS,
}: KindWordsHeartsBackdropProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${opacity} [mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]`}
      aria-hidden
    >
      <div
        className="kind-words-hearts-track absolute left-0 right-0 top-0 w-full"
        style={{ height: "200%" }}
      >
        <KindWordsHeartHalf layerKey="a" hearts={hearts} />
        <KindWordsHeartHalf layerKey="b" hearts={hearts} />
      </div>
    </div>
  );
}

export function KindWordsPostItGrid({
  testimonials = kindWordsTestimonials,
  postits = KIND_WORDS_POSTITS,
}: KindWordsPostItGridProps = {}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-8 pt-2 pb-6 sm:gap-10 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-12">
      {testimonials.map((item, index) => {
        const pad = postits[index] ?? postits[0];
        const hug = "hug" in pad && pad.hug === true;
        const fullWidthRow = "fullWidthRow" in pad && pad.fullWidthRow === true;
        const justifyLg = fullWidthRow
          ? "lg:justify-center"
          : index === 5
            ? "lg:justify-start"
            : index === 6
              ? "lg:justify-end"
              : index % 2 === 0
                ? "lg:justify-start"
                : "lg:justify-end";
        const widthClass = fullWidthRow
          ? "w-full max-w-[min(100%,56rem)] lg:max-w-[min(100%,60rem)]"
          : hug
            ? "w-full max-w-[min(100%,19rem)] sm:w-fit sm:max-w-[22rem]"
            : "w-full max-w-md md:max-w-lg";
        return (
          <motion.div
            key={item.attribution}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.06 + index * 0.08 }}
            className={`flex items-start justify-center ${fullWidthRow ? "lg:col-span-2" : ""} ${justifyLg}`}
          >
            <article
              className={`kind-words-postit relative text-black px-4 pb-5 pt-6 sm:px-5 sm:pb-5 sm:pt-7 md:px-6 md:pb-6 md:pt-7 ${widthClass}`}
              style={{
                backgroundColor: pad.bg,
                transform: reduceMotion ? undefined : `rotate(${pad.rotate})`,
              }}
            >
              <blockquote className="mt-0.5">
                <div className="space-y-2.5 text-lg leading-snug sm:space-y-3 sm:text-xl md:text-[1.35rem] md:leading-snug">
                  {item.paragraphs.map((p, pi) => (
                    <p key={`${item.attribution}-${pi}`}>{p}</p>
                  ))}
                </div>
                <p className="mt-4 text-base font-semibold leading-tight sm:mt-5 sm:text-lg">
                  - {item.attribution}
                </p>
              </blockquote>
            </article>
          </motion.div>
        );
      })}
    </div>
  );
}
