import Link from "next/link";

const NAV = [
  { href: "/",           label: "홈" },
  { href: "/studio",     label: "스튜디오" },
  { href: "/about-data", label: "데이터·검증" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-geum/25 bg-muk-deep/95 backdrop-blur-md">
      {/* 상단 금박 헤어라인 */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-geum-light/60 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* 로고 — 인장 + 명조 한글 + Cormorant 라틴 */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-geum/50 bg-gradient-to-br from-hong via-muk-soft to-cheong font-display text-sm text-baek shadow-[0_0_0_3px_rgba(184,134,11,0.10)] transition-transform duration-500 group-hover:rotate-[8deg] select-none">
            花
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-tight text-baek transition-colors group-hover:text-geum-bright">
              하나무늬
            </span>
            <span className="font-latin text-[11px] font-medium uppercase tracking-[0.34em] text-geum/75">
              Hanamuni
            </span>
          </span>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative rounded-md px-2.5 py-1.5 text-sm text-baek/65 transition hover:text-baek sm:px-3.5
                after:absolute after:bottom-0.5 after:left-2.5 after:right-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-geum-light/70 after:transition-transform after:duration-300 hover:after:scale-x-100 sm:after:left-3.5 sm:after:right-3.5"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/studio"
            className="ml-2 rounded-full border border-geum/40 bg-hong px-4 py-1.5 text-sm font-semibold text-baek shadow-[0_2px_10px_rgba(179,64,47,0.35)] transition hover:bg-hong-light hover:shadow-[0_4px_16px_rgba(179,64,47,0.45)] active:scale-95"
          >
            문양 짓기&nbsp;→
          </Link>
        </nav>
      </div>
    </header>
  );
}
