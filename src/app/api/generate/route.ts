/**
 * /api/generate
 * 감성 라벨 + 문양 → 전통문양 패턴 · 한복 착장 · 한글 굿즈 시안 3종 생성
 *
 * 주력 엔진: OpenAI GPT Image 2.0 (gpt-image-2)
 *   - 한글 텍스트 렌더 정확도 우수 → 굿즈 한글 축원 문구에 최적
 *   - 3종 이미지를 병렬 생성(Promise.all)으로 지연 최소화
 * 폴백: NANOBANANA_API_KEY(Gemini 2.5 Flash Image), 둘 다 없으면 mock(샘플 SVG)
 */

import { NextRequest, NextResponse } from "next/server";
import patternsData from "@/data/patterns.sample.json";

// 3종 이미지 병렬 생성이 기본 함수 타임아웃(10~15s)을 넘을 수 있어 상향.
// (Hobby 최대 60s. 병렬이라 실 소요 ≈ 가장 느린 1장 수준이지만 콜드스타트 여유 확보.)
export const maxDuration = 60;

export interface GenerateRequest {
  labels: string[];
  patternId?: string;
  story: string;
  blessing?: string;       // 굿즈에 새길 한글 축원 문구
}

export interface GenerateResponse {
  patternImageUrl: string;       // 전통문양 패턴 (생성 PNG data URI 또는 샘플 SVG 경로)
  hanbokImageUrl: string;        // 한복 착장 (생성 또는 mock)
  goodsImageUrl: string;         // 한글 굿즈 시안 (생성 또는 mock)
  blessing: string;              // 굿즈 문구(에코)
  selectedPattern: {
    id: string;
    name: string;
    meaning: string;
    encykoreaId: string;
  };
  matchedLabels: string[];
  engine: "gpt-image-2" | "nanobanana" | "mock";
  mode: "real" | "mock";
}

type Pattern = typeof patternsData[0];

function selectPattern(labels: string[], patternId?: string): Pattern {
  if (patternId) {
    const found = patternsData.find((p) => p.id === patternId);
    if (found) return found;
  }
  let best = patternsData[0];
  let bestScore = 0;
  for (const pattern of patternsData) {
    const score = labels.filter((l) => pattern.emotions.includes(l)).length;
    if (score > bestScore) { bestScore = score; best = pattern; }
  }
  return best;
}

// ── 프롬프트 ─────────────────────────────────────────────
function patternPrompt(p: Pattern): string {
  return `한국 전통문양 "${p.name}"의 seamless 반복 패턴 타일. ${p.meaning.slice(0, 50)}. `
    + `전통 오방색(${p.colorPalette.join("·")}) 조화, 평면 그래픽 디자인, 또렷한 윤곽선, `
    + `흰 배경, 정교한 고해상도, 텍스트·워터마크 없이.`;
}
function hanbokPrompt(p: Pattern, labels: string[], story: string): string {
  return `한국 전통 한복 착장 일러스트레이션. 옷감에 전통문양 "${p.name}"(${p.meaning.slice(0, 30)}) 패턴. `
    + `감성: ${labels.join(", ")}. 사연: ${story.slice(0, 100)}. `
    + `전통 오방색 조화, 한복 구조(고름·배래·깃·동정) 정확히, 흰 배경, 정면 전신, `
    + `고급 스튜디오 조명, 사진처럼 정교한 8K. 텍스트·워터마크 없이.`;
}
function goodsPrompt(p: Pattern, blessing: string): string {
  return `한국 전통 스타일 에코백(천 가방) 제품 목업 사진. 가방 전면에 전통문양 "${p.name}"을 은은히 배치하고, `
    + `중앙에 한글 문구 "${blessing}"를 정갈한 캘리그래피로 또렷하고 정확하게 인쇄. `
    + `미니멀 제품 사진, 부드러운 그림자, 밝은 흰 배경, 고급스러운 질감. 오타 없이 한글 정확히.`;
}

// ── mock SVG ─────────────────────────────────────────────
function mockSvg(label: string, sub: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="300" height="360">`
    + `<rect width="300" height="360" fill="#f8f4ef"/>`
    + `<rect x="40" y="40" width="220" height="240" rx="12" fill="#e8f0f8" stroke="#1a4a7a" stroke-width="2"/>`
    + `<circle cx="150" cy="160" r="60" fill="none" stroke="#b8860b" stroke-width="3"/>`
    + `<circle cx="150" cy="160" r="38" fill="none" stroke="#c0392b" stroke-width="2"/>`
    + `<text x="150" y="320" text-anchor="middle" font-size="14" fill="#1a4a7a" font-family="serif">${label}</text>`
    + `<text x="150" y="340" text-anchor="middle" font-size="9" fill="#b8860b" font-family="serif">${sub}</text>`
    + `</svg>`
  )}`;
}

// ── 생성기 (data URI 또는 null) ──────────────────────────
async function gptImage(prompt: string, apiKey: string, size: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-image-2", prompt, size, n: 1 }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (b64) return `data:image/png;base64,${b64}`;
    return data?.data?.[0]?.url ?? null;
  } catch { return null; }
}
async function nanoBanana(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const part = data.candidates?.[0]?.content?.parts?.find(
      (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData
    );
    return part?.inlineData?.data
      ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
  } catch { return null; }
}

// ── 경량 rate limit (in-memory 안전망: 서버 인스턴스 단위) ──
const RL_PER_IP = 6;                 // IP당 윈도우 내 최대 생성
const RL_WINDOW_MS = 10 * 60_000;    // 10분 윈도우
const RL_GLOBAL_PER_DAY = 300;       // 전역 일일 상한(비용 안전망)
const ipHits = new Map<string, number[]>();
let rlDay = "";
let rlDayCount = 0;
function checkRate(ip: string, now: number): { ok: boolean; msg?: string } {
  const day = new Date(now).toISOString().slice(0, 10);
  if (day !== rlDay) { rlDay = day; rlDayCount = 0; }
  if (rlDayCount >= RL_GLOBAL_PER_DAY)
    return { ok: false, msg: "오늘 데모 생성 한도에 도달했습니다. 내일 다시 시도해 주세요." };
  const arr = (ipHits.get(ip) ?? []).filter((t) => now - t < RL_WINDOW_MS);
  if (arr.length >= RL_PER_IP)
    return { ok: false, msg: "잠시 후 다시 시도해 주세요. (데모 생성 빈도 제한)" };
  arr.push(now); ipHits.set(ip, arr); rlDayCount += 1;
  return { ok: true };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = checkRate(ip, Date.now());
  if (!rl.ok) return NextResponse.json({ error: rl.msg }, { status: 429 });

  const body = (await req.json()) as GenerateRequest;
  const { labels = [], patternId, story, blessing = "복과 건강이 깃들기를" } = body;

  const pattern = selectPattern(labels, patternId);
  const matchedLabels = labels.filter((l) => pattern.emotions.includes(l)).slice(0, 3);

  const openaiKey = process.env.OPENAI_API_KEY;
  const nanoKey = process.env.NANOBANANA_API_KEY;

  // 엔진 선택: GPT Image 2.0 주력 → 나노바나나 폴백 → mock
  const gen = (prompt: string, size: string): Promise<string | null> =>
    openaiKey ? gptImage(prompt, openaiKey, size)
      : nanoKey ? nanoBanana(prompt, nanoKey)
      : Promise.resolve(null);

  // 3종 병렬 생성
  const [pat, han, goods] = await Promise.all([
    gen(patternPrompt(pattern), "1024x1024"),
    gen(hanbokPrompt(pattern, labels, story), "1024x1536"),
    gen(goodsPrompt(pattern, blessing), "1024x1024"),
  ]);

  const anyReal = Boolean(pat || han || goods);
  const engine: GenerateResponse["engine"] =
    !anyReal ? "mock" : openaiKey ? "gpt-image-2" : "nanobanana";

  return NextResponse.json({
    patternImageUrl: pat ?? pattern.imagePath,                 // 폴백: 샘플 SVG
    hanbokImageUrl: han ?? mockSvg("한복 착장 시안", "GPT Image 2.0 연결 시 실제 생성"),
    goodsImageUrl: goods ?? mockSvg("한글 굿즈 시안", `"${blessing}"`),
    blessing,
    selectedPattern: {
      id: pattern.id,
      name: pattern.name,
      meaning: pattern.meaning,
      encykoreaId: pattern.encykoreaId,
    },
    matchedLabels: matchedLabels.length > 0 ? matchedLabels : labels.slice(0, 3),
    engine,
    mode: anyReal ? "real" : "mock",
  } satisfies GenerateResponse);
}
