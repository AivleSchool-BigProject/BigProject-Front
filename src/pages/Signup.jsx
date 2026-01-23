// src/pages/Signup.jsx
import React, { useMemo, useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

// ✅ 공통 푸터/약관 모달
import SiteFooter from "../components/SiteFooter.jsx";
import PolicyModal from "../components/PolicyModal.jsx";
import { PrivacyContent, TermsContent } from "../components/PolicyContents.jsx";
// 2026-01-19
// API 클라이언트 import
import { apiRequest, setAccessToken } from "../api/client.js";
import { setCurrentUserId, setIsLoggedIn } from "../api/auth.js";

export default function SignupApp() {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState(null);

  
  // ✅ 입력값 state (검증용)
  // 2026-01-19 : Id 추가
  const [loginId, setLoginId] = useState("");  
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // ✅ 약관 체크
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // ✅ 모달 열기 타입
  const [openType, setOpenType] = useState(null);
  const closeModal = () => setOpenType(null);

  // ✅ 에러 메시지
  const [error, setError] = useState("");
  // 2026-01-19
  // 로딩 상태 추가
  const [loading, setLoading] = useState(false);

  const isEmailLike = useMemo(() => {
    const v = email.trim();
    return v.includes("@") && v.includes(".");
  }, [email]);

  const isPhoneLike = useMemo(() => {
    const onlyNum = phone.replace(/\D/g, "");
    return onlyNum.length >= 10 && onlyNum.length <= 11;
  }, [phone]);

  // ✅ 비밀번호 규칙: 8자 + 대문자 + 숫자 + 특수문자
  const pwRules = useMemo(() => {
    const v = pw;
    return {
      lenOk: v.length >= 8,
      upperOk: /[A-Z]/.test(v),
      numOk: /\d/.test(v),
      specialOk: /[^a-zA-Z0-9]/.test(v),
    };
  }, [pw]);

  const pwValid =
    pwRules.lenOk && pwRules.upperOk && pwRules.numOk && pwRules.specialOk;

  const pwMatch = useMemo(() => pw && pw2 && pw === pw2, [pw, pw2]);

  // 2026-01-19
  // 회원가입 시 실행되는 submit 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
// 2026-01-19
// 회원 가입 시 아이디를 아이디로 바꿈.
// 이메일 입력 받는 곳을 따로 추가.
    if (!loginId.trim()) return setError("아이디를 입력해주세요.");
    if (!email.trim()) return setError("이메일을 입력해주세요.");
    if (!isEmailLike) return setError("이메일은 이메일 형식으로 입력해주세요.");

    if (!pwValid) {
      return setError(
        "비밀번호는 8자 이상이며 대문자/숫자/특수문자를 포함해야 합니다."
      );
    }
    if (!pwMatch) return setError("비밀번호 확인이 일치하지 않습니다.");

    if (!name.trim()) return setError("이름을 입력해주세요.");
    if (!phone.trim()) return setError("휴대폰 번호를 입력해주세요.");
    if (!isPhoneLike)
      return setError("휴대폰 번호는 숫자만 10~11자리로 입력해주세요.");

    if (!birthDate) return setError("생년월일을 선택해주세요.");

    if (!agreeTerms || !agreePrivacy)
      return setError("필수 약관에 동의해주세요.");

    // 2026-01-19
    // API 호출 로직
    setLoading(true);
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        data: {
          loginId: loginId.trim(),
          email: email.trim(),
          password: pw,
          mobileNumber: phone.replace(/\D/g, ""),
          username: name.trim(),
        },
      });
      const token =
        data?.accessToken ||
        data?.token ||
        data?.access_token ||
        data?.jwt ||
        data?.jwtToken;
      if (token) {
        setAccessToken(token);
        setCurrentUserId(data?.userId || data?.loginId || loginId.trim());
        setIsLoggedIn(true);
        navigate("/main");
      } else {
        navigate("/auth/login");
      }
    } catch {
      setError("회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* ✅ 약관/개인정보 모달 */}
      <PolicyModal
        open={openType === "terms"}
        title="이용약관"
        onClose={closeModal}
      >
        <TermsContent />
      </PolicyModal>

      <PolicyModal
        open={openType === "privacy"}
        title="개인정보 처리방침"
        onClose={closeModal}
      >
        <PrivacyContent />
      </PolicyModal>

      <main className="signup-card">
        <h1 className="signup-title">회원가입</h1>
{/* 
2026-01-19
- 아이디를 이메일에서 id로 변경
- 이메일 따로 입력 받게함.
*/}
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="signup-id">아이디</label>
            <input
              id="signup-id"
              type="text"
              placeholder="아이디 입력"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              autoComplete="username"
              // 2026-01-19
              // 로딩 중 중복 요청 방지를 위해 버튼 비활성화
              disabled={loading}
            />
          </div>

          <div className="field">
            <label htmlFor="signup-email">이메일</label>
            <input
              id="signup-email"
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              // 2026-01-19
              // 로딩 중 중복 요청 방지를 위해 버튼 비활성화
              disabled={loading}
            />
            <small className="hint">* 이메일 형식으로 입력해주세요.</small>
          </div>

          <div className="field">
            <label htmlFor="signup-password">비밀번호</label>
            <input
              id="signup-password"
              type="password"
              placeholder="비밀번호 입력"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="new-password"
              // 2026-01-19
              // 로딩 중 중복 요청 방지를 위해 버튼 비활성화
              disabled={loading}
            />
            <small className="hint">
              * 8자 이상, <b>대문자</b>, 숫자, 특수문자를 포함해주세요.
            </small>

            {/* ✅ 규칙 체크 */}
            <div className="checkline">
              <span className={`pill ${pwRules.lenOk ? "ok" : ""}`}>8자+</span>
              <span className={`pill ${pwRules.upperOk ? "ok" : ""}`}>
                대문자
              </span>
              <span className={`pill ${pwRules.numOk ? "ok" : ""}`}>숫자</span>
              <span className={`pill ${pwRules.specialOk ? "ok" : ""}`}>
                특수문자
              </span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="signup-password-confirm">비밀번호 확인</label>
            <input
              id="signup-password-confirm"
              type="password"
              placeholder="비밀번호 재입력"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              autoComplete="new-password"
              // 2026-01-19
              // 로딩 중 중복 요청 방지를 위해 버튼 비활성화
              disabled={loading}
            />
            <div className="checkline">
              <span className={`pill ${pwMatch ? "ok" : ""}`}>일치</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="signup-name">이름</label>
            <input
              id="signup-name"
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              // 2026-01-19
              // 로딩 중 중복 요청 방지를 위해 버튼 비활성화
              disabled={loading}
            />
          </div>

          <div className="field">
            <label htmlFor="signup-phone">휴대폰 번호</label>
            <input
              id="signup-phone"
              type="tel"
              placeholder="휴대폰 번호 입력 (-없이 숫자만)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              // 2026-01-19
              // 로딩 중 중복 요청 방지를 위해 버튼 비활성화
              disabled={loading}
            />
          </div>

          <div className="field">
            <label>생년월일</label>
            <DatePicker
              selected={birthDate}
              onChange={(date) => setBirthDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="생년월일 선택"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              maxDate={new Date()}
              customInput={<DateInput />}
              // 2026-01-19
              // 로딩 중 중복 요청 방지를 위해 버튼 비활성화
              disabled={loading}
            />
          </div>

          {/* ✅ 약관: 보기 버튼 누르면 모달 열기 */}
          <div className="terms">
            <label className="check">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              // 2026-01-19
              // 로딩 중 중복 요청 방지를 위해 버튼 비활성화
                disabled={loading}
              />
              이용약관 동의 (필수)
            </label>
            <button
              type="button"
              className="link-button"
              onClick={() => setOpenType("terms")}
            >
              보기
            </button>
          </div>

          <div className="terms">
            <label className="check">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                disabled={loading}
              />
              개인정보 처리방침 동의 (필수)
            </label>
            <button
              type="button"
              className="link-button"
              onClick={() => setOpenType("privacy")}
            >
              보기
            </button>
          </div>

          {/* ✅ 에러 표시 */}
          {error ? <p className="error">{error}</p> : null}

          <div className="button-row">
            <button type="submit" className="primary" disabled={loading}>
              회원가입 하기
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => navigate("/auth/login")}
              disabled={loading}
            >
              돌아가기
            </button>
          </div>
        </form>
      </main>

      {/* ✅ 공통 푸터 적용 (메인/기업진단과 동일) */}
      <SiteFooter onOpenPolicy={setOpenType} />
    </div>
  );
}

const DateInput = forwardRef(({ value, onClick }, ref) => (
  <div className="date-input" onClick={onClick} ref={ref}>
    <input type="text" value={value} placeholder="생년월일 선택" readOnly />
    <span className="calendar-icon">📅</span>
  </div>
));


