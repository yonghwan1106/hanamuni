import Link from "next/link";

const DATA_SOURCES = [
  {
    name: "전통문양 AI학습데이터",
    count: "22만 건",
    fields: ["형태 라벨", "의미 태그", "감성 형용사 라벨", "시대 분류"],
    source: "culture.go.kr/share",
    license: "공공누리 제1유형",
    role: "핵심 — 감성 라벨 매칭의 정답 신호. 이 데이터 없이 서비스 불성립.",
    color: "border-hong/40 bg-hong/5",
    badge: "핵심 데이터",
    badgeColor: "bg-hong text-baek",
  },
  {
    name: "전통복식 한복 이미지",
    count: "10,163 건",
    fields: ["360° 8K 촬영", "복식 부위 레이블", "시대·착용자 메타"],
    source: "문화공공데이터광장",
    license: "문화 공공데이터 개방",
    role: "GPT Image 2.0 한복 생성의 레퍼런스·조건화 기반 데이터",
    color: "border-cheong/40 bg-cheong/5",
    badge: "생성 기반",
    badgeColor: "bg-cheong text-baek",
  },
  {
    name: "한국민족문화대백과사전 QA",
    count: "표제어 기반",
    fields: ["문양 고증 정보", "역사·의미 서술", "RAG 참조 소스"],
    source: "encykorea.aks.ac.kr",
    license: "한국학중앙연구원 공공데이터",
    role: "고증 RAG 및 출처 각주 생성 — 전통성 점수의 고증 축",
    color: "border-geum/40 bg-geum/5",
    badge: "고증 RAG",
    badgeColor: "bg-geum text-baek",
  },
  {
    name: "전통문양조회 API",
    count: "API 실시간",
    fields: ["문양 ID", "형태 분류", "이미지 링크"],
    source: "공공데이터포털 (data.go.kr)",
    license: "공공누리 제1유형",
    role: "문양 ID 조회 및 폴백 데모 — 전체 데이터 승인 전 개방분 활용",
    color: "border-muk/25 bg-hanji-warm",
    badge: "폴백 API",
    badgeColor: "bg-muk text-baek",
  },
];

const METRICS = [
  {
    label: "문양-감성 top-3 적중률",
    value: "측정 예정",
    desc: "hold-out 검증셋 기준, 생성 후 실측 예정",
    status: "placeholder",
  },
  {
    label: "한복 구조 요소 검출",
    value: "PoC 진행",
    desc: "고름·배래·깃·동정 4요소 검출 정확도",
    status: "placeholder",
  },
  {
    label: "전통성 점수 통과율",
    value: "70점 기준",
    desc: "임계 미달 시 자동 재생성 (generate-and-filter)",
    status: "active",
  },
  {
    label: "감성 라벨 위반율",
    value: "< 5% 목표",
    desc: "생성 문양이 선택 감성과 불일치하는 비율",
    status: "active",
  },
];

export default function AboutDataPage() {
  return (
    <div className="hanji-paper hanji-fibre relative min-h-screen">
      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* 헤더 */}
        <div className="mb-12">
          <p className="font-latin text-sm uppercase tracking-[0.34em] text-geum">
            Data &amp; Validation
          </p>
          <h1 className="mt-3 font-display text-3xl text-muk sm:text-4xl">
            데이터·검증 방법
          </h1>
          <div className="gilt-rule mt-4 w-24" />
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muk/55">
            하나무늬는 공공 문화 데이터를 서비스의 심장으로 삼습니다.
            데이터가 없으면 서비스 자체가 성립하지 않습니다.
          </p>
        </div>

        {/* ── 활용 데이터 목록 ── */}
        <section className="mb-16">
          <h2 className="mb-6 font-display text-xl text-muk">활용 데이터 목록</h2>
          <div className="space-y-4">
            {DATA_SOURCES.map((ds) => (
              <div
                key={ds.name}
                className={`rounded-sm border p-6 shadow-card ${ds.color}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2.5">
                      <h3 className="font-display text-base text-muk">{ds.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${ds.badgeColor}`}
                      >
                        {ds.badge}
                      </span>
                    </div>
                    <p className="mb-3 text-xs leading-relaxed text-muk/55">{ds.role}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ds.fields.map((f) => (
                        <span
                          key={f}
                          className="rounded-full border border-muk/10 bg-baek-pure/70 px-2.5 py-0.5 text-[11px] text-muk/60"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-latin text-2xl font-semibold text-geum">{ds.count}</p>
                    <p className="text-[11px] text-muk/40">{ds.source}</p>
                    <p className="text-[10px] text-muk/30">{ds.license}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── generate-and-filter 폐루프 다이어그램 ── */}
        <section className="mb-16">
          <h2 className="mb-6 font-display text-xl text-muk">
            generate-and-filter 폐루프
          </h2>
          <div className="rounded-sm border border-geum/25 bg-baek-pure p-6 shadow-card">
            {/* SVG 다이어그램 — 색만 디자인 언어와 조화 */}
            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 720 260"
                className="mx-auto w-full max-w-2xl"
                aria-label="generate-and-filter 폐루프 다이어그램"
              >
                {/* 배경 */}
                <rect width="720" height="260" fill="#f3ece0" rx="4" />

                {/* 노드들 */}
                {/* 1. 사연 입력 */}
                <rect x="20" y="100" width="110" height="60" rx="4" fill="#1a4a7a" />
                <text x="75" y="127" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">사연·감성</text>
                <text x="75" y="143" textAnchor="middle" fill="#a0c0e0" fontSize="10">입력</text>

                {/* 화살표 1 */}
                <path d="M130,130 L165,130" stroke="#b8860b" strokeWidth="2" markerEnd="url(#arrow)" />

                {/* 2. Claude 정규화 */}
                <rect x="165" y="100" width="110" height="60" rx="4" fill="#b3402f" />
                <text x="220" y="127" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Claude</text>
                <text x="220" y="143" textAnchor="middle" fill="#f0cac4" fontSize="10">감성 정규화</text>

                {/* 화살표 2 */}
                <path d="M275,130 L310,130" stroke="#b8860b" strokeWidth="2" markerEnd="url(#arrow)" />

                {/* 3. GPT Image 2.0 생성 */}
                <rect x="305" y="100" width="130" height="60" rx="4" fill="#2d6d3a" />
                <text x="370" y="125" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">GPT Image 2.0</text>
                <text x="370" y="143" textAnchor="middle" fill="#b0d8b8" fontSize="10">문양·한복 생성</text>

                {/* 화살표 3 */}
                <path d="M430,130 L465,130" stroke="#b8860b" strokeWidth="2" markerEnd="url(#arrow)" />

                {/* 4. Validator */}
                <rect x="465" y="100" width="115" height="60" rx="4" fill="#b8860b" />
                <text x="522" y="127" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Validator</text>
                <text x="522" y="143" textAnchor="middle" fill="#fdf6e3" fontSize="10">전통성 점수</text>

                {/* 화살표 4 — 통과 */}
                <path d="M580,130 L620,130" stroke="#2d6d3a" strokeWidth="2" markerEnd="url(#arrowGreen)" />
                <text x="600" y="122" textAnchor="middle" fill="#2d6d3a" fontSize="9">≥70</text>

                {/* 5. 결과 출력 */}
                <rect x="620" y="100" width="85" height="60" rx="4" fill="#1a1410" />
                <text x="662" y="127" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">결과 출력</text>
                <text x="662" y="143" textAnchor="middle" fill="#c9bba8" fontSize="10">+ 출처 각주</text>

                {/* 재생성 루프 화살표 (미달 시) */}
                <path
                  d="M522,160 L522,210 L370,210 L370,160"
                  fill="none"
                  stroke="#b3402f"
                  strokeWidth="2"
                  strokeDasharray="6,3"
                  markerEnd="url(#arrowRed)"
                />
                <text x="446" y="228" textAnchor="middle" fill="#b3402f" fontSize="10" fontWeight="bold">
                  &lt;70 → 재생성
                </text>

                {/* 민속대백과 RAG 연결 */}
                <rect x="310" y="20" width="120" height="44" rx="4" fill="#e8f0f8" stroke="#1a4a7a" strokeWidth="1.5" />
                <text x="370" y="39" textAnchor="middle" fill="#1a4a7a" fontSize="10" fontWeight="bold">민속대백과</text>
                <text x="370" y="54" textAnchor="middle" fill="#1a4a7a" fontSize="9">RAG 고증</text>
                <path d="M370,64 L370,100" stroke="#1a4a7a" strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#arrowBlue)" />

                {/* 화살표 마커 정의 */}
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 Z" fill="#b8860b" />
                  </marker>
                  <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 Z" fill="#2d6d3a" />
                  </marker>
                  <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 Z" fill="#b3402f" />
                  </marker>
                  <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 Z" fill="#1a4a7a" />
                  </marker>
                </defs>
              </svg>
            </div>

            <div className="gilt-rule mx-auto mt-5 w-32" />
            <p className="mt-4 text-center text-xs text-muk/45">
              전통성 점수 70점 미만 시 자동 재생성 루프 → 고품질 생성물만 최종 출력
            </p>
          </div>
        </section>

        {/* ── 성능 검증 지표 ── */}
        <section className="mb-16">
          <h2 className="mb-6 font-display text-xl text-muk">성능 검증 지표</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className={`rounded-sm border p-6 shadow-card ${
                  m.status === "active"
                    ? "border-geum/30 bg-baek-pure"
                    : "border-muk/15 bg-hanji-warm"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-base text-muk">{m.label}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                      m.status === "active"
                        ? "bg-cheong/10 text-cheong"
                        : "bg-muk/10 text-muk/40"
                    }`}
                  >
                    {m.status === "active" ? "운영 중" : "측정 예정"}
                  </span>
                </div>
                <p className="mt-3 font-latin text-2xl font-semibold text-geum">{m.value}</p>
                <p className="mt-1 text-xs text-muk/50">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* 혼동행렬 placeholder */}
          <div className="mt-4 rounded-sm border border-muk/15 bg-hanji-warm p-6 text-center">
            <p className="mb-4 font-latin text-xs font-semibold uppercase tracking-[0.18em] text-muk/40">
              감성 매칭 혼동행렬 (Confusion Matrix) — 실측 후 표시
            </p>
            <div className="overflow-x-auto">
              <table className="mx-auto border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="border border-muk/10 bg-muk/5 p-2 text-muk/50">예측 ↓ / 실제 →</th>
                    {["단아한", "화려한", "길한", "엄숙한", "정겨운"].map((l) => (
                      <th key={l} className="border border-muk/10 bg-muk/5 p-2 text-muk/50">{l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["단아한", "화려한", "길한", "엄숙한", "정겨운"].map((row) => (
                    <tr key={row}>
                      <td className="border border-muk/10 bg-muk/5 p-2 font-semibold text-muk/60">{row}</td>
                      {["단아한", "화려한", "길한", "엄숙한", "정겨운"].map((col) => (
                        <td
                          key={col}
                          className={`border border-muk/10 p-2 text-center ${
                            row === col ? "bg-geum/15 font-bold text-geum" : "text-muk/25"
                          }`}
                        >
                          {row === col ? "—" : "·"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-muk/35">
              hold-out 검증 완료 후 실측값으로 대체 예정 (top-3 적중률·F1 포함)
            </p>
          </div>
        </section>

        {/* ── 권리구조도 ── */}
        <section className="mb-14">
          <h2 className="mb-6 font-display text-xl text-muk">생성물 권리구조</h2>
          <div className="rounded-sm border border-geum/25 bg-baek-pure p-6 shadow-card">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "공공 원자재",
                  desc: "전통문양·한복 공공데이터",
                  note: "공공누리 제1유형 — 상업 이용 무료",
                  color: "bg-cheong/8 border-cheong/25",
                  textColor: "text-cheong",
                },
                {
                  title: "AI 생성물",
                  desc: "문양 패턴 + 한복 착장 이미지",
                  note: "이용자 귀속 (하나무늬 플랫폼 생성물)",
                  color: "bg-geum/8 border-geum/25",
                  textColor: "text-geum",
                },
                {
                  title: "로열티 한정",
                  desc: "신규 협업 장인 업로드분",
                  note: "외부 창작물만 별도 권리 협의 — 공공데이터 기반 생성물은 무료",
                  color: "bg-hong/8 border-hong/25",
                  textColor: "text-hong",
                },
              ].map((r) => (
                <div key={r.title} className={`rounded-sm border p-5 ${r.color}`}>
                  <p className={`font-display text-base ${r.textColor}`}>{r.title}</p>
                  <p className="mt-2 text-xs font-semibold text-muk">{r.desc}</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muk/50">{r.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/studio"
            className="group inline-flex items-center gap-2 rounded-full bg-hong px-9 py-4 text-sm font-semibold text-baek shadow-[0_4px_24px_rgba(179,64,47,0.45)] transition hover:bg-hong-light"
          >
            스튜디오에서 직접 검증하기
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
