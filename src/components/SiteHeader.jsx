// // src/components/SiteHeader.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "../styles/SiteHeader.css";

// export default function SiteHeader({ onLogout, onBrandPick, onPromoPick }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const pathname = location.pathname;

//   // ✅ active 처리(진단/브랜드/홍보물)
//   const isDiagnosisRoute =
//     pathname === "/diagnosis" ||
//     pathname === "/diagnosisinterview" ||
//     pathname.startsWith("/diagnosis/");

//   const isBrandRoute =
//     pathname === "/brandconsulting" ||
//     pathname === "/logoconsulting" ||
//     pathname === "/nameconsulting" ||
//     pathname === "/homepageconsulting" ||
//     pathname.startsWith("/brandconsulting/");

//   const isPromotionRoute =
//     pathname === "/promotion" || pathname.startsWith("/promotion/");

//   const isActiveExact = (path) => pathname === path;

//   // ===== Hover Dropdown: Brand =====
//   const [brandOpen, setBrandOpen] = useState(false);
//   const brandCloseTimerRef = useRef(null);

//   const clearBrandCloseTimer = () => {
//     if (brandCloseTimerRef.current) {
//       clearTimeout(brandCloseTimerRef.current);
//       brandCloseTimerRef.current = null;
//     }
//   };

//   const openBrandMenu = () => {
//     clearBrandCloseTimer();
//     setBrandOpen(true);
//   };

//   const closeBrandMenu = (delay = 180) => {
//     clearBrandCloseTimer();
//     brandCloseTimerRef.current = setTimeout(() => {
//       setBrandOpen(false);
//     }, delay);
//   };

//   // ===== Hover Dropdown: Promotion =====
//   const [promoOpen, setPromoOpen] = useState(false);
//   const promoCloseTimerRef = useRef(null);

//   const clearPromoCloseTimer = () => {
//     if (promoCloseTimerRef.current) {
//       clearTimeout(promoCloseTimerRef.current);
//       promoCloseTimerRef.current = null;
//     }
//   };

//   const openPromoMenu = () => {
//     clearPromoCloseTimer();
//     setPromoOpen(true);
//   };

//   const closePromoMenu = (delay = 180) => {
//     clearPromoCloseTimer();
//     promoCloseTimerRef.current = setTimeout(() => {
//       setPromoOpen(false);
//     }, delay);
//   };

//   useEffect(() => {
//     return () => {
//       clearBrandCloseTimer();
//       clearPromoCloseTimer();
//     };
//   }, []);

//   const handleDiagnosisClick = () => navigate("/diagnosis");

//   // ✅ 브랜드 컨설팅(컨셉 제거: logo/naming/homepage)
//   const handleBrandItem = (action) => {
//     setBrandOpen(false);
//     setPromoOpen(false);
//     navigate("/brandconsulting", { state: { section: action } });
//     if (typeof onBrandPick === "function") onBrandPick(action);
//   };

//   // ✅ “브랜드 컨설팅” 클릭은 페이지로 이동
//   const handleBrandClick = () => {
//     setPromoOpen(false);
//     navigate("/brandconsulting");
//   };

//   // ✅ 홍보물 컨설팅 메뉴 선택
//   const handlePromoItem = (action) => {
//     setPromoOpen(false);
//     setBrandOpen(false);
//     // 서비스 선택값은 query로 전달(원하면 state로 바꿔도 됨)
//     navigate(`/promotion?service=${action}`);
//     if (typeof onPromoPick === "function") onPromoPick(action);
//   };

//   // ✅ “홍보물 컨설팅” 클릭은 페이지로 이동
//   const handlePromoClick = () => {
//     setBrandOpen(false);
//     navigate("/promotion");
//   };

//   const handleLogout = () => {
//     if (typeof onLogout === "function") onLogout();
//     else navigate("/login");
//   };

//   return (
//     <header className="main-header">
//       <div
//         className="brand"
//         role="button"
//         tabIndex={0}
//         onClick={() => navigate("/main")}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === " ") navigate("/main");
//         }}
//       >
//         BRANDPILOT
//       </div>

//       <nav className="main-nav" aria-label="주요 메뉴">
//         <button
//           type="button"
//           className={`nav-link ${isDiagnosisRoute ? "is-active" : ""}`}
//           onClick={handleDiagnosisClick}
//         >
//           기업 진단 &amp; 인터뷰
//         </button>

//         {/* ✅ 브랜드 컨설팅 Hover 드롭다운 */}
//         <div
//           className={`nav-dropdown ${brandOpen ? "is-open" : ""}`}
//           onMouseEnter={() => {
//             openBrandMenu();
//             setPromoOpen(false);
//           }}
//           onMouseLeave={() => closeBrandMenu(220)}
//           onFocus={() => {
//             openBrandMenu();
//             setPromoOpen(false);
//           }}
//           onBlur={() => closeBrandMenu(120)}
//         >
//           <button
//             type="button"
//             className={`nav-link nav-dropdown__btn ${
//               isBrandRoute ? "is-active" : ""
//             }`}
//             aria-expanded={brandOpen ? "true" : "false"}
//             onClick={handleBrandClick}
//             onKeyDown={(e) => {
//               if (e.key === "Escape") setBrandOpen(false);
//               if (e.key === "ArrowDown") openBrandMenu();
//             }}
//           >
//             브랜드 컨설팅 <span className="nav-dropdown__chev">▾</span>
//           </button>

//           <div
//             className="nav-dropdown__panel"
//             role="menu"
//             aria-label="브랜드 컨설팅 메뉴"
//             onMouseEnter={openBrandMenu}
//             onMouseLeave={() => closeBrandMenu(220)}
//           >
//             <button
//               type="button"
//               className="nav-dropdown__item"
//               onClick={() => handleBrandItem("logo")}
//             >
//               로고 컨설팅
//             </button>

//             <button
//               type="button"
//               className="nav-dropdown__item"
//               onClick={() => handleBrandItem("naming")}
//             >
//               네이밍 컨설팅
//             </button>

//             <button
//               type="button"
//               className="nav-dropdown__item"
//               onClick={() => handleBrandItem("homepage")}
//             >
//               홈페이지 컨설팅
//             </button>
//           </div>
//         </div>

//         {/* ✅ 홍보물 컨설팅 Hover 드롭다운 */}
//         <div
//           className={`nav-dropdown ${promoOpen ? "is-open" : ""}`}
//           onMouseEnter={() => {
//             openPromoMenu();
//             setBrandOpen(false);
//           }}
//           onMouseLeave={() => closePromoMenu(220)}
//           onFocus={() => {
//             openPromoMenu();
//             setBrandOpen(false);
//           }}
//           onBlur={() => closePromoMenu(120)}
//         >
//           <button
//             type="button"
//             className={`nav-link nav-dropdown__btn ${
//               isPromotionRoute ? "is-active" : ""
//             }`}
//             aria-expanded={promoOpen ? "true" : "false"}
//             onClick={handlePromoClick}
//             onKeyDown={(e) => {
//               if (e.key === "Escape") setPromoOpen(false);
//               if (e.key === "ArrowDown") openPromoMenu();
//             }}
//           >
//             홍보물 컨설팅 <span className="nav-dropdown__chev">▾</span>
//           </button>

//           <div
//             className="nav-dropdown__panel"
//             role="menu"
//             aria-label="홍보물 컨설팅 메뉴"
//             onMouseEnter={openPromoMenu}
//             onMouseLeave={() => closePromoMenu(220)}
//           >
//             <button
//               type="button"
//               className="nav-dropdown__item"
//               onClick={() => handlePromoItem("digital")}
//             >
//               디지털 디자인
//             </button>

//             <button
//               type="button"
//               className="nav-dropdown__item"
//               onClick={() => handlePromoItem("offline")}
//             >
//               오프라인 디자인
//             </button>

//             <button
//               type="button"
//               className="nav-dropdown__item"
//               onClick={() => handlePromoItem("video")}
//             >
//               홍보 영상
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="account-nav">
//         <button
//           type="button"
//           className={`nav-link ${isActiveExact("/main") ? "is-active" : ""}`}
//           onClick={() => navigate("/main")}
//         >
//           홈
//         </button>

//         <button
//           type="button"
//           className="nav-link"
//           onClick={() => alert("마이페이지 (준비중)")}
//         >
//           마이페이지
//         </button>

//         <button type="button" className="nav-link" onClick={handleLogout}>
//           로그아웃
//         </button>
//       </div>
//     </header>
//   );
// }

// src/components/SiteHeader.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SiteHeader.css";

export default function SiteHeader({ onLogout, onBrandPick, onPromoPick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  // ✅ active 처리(진단/브랜드/홍보물)
  const isDiagnosisRoute =
    pathname === "/diagnosis" ||
    pathname === "/diagnosisinterview" ||
    pathname.startsWith("/diagnosis/");

  // ✅ Brand 영역: 브랜드 메인 + 3개 인터뷰 경로까지 포함
  const isBrandRoute =
    pathname === "/brandconsulting" ||
    pathname === "/logoconsulting" ||
    pathname === "/nameconsulting" ||
    pathname === "/homepageconsulting" ||
    pathname.startsWith("/brandconsulting/") ||
    pathname.startsWith("/brand/");

  const isPromotionRoute =
    pathname === "/promotion" || pathname.startsWith("/promotion/");

  const isActiveExact = (path) => pathname === path;

  // ===== Hover Dropdown: Brand =====
  const [brandOpen, setBrandOpen] = useState(false);
  const brandCloseTimerRef = useRef(null);

  const clearBrandCloseTimer = () => {
    if (brandCloseTimerRef.current) {
      clearTimeout(brandCloseTimerRef.current);
      brandCloseTimerRef.current = null;
    }
  };

  const openBrandMenu = () => {
    clearBrandCloseTimer();
    setBrandOpen(true);
  };

  const closeBrandMenu = (delay = 180) => {
    clearBrandCloseTimer();
    brandCloseTimerRef.current = setTimeout(() => {
      setBrandOpen(false);
    }, delay);
  };

  // ===== Hover Dropdown: Promotion =====
  const [promoOpen, setPromoOpen] = useState(false);
  const promoCloseTimerRef = useRef(null);

  const clearPromoCloseTimer = () => {
    if (promoCloseTimerRef.current) {
      clearTimeout(promoCloseTimerRef.current);
      promoCloseTimerRef.current = null;
    }
  };

  const openPromoMenu = () => {
    clearPromoCloseTimer();
    setPromoOpen(true);
  };

  const closePromoMenu = (delay = 180) => {
    clearPromoCloseTimer();
    promoCloseTimerRef.current = setTimeout(() => {
      setPromoOpen(false);
    }, delay);
  };

  useEffect(() => {
    return () => {
      clearBrandCloseTimer();
      clearPromoCloseTimer();
    };
  }, []);

  const handleDiagnosisClick = () => navigate("/diagnosis");

  // ✅ 드롭다운에서 선택 시: 각 인터뷰 페이지로 이동
  const brandInterviewRouteMap = {
    logo: "/logoconsulting",
    naming: "/nameconsulting",
    homepage: "/homepageconsulting",
  };

  const handleBrandItem = (action) => {
    setBrandOpen(false);
    setPromoOpen(false);

    const target = brandInterviewRouteMap[action] || "/brandconsulting";
    navigate(target);

    if (typeof onBrandPick === "function") onBrandPick(action);
  };

  // ✅ “브랜드 컨설팅” 버튼 클릭은 브랜드 메인으로
  const handleBrandClick = () => {
    setPromoOpen(false);
    navigate("/brandconsulting");
  };

  // ✅ 홍보물 컨설팅 메뉴 선택
  const handlePromoItem = (action) => {
    setPromoOpen(false);
    setBrandOpen(false);

    navigate(`/promotion?service=${action}`);
    if (typeof onPromoPick === "function") onPromoPick(action);
  };

  // ✅ “홍보물 컨설팅” 클릭은 페이지로 이동
  const handlePromoClick = () => {
    setBrandOpen(false);
    navigate("/promotion");
  };

  const handleLogout = () => {
    if (typeof onLogout === "function") onLogout();
    else navigate("/login");
  };

  return (
    <header className="main-header">
      <div
        className="brand"
        role="button"
        tabIndex={0}
        onClick={() => navigate("/main")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") navigate("/main");
        }}
      >
        BRANDPILOT
      </div>

      <nav className="main-nav" aria-label="주요 메뉴">
        <button
          type="button"
          className={`nav-link ${isDiagnosisRoute ? "is-active" : ""}`}
          onClick={handleDiagnosisClick}
        >
          기업 진단 &amp; 인터뷰
        </button>

        {/* ✅ 브랜드 컨설팅 Hover 드롭다운 */}
        <div
          className={`nav-dropdown ${brandOpen ? "is-open" : ""}`}
          onMouseEnter={() => {
            openBrandMenu();
            setPromoOpen(false);
          }}
          onMouseLeave={() => closeBrandMenu(220)}
          onFocus={() => {
            openBrandMenu();
            setPromoOpen(false);
          }}
          onBlur={() => closeBrandMenu(120)}
        >
          <button
            type="button"
            className={`nav-link nav-dropdown__btn ${
              isBrandRoute ? "is-active" : ""
            }`}
            aria-expanded={brandOpen ? "true" : "false"}
            onClick={handleBrandClick}
            onKeyDown={(e) => {
              if (e.key === "Escape") setBrandOpen(false);
              if (e.key === "ArrowDown") openBrandMenu();
            }}
          >
            브랜드 컨설팅 <span className="nav-dropdown__chev">▾</span>
          </button>

          <div
            className="nav-dropdown__panel"
            role="menu"
            aria-label="브랜드 컨설팅 메뉴"
            onMouseEnter={openBrandMenu}
            onMouseLeave={() => closeBrandMenu(220)}
          >
            <button
              type="button"
              className="nav-dropdown__item"
              onClick={() => handleBrandItem("logo")}
            >
              로고 컨설팅
            </button>

            <button
              type="button"
              className="nav-dropdown__item"
              onClick={() => handleBrandItem("naming")}
            >
              네이밍 컨설팅
            </button>

            <button
              type="button"
              className="nav-dropdown__item"
              onClick={() => handleBrandItem("homepage")}
            >
              홈페이지 컨설팅
            </button>
          </div>
        </div>

        {/* ✅ 홍보물 컨설팅 Hover 드롭다운 */}
        <div
          className={`nav-dropdown ${promoOpen ? "is-open" : ""}`}
          onMouseEnter={() => {
            openPromoMenu();
            setBrandOpen(false);
          }}
          onMouseLeave={() => closePromoMenu(220)}
          onFocus={() => {
            openPromoMenu();
            setBrandOpen(false);
          }}
          onBlur={() => closePromoMenu(120)}
        >
          <button
            type="button"
            className={`nav-link nav-dropdown__btn ${
              isPromotionRoute ? "is-active" : ""
            }`}
            aria-expanded={promoOpen ? "true" : "false"}
            onClick={handlePromoClick}
            onKeyDown={(e) => {
              if (e.key === "Escape") setPromoOpen(false);
              if (e.key === "ArrowDown") openPromoMenu();
            }}
          >
            홍보물 컨설팅 <span className="nav-dropdown__chev">▾</span>
          </button>

          <div
            className="nav-dropdown__panel"
            role="menu"
            aria-label="홍보물 컨설팅 메뉴"
            onMouseEnter={openPromoMenu}
            onMouseLeave={() => closePromoMenu(220)}
          >
            <button
              type="button"
              className="nav-dropdown__item"
              onClick={() => handlePromoItem("digital")}
            >
              디지털 디자인
            </button>

            <button
              type="button"
              className="nav-dropdown__item"
              onClick={() => handlePromoItem("offline")}
            >
              오프라인 디자인
            </button>

            <button
              type="button"
              className="nav-dropdown__item"
              onClick={() => handlePromoItem("video")}
            >
              홍보 영상
            </button>
          </div>
        </div>
      </nav>

      <div className="account-nav">
        <button
          type="button"
          className={`nav-link ${isActiveExact("/main") ? "is-active" : ""}`}
          onClick={() => navigate("/main")}
        >
          홈
        </button>

        <button
          type="button"
          className="nav-link"
          onClick={() => alert("마이페이지 (준비중)")}
        >
          마이페이지
        </button>

        <button type="button" className="nav-link" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </header>
  );
}
