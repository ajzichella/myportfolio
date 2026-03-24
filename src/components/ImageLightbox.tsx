import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { cn } from "../lib/utils";

/** Zoom is a multiplier on top of the “fit to viewport” scale (1 = fitted). */
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_BTN_STEP = 0.35;
/** Padding inside the scroll pane (matches p-4 md:p-6 on the inner wrapper). */
const FIT_PADDING = 56;

export type ImageLightboxProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
};

export function ImageLightbox({ open, onClose, src, alt }: ImageLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [meta, setMeta] = useState<{ w: number; h: number } | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) {
      setViewport({ w: 0, h: 0 });
      return;
    }
    const el = scrollRef.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setViewport({ w: r.width, h: r.height });
    };
    read();
    const raf = requestAnimationFrame(read);
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [open]);

  const fitScale = useMemo(() => {
    if (!meta || viewport.w < 24 || viewport.h < 24) {
      return null;
    }
    const aw = Math.max(1, viewport.w - FIT_PADDING);
    const ah = Math.max(1, viewport.h - FIT_PADDING);
    const fs = Math.min(1, aw / meta.w, ah / meta.h);
    return fs;
  }, [meta, viewport]);

  useEffect(() => {
    if (!open) {
      setZoom(1);
      setMeta(null);
      return;
    }
    setZoom(1);
    setMeta(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = prev;
      cancelAnimationFrame(t);
    };
  }, [open, src]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const clampZoom = useCallback((z: number) => {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
  }, []);

  const computedPx =
    meta && fitScale != null
      ? {
          w: Math.round(meta.w * fitScale * zoom),
          h: Math.round(meta.h * fitScale * zoom),
        }
      : null;

  if (!open) return null;

  const toolbarBtn =
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const node = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4 md:p-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged image"
        className="flex h-[min(92vh,880px)] max-h-[min(92vh,880px)] w-full max-w-[min(96vw,1280px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_25px_60px_-12px_rgba(15,23,42,0.35),0_12px_24px_-8px_rgba(15,23,42,0.2)] ring-1 ring-slate-900/[0.06]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 justify-end gap-1.5 border-b border-slate-200 px-3 py-2.5 md:gap-2 md:px-4">
          <button
            type="button"
            className={toolbarBtn}
            aria-label="Zoom out"
            onClick={() => setZoom((z) => clampZoom(z - ZOOM_BTN_STEP))}
          >
            <Minus className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            className={toolbarBtn}
            aria-label="Zoom in"
            onClick={() => setZoom((z) => clampZoom(z + ZOOM_BTN_STEP))}
          >
            <Plus className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            className={toolbarBtn}
            aria-label="Reset zoom to fit"
            onClick={() => {
              setZoom(1);
              scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }}
          >
            <RotateCcw className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            ref={closeRef}
            type="button"
            className={toolbarBtn}
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-auto overscroll-contain bg-slate-100"
        >
          <div className="flex min-h-0 min-w-full items-center justify-center p-4 md:p-6">
            <img
              src={src}
              alt={alt}
              className="block max-w-none select-none"
              style={
                computedPx
                  ? {
                      width: computedPx.w,
                      height: computedPx.h,
                    }
                  : {
                      maxWidth: "100%",
                      maxHeight: "min(65vh, 70dvh)",
                      width: "auto",
                      height: "auto",
                    }
              }
              onLoad={(e) => {
                const el = e.currentTarget;
                const nw = el.naturalWidth;
                const nh = el.naturalHeight;
                setMeta({ w: nw, h: nh });
              }}
              draggable={false}
            />
          </div>
        </div>

        <p className="sr-only">
          {alt}. Use plus and minus to zoom; the image starts fitted to the
          window. Scroll to pan. Press Escape to close. Click outside the dialog
          to close.
        </p>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

export type LightboxImageButtonProps = {
  src: string;
  alt: string;
  /** Classes on the `<img>`. */
  className?: string;
  /** Classes on the `<button>` wrapper (e.g. `h-full rounded-lg`). */
  wrapperClassName?: string;
  onOpen: (payload: { src: string; alt: string }) => void;
};

/**
 * Wraps a case-study image: click opens full resolution in ImageLightbox (parent holds lightbox state).
 */
export function LightboxImageButton({
  src,
  alt,
  className,
  wrapperClassName,
  onOpen,
}: LightboxImageButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen({ src, alt })}
      className={cn(
        "group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        wrapperClassName,
      )}
      aria-label={`Open larger view: ${alt}`}
    >
      <img src={src} alt={alt} className={className} loading="lazy" />
    </button>
  );
}
