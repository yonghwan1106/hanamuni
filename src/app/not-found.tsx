import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-6xl font-extrabold text-geum mb-4">花</p>
      <h1 className="text-2xl font-bold text-muk mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-sm text-muk/50 mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-hong px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-hong-light"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
