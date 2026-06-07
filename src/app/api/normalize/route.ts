/**
 * /api/normalize
 * 사연 텍스트 + 감성 형용사 칩 → 감성 라벨 정규화 + 한글 축원 문구
 *
 * 실모드: ANTHROPIC_API_KEY 존재 시 Claude API 호출
 * mock모드: 키 없으면 규칙 기반 결정적 응답 반환
 */

import { NextRequest, NextResponse } from "next/server";

export interface NormalizeRequest {
  story: string;          // 사용자 사연 텍스트
  chips: string[];        // 선택된 감성 형용사 칩
}

export interface NormalizeResponse {
  labels: string[];       // 정규화된 감성 라벨 top-5
  summary: string;        // 사연 요약 (1~2문장)
  blessing: string;       // 굿즈에 새길 한글 축원 문구 (6~14자)
  mode: "real" | "mock";
}

// 감성 키워드 → 라벨 매핑 (mock 규칙 기반)
const KEYWORD_MAP: Record<string, string[]> = {
  결혼: ["길한", "화려한", "정겨운"],
  혼례: ["길한", "화려한", "장중한"],
  돌아가신: ["엄숙한", "장중한", "고결한"],
  부모님: ["정겨운", "엄숙한", "단아한"],
  감사: ["정겨운", "길한", "청명한"],
  기념: ["길한", "정겨운", "화려한"],
  생일: ["길한", "화려한", "정겨운"],
  슬픔: ["엄숙한", "고결한", "단아한"],
  기쁨: ["길한", "화려한", "생동감 있는"],
  사랑: ["화려한", "정겨운", "길한"],
  고향: ["정겨운", "단아한", "청명한"],
  자연: ["청명한", "단아한", "생동감 있는"],
  새해: ["길한", "장중한", "화려한"],
  졸업: ["청명한", "길한", "생동감 있는"],
};

// 키워드 → 축원 문구 (mock)
const BLESSING_MAP: Record<string, string> = {
  결혼: "백년해로 하소서",
  혼례: "백년가약 영원히",
  돌아가신: "고이 잠드소서",
  부모님: "강녕하시기를",
  생일: "만수무강 하소서",
  졸업: "앞길에 꽃길만",
  새해: "복 많이 받으세요",
  돌잔치: "무병장수 하거라",
};

const ALL_LABELS = [
  "단아한", "화려한", "정겨운", "엄숙한", "길한",
  "장중한", "고결한", "청명한", "생동감 있는", "풍요로운",
  "신비로운", "익살스러운",
];

function mockNormalize(story: string, chips: string[]): NormalizeResponse {
  const found: string[] = [...chips];
  for (const [kw, labels] of Object.entries(KEYWORD_MAP)) {
    if (story.includes(kw)) {
      for (const l of labels) if (!found.includes(l)) found.push(l);
    }
  }
  if (found.length < 3) {
    for (const l of ALL_LABELS) {
      if (!found.includes(l)) {
        found.push(l);
        if (found.length >= 5) break;
      }
    }
  }
  const labels = found.slice(0, 5);
  const summary =
    story.length > 10
      ? `${story.slice(0, 30).trim()}${story.length > 30 ? "…" : ""}에 담긴 감성을 전통문양으로 표현합니다.`
      : "소중한 사연을 전통문양으로 담아드립니다.";

  let blessing = "복과 건강이 깃들기를";
  for (const [kw, b] of Object.entries(BLESSING_MAP)) {
    if (story.includes(kw)) { blessing = b; break; }
  }

  return { labels, summary, blessing, mode: "mock" };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as NormalizeRequest;
  const { story = "", chips = [] } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log("[normalize] hasKey=", !!apiKey, "len=", apiKey?.length ?? 0);

  if (apiKey) {
    try {
      const prompt = `당신은 한국 전통문양 감성 분류 전문가입니다.
아래 사연과 감성 형용사를 분석하여 (1)전통문양 감성 라벨 top-5, (2)사연 요약, (3)굿즈에 새길 한글 축원 문구를 반환하세요.

사연: ${story}
선택된 감성: ${chips.join(", ")}

가능한 라벨: ${ALL_LABELS.join(", ")}
축원 문구 규칙: 사연에 어울리는 한국 전통 정서의 짧은 축원/기원 문구(6~14자, 한글), 예) "백년해로 하소서", "만수무강 하소서".

JSON으로만 응답하세요:
{"labels": ["라벨1","라벨2","라벨3","라벨4","라벨5"], "summary": "1~2문장 요약", "blessing": "축원 문구"}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 320,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text ?? "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            labels: parsed.labels ?? [],
            summary: parsed.summary ?? "",
            blessing: parsed.blessing ?? "복과 건강이 깃들기를",
            mode: "real",
          } satisfies NormalizeResponse);
        }
        console.error("[normalize] no JSON in response");
      } else {
        console.error("[normalize] anthropic status=", res.status, (await res.text()).slice(0, 150));
      }
    } catch (e) {
      console.error("[normalize] threw:", String(e).slice(0, 200));
    }
  }

  return NextResponse.json(mockNormalize(story, chips));
}
