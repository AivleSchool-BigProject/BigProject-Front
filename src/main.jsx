// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

/** ✅ 라이브러리 CSS */
import "react-datepicker/dist/react-datepicker.css";

/** ✅ 전역 CSS */
import "./styles/auth/Login.css";
import "./styles/auth/Signup.css";
import "./styles/auth/FindID.css";
import "./styles/auth/FindPassword.css";
import "./styles/main/MainPage.css";
import "./styles/brand/BrandConsulting.css";

import "./styles/diagnosis/DiagnosisHome.css";
import "./styles/diagnosis/DiagnosisInterview.css";

import "./styles/auth/EasyLogin.css";
import "./styles/auth/EasyLoginModal.css";

import "./styles/policy/PolicyModal.css";

import "./styles/layout/SiteHeader.css";
import "./styles/layout/SiteFooter.css";

import "./styles/brand/NamingConsultingInterview.css";
import "./styles/brand/LogoConsultingInterview.css";
import "./styles/brand/ConceptConsultingInterview.css";
import "./styles/flow/ConsultingFlowPanel.css";

import "./styles/promotion/Promotion.css";

import "./styles/mypage/MyPage.css";

import "./styles/brand/BrandConsulting.css";

import "./styles/diagnosis/DiagnosisResult.css";
import "./styles/promotion/PromotionResult.css";
import "./styles/brand/BrandConsultingResult.css";

import "./styles/investment/InvestmentBoard.css";
import "./styles/investment/InvestmentPostCreate.css";
import "./styles/investment/InvestmentPostDetail.css";

import "./styles/brand/BrandStoryConsultingInterview.css";

import "./styles/brand/BrandAllResults.css";

import "./styles/promotion/PromotionAllResults.css";

import "./styles/chatbot/ChatbotWidget.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
