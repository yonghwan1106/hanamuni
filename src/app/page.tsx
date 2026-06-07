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
    icon: "婚",
    title: "웨딩·한복대여",
    desc: "혼례의 의미와 가족 사연을 담은 나만의 전통문양 예복 디자인",
  },
  {
    icon: "禮",
    title: "굿즈·기념품",
    desc: "생일·졸업·환갑 — 특별한 날의 이야기가 새겨진 전통 문양 굿즈",
  },
  {
    icon: "鄕",
    title: "지자체·공방",
    desc: "지역 문화 정체성을 담은 관광 기념품과 문화상품 자동 생성",
  },
  {
    icon: "韓",
    title: "글로벌 한류 팬",
    desc: "K-culture 팬을 위한 개인화된 전통 패턴 굿즈 · 세종학당 채널",
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* ══════════════ HERO ══════════════ */}
      <section className="hero-bg ink-grain hero-feather relative overflow-hidden text-baek">
        {/* 배경 전통문양 모티프 레이어 (은은히) */}
        <div className="pointer-events-none absolute -right-40 -top-44 h-[34rem] w-[34rem] opacity-[0.07] drift-spin">
          <Image src="/patterns/dangcho.svg" alt="" width={544} height={544} className="h-full w-full" />
        </div>
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[26rem] w-[26rem] opacity-[0.06]">
          <Image src="/patterns/yeonhwa.svg" alt="" width={416} height={416} className="h-full w-full" />
        </div>
        {/* 색 글로우 */}
        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-hong/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cheong/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-6">
          {/* 좌측 — 텍스트 (비대칭 7컬럼) */}
          <div className="lg:col-span-7">
            <span className="rise-in d1 inline-flex items-center gap-2 rounded-full border border-geum/35 bg-geum/[0.08] px-4 py-1.5 font-latin text-[12px] uppercase tracking-[0.2em] text-geum-bright">
              <span className="h-1.5 w-1.5 rounded-full bg-geum-bright" />
              제4회 문화체육관광 AI·데이터 활용 공모전
            </span>

            <h1 className="rise-in d2 mt-8 font-display text-5xl leading-[1.12] tracking-tight sm:text-7xl">
              내 이야기로 짓는
              <span className="mt-2 block gilt-text">전통</span>
            </h1>

            <p className="rise-in d3 mt-3 font-latin text-2xl italic tracking-wide text-baek/45 sm:text-3xl">
              Weaving tradition from your story
            </p>

            <p className="rise-in d4 mt-7 max-w-xl text-base leading-loose text-baek/70 sm:text-lg">
              전통문양 <strong className="font-semibold text-baek">22만 건</strong>의 감성 형용사 라벨로
              당신의 사연을 읽어내고, 전통문양 패턴과 한복 착장을 짓습니다.{" "}
              <strong className="text-geum-bright">전통성 점수</strong>로 검증한 작품을
              굿즈·웨딩·기념품으로 바로 사용하세요.
            </p>

            <div className="rise-in d5 mt-10 flex flex-wrap gap-4">
              <Link
                href="/studio"
                className="group rounded-full bg-hong px-8 py-4 text-sm font-semibold text-baek shadow-[0_4px_24px_rgba(179,64,47,0.45)] transition hover:bg-hong-light active:scale-95"
              >
                내 사연으로 문양 짓기
                <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/about-data"
                className="rounded-full border border-geum/30 px-8 py-4 text-sm font-medium text-baek/80 transition hover:border-geum/60 hover:bg-baek/[0.04] hover:text-baek"
              >
                데이터·검증 방법 보기
              </Link>
            </div>

            {/* 신뢰 지표 — 금색 헤어라인 구분 */}
            <div className="rise-in d6 mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-geum/15 pt-8">
              {[
                ["22만", "전통문양 학습데이터"],
                ["10,163", "한복 360° 8K 이미지"],
                ["0–100", "전통성 검증 점수"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="font-latin text-4xl font-semibold tracking-tight text-geum-bright">{num}</p>
                  <p className="mt-1 text-xs tracking-wide text-baek/45">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 우측 — 족자형 인장 비주얼 (5컬럼, 비대칭) */}
          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="seal-in relative mx-auto aspect-[3/4] max-w-sm">
              {/* 족자 프레임 */}
              <div className="gilt-frame absolute inset-0 rounded-[2px]">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                  <Image
                    src="/patterns/moran.svg"
                    alt="모란문 미리보기"
                    width={220}
                    height={220}
                    className="h-44 w-44 opacity-90"
                  />
                  <div className="gilt-rule w-2/3" />
                  <p className="font-display text-2xl text-muk">모란문 · 牡丹紋</p>
                  <p className="text-center text-xs leading-relaxed text-muk/55">
                    부귀와 화려함의 상징.<br />당신의 사연이 문양이 되는 자리.
                  </p>
                </div>
              </div>
              {/* 떠 있는 금박 인장 */}
              <div className="absolute -right-5 -top-5 flex h-20 w-20 rotate-[-4deg] items-center justify-center rounded-md border-2 border-hong/70 bg-hong/90 font-display text-3xl text-baek shadow-gilt">
                印
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 문양 갤러리 ══════════════ */}
      <section className="hanji-paper hanji-fibre relative">
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-latin text-sm uppercase tracking-[0.34em] text-geum">
                Pattern Gallery
              </p>
              <h2 className="mt-3 font-display text-3xl text-muk sm:text-4xl">
                전통문양 감성 라이브러리
              </h2>
              <div className="gilt-rule mt-4 w-24" />
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muk/55">
                각 문양은 시대·의미·감성 형용사 라벨로 분류되어, 당신의 이야기와 정밀하게 매칭됩니다.
              </p>
            </div>
            <Link
              href="/studio"
              className="hidden font-latin text-sm uppercase tracking-widest text-hong transition hover:text-hong-light sm:block"
            >
              All patterns →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {PATTERN_PREVIEWS.map((p) => (
              <Link
                key={p.id}
                href={`/studio?pattern=${p.id}`}
                className="pattern-card gilt-sweep group flex flex-col items-center rounded-sm border border-geum/25 bg-baek-pure/80 p-5 text-center"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-sm border border-geum/15 bg-hanji p-2">
                  <Image
                    src={`/patterns/${p.id}.svg`}
                    alt={p.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="mt-4 font-display text-base text-muk">{p.name}</p>
                <p className="mt-1 text-[11px] tracking-wide text-muk/45">{p.emotion}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ 서비스 흐름 ══════════════ */}
      <section className="relative bg-muk-deep ink-grain py-20 text-baek">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 opacity-[0.05]">
          <Image src="/patterns/unmun.svg" alt="" width={288} height={288} className="h-full w-full" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <p className="font-latin text-sm uppercase tracking-[0.34em] text-geum-bright">
              How It Works
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              사연에서 굿즈까지, 네 걸음
            </h2>
            <div className="gilt-rule mx-auto mt-5 w-24" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "壹", num: "01", title: "사연 입력", desc: "특별한 이야기와 감성 형용사를 선택합니다", accent: "text-hong" },
              { step: "貳", num: "02", title: "감성 정규화", desc: "Claude가 사연을 전통문양 감성 라벨로 분석합니다", accent: "text-cheong-light" },
              { step: "參", num: "03", title: "문양·한복 생성", desc: "GPT Image 2.0이 전통문양 패턴과 한복 착장을 짓습니다", accent: "text-geum-bright" },
              { step: "肆", num: "04", title: "전통성 검증", desc: "0~100 전통성 점수로 고증 품질을 확인하고 출처를 표시합니다", accent: "text-baek" },
            ].map((item) => (
              <div
                key={item.num}
                className="group relative overflow-hidden rounded-sm border border-geum/20 bg-muk-soft/60 p-7 transition hover:border-geum/50"
              >
                <span className="font-latin text-xs tracking-[0.3em] text-geum/50">{item.num}</span>
                <p className={`mt-2 font-display text-4xl ${item.accent}`}>{item.step}</p>
                <h3 className="mt-5 font-display text-lg text-baek">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-baek/55">{item.desc}</p>
                <div className="gilt-rule mt-5 w-0 transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ 활용 대상 ══════════════ */}
      <section className="hanji-paper hanji-fibre relative">
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <p className="font-latin text-sm uppercase tracking-[0.34em] text-geum">
              Use Cases
            </p>
            <h2 className="mt-3 font-display text-3xl text-muk sm:text-4xl">누가 쓰나요?</h2>
            <div className="gilt-rule mx-auto mt-5 w-24" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((uc) => (
              <div
                key={uc.title}
                className="group rounded-sm border border-geum/20 bg-baek-pure/80 p-7 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-sm border border-geum/30 bg-hanji font-display text-2xl text-hong transition-colors group-hover:bg-hong group-hover:text-baek">
                  {uc.icon}
                </span>
                <h3 className="mt-5 font-display text-lg text-muk">{uc.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muk/55">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA 배너 ══════════════ */}
      <section className="hanji-paper relative">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-6">
          <div className="hero-bg ink-grain relative overflow-hidden rounded-sm border border-geum/25 p-12 text-center text-baek shadow-gilt sm:p-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-[0.08] drift-spin">
              <Image src="/patterns/taeguk.svg" alt="" width={256} height={256} className="h-full w-full" />
            </div>
            <p className="relative font-latin text-sm uppercase tracking-[0.34em] text-geum-bright">
              지금 시작하세요
            </p>
            <h2 className="relative mt-4 font-display text-3xl sm:text-5xl">
              나만의 전통문양을 짓다
            </h2>
            <div className="gilt-rule mx-auto mt-6 w-28" />
            <p className="relative mt-6 text-sm text-baek/60">
              키 없이도 mock 모드로 즉시 체험 가능합니다
            </p>
            <Link
              href="/studio"
              className="group relative mt-9 inline-flex items-center gap-2 rounded-full bg-hong px-9 py-4 text-sm font-semibold text-baek shadow-[0_4px_24px_rgba(179,64,47,0.45)] transition hover:bg-hong-light active:scale-95"
            >
              스튜디오 열기
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
