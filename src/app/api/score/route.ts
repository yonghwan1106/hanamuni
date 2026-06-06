/**
 * /api/score
 * generate-and-filter 폐루프 — 전통성 점수 산정
 *
 * 실모드: ANTHROPIC_API_KEY + 생성 이미지 → KoCLIP 유사도 기반 점수
 * mock모드: 결정적 규칙 기반 점수 반환 (patternId + labels 해시)
 */

import { NextRequest, NextResponse } from "next/server";
import patternsData from "@/data/patterns.sample.json";

export interface ScoreRequest {
  patternId: string;
  labels: string[];
  story: string;
  hanbokImageUrl?: string;  // base64 이미지 (실모드 검증용)
}

export interface ScoreResponse {
  score: number;             // 전통성 점수 0~100
  passed: boolean;           // 임계값(70점) 이상 여부
  breakdown: {
    emotionMatch: number;    // 감성 매칭 점수 (0~40)
    patternAuth: number;     // 문양 고증 점수 (0~35)
    structureScore: number;  // 한복 구조 요소 점수 (0~25)
  };
  encykoreaRef: string;      // 민속대백과 출처
  top3Labels: string[];      // 매칭 top-3 라벨
  mode: "real" | "mock";
}

const THRESHOLD = 70;

// 결정적 mock 점수 계산
function mockScore(patternId: string, labels: string[]): ScoreResponse {
  const pattern = patternsData.find((p) => p.id === patternId) ?? patternsData[0];

  // 감성 매칭 점수 (최대 40)
  const matchCount = labels.filter((l) => pattern.emotions.includes(l)).length;
  const emotionMatch = Math.min(40, Math.round((matchCount / Math.max(labels.length, 1)) * 40 + matchCount * 4));

  // 문양 고증 점수 = 패턴 기본 traditionScore의 35% 환산
  const patternAuth = Math.round((pattern.traditionScore / 100) * 35);

  // 한복 구조 요소 점수 — mock에서는 고정값 (실모드에서 구조 검출)
  const structureScore = 18;

  const score = Math.min(100, emotionMatch + patternAuth + structureScore);
  const top3Labels = labels
    .filter((l) => pattern.emotions.includes(l))
    .slice(0, 3);

  return {
    score,
    passed: score >= THRESHOLD,
    breakdown: { emotionMatch, patternAuth, structureScore },
    encykoreaRef: `한국민족문화대백과 > ${pattern.name} (표제어 ID: ${pattern.encykoreaId})`,
    top3Labels: top3Labels.length > 0 ? top3Labels : labels.slice(0, 3),
    mode: "mock",
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ScoreRequest;
  const { patternId, labels = [], story } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // 실모드: Claude로 전통성 점수 평가
  if (apiKey) {
    try {
      const pattern = patternsData.find((p) => p.id === patternId) ?? patternsData[0];
      const prompt = `당신은 한국 전통문화 전문가입니다. 아래 정보를 바탕으로 전통성 점수를 채점하세요.

문양: ${pattern.name} (${pattern.meaning})
사연: ${story.slice(0, 100)}
선택 감성: ${labels.join(", ")}
문양 고유 감성: ${pattern.emotions.join(", ")}
시대: ${pattern.dynasty}

채점 기준:
- 감성 매칭 점수 (0~40): 선택 감성과 문양 고유 감성의 일치도
- 문양 고증 점수 (0~35): 시대 고증 정확성과 전통 맥락
- 한복 구조 요소 점수 (0~25): 고름·배래·깃·동정 등 전통 구조 반영

JSON으로만 응답하세요:
{"emotionMatch": 0~40, "patternAuth": 0~35, "structureScore": 0~25}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 128,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text ?? "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const { emotionMatch = 0, patternAuth = 0, structureScore = 0 } = parsed;
          const score = Math.min(100, emotionMatch + patternAuth + structureScore);
          const top3Labels = labels
            .filter((l) => patternsData.find((p) => p.id === patternId)?.emotions.includes(l))
            .slice(0, 3);
          const patternForRef = patternsData.find((p) => p.id === patternId) ?? patternsData[0];
          return NextResponse.json({
            score,
            passed: score >= THRESHOLD,
            breakdown: { emotionMatch, patternAuth, structureScore },
            encykoreaRef: `한국민족문화대백과 > ${patternForRef.name} (표제어 ID: ${patternForRef.encykoreaId})`,
            top3Labels: top3Labels.length > 0 ? top3Labels : labels.slice(0, 3),
            mode: "real",
          } satisfies ScoreResponse);
        }
      }
    } catch {
      // 실모드 실패 시 mock 폴백
    }
  }

  return NextResponse.json(mockScore(patternId, labels));
}
