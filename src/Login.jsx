export default function LoginApp() {
  return (
    <div className="login-page navy">
      <div className="login-shell split">
        <section className="login-hero navy-panel">
          <div className="hero-top">
            <span className="hero-title-line">여러분의 새로운 시작</span>
            <span className="hero-title-line">BRANDPILOT이 함께 합니다.</span>
          </div>
          <div className="feature-marquee" aria-label="서비스 핵심 기능">
            <div className="marquee-track">
              <span className="chip">AI 브랜드 진단 리포트</span>
              <span className="chip">인터뷰 인사이트 요약</span>
              <span className="chip">네이밍·로고 추천</span>
              <span className="chip">홈페이지 템플릿 제작</span>
              <span className="chip">사업계획서·IR 초안</span>

              {/* 끊김 방지: 동일 문구 반복 */}
              <span className="chip">AI 브랜드 진단 리포트</span>
              <span className="chip">인터뷰 인사이트 요약</span>
              <span className="chip">네이밍·로고 추천</span>
              <span className="chip">홈페이지 템플릿 제작</span>
              <span className="chip">사업계획서·IR 초안</span>
            </div>
          </div>
          <footer className="hero-footer">
            <div className="hero-footer-links">
              <button type="button" className="hero-footer-link">개인정보 처리방침</button>
              <span className="hero-footer-sep">|</span>
              <button type="button" className="hero-footer-link">이용약관</button>
            </div>

            <div className="hero-footer-text">
              <div><strong>BRANDPILOT</strong></div>
              <div>BRANDPILOT | 대전광역시 서구 문정로48번길 30 (탄방동, KT타워)</div>
              <div>KT AIVLE 7반 15조 </div>
              <div className="hero-footer-copy">© 2026 Team15 Corp. All rights reserved.</div>
            </div>

          </footer>
        </section>

        <section className="login-panel light-panel">
          <h2>LOGIN</h2>
          <form className="login-form">
            <div className="field">
              <label htmlFor="login-id">아이디 (E-mail 계정)</label>
              <input id="login-id" type="text" placeholder="이메일 아이디" />
            </div>
            <div className="field">
              <label htmlFor="login-password">비밀번호</label>
              <input
                id="login-password"
                type="password"
                placeholder="비밀번호 입력"
              />
            </div>
            <div className="login-links">
              <button type="button">아이디 찾기</button>
              <span className="dot" aria-hidden="true" />
              <button type="button">비밀번호 찾기</button>
            </div>
            <button type="submit" className="login-primary">
              로그인
            </button>
            <button type="button" className="login-easy">
              간편로그인
            </button>
            <div className="login-divider" />
            <div className="signup-row">
              <div className="signup-copy">
                회원가입하고 <strong>BrandPliot</strong>의
                <br></br>
                <strong>더 많은 컨설팅</strong>를 받아보세요!
              </div>
              <button type="button" className="signup-cta">
                회원가입
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
