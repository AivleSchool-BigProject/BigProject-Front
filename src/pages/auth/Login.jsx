// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import namingLogoImg from "../../Image/login_image/네이밍_로고_추천.png";
import analyzeCompany from "../../Image/login_image/기업 초기 진단.png";
import analyzeReport from "../../Image/login_image/진단분석리포트.png";
import makeset from "../../Image/login_image/문서초안생성.png";
import story from "../../Image/login_image/스토리텔링.png";

import PolicyModal from "../../components/policy/PolicyModal.jsx";
import { PrivacyContent, TermsContent } from "../../components/policy/PolicyContents.jsx";
import EasyLoginModal from "../../components/auth/EasyLoginModal.jsx";
// 2025-01-19
// API 클라이언트 import 추가
import { apiRequest, setAccessToken } from "../../api/client.js";
import { setCurrentUserId, setIsLoggedIn } from "../../api/auth.js";

export default function LoginApp() {
  const navigate = useNavigate();

  // "privacy" | "terms" | null
  const [openType, setOpenType] = useState(null);
  const closeModal = () => setOpenType(null);

  // 간편로그인 모달
  // 2026-01-19
  // loginId, password, error, loading 상태 추가
  const [easyOpen, setEasyOpen] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2026-01-19
  // API 호출 + 토큰 저장 로직 + 에러 메시지
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!loginId.trim() || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        // 2026-01-19
        // 백엔드와 같은 이름 사용
        data: {
          loginId: loginId.trim(),
          password: password,
        },
      });
      const token =
        data?.accessToken ||
        data?.token ||
        data?.access_token ||
        data?.jwt ||
        data?.jwtToken;
      if (token) setAccessToken(token);
      setCurrentUserId(data?.userId || data?.loginId || loginId.trim());
      setIsLoggedIn(true);
      navigate("/main");
    } catch {
      setError("로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page navy">
      {/* 개인정보/약관 모달 */}
      <PolicyModal
        open={openType === "privacy"}
        title="개인정보 처리방침"
        onClose={closeModal}
      >
        <PrivacyContent />
      </PolicyModal>

      <PolicyModal
        open={openType === "terms"}
        title="이용약관"
        onClose={closeModal}
      >
        <TermsContent />
      </PolicyModal>

      {/* 간편로그인 모달 */}
      <EasyLoginModal open={easyOpen} onClose={() => setEasyOpen(false)} />

      <div className="login-shell split">
        <section className="login-hero navy-panel">
          <div className="hero-top">
            <span className="hero-title-line">여러분의 브랜드의 시작</span>
            <span className="hero-title-line">BRANDPILOT과 함께 합니다</span>
          </div>

          <div className="feature-marquee" aria-label="서비스 핵심 기능">
            <div className="marquee-track">
              <div className="marquee-card">
                <img src={namingLogoImg} alt="네이밍 로고 추천" />
                <strong>네이밍·로고 추천</strong>
                <p>
                  입력 항목에 맞는 네이밍과 로고를 추천해드립니다.
                </p>
              </div>

              <div className="marquee-card">
                <img src={analyzeCompany} alt="기업 초기 진단" />
                <strong>기업 진단 분석</strong>
                <p>초기 상황을 분석해 최적의 안을 제안해드립니다.</p>
              </div>

              <div className="marquee-card">
                <img src={analyzeReport} alt="진단 분석 리포트" />
                <strong>분석 리포트 제공</strong>
                <p>분석 내용 기반 리포트를 제공합니다.</p>
              </div>

              <div className="marquee-card">
                <img src={makeset} alt="문서 초안 자동 생성" />
                <strong>문서 초안 자동 생성</strong>
                <p>사업계획서·IR 등 문서 초안을 자동 생성합니다.</p>
              </div>

              <div className="marquee-card">
                <img src={story} alt="스토리텔링" />
                <strong>브랜드 스토리텔링</strong>
                <p>기업 관점의 소개글과 홍보글을 생성합니다.</p>
              </div>

              {/* 앞쪽 카드 반복 */}
              <div className="marquee-card">
                <img src={namingLogoImg} alt="네이밍 로고 추천" />
                <strong>네이밍·로고 추천</strong>
                <p>
                  입력 항목에 맞는 네이밍과 로고를 추천해드립니다.
                </p>
              </div>
              <div className="marquee-card">
                <img src={analyzeCompany} alt="기업 초기 진단" />
                <strong>기업 진단 분석</strong>
                <p>초기 상황을 분석해 최적의 안을 제안해드립니다.</p>
              </div>
              <div className="marquee-card">
                <img src={analyzeReport} alt="진단 분석 리포트" />
                <strong>분석 리포트 제공</strong>
                <p>분석 내용 기반 리포트를 제공합니다.</p>
              </div>
              <div className="marquee-card">
                <img src={makeset} alt="문서 초안 자동 생성" />
                <strong>문서 초안 자동 생성</strong>
                <p>사업계획서·IR 등 문서 초안을 자동 생성합니다.</p>
              </div>
              <div className="marquee-card">
                <img src={story} alt="스토리텔링" />
                <strong>브랜드 스토리텔링</strong>
                <p>기업 관점의 소개글과 홍보글을 생성합니다.</p>
              </div>
            </div>
          </div>

          <footer className="hero-footer">
            <div className="hero-footer-links">
              <button
                type="button"
                className="hero-footer-link"
                onClick={() => setOpenType("privacy")}
              >
                개인정보 처리방침
              </button>
              <span className="hero-footer-sep">|</span>
              <button
                type="button"
                className="hero-footer-link"
                onClick={() => setOpenType("terms")}
              >
                이용약관
              </button>
            </div>

            <div className="hero-footer-text">
              <div>
                <strong>BRANDPILOT</strong>
              </div>
              <div>BRANDPILOT | 서울특별시 송파구 문정로 8번길 30</div>
              <div>KT AIVLE 7기 15조</div>
              <div className="hero-footer-copy">
                © 2026 Team15 Corp. All rights reserved.
              </div>
            </div>
          </footer>
        </section>

        <section className="login-panel light-panel">
          <h2>LOGIN</h2>

          {/*
          2026-01-19
          - 아이디 e-mail -> id
          - 아이디를 이메일로 할 경우 개인정보 관련해서 문제가 발생할 수 있어 아이디를 백엔드에 맞춤.
          */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="login-id">아이디 (Login ID)</label>
              <input
                id="login-id"
                type="text"
                placeholder="아이디 입력"
                autoComplete="username"
                // 2026-01-19
                // axios 로그인 요청에 사용할 loginId 상태와 input 연동
                // 로딩 중 중복 요청 방지를 위해 버튼 비활성화
                value={loginId}
                onChange={(event) => setLoginId(event.target.value)}
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="login-password">비밀번호</label>
              <input
                id="login-password"
                type="password"
                placeholder="비밀번호 입력"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                // 2026-01-19
                // 로딩 중 중복 요청 방지를 위해 버튼 비활성화
                disabled={loading}
              />
            </div>

            <div className="login-links">
              <button type="button" onClick={() => navigate("/findid")}
              >
                아이디 찾기
              </button>
              <span className="dot" aria-hidden="true" />
              <button type="button" onClick={() => navigate("/findpw")}
              >
                비밀번호 찾기
              </button>
            </div>

            {/* 2026-01-19 : 에러메시지 표시 */}
            {error ? <p className="error">{error}</p> : null}

            <button
              type="submit"
              className="login-primary"
              disabled={loading}
            >
              로그인
            </button>

            {/* 간편로그인 모달 띄우기 */}
            <button
              type="button"
              className="login-easy"
              onClick={() => setEasyOpen(true)}
              // 2026-01-19
              // 로딩 중 중복 요청 방지를 위해 버튼 비활성화
              disabled={loading}
            >
              간편로그인
            </button>

            {/* (모달 대신 페이지 이동) */}
            {/* <button type="button" className="login-easy" onClick={() => navigate("/easylogin")}>
              간편로그인
            </button> */}

            <div className="login-divider" />

            <div className="signup-row">
              <div className="signup-copy">
                회원가입하고 <strong>BrandPilot</strong>과<br />
                <strong>더 많은 컨설팅</strong>을 받아보세요.
              </div>
              <button
                type="button"
                className="signup-cta"
                onClick={() => navigate("/auth/register")}
                disabled={loading}
              >
                회원가입
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}