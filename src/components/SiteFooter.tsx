export function SiteFooter() {
  return (
    <footer className="relative border-t border-geum/20 bg-muk-deep py-12 text-baek/55">
      {/* 상단 금박 헤어라인 */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-geum-light/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          {/* 서비스 소개 */}
          <div>
            <p className="mb-1 font-display text-base text-baek">하나무늬</p>
            <p className="mb-3 font-latin text-[11px] uppercase tracking-[0.34em] text-geum/70">
              Hanamuni
            </p>
            <p className="text-xs leading-relaxed text-baek/60">
              사연과 감정을 전통문양과 한복으로 짓고,
              전통성 점수로 검증하는 생성형 창작 스튜디오.
            </p>
            <p className="mt-3 text-[11px] text-geum/70">
              제4회 문화체육관광 AI·데이터 활용 공모전 출품작
            </p>
          </div>

          {/* 활용 데이터 */}
          <div>
            <p className="mb-3 font-display text-sm text-baek">활용 데이터</p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <span className="text-geum-light">◦</span>{" "}
                전통문양 AI학습데이터 22만건
                <span className="ml-1 text-baek/35">(culture.go.kr/share)</span>
              </li>
              <li>
                <span className="text-geum-light">◦</span>{" "}
                전통복식 한복 10,163건 360°8K
                <span className="ml-1 text-baek/35">(문화공공데이터광장)</span>
              </li>
              <li>
                <span className="text-geum-light">◦</span>{" "}
                한국민족문화대백과사전 QA
                <span className="ml-1 text-baek/35">(encykorea.aks.ac.kr)</span>
              </li>
              <li>
                <span className="text-geum-light">◦</span>{" "}
                전통문양조회 API · 2D개별문양
                <span className="ml-1 text-baek/35">(공공데이터포털)</span>
              </li>
            </ul>
          </div>

          {/* 라이선스·안내 */}
          <div>
            <p className="mb-3 font-display text-sm text-baek">이용 안내</p>
            <ul className="space-y-1.5 text-xs text-baek/60">
              <li>공공데이터 이용: 공공누리 제1유형</li>
              <li>생성물 권리: 이용자 귀속 (신규 협업 업로드분 한정)</li>
              <li>상업 이용 시 로열티 무료 (공공 원자재 기반)</li>
            </ul>
            <p className="mt-4 font-latin text-[11px] tracking-wide text-baek/30">
              © 2026 하나무늬 · 박용환 · 경인블루저널
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
