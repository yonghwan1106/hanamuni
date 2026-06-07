/**
 * /api/diag — 임시 진단 엔드포인트 (배포 후 키 연동 점검용)
 * ?t=hanamuni-check 토큰 필요. 진단 완료 후 삭제 예정. 키 값은 노출하지 않음(길이/prefix만).
 */
import { NextRequest, NextResponse } from "next/server";

const ALL_LABELS = [
  "단아한", "화려한", "정겨운", "엄숙한", "길한",
  "장중한", "고결한", "청명한", "생동감 있는", "풍요로운",
  "신비로운", "익살스러운",
];

export async function GET(req: NextRequest) {
  const t = new URL(req.url).searchParams.get("t");
  if (t !== "hanamuni-check") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const ak = process.env.ANTHROPIC_API_KEY || "";
  const ok = process.env.OPENAI_API_KEY || "";
  const out: Record<string, unknown> = {
    anthropic: { present: !!ak, len: ak.length, head: ak.slice(0, 7) },
    openai: { present: !!ok, len: ok.length, head: ok.slice(0, 7) },
  };

  // normalize와 동일한 Claude 호출 재현 (model/max_tokens/prompt 동일)
  try {
    const prompt = `당신은 한국 전통문양 감성 분류 전문가입니다.
아래 사연과 감성 형용사를 분석하여 (1)전통문양 감성 라벨 top-5, (2)사연 요약, (3)굿즈에 새길 한글 축원 문구를 반환하세요.

사연: 첫 아이 돌잔치를 앞두고 건강하게 자라길 바랍니다
선택된 감성: 길한, 화려한

가능한 라벨: ${ALL_LABELS.join(", ")}
축원 문구 규칙: 사연에 어울리는 한국 전통 정서의 짧은 축원/기원 문구(6~14자, 한글).

JSON으로만 응답하세요:
{"labels": ["라벨1","라벨2","라벨3","라벨4","라벨5"], "summary": "1~2문장 요약", "blessing": "축원 문구"}`;
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": ak, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: "claude-haiku-4-5", max_tokens: 256, messages: [{ role: "user", content: prompt }] }),
    });
    const probe: Record<string, unknown> = { status: r.status };
    const raw = await r.text();
    if (!r.ok) {
      probe.errBody = raw.slice(0, 300);
    } else {
      try {
        const data = JSON.parse(raw);
        const text = data.content?.[0]?.text ?? "";
        probe.stopReason = data.stop_reason;
        probe.textLen = text.length;
        probe.textHead = text.slice(0, 180);
        const m = text.match(/\{[\s\S]*\}/);
        probe.hasJsonMatch = !!m;
        if (m) {
          try { JSON.parse(m[0]); probe.parseOk = true; }
          catch (e) { probe.parseOk = false; probe.parseErr = String(e).slice(0, 100); }
        }
      } catch (e) {
        probe.bodyParseErr = String(e).slice(0, 120);
        probe.rawHead = raw.slice(0, 180);
      }
    }
    out.normProbe = probe;
  } catch (e) {
    out.normProbe = { threw: String(e).slice(0, 250) };
  }

  return NextResponse.json(out);
}
