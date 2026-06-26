// En-tête de section numéroté « 01 ──── FORMATIONS » (signature Editorial-Tech)

export function SectionHeader({
  num,
  label,
  title,
  dark = false,
}: {
  num: string;
  label: string;
  title: string;
  dark?: boolean;
}) {
  const sub = dark ? "text-ink/55" : "text-muted";
  const titleColor = dark ? "text-ink" : "text-paper";
  const rule = dark ? "bg-ink/15" : "bg-line";
  return (
    <div className="mb-12 md:mb-16">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.25em] text-accent">{num}</span>
        <span className={`h-px flex-1 ${rule}`} />
        <span className={`font-mono text-xs uppercase tracking-[0.25em] ${sub}`}>
          {label}
        </span>
      </div>
      <h2
        className={`mt-6 max-w-3xl font-display text-3xl leading-tight md:text-5xl ${titleColor}`}
      >
        {title}
      </h2>
    </div>
  );
}
