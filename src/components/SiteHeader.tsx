import Link from "next/link";

const NAV = [
  { href: "/",           label: "홈" },
  { href: "/studio",     label: "스튜디오" },
  { href: "/about-data", label: "데이터·검증" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-geum/20 bg-muk/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* 태극 미니 아이콘 */}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-hong to-cheong text-xs font-black text-baek select-none">
            花
          </span>
          <span className="text-lg font-extrabold tracking-tight text-baek group-hover:text-geum transition-colors">
            하나무늬
            <span className="ml-1.5 text-xs font-normal text-geum/80 tracking-widest">
              HANAMUNI
            </span>
          </span>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-baek/70 transition hover:bg-white/10 hover:text-baek"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/studio"
            className="ml-2 rounded-lg bg-hong px-4 py-1.5 text-sm font-bold text-white shadow transition hover:bg-hong-light"
          >
            문양 짓기 →
          </Link>
        </nav>
      </div>
    </header>
  );
}
