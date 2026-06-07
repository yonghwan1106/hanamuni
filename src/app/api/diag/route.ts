/**
 * /api/_diag — 임시 진단 엔드포인트 (배포 후 키 연동 점검용)
 * ?t=hanamuni-check 토큰 필요. 진단 완료 후 삭제 예정. 키 값은 노출하지 않음(길이만).
 */
import { NextRequest, NextResponse } from "next/server";

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

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": ak, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: "claude-haiku-4-5", max_tokens: 8, messages: [{ role: "user", content: "hi" }] }),
    });
    (out.anthropic as Record<string, unknown>).status = r.status;
    if (!r.ok) (out.anthropic as Record<string, unknown>).err = (await r.text()).slice(0, 200);
  } catch (e) {
    (out.anthropic as Record<string, unknown>).threw = String(e).slice(0, 200);
  }

  try {
    const r = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${ok}` },
    });
    (out.openai as Record<string, unknown>).status = r.status;
    if (!r.ok) (out.openai as Record<string, unknown>).err = (await r.text()).slice(0, 200);
  } catch (e) {
    (out.openai as Record<string, unknown>).threw = String(e).slice(0, 200);
  }

  return NextResponse.json(out);
}
