// // src/pages/MainPage.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// // UI: 메인 카드(컨설팅 시작하기)에서 사용하는 이미지 에셋
// import analyzeCompany from "../../Image/main_image/companyanalyze.png";
// import makeset from "../../Image/main_image/Brandingconsult.png";
// import story from "../../Image/main_image/PromotionalConsulting.png";
// import mainBanner from "../../Image/banner_image/AI_CONSULTING.png";

// // UI: 약관/개인정보 모달 + 공통 헤더/푸터
// import PolicyModal from "../../components/policy/PolicyModal.jsx";
// import { PrivacyContent, TermsContent } from "../../components/policy/PolicyContents.jsx";
// import SiteFooter from "../../components/layout/SiteFooter.jsx";
// import SiteHeader from "../../components/layout/SiteHeader.jsx";
// import { apiRequest } from "../../api/client.js";

// /**
//  * [MainPage] 메인 허브 페이지
//  * ------------------------------------------------------------
//  * ✅ 화면 목적
//  * - 로그인 후 첫 진입 허브(컨설팅 시작하기 카드 제공)
//  * - 투자유치 게시판(현재는 예시 카드) 노출
//  * - 공통 헤더/푸터 + 약관/개인정보 모달 접근
//  *
//  * ✅ 현재 프론트 구현 상태
//  * - 3개의 주요 서비스 진입(기업진단/브랜드/홍보물) 라우팅
//  * - 투자유치 게시판: 더미 카드(하드코딩)
//  * - "투자성과 뉴스" 버튼은 alert 테스트
//  *
//  * ✅ BACKEND 연동 포인트(핵심)
//  * 1) 인증/세션 확인
//  *   - 이 페이지는 보통 "로그인한 사용자만 접근"하게 설계됨
//  *   - 토큰이 없거나 만료되면 /login으로 보내는 보호 라우트가 필요
//  *   - (보통 App 라우팅 레벨에서 처리)
//  *
//  * 2) 로그아웃(onLogout)
//  *   - 현재 props로 받는 onLogout이 있다면,
//  *     백과 연동 시 토큰 삭제/세션 종료 API 호출이 이쪽(혹은 헤더)에서 필요
//  *   - 예: POST /auth/logout (서버가 refreshToken을 관리한다면)
//  *   - 또는 프론트에서 토큰만 삭제하고 /login 이동
//  *
//  * 3) 투자유치 게시판 데이터
//  *   - 현재 하드코딩된 카드들을
//  *     GET /investment/posts 같은 API로 받아와 렌더링하도록 교체 가능
//  *   - "투자성과 뉴스" 버튼도 실제 링크/상세 페이지로 연결 가능
//  *
//  * ✅ UI 주의
//  * - card-grid의 article은 role="button" + onKeyDown으로 접근성 대응
//  */
// export default function MainPage({ onLogout }) {
//   const navigate = useNavigate();

//   /**
//    * NAV: 각 카드 클릭 시 페이지 이동
//    * - 기업진단: /diagnosis
//    * - 브랜드 컨설팅: /brandconsulting
//    * - 홍보물 컨설팅: /promotion (인라인)
//    */
//   const handleDiagnosisClick = () => navigate("/diagnosis");
//   const handleBrandPage = () => navigate("/brandconsulting");

//   /**
//    * UI STATE: 약관/방침 모달
//    * - "privacy" | "terms" | null
//    * - SiteFooter에서 setOpenType으로 모달을 열 수 있게 연결
//    */
//   const [openType, setOpenType] = useState(null);
//   const closeModal = () => setOpenType(null);

//   const [dealItems, setDealItems] = useState([]);
//   const [dealLoading, setDealLoading] = useState(false);
//   const [dealError, setDealError] = useState("");

//   useEffect(() => {
//     let mounted = true;
//     const fetchDeals = async () => {
//       setDealLoading(true);
//       setDealError("");
//       try {
//         const data = await apiRequest("/brands/posts");
//         const list = Array.isArray(data) ? data : [];
//         const mapped = list.slice(0, 6).map((item) => {
//           const tags = Array.isArray(item.hashtags)
//             ? item.hashtags.map((tag) => tag.trim()).filter(Boolean)
//             : [];
//           const company = item.companyName || "회사명";
//           const locationText = item.region || "";
//           const sizeText = item.companySize || "";
//           const meta = [sizeText, locationText].filter(Boolean).join(", ");
//           return {
//             id: item.postId,
//             company,
//             oneLiner: item.shortDescription || "",
//             meta,
//             tags,
//             logoImageUrl: item.logoImageUrl || "",
//             updatedAt: item.updatedAt ? item.updatedAt.slice(0, 10) : "-",
//           };
//         });
//         if (mounted) setDealItems(mapped);
//       } catch (error) {
//         console.error(error);
//         if (mounted) setDealError("투자 라운지 게시글을 불러오지 못했습니다.");
//       } finally {
//         if (mounted) setDealLoading(false);
//       }
//     };
//     fetchDeals();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   /**
//    * TODO(BACKEND - 선택/권장):
//    * ------------------------------------------------------------
//    * 이 메인 페이지에서 사용자 정보를 보여주고 싶다면
//    * - GET /user/me 같은 API를 호출해서
//    * - 헤더에 사용자 이름/프로필 등을 표기할 수 있음
//    *
//    * 단, 이 로직은 MainPage보다 "SiteHeader" 또는
//    * "인증 전역 상태(Auth Context)"에서 관리하는 게 더 깔끔함.
//    */

//   return (
//     <div className="main-page">
//       {/* =====================================================
//           UI: 개인정보/약관 모달
//           - openType 값에 따라 렌더링 여부 결정
//          ===================================================== */}
//       <PolicyModal
//         open={openType === "privacy"}
//         title="개인정보 처리방침"
//         onClose={closeModal}
//       >
//         <PrivacyContent />
//       </PolicyModal>

//       <PolicyModal
//         open={openType === "terms"}
//         title="이용약관"
//         onClose={closeModal}
//       >
//         <TermsContent />
//       </PolicyModal>

//       {/* =====================================================
//           ✅ 공통 헤더
//           - onLogout: 로그아웃 동작을 외부(App)에서 주입받는 구조
//           - onBrandPick: 헤더 드롭다운(브랜드 컨설팅) 선택 콜백
          
//           BACKEND(로그아웃):
//           - 실제 연동 시 보통 아래 중 하나가 필요:
//             1) 프론트 토큰 삭제 + navigate("/login")
//             2) POST /auth/logout 호출 후 토큰 삭제
//          ===================================================== */}
//       <SiteHeader
//         onLogout={onLogout}
//         onBrandPick={(action) => {
//           // MainPage에서 드롭다운 선택 시 section 전달은 헤더에서 이미 처리함
//           // 여기서는 추가로 뭔가 하고 싶을 때만 작성
//           // 예: console.log("brand pick:", action);
//           // TODO(BACKEND - 선택):
//           // - 사용자의 메뉴 클릭 로그/이력(analytics)이 필요하면
//           //   여기서 이벤트 트래킹 API를 호출할 수도 있음
//         }}
//       />

//       <main className="main-content">
//         {/* ✅ 메인 배너 */}
//         <section className="main-hero" aria-label="AI 컨설팅 배너">
//           <img
//             className="main-hero__img"
//             src={mainBanner}
//             alt="AI 컨설팅 배너"
//           />
//           <div className="main-hero__overlay">
//             <p className="main-hero__kicker">AI 기반 컨설팅</p>

//             <p className="main-hero__sub">
//               기업 진단 → 브랜드 → 홍보물 컨설팅까지 한 흐름으로.
//             </p>
//           </div>
//         </section>

//         <h2 className="section-title">컨설팅 시작하기</h2>

//         {/* =====================================================
//             UI: 컨설팅 진입 카드 3개
//             - 클릭/키보드 Enter/Space로 이동
//             - 현재는 라우팅만 수행, 백 연동 필요 없음
//            ===================================================== */}
//         <div className="card-grid">
//           <article
//             className="info-card"
//             role="button"
//             tabIndex={0}
//             onClick={handleDiagnosisClick}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" || e.key === " ") handleDiagnosisClick();
//             }}
//           >
//             <div className="card-image">
//               <img src={analyzeCompany} alt="기업 진단 & 인터뷰" />
//             </div>
//             <div className="card-body">
//               <p className="card-tag">Company Analyze</p>
//               <h3>기업 진단 &amp; 인터뷰</h3>
//               <p className="card-desc">
//                 기업의 현황을 정밀하게 분석하고 핵심 인사이트를 제공합니다.
//               </p>
//             </div>
//           </article>

//           <article
//             className="info-card"
//             role="button"
//             tabIndex={0}
//             onClick={handleBrandPage}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" || e.key === " ") handleBrandPage();
//             }}
//           >
//             <div className="card-image alt">
//               <img src={makeset} alt="브랜드 컨설팅" />
//             </div>
//             <div className="card-body">
//               <p className="card-tag">Brand Consulting</p>
//               <h3>브랜드 컨설팅</h3>
//               <p className="card-desc">
//                 기업의 이미지와 정체성을 정교하게 다듬습니다.
//               </p>
//             </div>
//           </article>

//           <article
//             className="info-card"
//             role="button"
//             tabIndex={0}
//             onClick={() => navigate("/promotion")}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" || e.key === " ") navigate("/promotion");
//             }}
//           >
//             <div className="card-image third">
//               <img src={story} alt="홍보물 컨설팅" />
//             </div>
//             <div className="card-body">
//               <p className="card-tag">Promotional Consulting</p>
//               <h3>홍보물 컨설팅</h3>
//               <p className="card-desc">
//                 기업 전반의 소개와 홍보 과정을 기획 단계부터 제안합니다.
//               </p>
//             </div>
//           </article>
//         </div>

//         {/* =====================================================
//             [투자 유치 게시판] 
//            ===================================================== */}
//         <section className="deal-board" aria-label="투자 라운지 요약">
//           <div className="deal-header">
//             <div>
//               <p className="deal-eyebrow">브랜딩과 성장을 준비하는 기업을 한곳에서 만나보세요.</p>
//               <h3 className="deal-title">투자 라운지</h3>
//             </div>

//             <button
//               type="button"
//               className="deal-more"
//               onClick={() => navigate("/investment")}
//             >
//               전체보기 &gt;
//             </button>
//           </div>

//           <div className="deal-grid">
//             {dealLoading ? (
//               <div className="deal-card">
//                 <div>
//                   <h4>불러오는 중...</h4>
//                   <p>투자 라운지 게시글을 불러오는 중입니다.</p>
//                 </div>
//               </div>
//             ) : dealError ? (
//               <div className="deal-card">
//                 <div>
//                   <h4>불러오기 실패</h4>
//                   <p>{dealError}</p>
//                 </div>
//               </div>
//             ) : dealItems.length === 0 ? (
//               <div className="deal-card">
//                 <div>
//                   <h4>등록된 기업이 없습니다.</h4>
//                   <p>투자 라운지에서 첫 게시글을 등록해 주세요.</p>
//                 </div>
//               </div>
//             ) : (
//               dealItems.map((item) => (
//                 <article
//                   key={item.id}
//                   className="deal-card"
//                   role="button"
//                   tabIndex={0}
//                   onClick={() => navigate(`/investment/${item.id}`)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" || e.key === " ")
//                       navigate(`/investment/${item.id}`);
//                   }}
//                 >
//                   <div className="deal-card-head">
//                     <div>
//                       <h4>{item.company}</h4>
//                       <p>{item.oneLiner || "한 줄 소개가 없습니다."}</p>
//                       <p className="deal-meta">{item.meta || "지역/규모 정보 없음"}</p>
//                     </div>
//                     <div className="deal-logo">
//                       {item.logoImageUrl ? (
//                         <img src={item.logoImageUrl} alt={`${item.company} 로고`} />
//                       ) : (
//                         item.company.slice(0, 2)
//                       )}
//                     </div>
//                   </div>
//                   <div className="deal-tags">
//                     {item.tags.length === 0 ? (
//                       <span>태그 없음</span>
//                     ) : (
//                       item.tags.map((tag) => <span key={tag}>#{tag}</span>)
//                     )}
//                   </div>
//                   <div className="deal-footer">
//                     <strong>업데이트: {item.updatedAt}</strong>
//                     <button type="button">↗</button>
//                   </div>
//                 </article>
//               ))
//             )}
//           </div>
//         </section>
//       </main>

//       {/* =====================================================
//           UI: 공통 푸터
//           - onOpenPolicy로 약관 모달을 footer에서도 열 수 있음
//          ===================================================== */}
//       <SiteFooter onOpenPolicy={setOpenType} />
//     </div>
//   );
// }

// src/pages/MainPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PolicyModal from "../../components/policy/PolicyModal.jsx";
import { PrivacyContent, TermsContent } from "../../components/policy/PolicyContents.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import { apiRequest } from "../../api/client.js";

/**
 * ✅ 히어로 배경 이미지
 * - 아래 경로는 프로젝트에 맞게 바꿔줘!
 * - (예: 메인 배너 이미지가 있는 폴더/파일)
 */
import heroImage from "../../Image/banner_image/Banner_B.png";

const PROMOTION_ITEMS = [
  {
    title: "제품 아이콘",
    desc: "제품의 특징을 직관적으로 표현하는 맞춤형 아이콘 디자인",
    icon: "🎯",
    onClickPath: "/promotion",
  },
  {
    title: "AI컷 모델",
    desc: "AI 기술로 생성된 고품질 제품 모델 이미지",
    icon: "🤖",
    onClickPath: "/promotion",
  },
  {
    title: "제품 연출컷",
    desc: "제품의 가치를 극대화하는 프로페셔널 연출 사진",
    icon: "📸",
    onClickPath: "/promotion",
  },
  {
    title: "SNS 제품 포스터",
    desc: "소셜미디어에 최적화된 매력적인 제품 포스터 디자인",
    icon: "📱",
    onClickPath: "/promotion",
  },
];

export default function MainPage({ onLogout }) {
  const navigate = useNavigate();

  const handleDiagnosisClick = () => navigate("/diagnosis");
  const handleBrandPage = () => navigate("/brandconsulting");

  // 약관 모달
  const [openType, setOpenType] = useState(null);
  const closeModal = () => setOpenType(null);

  // 투자 라운지
  const [dealItems, setDealItems] = useState([]);
  const [dealLoading, setDealLoading] = useState(false);
  const [dealError, setDealError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchDeals = async () => {
      setDealLoading(true);
      setDealError("");

      try {
        const data = await apiRequest("/brands/posts");
        const list = Array.isArray(data) ? data : [];

        const mapped = list.slice(0, 6).map((item) => {
          const tags = Array.isArray(item.hashtags)
            ? item.hashtags.map((t) => String(t).trim()).filter(Boolean)
            : [];

          const company = item.companyName || "회사명";
          const meta = [item.region, item.companySize].filter(Boolean).join(", ");

          return {
            id: item.postId,
            company,
            oneLiner: item.shortDescription || "",
            meta,
            tags,
            logoImageUrl: item.logoImageUrl || "",
            updatedAt: item.updatedAt ? item.updatedAt.slice(0, 10) : "-",
          };
        });

        if (mounted) setDealItems(mapped);
      } catch (e) {
        console.error(e);
        if (mounted) setDealError("투자 라운지 게시글을 불러오지 못했습니다.");
      } finally {
        if (mounted) setDealLoading(false);
      }
    };

    fetchDeals();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="main-page">
      {/* 모달 */}
      <PolicyModal open={openType === "privacy"} title="개인정보 처리방침" onClose={closeModal}>
        <PrivacyContent />
      </PolicyModal>
      <PolicyModal open={openType === "terms"} title="이용약관" onClose={closeModal}>
        <TermsContent />
      </PolicyModal>

      {/* 헤더 */}
      <SiteHeader onLogout={onLogout} />

      {/* HERO (사진 무드: 배경이미지 + 딤 + 중앙 텍스트) */}
      <section
      className="mp-hero"
      aria-label="메인 히어로"
      >
        <div className="mp-hero-content">
          <h1 className="mp-hero-title">BRANDPILOT</h1>
          <p className="mp-hero-subtitle">
            간단한 정보를 입력하면 AI가 빠르게 분석하고,
            <br />
            주요 문제와 추천 전략을 제공합니다.
          </p>

          <div className="mp-hero-cta">
            <button type="button" className="mp-btn mp-btn-primary" onClick={handleDiagnosisClick}>
              기업 진단 시작하기 →
            </button>
            <button type="button" className="mp-btn mp-btn-secondary" onClick={() => navigate("/investment")}>
              투자 라운지 둘러보기
            </button>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="mp-container">
        {/* 프로세스 섹션 */}
        <section id="consulting" className="mp-section">
          <div className="mp-section-header">
            <div className="mp-section-badge">원스톱 컨설팅 프로세스</div>
            <h2 className="mp-section-title">AI 기반 브랜드 구축 여정</h2>
            <p className="mp-section-subtitle">진단부터 브랜딩까지 하나의 흐름으로 완성합니다</p>
          </div>

          <div className="mp-main-process">
            <div className="mp-process-badge">AI가 함께하는 원큐 프로세스</div>
            <h3 className="mp-process-title">기업 진단 → 브랜드 컨설팅 (순차 진행)</h3>
            <p className="mp-process-desc">
              AI가 기업을 심층 분석하고 브랜드 아이덴티티를 단계별로 완성합니다.
              <br />
              모든 과정이 유기적으로 연결되어 일관성 있는 브랜드를 구축합니다.
            </p>

            <div className="mp-process-flow">
              <article
                className="mp-process-step"
                role="button"
                tabIndex={0}
                onClick={handleDiagnosisClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleDiagnosisClick();
                }}
              >
                <div className="mp-step-number">1</div>
                <div className="mp-step-icon" aria-hidden="true">🔍</div>
                <div className="mp-step-title">기업 진단 &amp; 인터뷰</div>
                <div className="mp-step-desc">AI 기반 현황 분석 및 심층 인터뷰</div>
              </article>

              <div className="mp-arrow" aria-hidden="true">→</div>

              <article
                className="mp-process-step"
                role="button"
                tabIndex={0}
                onClick={handleBrandPage}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleBrandPage();
                }}
              >
                <div className="mp-step-number">2</div>
                <div className="mp-step-icon" aria-hidden="true">✨</div>
                <div className="mp-step-title">브랜드 컨설팅</div>
                <div className="mp-step-desc">네이밍부터 로고까지 단계별 완성</div>
              </article>
            </div>

            <div className="mp-sub-process">
              <div className="mp-sub-title">브랜드 컨설팅 세부 단계</div>
              <div className="mp-branding-steps">
                <button type="button" className="mp-branding-step" onClick={handleBrandPage}>
                  <div className="mp-branding-icon">📝</div>
                  <div className="mp-branding-label">네이밍</div>
                </button>
                <button type="button" className="mp-branding-step" onClick={handleBrandPage}>
                  <div className="mp-branding-icon">💡</div>
                  <div className="mp-branding-label">컨셉</div>
                </button>
                <button type="button" className="mp-branding-step" onClick={handleBrandPage}>
                  <div className="mp-branding-icon">📖</div>
                  <div className="mp-branding-label">스토리</div>
                </button>
                <button type="button" className="mp-branding-step" onClick={handleBrandPage}>
                  <div className="mp-branding-icon">🎨</div>
                  <div className="mp-branding-label">로고</div>
                </button>
              </div>
            </div>
          </div>

          {/* 홍보물 컨설팅 */}
          <div className="mp-promotional">
            <div className="mp-section-header">
              <div className="mp-section-badge">개별 선택 가능</div>
              <h2 className="mp-section-title">홍보물 컨설팅</h2>
              <p className="mp-section-subtitle">필요한 서비스만 골라서 이용하세요</p>
            </div>

            <div className="mp-promo-grid">
              {PROMOTION_ITEMS.map((it) => (
                <article
                  key={it.title}
                  className="mp-promo-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(it.onClickPath)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") navigate(it.onClickPath);
                  }}
                >
                  <div className="mp-promo-image" aria-hidden="true">
                    <div className="mp-promo-icon">{it.icon}</div>
                  </div>
                  <div className="mp-promo-content">
                    <h3 className="mp-promo-title">{it.title}</h3>
                    <p className="mp-promo-desc">{it.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 투자 라운지 */}
      <section id="investment" className="mp-investment">
        <div className="mp-investment-inner">
          <div className="mp-investment-header">
            <div className="mp-investment-title-group">
              <h2 className="mp-investment-title">투자 라운지</h2>
            </div>
            <button type="button" className="mp-view-all" onClick={() => navigate("/investment")}>
              전체보기 →
            </button>
          </div>

          <div className="mp-investment-grid">
            {dealLoading ? (
              <div className="mp-investment-empty">불러오는 중...</div>
            ) : dealError ? (
              <div className="mp-investment-empty">{dealError}</div>
            ) : dealItems.length === 0 ? (
              <div className="mp-investment-empty">등록된 기업이 없습니다.</div>
            ) : (
              dealItems.map((item) => (
                <article
                  key={item.id}
                  className="mp-investment-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/investment/${item.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") navigate(`/investment/${item.id}`);
                  }}
                >


                  <div className="mp-card-company">
                    <div className="mp-company-logo">
                      {item.logoImageUrl ? (
                        <img src={item.logoImageUrl} alt={`${item.company} 로고`} />
                      ) : (
                        <span>{item.company.slice(0, 2)}</span>
                      )}
                    </div>

                    <div className="mp-company-info">
                      <div className="mp-company-name">{item.company}</div>
                      <div className="mp-company-subtitle">
                        {item.oneLiner || "한 줄 소개가 없습니다."}
                      </div>
                    </div>
                  </div>

                  <div className="mp-company-tags">
                    {(item.tags?.length ? item.tags : ["태그 없음"]).slice(0, 6).map((tag) => (
                      <span key={`${item.id}-${tag}`} className="mp-company-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mp-company-meta">
                    <span className="mp-company-category">{item.meta || "지역/규모 정보 없음"}</span>
                    <span className="mp-company-date">업데이트: {item.updatedAt}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <SiteFooter onOpenPolicy={setOpenType} />
    </div>
  );
}
