const segments = [
  "Cafes",
  "Tradies",
  "Salons",
  "Gyms",
  "Retail",
  "Restaurants",
  "Accountants",
  "Physios",
  "Dentists",
  "Florists",
];

function MarqueeRow({
  items,
  reverse = false,
  speed = 30,
}: {
  items: string[];
  reverse?: boolean;
  speed?: number;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-container relative overflow-hidden">
      <div
        className={`marquee-track flex w-max items-center ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
        style={{ willChange: "transform", animationDuration: `${speed}s` }}
      >
        {doubled.map((seg, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span
              className={`font-display italic text-[28px] md:text-[36px] lg:text-[42px] uppercase tracking-[0.06em] px-6 md:px-8 whitespace-nowrap ${
                reverse ? "text-dark/20" : "text-dark/50"
              }`}
            >
              {seg}
            </span>
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${
                reverse ? "bg-accent/30" : "bg-accent/60"
              }`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SegmentMarquee() {
  const reversed = [...segments].reverse();

  return (
    <section
      className="relative py-6 md:py-8 bg-warm border-y border-border overflow-hidden"
      aria-hidden="true"
    >
      <MarqueeRow items={segments} speed={35} />
      <div className="h-2 md:h-3" />
      <MarqueeRow items={reversed} reverse speed={40} />

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-warm to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-warm to-transparent z-10" />
    </section>
  );
}
