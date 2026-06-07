"use client";

import { useState, useCallback, useEffect } from "react";
import type { NormalizeResponse } from "@/app/api/normalize/route";
import type { GenerateResponse, ImageType } from "@/app/api/generate/route";
import type { ScoreResponse } from "@/app/api/score/route";

// ── 상수 ──────────────────────────────────────────────────────────
const EMOTION_CHIPS = [
  "단아한", "화려한", "정겨운", "엄숙한", "길한",
  "장중한", "고결한", "청명한", "생동감 있는", "풍요로운",
  "신비로운", "익살스러운",
];

const STORY_EXAMPLES = [
  "부모님 결혼 50주년 기념 선물을 만들고 싶어요. 평생 서로를 지지해온 두 분의 이야기를 담고 싶습니다.",
  "올해 대학 졸업을 맞아 4년간의 노력과 설렘을 기억하고 싶어요.",
  "돌아가신 할머니를 그리워하며, 고향의 정겨움을 담은 문양을 갖고 싶습니다.",
  "첫 아이의 돌잔치를 앞두고 건강하고 행복하게 자라길 바라는 마음을 담으려 합니다.",
];

const IMAGE_SLOTS: { type: ImageType; title: string }[] = [
  { type: "pattern", title: "전통문양 패턴" },
  { type: "hanbok", title: "한복 착장 시안" },
  { type: "goods", title: "한글 굿즈 시안" },
];

// ── 타입 ──────────────────────────────────────────────────────────
type Step = "input" | "generating" | "result";
type Phase = "normalize" | "images" | "score";
type ImagesState = Partial<Record<ImageType, GenerateResponse>>;

const STEP_DEFS: { key: Phase; label: string }[] = [
  { key: "normalize", label: "감성 분석" },
  { key: "images", label: "이미지 생성" },
  { key: "score", label: "전통성 검증" },
];

// ── 점수 게이지 ───────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const color = score >= 85 ? "#2d6d3a" : score >= 70 ? "#b8860b" : "#b3402f";
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <span className="font-latin text-xs uppercase tracking-[0.2em] text-muk/55">전통성 점수</span>
        <span className="font-latin text-4xl font-semibold leading-none" style={{ color }}>
          {score}<span className="ml-1 font-body text-sm font-normal text-muk/40">/ 100</span>
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border border-geum/25 bg-hanji-deep">
        <div className="score-bar h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <p className="text-[11px] leading-relaxed text-muk/50">
        {score >= 85 ? "우수 — 고증이 탁월하여 굿즈·상업 이용 최적"
          : score >= 70 ? "양호 — 전통성 기준 통과, 이용 가능"
          : "미달 — 재생성을 권장합니다"}
      </p>
    </div>
  );
}

function ScoreBreakdown({ breakdown }: { breakdown: ScoreResponse["breakdown"] }) {
  const items = [
    { label: "감성 매칭", value: breakdown.emotionMatch, max: 40 },
    { label: "문양 고증", value: breakdown.patternAuth, max: 35 },
    { label: "한복 구조", value: breakdown.structureScore, max: 25 },
  ];
  return (
    <div className="mt-6 space-y-3">
      <p className="font-latin text-[11px] uppercase tracking-[0.2em] text-muk/45">점수 세부 내역</p>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-[11px] text-muk/60">{item.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-geum/10">
            <div className="h-full rounded-full bg-gradient-to-r from-geum to-geum-light transition-all duration-700"
              style={{ width: `${(item.value / item.max) * 100}%` }} />
          </div>
          <span className="w-10 text-right font-latin text-sm font-semibold text-geum">{item.value}/{item.max}</span>
        </div>
      ))}
    </div>
  );
}

// ── 단계 진행 표시 ────────────────────────────────────────────────
function StepProgress({ phase, imagesDone }: { phase: Phase; imagesDone: number }) {
  const order: Phase[] = ["normalize", "images", "score"];
  const cur = order.indexOf(phase);
  return (
    <div className="flex items-center">
      {STEP_DEFS.map((s, i) => {
        const state = i < cur ? "done" : i === cur ? "active" : "pending";
        return (
          <div key={s.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full font-latin text-xs font-bold transition ${
                state === "done" ? "bg-mint text-baek"
                  : state === "active" ? "bg-cheong text-baek ring-4 ring-cheong/20"
                  : "border border-geum/30 bg-hanji text-muk/40"
              }`}>
                {state === "done" ? "✓" : i + 1}
              </span>
              <span className={`whitespace-nowrap text-[10px] font-semibold ${
                state === "pending" ? "text-muk/35" : "text-muk/70"
              }`}>
                {s.label}{s.key === "images" && state === "active" ? ` ${imagesDone}/3` : ""}
              </span>
            </div>
            {i < STEP_DEFS.length - 1 && (
              <div className={`mx-1 mb-4 h-px flex-1 rounded ${i < cur ? "bg-mint" : "bg-geum/20"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── 이미지 카드 (족자/현판 프레이밍 · 스켈레톤 ↔ 실이미지) ─────────
function ImageCard({ title, data, blessing }: { title: string; data?: GenerateResponse; blessing: string }) {
  return (
    <div className="rounded-sm border border-geum/25 bg-baek-pure p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-latin text-xs font-semibold uppercase tracking-[0.18em] text-geum">{title}</p>
        {data && (
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
            data.mode === "real" ? "bg-cheong/10 text-cheong" : "bg-geum-muted text-geum"
          }`}>{data.mode === "real" ? "AI 생성" : "샘플"}</span>
        )}
      </div>
      {/* 금색 매트 + 한지 바탕 작품 프레임 */}
      <div className="gilt-frame mb-4 flex min-h-[210px] items-center justify-center overflow-hidden rounded-[2px]">
        {data ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.imageUrl} alt={title} className="h-52 w-auto max-w-full rounded-[2px] object-contain animate-[fadein_0.5s_ease]" />
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-muk/40">
            <span className="hanamuni-spinner inline-block !h-7 !w-7 !border-2" />
            <span className="text-[11px] font-semibold tracking-wide">생성 중…</span>
          </div>
        )}
      </div>
      {data && data.type === "pattern" && (
        <>
          <h3 className="font-display text-lg text-muk">{data.selectedPattern.name}</h3>
          <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muk/60">{data.selectedPattern.meaning}</p>
        </>
      )}
      {data && data.type === "hanbok" && (
        <p className="text-center text-[11px] text-muk/40">
          {data.mode === "mock" ? "GPT Image 2.0 연결 시 실제 생성"
            : `${data.engine === "nanobanana" ? "나노바나나" : "GPT Image 2.0"} 실시간 생성`}
        </p>
      )}
      {data && data.type === "goods" && (
        <>
          <p className="text-center text-sm text-muk/70">
            새김 문구 <span className="font-display text-base text-hong">&ldquo;{blessing}&rdquo;</span>
          </p>
          <p className="mt-1 text-center text-[11px] text-muk/40">GPT Image 2.0 한글 렌더링 — 즉시 상품화</p>
        </>
      )}
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────────────────
export default function StudioPage() {
  const [step, setStep] = useState<Step>("input");
  const [phase, setPhase] = useState<Phase>("normalize");
  const [story, setStory] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // 점진적 상태
  const [normalize, setNormalize] = useState<NormalizeResponse | null>(null);
  const [images, setImages] = useState<ImagesState>({});
  const [score, setScore] = useState<ScoreResponse | null>(null);

  // 경과 타이머 (생성 중에만)
  useEffect(() => {
    if (step !== "generating") return;
    setElapsed(0);
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [step]);

  const toggleChip = useCallback((chip: string) => {
    setSelectedChips((prev) => prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!story.trim() && selectedChips.length === 0) {
      setError("사연이나 감성 형용사를 하나 이상 선택해 주세요.");
      return;
    }
    setError(null);
    setNormalize(null);
    setImages({});
    setScore(null);
    setPhase("normalize");
    setStep("generating");

    try {
      // 1) 감성 정규화
      const normRes = await fetch("/api/normalize", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ story, chips: selectedChips }),
      });
      if (!normRes.ok) throw new Error("감성 정규화 실패");
      const norm: NormalizeResponse = await normRes.json();
      setNormalize(norm);

      // 2) 이미지 3종 병렬 생성 — 완성되는 대로 즉시 노출
      setPhase("images");
      const gen = async (type: ImageType): Promise<GenerateResponse> => {
        const r = await fetch("/api/generate", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ type, labels: norm.labels, story, blessing: norm.blessing }),
        });
        if (!r.ok) {
          const e = await r.json().catch(() => null);
          throw new Error(e?.error || "이미지 생성 실패");
        }
        const g: GenerateResponse = await r.json();
        setImages((prev) => ({ ...prev, [type]: g })); // ← incremental reveal
        return g;
      };
      const gens = await Promise.all(IMAGE_SLOTS.map((s) => gen(s.type)));
      const selectedPattern = gens[0].selectedPattern;

      // 3) 전통성 점수
      setPhase("score");
      const scoreRes = await fetch("/api/score", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ patternId: selectedPattern.id, labels: norm.labels, story }),
      });
      if (!scoreRes.ok) throw new Error("점수 산정 실패");
      const sc: ScoreResponse = await scoreRes.json();
      setScore(sc);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "생성 중 오류가 발생했습니다.");
      setStep("input");
    }
  }, [story, selectedChips]);

  const handleReset = useCallback(() => {
    setStep("input"); setNormalize(null); setImages({}); setScore(null); setError(null);
  }, []);
  const handleRegenerate = useCallback(() => { void handleGenerate(); }, [handleGenerate]);

  const imagesDone = Object.keys(images).length;
  const selectedPattern =
    images.pattern?.selectedPattern ?? images.hanbok?.selectedPattern ?? images.goods?.selectedPattern;
  const anyReal = Object.values(images).some((g) => g?.mode === "real");
  const blessing = normalize?.blessing ?? "복과 건강이 깃들기를";
  const waitMsg = elapsed < 6 ? "사연 속 감성을 읽어내는 중이에요…"
    : imagesDone === 0 ? "전통문양·한복·굿즈를 동시에 짓고 있어요…"
    : imagesDone < 3 ? "완성된 작품부터 아래에 표시되고 있어요…"
    : "전통성을 검증하고 출처를 정리하는 중이에요…";

  return (
    <div className="hanji-paper hanji-fibre relative min-h-screen">
      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <p className="font-latin text-sm uppercase tracking-[0.34em] text-geum">Creation Studio</p>
          <h1 className="mt-3 font-display text-3xl text-muk sm:text-4xl">내 사연으로 문양 짓기</h1>
          <div className="gilt-rule mt-4 w-24" />
          <p className="mt-4 text-sm leading-relaxed text-muk/55">사연을 입력하고 감성을 선택하면, 전통문양·한복·한글 굿즈를 한자리에서 짓습니다.</p>
        </div>

        {/* ── 입력 단계 ── */}
        {step === "input" && (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-3">
              <div className="rounded-sm border border-geum/25 bg-baek-pure p-6 shadow-card">
                <label className="mb-3 block font-display text-base text-muk">사연 · 감정 입력</label>
                <textarea value={story} onChange={(e) => setStory(e.target.value)}
                  placeholder="특별한 이야기를 적어주세요. (예: 부모님 결혼기념일, 졸업 선물, 돌아가신 분을 그리며…)"
                  rows={5}
                  className="w-full resize-none rounded-sm border border-geum/25 bg-hanji px-4 py-3 text-sm leading-relaxed text-muk outline-none transition placeholder:text-muk/30 focus:border-cheong focus:ring-2 focus:ring-cheong/20" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {STORY_EXAMPLES.map((ex, i) => (
                    <button key={i} type="button" onClick={() => setStory(ex)}
                      className="rounded-full border border-geum/25 bg-geum-muted px-3 py-1 text-[11px] text-geum transition hover:bg-geum/20">
                      예시 {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-sm border border-geum/25 bg-baek-pure p-6 shadow-card">
                <label className="mb-1 block font-display text-base text-muk">감성 형용사 선택</label>
                <p className="mb-4 text-xs text-muk/45">어울리는 감성을 복수 선택할 수 있습니다</p>
                <div className="flex flex-wrap gap-2">
                  {EMOTION_CHIPS.map((chip) => {
                    const active = selectedChips.includes(chip);
                    return (
                      <button key={chip} type="button" onClick={() => toggleChip(chip)}
                        className={`emotion-chip rounded-full border px-4 py-1.5 text-xs font-semibold ${
                          active ? "border-hong bg-hong text-baek shadow-[0_2px_8px_rgba(179,64,47,0.30)]"
                            : "border-geum/30 bg-hanji text-muk/70 hover:border-hong/50 hover:text-hong"
                        }`}>{chip}</button>
                    );
                  })}
                </div>
                {selectedChips.length > 0 && (
                  <p className="mt-3 text-[11px] text-muk/45">선택됨: {selectedChips.join(" · ")}</p>
                )}
              </div>

              {error && (
                <div className="rounded-sm border border-hong/30 bg-hong-muted px-4 py-3 text-sm text-hong">{error}</div>
              )}

              <button type="button" onClick={handleGenerate}
                className="group w-full rounded-full bg-hong py-4 text-sm font-semibold text-baek shadow-[0_4px_20px_rgba(179,64,47,0.40)] transition hover:bg-hong-light active:scale-95">
                전통문양 생성하기
                <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>

            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-sm border border-geum/25 bg-baek-pure p-5 shadow-card">
                <p className="mb-4 font-latin text-xs font-semibold uppercase tracking-[0.18em] text-geum">생성 파이프라인</p>
                {[
                  { n: "1", label: "Claude", desc: "사연→감성 라벨 정규화" },
                  { n: "2", label: "GPT Image 2.0", desc: "문양·한복·굿즈 병렬 생성" },
                  { n: "3", label: "Validator", desc: "전통성 점수·출처 각주" },
                ].map((s) => (
                  <div key={s.n} className="mb-3 flex gap-3 last:mb-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cheong font-latin text-[11px] font-bold text-baek">{s.n}</span>
                    <div><p className="text-xs font-bold text-muk">{s.label}</p><p className="text-[11px] text-muk/50">{s.desc}</p></div>
                  </div>
                ))}
              </div>
              <div className="rounded-sm border border-cheong/25 bg-cheong/5 p-5">
                <p className="mb-2 font-display text-sm text-cheong">생성 안내</p>
                <p className="text-[11px] leading-relaxed text-muk/60">
                  AI가 문양·한복·굿즈 3종을 동시에 생성합니다. 보통 <strong>20~40초</strong>가 걸리며,
                  완성되는 작품부터 화면에 바로 나타납니다.
                </p>
              </div>
              <div className="rounded-sm border border-geum/25 bg-baek-pure p-5 shadow-card">
                <p className="mb-2 font-latin text-xs font-semibold uppercase tracking-[0.18em] text-geum">활용 데이터</p>
                <ul className="space-y-1.5 text-[11px] text-muk/55">
                  <li><span className="text-geum-light">◦</span> 전통문양 AI학습데이터 22만건 (감성 라벨)</li>
                  <li><span className="text-geum-light">◦</span> 전통복식 한복 10,163건 360°8K</li>
                  <li><span className="text-geum-light">◦</span> 민속대백과 QA (고증 RAG)</li>
                  <li><span className="text-geum-light">◦</span> 전통문양조회 API</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── 생성/결과 단계 (이미지 점진 노출) ── */}
        {(step === "generating" || step === "result") && (
          <div className="space-y-6">
            {/* 진행 헤더 */}
            {step === "generating" && (
              <div className="rounded-sm border border-cheong/25 bg-cheong/5 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="hanamuni-spinner inline-block !h-5 !w-5 !border-2" />
                    <p className="font-display text-base text-cheong">작품을 짓고 있어요</p>
                  </div>
                  <span className="rounded-full border border-geum/20 bg-baek-pure/80 px-3 py-1 font-latin text-sm font-semibold text-muk/60">{elapsed}초</span>
                </div>
                <StepProgress phase={phase} imagesDone={imagesDone} />
                <p className="mt-5 text-[11px] text-muk/55">{waitMsg} · 보통 20~40초 걸려요. 멈춘 게 아니에요!</p>
              </div>
            )}

            {/* 결과 헤더 */}
            {step === "result" && (
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-3.5 py-1 text-xs font-semibold ${anyReal ? "bg-cheong/10 text-cheong" : "bg-geum-muted text-geum"}`}>
                  {anyReal ? "실모드 · AI 생성" : "mock 모드 · 샘플 생성"}
                </span>
                <button type="button" onClick={handleReset}
                  className="rounded-full border border-geum/30 px-4 py-1.5 text-xs font-semibold text-muk/60 transition hover:text-muk">← 다시 만들기</button>
              </div>
            )}

            {/* 사연 요약 (정규화 완료 시) */}
            {normalize && (
              <div className="rounded-sm border border-geum/25 bg-baek-pure p-6 shadow-card">
                <p className="mb-2 font-latin text-xs font-semibold uppercase tracking-[0.18em] text-geum">사연 분석 요약</p>
                <p className="text-sm leading-relaxed text-muk">{normalize.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {normalize.labels.map((l) => (
                    <span key={l} className="rounded-full bg-hong/10 px-3 py-1 text-[11px] font-semibold text-hong">{l}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 이미지 3종 (스켈레톤 → 완성 시 즉시 표시) */}
            <div className="grid gap-6 lg:grid-cols-3">
              {IMAGE_SLOTS.map((s) => (
                <ImageCard key={s.type} title={s.title} data={images[s.type]} blessing={blessing} />
              ))}
            </div>

            {/* 점수 + 출처 (결과 단계) */}
            {step === "result" && score && selectedPattern && (
              <>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-sm border border-geum/30 bg-baek-pure p-6 shadow-card">
                    <ScoreGauge score={score.score} />
                    <ScoreBreakdown breakdown={score.breakdown} />
                    {!score.passed && (
                      <div className="mt-6 rounded-sm border border-hong/30 bg-hong-muted p-4">
                        <p className="mb-1 font-display text-sm text-hong">전통성 임계 미달 (70점 기준)</p>
                        <p className="text-[11px] text-hong/80">감성 형용사를 바꾸거나 사연을 보완하여 재생성하면 점수가 향상됩니다.</p>
                        <button type="button" onClick={handleRegenerate}
                          className="mt-3 w-full rounded-full bg-hong py-2.5 text-xs font-bold text-baek transition hover:bg-hong-light">재생성하기 →</button>
                      </div>
                    )}
                  </div>

                  <div className="rounded-sm border border-cheong/20 bg-cheong/5 p-6">
                    <p className="mb-4 font-latin text-xs font-semibold uppercase tracking-[0.18em] text-cheong">출처 각주 (민속대백과)</p>
                    <div className="rounded-sm border border-cheong/20 bg-baek-pure p-4 text-xs leading-relaxed text-muk/70">
                      <p className="mb-1 font-display text-sm text-muk">[{selectedPattern.name}]</p>
                      <p>{score.encykoreaRef}</p>
                      <p className="mt-2 text-[11px] text-muk/40">출처: 한국민족문화대백과사전 (encykorea.aks.ac.kr) — 한국학중앙연구원 제공</p>
                    </div>
                    <div className="mt-5 space-y-2 text-[11px] text-muk/55">
                      <p className="font-semibold text-muk/70">활용 데이터 라이선스</p>
                      <p><span className="text-geum-light">◦</span> 전통문양 AI학습데이터: 공공누리 제1유형</p>
                      <p><span className="text-geum-light">◦</span> 전통복식 한복: 문화공공데이터광장 개방</p>
                      <p><span className="text-geum-light">◦</span> 민속대백과: 한국학중앙연구원 공공데이터</p>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: "정규화", mode: normalize?.mode },
                        { label: "생성", mode: anyReal ? "real" : "mock" },
                        { label: "점수", mode: score.mode },
                      ].map((m) => (
                        <div key={m.label} className="rounded-sm border border-geum/20 bg-baek-pure p-2">
                          <p className="text-[10px] text-muk/40">{m.label}</p>
                          <p className={`font-latin text-xs font-semibold ${m.mode === "real" ? "text-cheong" : "text-geum"}`}>{m.mode}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <button type="button" onClick={handleReset}
                    className="rounded-full border border-geum/30 px-6 py-2.5 text-sm font-semibold text-muk/70 transition hover:text-muk">다시 만들기</button>
                  <button type="button" onClick={() => window.print()}
                    className="rounded-full bg-cheong px-6 py-2.5 text-sm font-semibold text-baek shadow transition hover:bg-cheong-light">결과 저장 (인쇄)</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
