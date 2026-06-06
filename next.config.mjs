/** @type {import('next').NextConfig} */
// IMPORTANT: Turbopack은 의도적으로 비활성화합니다.
// 한글 경로 + Turbopack 조합이 panic을 일으킨 이력이 있어
// dev/build 모두 webpack 컴파일러를 사용합니다. (--turbopack 플래그 금지)
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  // workspace root 경고 제거 — 이 프로젝트 디렉터리를 명시
  outputFileTracingRoot: path.join(__dirname, "../../"),
  eslint: {
    // 프로토타입 빌드 차단 방지: 린트는 별도 단계에서 수행
    ignoreDuringBuilds: true,
  },
  images: {
    // mock 이미지 외부 도메인 허용 (향후 나노바나나 CDN 추가 예정)
    remotePatterns: [],
  },
};

export default nextConfig;
