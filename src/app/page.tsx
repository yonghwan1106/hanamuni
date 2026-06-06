import Link from "next/link";
import Image from "next/image";

const PATTERN_PREVIEWS = [
  { id: "taeguk",  name: "태극문",  emotion: "엄숙한·길한" },
  { id: "moran",   name: "모란문",  emotion: "화려한·길한" },
  { id: "yeonhwa", name: "연화문",  emotion: "단아한·청명한" },
  { id: "hak",     name: "학문",    emotion: "고결한·장중한" },
  { id: "maehwa",  name: "매화문",  emotion: "단아한·생동감" },
  { id: "chilbo",  name: "칠보문",  emotion: "길한·풍요로운" },
];

const USE_CASES = [
  {
    icon: "혼",
    title: "웨딩·한복대여",
    desc: "혼례의 의미와 가족 사연을 담은 나만의 전통문양 예복 디자인",
  },
  {
    icon: "굿",
    title: "굿즈·기념품",
    desc: "생일·졸업·환갑 — 특별한 날의 이야기가 새겨진 전통 문양 굿즈",
  },
  {
    icon: "공",
    title: "지자체·공방",
    desc: "지역 문화 정체성을 담은 관광 기념품과 문화상품 자동 생성",
  },
  {
    icon: "글",
    title: "글로벌 한류 팬",
    desc: "K-culture 팬을 위한 개인화된 전통 패턴 굿즈 · 세종학당 채널",
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-bg text-white relative overflow-hidden">
        {/* 장식 원형 */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-hong/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cheong/15 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-geum/30 bg-geum/10 px-3 py-1 text-xs font-medium text-geum">
              제4회 문화체육관광 AI·데이터 활용 공모전 · 제품·서비스 분야
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              내 사연으로
              <span className="block text-geum">문양을 짓다</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">
              전통문양 <strong className="text-white">22만 건</strong>의 감성 형용사 라벨로
              당신의 이야기를 분석하고, 나노바나나로 전통문양 패턴과 한복 착장을 생성합니다.{" "}
              <strong className="text-geum">전통성 점수</strong>로 검증 후 굿즈·웨딩·기념품으로 바로 사용하세요.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/studio"
                className="rounded-xl bg-hong px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-hong-light active:scale-95"
              >
                내 사연으로 문양 짓기 →
              </Link>
              <Link
                href="/about-data"
                className="rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-white"
              >
                데이터·검증 방법 보기
              </Link>
            </div>

            {/* 신뢰 지표 */}
            <div className="mt-10 flex flex-wrap gap-6">
              {[
                ["22만", "전통문양 학습데이터"],
                ["10,163", "한복 360°8K 이미지"],
                ["0~100", "전통성 검증 점수"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold text-geum">{num}</p>
                  <p className="text-xs text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 문양 갤러리 미리보기 ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-geum">
              Pattern Gallery
            </p>
            <h2 className="mt-1 text-2xl font-bold text-muk">
              전통문양 감성 라이브러리
            </h2>
            <p className="mt-1 text-sm text-muk/50">
              각 문양은 시대·의미·감성 형용사 라벨로 분류됩니다
            </p>
          </div>
          <Link
            href="/studio"
            className="hidden text-sm font-semibold text-cheong hover:underline sm:block"
          >
            모든 문양으로 창작하기 →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PATTERN_PREVIEWS.map((p) => (
            <Link
              key={p.id}
              href={`/studio?pattern=${p.id}`}
              className="pattern-card group flex flex-col items-center rounded-2xl border border-geum/15 bg-white p-4 shadow-card text-center"
            >
              <div className="h-24 w-24 overflow-hidden rounded-xl bg-baek">
                <Image
                  src={`/patterns/${p.id}.svg`}
                  alt={p.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-3 text-sm font-bold text-muk">{p.name}</p>
              <p className="mt-0.5 text-[11px] text-muk/40">{p.emotion}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 서비스 흐름 ── */}
      <section className="bg-cheong/5 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-geum">
              How It Works
            </p>
            <h2 className="mt-1 text-2xl font-bold text-muk">
              사연에서 굿즈까지, 4단계
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "사연 입력",
                desc: "특별한 이야기와 감성 형용사를 선택합니다",
                color: "bg-hong",
              },
              {
                step: "02",
                title: "감성 정규화",
                desc: "Claude가 사연을 전통문양 감성 라벨로 분석합니다",
                color: "bg-cheong",
              },
              {
                step: "03",
                title: "문양·한복 생성",
                desc: "나노바나나가 전통문양 패턴과 한복 착장을 생성합니다",
                color: "bg-geum",
              },
              {
                step: "04",
                title: "전통성 검증",
                desc: "0~100 전통성 점수로 고증 품질을 확인하고 출처를 표시합니다",
                color: "bg-muk",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-geum/10 bg-white p-6 shadow-card"
              >
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${item.color} text-sm font-extrabold text-white`}
                >
                  {item.step}
                </span>
                <h3 className="mt-4 text-base font-bold text-muk">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muk/55">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 활용 대상 ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-geum">
            Use Cases
          </p>
          <h2 className="mt-1 text-2xl font-bold text-muk">누가 쓰나요?</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((uc) => (
            <div
              key={uc.title}
              className="rounded-2xl border border-geum/12 bg-white p-6 shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-geum-muted text-xl font-bold text-geum">
                {uc.icon}
              </span>
              <h3 className="mt-4 text-sm font-bold text-muk">{uc.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muk/55">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA 배너 ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-muk via-cheong to-muk p-10 text-white text-center shadow-card">
          <div className="pointer-events-none absolute inset-0 opacity-10"
            style={{backgroundImage: "repeating-linear-gradient(45deg, #b8860b 0, #b8860b 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px"}}
          />
          <p className="relative text-xs font-semibold uppercase tracking-widest text-geum">
            지금 시작하세요
          </p>
          <h2 className="relative mt-3 text-2xl font-extrabold sm:text-3xl">
            나만의 전통문양을 짓다
          </h2>
          <p className="relative mt-3 text-sm text-white/65">
            키 없이도 mock 모드로 즉시 체험 가능합니다
          </p>
          <Link
            href="/studio"
            className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-hong px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-hong-light active:scale-95"
          >
            스튜디오 열기 →
          </Link>
        </div>
      </section>
    </div>
  );
}
