interface SectionHeaderProps {
  number: string;
  titlePrefix: string;
  titleAccent: string;
  tag?: string;
}

export default function SectionHeader({
  number,
  titlePrefix,
  titleAccent,
  tag,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 mt-14 flex items-end justify-between gap-6 border-b border-text pb-3.5">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
          {number}
        </span>
        <h2
          className="font-display leading-none tracking-[-0.025em]"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 500',
            fontSize: "clamp(28px, 3.6vw, 38px)",
          }}
        >
          {titlePrefix}{" "}
          <em
            className="not-italic text-accent"
            style={{
              fontStyle: "italic",
              fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
            }}
          >
            {titleAccent}
          </em>
        </h2>
      </div>
      {tag && (
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted md:block">
          {tag}
        </span>
      )}
    </div>
  );
}
