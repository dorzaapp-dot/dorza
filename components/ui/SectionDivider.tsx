type Props = {
  fill: string;
  className?: string;
  flip?: boolean;
};

export default function SectionDivider({ fill, flip = false, className = "" }: Props) {
  return (
    <div
      aria-hidden
      className={`w-full overflow-hidden leading-[0] ${className}`}
      style={{ marginTop: "-1px" }}
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="block w-full h-[30px] md:h-[48px] lg:h-[60px]"
        style={flip ? { transform: "rotate(180deg)" } : undefined}
      >
        <path
          d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
