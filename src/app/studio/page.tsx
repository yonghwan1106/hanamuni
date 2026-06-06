"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { NormalizeResponse } from "@/app/api/normalize/route";
import type { GenerateResponse } from "@/app/api/generate/route";
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

// ── 타입 ──────────────────────────────────────────────────────────
type Step = "input" | "generating" | "result";

interface ResultState {
  normalize: NormalizeResponse;
  generate: GenerateResponse;
  score: ScoreResponse;
}

// ── 점수 게이지 컴포넌트 ──────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const color =
    score >= 85 ? "#2d6d3a" :
    score >= 70 ? "#b8860b" :
    "#c0392b";

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <span className="text-xs font-semibold text-muk/60">전통성 점수</span>
        <span className="text-2xl font-extrabold" style={{ color }}>
          {score}
          <span className="ml-0.5 text-sm font-normal text-muk/40">/ 100</span>
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-baek border border-geum/20">
        <div
          className="score-bar h-full rounded-full"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <p className="text-[11px] text-muk/50">
        {score >= 85
          ? "우수 — 고증이 탁월하여 굿즈·상업 이용 최적"
          : score >= 70
          ? "양호 — 전통성 기준 통과, 이용 가능"
          : "미달 — 재생성을 권장합니다"}
      </p>
    </div>
  );
}

// ── 세부 점수 분해 컴포넌트 ───────────────────────────────────────
function ScoreBreakdown({ breakdown }: { breakdown: ScoreResponse["breakdown"] }) {
  const items = [
    { label: "감성 매칭", value: breakdown.emotionMatch, max: 40 },
    { label: "문양 고증", value: breakdown.patternAuth, max: 35 },
    { label: "한복 구조", value: breakdown.structureScore, max: 25 },
  ];
  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-semibold text-muk/50">점수 세부 내역</p>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-[11px] text-muk/60">{item.label}</span>
          <div className="flex-1 h-2 overflow-hidden rounded-full bg-geum/10">
            <div
              className="h-full rounded-full bg-geum transition-all duration-700"
              style={{ width: `${(item.value / item.max) * 100}%` }}
            />
          </div>
          <span className="w-10 text-right text-xs font-semibold text-geum">
            {item.value}/{item.max}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── 메인 스튜디오 페이지 ─────────────────────────────────────────
export default function StudioPage() {
  const [step, setStep] = useState<Step>("input");
  const [story, setStory] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [result, setResult] = useState<ResultState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleChip = useCallback((chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!story.trim() && selectedChips.length === 0) {
      setError("사연이나 감성 형용사를 하나 이상 선택해 주세요.");
      return;
    }
    setError(null);
    setStep("generating");

    try {
      // 1) 감성 정규화
      const normRes = await fetch("/api/normalize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ story, chips: selectedChips }),
      });
      if (!normRes.ok) throw new Error("감성 정규화 실패");
      const normalize: NormalizeResponse = await normRes.json();

      // 2) 이미지 생성
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ labels: normalize.labels, story, blessing: normalize.blessing }),
      });
      if (!genRes.ok) {
        const errBody = await genRes.json().catch(() => null);
        throw new Error(errBody?.error || "이미지 생성 실패");
      }
      const generate: GenerateResponse = await genRes.json();

      // 3) 전통성 점수 산정
      const scoreRes = await fetch("/api/score", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          patternId: generate.selectedPattern.id,
          labels: normalize.labels,
          story,
        }),
      });
      if (!scoreRes.ok) throw new Error("점수 산정 실패");
      const score: ScoreResponse = await scoreRes.json();

      setResult({ normalize, generate, score });
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "생성 중 오류가 발생했습니다.");
      setStep("input");
    }
  }, [story, selectedChips]);

  const handleReset = useCallback(() => {
    setStep("input");
    setResult(null);
    setError(null);
  }, []);

  // generate-and-filter 재생성 — 동일 입력으로 파이프라인 재실행(GPT Image는 확률적 생성)
  const handleRegenerate = useCallback(() => {
    void handleGenerate();
  }, [handleGenerate]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* 페이지 제목 */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-geum">
          Creation Studio
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-muk sm:text-3xl">
          내 사연으로 문양 짓기
        </h1>
        <p className="mt-2 text-sm text-muk/55">
          사연을 입력하고 감성을 선택하면, 전통문양과 한복 착장을 생성합니다.
        </p>
      </div>

      {/* ── 입력 단계 ── */}
      {(step === "input" || step === "generating") && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* 좌: 입력 폼 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 사연 입력 */}
            <div className="rounded-2xl border border-geum/15 bg-white p-6 shadow-card">
              <label className="mb-3 block text-sm font-bold text-muk">
                사연 · 감정 입력
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="특별한 이야기를 적어주세요. (예: 부모님 결혼기념일, 졸업 선물, 돌아가신 분을 그리며…)"
                rows={5}
                className="w-full resize-none rounded-xl border border-geum/20 bg-baek px-4 py-3 text-sm text-muk placeholder-muk/30 outline-none focus:border-cheong focus:ring-2 focus:ring-cheong/20 transition"
                disabled={step === "generating"}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {STORY_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStory(ex)}
                    disabled={step === "generating"}
                    className="rounded-full border border-geum/20 bg-geum-muted px-2.5 py-1 text-[11px] text-geum hover:bg-geum/20 transition disabled:opacity-40"
                  >
                    예시 {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* 감성 칩 선택 */}
            <div className="rounded-2xl border border-geum/15 bg-white p-6 shadow-card">
              <label className="mb-1 block text-sm font-bold text-muk">
                감성 형용사 선택
              </label>
              <p className="mb-4 text-xs text-muk/45">
                어울리는 감성을 복수 선택할 수 있습니다
              </p>
              <div className="flex flex-wrap gap-2">
                {EMOTION_CHIPS.map((chip) => {
                  const active = selectedChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleChip(chip)}
                      disabled={step === "generating"}
                      className={`emotion-chip rounded-full border px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${
                        active
                          ? "border-hong bg-hong text-white shadow-sm"
                          : "border-geum/25 bg-baek text-muk/70 hover:border-hong/40 hover:text-hong"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
              {selectedChips.length > 0 && (
                <p className="mt-3 text-[11px] text-muk/45">
                  선택됨: {selectedChips.join(" · ")}
                </p>
              )}
            </div>

            {/* 오류 메시지 */}
            {error && (
              <div className="rounded-xl border border-hong/30 bg-hong-muted px-4 py-3 text-sm text-hong">
                {error}
              </div>
            )}

            {/* 생성 버튼 */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={step === "generating"}
              className="w-full rounded-xl bg-hong py-4 text-sm font-bold text-white shadow-lg transition hover:bg-hong-light active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {step === "generating" ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="hanamuni-spinner inline-block !w-5 !h-5 !border-2" />
                  문양을 짓는 중…
                </span>
              ) : (
                "전통문양 생성하기 →"
              )}
            </button>
          </div>

          {/* 우: 안내 패널 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-geum/15 bg-white p-5 shadow-card">
              <p className="text-xs font-bold text-geum uppercase tracking-widest mb-3">
                생성 파이프라인
              </p>
              {[
                { n: "1", label: "Claude", desc: "사연→감성 라벨 정규화" },
                { n: "2", label: "GPT Image 2.0", desc: "전통문양 패턴·한복 생성" },
                { n: "3", label: "Validator", desc: "전통성 점수 산정·출처 각주" },
              ].map((s) => (
                <div key={s.n} className="flex gap-3 mb-3 last:mb-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cheong text-[10px] font-black text-white">
                    {s.n}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-muk">{s.label}</p>
                    <p className="text-[11px] text-muk/50">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-cheong/20 bg-cheong/5 p-5">
              <p className="text-xs font-bold text-cheong mb-2">mock 모드 안내</p>
              <p className="text-[11px] leading-relaxed text-muk/60">
                API 키 없이도 규칙 기반 감성 분류와 샘플 SVG 문양으로
                end-to-end 흐름을 체험할 수 있습니다.
                키 발급 후 <code className="bg-cheong/10 px-1 rounded">.env.local</code>에
                입력하면 실제 AI 생성으로 전환됩니다.
              </p>
            </div>

            <div className="rounded-2xl border border-geum/15 bg-white p-5 shadow-card">
              <p className="text-xs font-bold text-geum mb-2">활용 데이터</p>
              <ul className="space-y-1.5 text-[11px] text-muk/55">
                <li>● 전통문양 AI학습데이터 22만건 (감성 라벨)</li>
                <li>● 전통복식 한복 10,163건 360°8K</li>
                <li>● 민속대백과 QA (고증 RAG)</li>
                <li>● 전통문양조회 API</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── 결과 단계 ── */}
      {step === "result" && result && (
        <div className="space-y-6">
          {/* 상단: mock/real 배지 */}
          <div className="flex items-center justify-between">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                result.generate.mode === "real"
                  ? "bg-cheong/10 text-cheong"
                  : "bg-geum-muted text-geum"
              }`}
            >
              {result.generate.mode === "real" ? "실모드 · AI 생성" : "mock 모드 · 샘플 생성"}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-geum/25 px-4 py-1.5 text-xs font-semibold text-muk/60 hover:text-muk transition"
            >
              ← 다시 만들기
            </button>
          </div>

          {/* 사연 요약 */}
          <div className="rounded-2xl border border-geum/15 bg-white p-5 shadow-card">
            <p className="text-xs font-semibold text-geum mb-1">사연 분석 요약</p>
            <p className="text-sm text-muk leading-relaxed">{result.normalize.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {result.normalize.labels.map((l) => (
                <span
                  key={l}
                  className="rounded-full bg-hong/10 px-2.5 py-1 text-[11px] font-semibold text-hong"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* 결과 카드 */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 전통문양 이미지 */}
            <div className="rounded-2xl border border-geum/15 bg-white p-6 shadow-card">
              <p className="text-xs font-bold text-geum uppercase tracking-widest mb-4">
                전통문양 패턴
              </p>
              <div className="flex items-center justify-center rounded-xl bg-baek p-6 border border-geum/10 mb-4">
                {result.generate.patternImageUrl.startsWith("data:") ? (
                  // 생성된 문양(PNG data URI) — img로 직접 렌더
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.generate.patternImageUrl}
                    alt={result.generate.selectedPattern.name}
                    className="h-40 w-40 object-contain rounded-lg"
                  />
                ) : (
                  <Image
                    src={result.generate.patternImageUrl}
                    alt={result.generate.selectedPattern.name}
                    width={200}
                    height={200}
                    className="h-40 w-40 object-contain"
                  />
                )}
              </div>
              <h3 className="text-lg font-bold text-muk">
                {result.generate.selectedPattern.name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muk/60">
                {result.generate.selectedPattern.meaning}
              </p>
              {/* 감성 매칭 top-3 */}
              {result.generate.matchedLabels.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-muk/40 self-center">매칭 감성:</span>
                  {result.generate.matchedLabels.map((l) => (
                    <span
                      key={l}
                      className="rounded-full border border-cheong/25 bg-cheong/5 px-2 py-0.5 text-[11px] font-semibold text-cheong"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 한복 착장 이미지 */}
            <div className="rounded-2xl border border-geum/15 bg-white p-6 shadow-card">
              <p className="text-xs font-bold text-geum uppercase tracking-widest mb-4">
                한복 착장 시안
              </p>
              <div className="flex items-center justify-center rounded-xl bg-baek p-4 border border-geum/10 mb-4 min-h-[200px]">
                {result.generate.hanbokImageUrl.startsWith("data:") ? (
                  // data URI(SVG mock / PNG 실생성) — Next Image 최적화 우회, img로 직접 렌더
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.generate.hanbokImageUrl}
                    alt="한복 착장 시안"
                    className="h-48 w-auto object-contain"
                  />
                ) : (
                  <Image
                    src={result.generate.hanbokImageUrl}
                    alt="한복 착장 시안"
                    width={200}
                    height={280}
                    className="h-48 w-auto object-contain"
                  />
                )}
              </div>
              <p className="text-xs text-muk/40 text-center">
                {result.generate.mode === "mock"
                  ? "GPT Image 2.0 API 연결 시 실제 한복 이미지 생성"
                  : `${result.generate.engine === "nanobanana" ? "나노바나나(Gemini 2.5 Flash)" : "GPT Image 2.0"} 실시간 생성`}
              </p>
            </div>

            {/* 한글 굿즈 시안 */}
            <div className="rounded-2xl border border-geum/15 bg-white p-6 shadow-card">
              <p className="text-xs font-bold text-geum uppercase tracking-widest mb-4">
                한글 굿즈 시안
              </p>
              <div className="flex items-center justify-center rounded-xl bg-baek p-4 border border-geum/10 mb-4 min-h-[200px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.generate.goodsImageUrl}
                  alt="한글 굿즈 시안"
                  className="h-48 w-auto object-contain rounded-lg"
                />
              </div>
              <p className="text-sm text-center text-muk/70">
                새김 문구 <span className="font-bold text-hong">&ldquo;{result.generate.blessing}&rdquo;</span>
              </p>
              <p className="mt-1 text-[11px] text-muk/40 text-center">
                GPT Image 2.0 한글 렌더링 — 굿즈·기념품 즉시 상품화
              </p>
            </div>
          </div>

          {/* 전통성 점수 + 출처 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 점수 패널 */}
            <div className="rounded-2xl border border-geum/20 bg-white p-6 shadow-card">
              <ScoreGauge score={result.score.score} />
              <ScoreBreakdown breakdown={result.score.breakdown} />

              {!result.score.passed && (
                <div className="mt-5 rounded-xl border border-hong/25 bg-hong-muted p-3">
                  <p className="text-xs font-semibold text-hong mb-1">
                    전통성 임계 미달 (70점 기준)
                  </p>
                  <p className="text-[11px] text-hong/80">
                    감성 형용사를 바꾸거나 사연을 보완하여 재생성하면 점수가 향상됩니다.
                  </p>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    className="mt-3 w-full rounded-lg bg-hong py-2 text-xs font-bold text-white transition hover:bg-hong-light"
                  >
                    재생성하기 →
                  </button>
                </div>
              )}
            </div>

            {/* 출처 각주 */}
            <div className="rounded-2xl border border-cheong/15 bg-cheong/5 p-6">
              <p className="text-xs font-bold text-cheong uppercase tracking-widest mb-4">
                출처 각주 (민속대백과)
              </p>
              <div className="rounded-xl border border-cheong/20 bg-white p-4 text-xs leading-relaxed text-muk/70">
                <p className="font-semibold text-muk mb-1">
                  [{result.generate.selectedPattern.name}]
                </p>
                <p>{result.score.encykoreaRef}</p>
                <p className="mt-2 text-[11px] text-muk/40">
                  출처: 한국민족문화대백과사전 (encykorea.aks.ac.kr) — 한국학중앙연구원 제공
                </p>
              </div>

              <div className="mt-4 space-y-2 text-[11px] text-muk/55">
                <p className="font-semibold text-muk/70">활용 데이터 라이선스</p>
                <p>● 전통문양 AI학습데이터: 공공누리 제1유형</p>
                <p>● 전통복식 한복: 문화공공데이터광장 개방</p>
                <p>● 민속대백과: 한국학중앙연구원 공공데이터</p>
              </div>

              {/* 생성 파이프라인 모드 표시 */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "정규화", mode: result.normalize.mode },
                  { label: "생성", mode: result.generate.mode },
                  { label: "점수", mode: result.score.mode },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-white border border-geum/15 p-2">
                    <p className="text-[10px] text-muk/40">{m.label}</p>
                    <p className={`text-[11px] font-semibold ${m.mode === "real" ? "text-cheong" : "text-geum"}`}>
                      {m.mode}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 액션 */}
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-geum/25 px-5 py-2.5 text-sm font-semibold text-muk/70 hover:text-muk transition"
            >
              다시 만들기
            </button>
            <button
              type="button"
              className="rounded-xl bg-cheong px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-cheong-light"
              onClick={() => window.print()}
            >
              결과 저장 (인쇄)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
