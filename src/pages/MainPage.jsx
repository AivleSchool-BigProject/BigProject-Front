// src/pages/MainPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import analyzeCompany from "../Image/main_image/companyanalyze.png";
import makeset from "../Image/main_image/Brandingconsult.png";
import story from "../Image/main_image/PromotionalConsulting.png";

import PolicyModal from "../components/PolicyModal.jsx";
import { PrivacyContent, TermsContent } from "../components/PolicyContents.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import { apiRequest } from "../api/client.js";

export default function MainPage({ onLogout }) {
  const navigate = useNavigate();

  const handleDiagnosisClick = () => navigate("/diagnosis");
  const handleBrandPage = () => navigate("/brandconsulting");

  // 정책 모달
  const [openType, setOpenType] = useState(null);
  const closeModal = () => setOpenType(null);

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
            ? item.hashtags.map((tag) => tag.trim()).filter(Boolean)
            : [];
          const company = item.companyName || "회사명";
          const locationText = item.region || "";
          const sizeText = item.companySize || "";
          const meta = [sizeText, locationText].filter(Boolean).join(", ");
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
      } catch (error) {
        console.error(error);
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
      <PolicyModal
        open={openType === "privacy"}
        title="개인정보 처리방침"
        onClose={closeModal}
      >
        <PrivacyContent />
      </PolicyModal>

      <PolicyModal open={openType === "terms"} title="이용약관" onClose={closeModal}>
        <TermsContent />
      </PolicyModal>

      <SiteHeader
        onLogout={onLogout}
        onBrandPick={(action) => {
          if (action === "logo") navigate("/logoconsulting");
          if (action === "naming") navigate("/namingconsulting");
          if (action === "homepage") navigate("/homepageconsulting");
        }}
      />

      <main className="main-content">
        <h2 className="section-title">컨설팅 시작하기</h2>

        <div className="card-grid">
          <article
            className="info-card"
            role="button"
            tabIndex={0}
            onClick={handleDiagnosisClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleDiagnosisClick();
            }}
          >
            <div className="card-image">
              <img src={analyzeCompany} alt="기업 진단 & 인터뷰" />
            </div>
            <div className="card-body">
              <p className="card-tag">Company Analyze</p>
              <h3>기업 진단 &amp; 인터뷰</h3>
              <p className="card-desc">
                기업의 현황을 정밀하게 분석하고 핵심 인사이트를 제공합니다.
              </p>
            </div>
          </article>

          <article
            className="info-card"
            role="button"
            tabIndex={0}
            onClick={handleBrandPage}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleBrandPage();
            }}
          >
            <div className="card-image alt">
              <img src={makeset} alt="브랜드 컨설팅" />
            </div>
            <div className="card-body">
              <p className="card-tag">Brand Consulting</p>
              <h3>브랜드 컨설팅</h3>
              <p className="card-desc">
                기업의 이미지와 정체성을 정교하게 다듬습니다.
              </p>
            </div>
          </article>

          <article
            className="info-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/promotion")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate("/promotion");
            }}
          >
            <div className="card-image third">
              <img src={story} alt="홍보물 컨설팅" />
            </div>
            <div className="card-body">
              <p className="card-tag">Promotional Consulting</p>
              <h3>홍보물 컨설팅</h3>
              <p className="card-desc">
                기업 전반의 소개와 홍보 과정을 기획하고 제안합니다.
              </p>
            </div>
          </article>
        </div>

        <section className="deal-board" aria-label="투자 라운지 요약">
          <div className="deal-header">
            <div>
              <p className="deal-eyebrow">브랜딩과 성장을 준비하는 기업을 한곳에서 만나보세요.</p>
              <h3 className="deal-title">투자 라운지</h3>
            </div>

            <button
              type="button"
              className="deal-more"
              onClick={() => navigate("/investment")}
            >
              전체보기 &gt;
            </button>
          </div>

          <div className="deal-grid">
            {dealLoading ? (
              <div className="deal-card">
                <div>
                  <h4>불러오는 중...</h4>
                  <p>투자 라운지 게시글을 불러오는 중입니다.</p>
                </div>
              </div>
            ) : dealError ? (
              <div className="deal-card">
                <div>
                  <h4>불러오기 실패</h4>
                  <p>{dealError}</p>
                </div>
              </div>
            ) : dealItems.length === 0 ? (
              <div className="deal-card">
                <div>
                  <h4>등록된 기업이 없습니다.</h4>
                  <p>투자 라운지에서 첫 게시글을 등록해 주세요.</p>
                </div>
              </div>
            ) : (
              dealItems.map((item) => (
                <article
                  key={item.id}
                  className="deal-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/investment/${item.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      navigate(`/investment/${item.id}`);
                  }}
                >
                  <div className="deal-card-head">
                    <div>
                      <h4>{item.company}</h4>
                      <p>{item.oneLiner || "한 줄 소개가 없습니다."}</p>
                      <p className="deal-meta">{item.meta || "지역/규모 정보 없음"}</p>
                    </div>
                    <div className="deal-logo">
                      {item.logoImageUrl ? (
                        <img src={item.logoImageUrl} alt={`${item.company} 로고`} />
                      ) : (
                        item.company.slice(0, 2)
                      )}
                    </div>
                  </div>
                  <div className="deal-tags">
                    {item.tags.length === 0 ? (
                      <span>태그 없음</span>
                    ) : (
                      item.tags.map((tag) => <span key={tag}>#{tag}</span>)
                    )}
                  </div>
                  <div className="deal-footer">
                    <strong>업데이트: {item.updatedAt}</strong>
                    <button type="button">↗</button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <SiteFooter onOpenPolicy={setOpenType} />
    </div>
  );
}
