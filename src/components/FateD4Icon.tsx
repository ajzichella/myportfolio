type FateD4IconProps = {
  className?: string;
};

/** Tetrahedron face — triangle with d4 label. */
export function FateD4Icon({ className }: FateD4IconProps) {
  return (
    <svg
      viewBox="0 0 32 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M16 2.5 29.5 25.5H2.5L16 2.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="currentColor"
        fontSize="9.5"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        d4
      </text>
    </svg>
  );
}
