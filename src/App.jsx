// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import FindID from "./pages/auth/FindID.jsx";
import FindPassword from "./pages/auth/FindPassword.jsx";
import EasyLogin from "./pages/auth/EasyLogin.jsx";

import MainPage from "./pages/main/MainPage.jsx";

import DiagnosisHome from "./pages/diagnosis/DiagnosisHome.jsx";
import DiagnosisInterview from "./pages/diagnosis/DiagnosisInterview.jsx";
import DiagnosisResult from "./pages/diagnosis/DiagnosisResult.jsx";

import BrandConsulting from "./pages/brand/BrandConsulting.jsx";
import NamingConsultingInterview from "./pages/brand/NamingConsultingInterview.jsx";
import LogoConsultingInterview from "./pages/brand/LogoConsultingInterview.jsx";
import ConceptConsultingInterview from "./pages/brand/ConceptConsultingInterview.jsx";
import BrandStoryConsultingInterview from "./pages/brand/BrandStoryConsultingInterview.jsx";
import BrandConsultingResult from "./pages/brand/BrandConsultingResult.jsx";
import BrandAllResults from "./pages/brand/BrandAllResults.jsx";

import PromotionPage from "./pages/promotion/Promotion.jsx";
import ProductIconConsultingInterview from "./pages/promotion/ProductIconConsultingInterview.jsx";
import AICutModelConsultingInterview from "./pages/promotion/AICutModelConsultingInterview.jsx";
import ProductStagingCutConsultingInterview from "./pages/promotion/ProductStagingCutConsultingInterview.jsx";
import SNSPosterConsultingInterview from "./pages/promotion/SNSPosterConsultingInterview.jsx";
import PromotionResult from "./pages/promotion/PromotionResult.jsx";
import PromotionAllResults from "./pages/promotion/PromotionAllResults.jsx";

import MyPage from "./pages/mypage/MyPage.jsx";

import InvestmentBoard from "./pages/investment/InvestmentBoard.jsx";
import InvestmentPostEdit from "./pages/investment/InvestmentPostEdit.jsx";
import InvestmentPostCreate from "./pages/investment/InvestmentPostCreate.jsx";
import InvestmentPostDetail from "./pages/investment/InvestmentPostDetail.jsx";

import ChatbotWidget from "./components/chatbot/ChatbotWidget.jsx";

export default function App() {
  const { pathname } = useLocation();

  // ✅ 로그인/회원가입 관련 페이지에서는 숨김
  const hideChatbotPaths = [
    "/",
    "/login",
    "/signup",
    "/findid",
    "/findpw",
    "/easylogin",
  ];
  const shouldHideChatbot = hideChatbotPaths.includes(pathname);

  return (
    <>
      <Routes>
        {/* ✅ 기본 진입: 로그인 */}
        <Route path="/" element={<Login />} />
        {/* ✅ 로그인/계정 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/findid" element={<FindID />} />
        <Route path="/findpw" element={<FindPassword />} />
        <Route path="/easylogin" element={<EasyLogin />} />
        {/* ✅ 메인 */}
        <Route path="/main" element={<MainPage />} />
        {/* ✅ 기업 진단 */}
        <Route path="/diagnosis" element={<DiagnosisHome />} />
        <Route path="/diagnosisinterview" element={<DiagnosisInterview />} />
        <Route path="/diagnosis/result" element={<DiagnosisResult />} />
        {/* ✅ 브랜드 컨설팅 메인 */}
        <Route path="/brandconsulting" element={<BrandConsulting />} />
        {/* ✅ 브랜드 컨설팅 인터뷰(권장 표준 라우트) */}
        <Route
          path="/brand/naming/interview"
          element={<NamingConsultingInterview />}
        />
        <Route
          path="/brand/concept/interview"
          element={<ConceptConsultingInterview />}
        />
        <Route
          path="/brand/story"
          element={<BrandStoryConsultingInterview />}
        />
        <Route
          path="/brand/story/interview"
          element={<BrandStoryConsultingInterview />}
        />{" "}
        {/* ✅ alias */}
        <Route
          path="/brand/logo/interview"
          element={<LogoConsultingInterview />}
        />
        {/* ✅ 기존 라우트(alias) 유지 */}
        <Route path="/nameconsulting" element={<NamingConsultingInterview />} />
        <Route
          path="/namingconsulting"
          element={<NamingConsultingInterview />}
        />
        <Route
          path="/conceptconsulting"
          element={<ConceptConsultingInterview />}
        />
        <Route
          path="/homepageconsulting"
          element={<ConceptConsultingInterview />}
        />
        <Route
          path="/brand/homepage/interview"
          element={<ConceptConsultingInterview />}
        />{" "}
        {/* legacy */}
        <Route
          path="/brandstoryconsulting"
          element={<BrandStoryConsultingInterview />}
        />
        <Route path="/logoconsulting" element={<LogoConsultingInterview />} />
        {/* ✅ 브랜드/홍보물 결과 단일 페이지 */}
        <Route path="/brand/result" element={<BrandConsultingResult />} />
        <Route path="/promotion/result" element={<PromotionResult />} />
        {/* ✅ 통합 결과 페이지 */}
        <Route path="/mypage/brand-results" element={<BrandAllResults />} />
        <Route
          path="/mypage/promotion-results"
          element={<PromotionAllResults />}
        />
        {/* ✅ 홍보물 컨설팅 */}
        <Route path="/promotion" element={<PromotionPage />} />
        <Route
          path="/promotion/icon/interview"
          element={<ProductIconConsultingInterview />}
        />
        <Route
          path="/promotion/aicut/interview"
          element={<AICutModelConsultingInterview />}
        />
        <Route
          path="/promotion/staging/interview"
          element={<ProductStagingCutConsultingInterview />}
        />
        <Route
          path="/promotion/poster/interview"
          element={<SNSPosterConsultingInterview />}
        />
        {/* ✅ 마이페이지 */}
        <Route path="/mypage" element={<MyPage />} />
        {/* ✅ 투자 라운지 */}
        <Route path="/investment" element={<InvestmentBoard />} />
        <Route path="/investment/new" element={<InvestmentPostCreate />} />
        <Route path="/investment/:id" element={<InvestmentPostDetail />} />
        <Route path="/investment/edit/:id" element={<InvestmentPostEdit />} />
        {/* ✅ 없는 경로는 메인으로 */}
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>

      {/* ✅ 챗봇은 라우트 아래에 떠 있게 */}
      {!shouldHideChatbot && (
        <ChatbotWidget title="AI 도우미" subtitle="무엇을 도와드릴까요?" />
      )}
    </>
  );
}