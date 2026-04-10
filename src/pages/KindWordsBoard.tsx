import { motion } from "motion/react";
import { FixedBlobBackdrop, SOFT_FIXED_BLOB_PRESET } from "../components/BlobBackground";
import { KindWordsBoardStickerHeading } from "../components/KindWordsBoardStickerHeading";
import {
  KindWordsHeartsBackdrop,
  KindWordsPostItGrid,
} from "../components/KindWordsPostIts";

export function KindWordsBoard() {
  return (
    <section
      className="relative z-10 w-full min-h-screen shrink-0 overflow-hidden px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-14 lg:px-12 lg:py-16"
      aria-labelledby="kind-words-board-heading"
    >
      <FixedBlobBackdrop {...SOFT_FIXED_BLOB_PRESET} />
      <div className="kind-words-corkboard kind-words-corkboard-inner relative mx-auto max-w-[min(1200px,calc(100vw-2rem))] min-h-[min(100vh,1200px)] overflow-hidden px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-14">
        <KindWordsHeartsBackdrop opacity="opacity-[0.22]" />

        <div className="relative z-10 mx-auto max-w-[1100px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-10 text-center"
          >
            <KindWordsBoardStickerHeading id="kind-words-board-heading" />
            <p className="mx-auto mt-3 max-w-xl text-base text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">
              Notes from teammates, straight from the corkboard.
            </p>
          </motion.div>

          <KindWordsPostItGrid />
        </div>
      </div>
    </section>
  );
}
