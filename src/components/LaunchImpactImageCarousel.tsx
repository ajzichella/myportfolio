import { LightboxImageButton } from "./ImageLightbox";

const SLIDES = [
  {
    file: "rbac-success-banner.png",
    alt: "Success banner after joining a team as Modifier: create, read, and update access without delete, with link to team admin",
  },
  {
    file: "rbac-invite-members.png",
    alt: "Invite team members flow: Modifier role selected, multiple email chips, secure sign-in option, and send invites",
  },
  {
    file: "rbac-change-role-modal-full.png",
    alt: "Change role modal listing Owner, Member, Modifier, Biller, Billing Viewer, and Resource Viewer with permission summaries",
  },
] as const;

/** Overrides default `block w-full` on LightboxImageButton so flex row sizing stays correct. */
const carouselSlideButtonClass =
  "inline-block w-auto max-w-[min(1120px,92vw)] shrink-0";

const carouselSlideImgClass =
  "h-[min(520px,62vh)] w-auto max-w-full shrink-0 select-none object-contain object-left opacity-90 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100";

export type LaunchImpactImageCarouselProps = {
  baseUrl: string;
  onOpenImage: (payload: { src: string; alt: string }) => void;
};

/**
 * Full-viewport-width horizontal marquee of launch screenshots; pauses while hovered or focus-within.
 */
export function LaunchImpactImageCarousel({
  baseUrl,
  onOpenImage,
}: LaunchImpactImageCarouselProps) {
  const loopSlides = [...SLIDES, ...SLIDES];

  return (
    <div
      className="launch-impact-carousel mt-12 w-screen max-w-[100vw] shrink-0 -translate-x-1/2 relative left-1/2 py-8 md:py-10"
      aria-label="Launch screenshots: success state, invite flow, and change role"
    >
      <div className="launch-impact-carousel__track">
        {loopSlides.map((slide, i) => (
          <LightboxImageButton
            key={`${slide.file}-${i}`}
            src={`${baseUrl}${slide.file}`}
            alt={slide.alt}
            wrapperClassName={carouselSlideButtonClass}
            className={carouselSlideImgClass}
            onOpen={onOpenImage}
          />
        ))}
      </div>
    </div>
  );
}
