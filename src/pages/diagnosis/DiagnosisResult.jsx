// src/pages/DiagnosisResult.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

import PolicyModal from "../../components/policy/PolicyModal.jsx";
import { PrivacyContent, TermsContent } from "../../components/policy/PolicyContents.jsx";

// ✅ 사용자별 localStorage 분리(계정마다 독립 진행)
import { userGetItem, userRemoveItem } from "../../utils/userLocalStorage.js";

const DIAGNOSIS_RESULT_KEY = "diagnosisResult_v1";
const DIAGNOSIS_RESULT_KEY_LEGACY = "diagnosisResult_v1_global";
const DIAGNOSIS_DRAFT_KEYS = [
  "diagnosisInterviewDraft_v1",
  "diagnosisInterviewDraft",
];

// ------------------- 2026-01-30 ---------------------
// AI 결과 더미 데이터 (UI 확인용) - 연동 시 삭제
const DUMMY_AI_RESULT = {
  summary:
    "이 서비스는 개인화와 편의성을 통해 여행 계획의 복잡함을 해소하려는 2030 여성들을 타겟으로 하며, 성장 가능성이 큰 분야에 속해 있습니다.",
  keywords: ["개인화", "AI 여행 큐레이션", "원클릭 편의성"],
  perspectives: {
    business:
      "SaaS 및 플랫폼 기반 서비스로 확장성이 높으며, 구독·프리미엄 큐레이션·제휴 마케팅 등 다양한 수익 모델을 통해 성장할 수 있습니다.",
    user:
      "바쁜 2030 여성들이 겪는 여행 계획 피로를 줄여주고, 개인화된 추천으로 정서적 만족과 시간 절약이라는 가치를 제공합니다.",
    market:
      "MZ세대는 맞춤형 경험과 디지털 도구를 선호하며, AI 큐레이션을 기반으로 한 여행 서비스는 높은 시장 성장 가능성을 가집니다.",
  },
};
// ----------------------------------------------------

function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function stageLabel(stage) {
  const s = String(stage || "");
  if (s === "idea") return "아이디어 단계";
  if (s === "mvp") return "MVP/테스트 중";
  if (s === "pmf") return "PMF 탐색";
  if (s === "revenue") return "매출 발생";
  if (s === "invest") return "투자 유치 진행";
  if (s.includes("단계")) return s;
  return "-";
}

function industryLabel(industry) {
  const s = String(industry || "").toLowerCase();
  if (s === "education") return "교육";
  if (s === "it") return "IT";
  if (s === "finance") return "금융";
  if (s === "commerce") return "커머스";
  if (
    s === "saas_platform" ||
    s === "saas platform" ||
    s === "saas" ||
    s === "saas/플랫폼"
  )
    return "SaaS/플랫폼";
  return industry ? String(industry) : "-";
}

function personaLabel(code) {
  const s = String(code || "");
  if (s === "trend_2030") return "2030 트렌드 세터";
  if (s === "trend2030") return "2030 트렌드 세터";
  return s || "-";
}

function isPlainObject(v) {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function renderText(v) {
  const s = String(v ?? "").trim();
  return s ? s : "-";
}

function toTextArray(v) {
  if (!v) return [];
  if (Array.isArray(v))
    return v.map((x) => String(x ?? "").trim()).filter(Boolean);
  if (typeof v === "string") return [v.trim()].filter(Boolean);
  return [];
}

function Chips({ items }) {
  const arr = toTextArray(items);
  if (!arr.length) return <span style={{ color: "#6b7280" }}>-</span>;
  return (
    <div className="chipList">
      {arr.map((t, i) => (
        <span className="chip" key={`${t}-${i}`}>
          {t}
        </span>
      ))}
    </div>
  );
}

function InfoGrid({ rows }) {
  const items = (rows || []).filter((r) => r && r.k);
  if (!items.length) return null;

  return (
    <div className="summaryGrid">
      {items.map((r) => (
        <div className="summaryItem" key={r.k}>
          <div className="k">{r.k}</div>
          <div className="v" style={{ whiteSpace: "pre-wrap" }}>
            {renderText(r.v)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Block({ title, children, subtitle }) {
  return (
    <div className="block">
      <div className="block__title">
        {title}
        {subtitle ? (
          <span
            style={{
              marginLeft: 8,
              fontSize: 12,
              color: "#6b7280",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </span>
        ) : null}
      </div>
      <div className="block__body" style={{ whiteSpace: "pre-wrap" }}>
        {children}
      </div>
    </div>
  );
}

function Card({ title, sub, children, footer }) {
  return (
    <div className="card">
      <div className="card__head">
        <h2>{title}</h2>
        {sub ? <p>{sub}</p> : null}
      </div>
      {children}
      {footer ? <div style={{ marginTop: 12 }}>{footer}</div> : null}
    </div>
  );
}

function QACard({ qa }) {
  const entries = isPlainObject(qa) ? Object.entries(qa) : [];
  return (
    <Card
      title="인터뷰 Q&A"
      sub="사용자가 실제로 입력한 질문/답변을 보기 좋게 정리했습니다."
    >
      {entries.length ? (
        <div style={{ display: "grid", gap: 10 }}>
          {entries.map(([q, a]) => (
            <div
              key={q}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 12,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 6 }}>{q}</div>
              <div style={{ color: "#111827", whiteSpace: "pre-wrap" }}>
                {renderText(a)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="block">
          <div className="block__body">Q&A 데이터가 없습니다.</div>
        </div>
      )}
    </Card>
  );
}

export default function DiagnosisResult({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [openType, setOpenType] = useState(null);
  const closeModal = () => setOpenType(null);

  // ✅ 브랜드 컨설팅 시작 안내 모달
  const [openBrandStartGuide, setOpenBrandStartGuide] = useState(false);

  const report = useMemo(() => {
    const state = location.state || {};
    const fromState =
      state?.report || state?.result || state?.diagnosisResult || null;
    if (fromState) return fromState;

    const raw =
      userGetItem(DIAGNOSIS_RESULT_KEY) ||
      userGetItem(DIAGNOSIS_RESULT_KEY_LEGACY) ||
      localStorage.getItem(DIAGNOSIS_RESULT_KEY) ||
      null;

    return safeParse(raw);
  }, [location.state]);

  const interviewReport =
    report?.interviewReport || report?.data?.interviewReport || report || null;

  // ✅ 예시 결과(JSON) 구조 대응: interviewReport.analysis / interviewReport.output
  const analysisObj =
    interviewReport?.analysis || interviewReport?.data?.analysis || null;
  const outputObj =
    interviewReport?.output || interviewReport?.data?.output || null;

  // const normalized = useMemo(() => {
  //   // 팀원이 말한 섹션(요약/키워드/관점 3개)을 최대한 “어디에 있든” 찾아서 매핑
  //   const summary =
  //     outputObj?.summary ||
  //     analysisObj?.diagnosis_summary ||
  //     interviewReport?.summary ||
  //     interviewReport?.diagnosis_summary ||
  //     "";

  //   const keywords =
  //     outputObj?.keywords ||
  //     analysisObj?.core_keywords ||
  //     interviewReport?.keywords ||
  //     interviewReport?.core_keywords ||
  //     [];

  //   const persona =
  //     outputObj?.persona ||
  //     analysisObj?.target_persona ||
  //     interviewReport?.persona ||
  //     interviewReport?.target_persona ||
  //     "";

  //   const perspectives =
  //     outputObj?.perspectives ||
  //     analysisObj?.multi_perspective_analysis ||
  //     interviewReport?.perspectives ||
  //     interviewReport?.multi_perspective_analysis ||
  //     {};

  //   return {
  //     summary,
  //     keywords,
  //     persona,
  //     business: perspectives?.business_perspective,
  //     user: perspectives?.user_perspective,
  //     market: perspectives?.market_perspective,
  //     rawQa: analysisObj?.raw_qa || interviewReport?.raw_qa || null,
  //   };
  // }, [analysisObj, outputObj, interviewReport]);

  // -------------------- 2026-01-30 ---------------------
  // AI 더미 확인용
  const normalized = useMemo(() => {
  const summary =
    interviewReport?.output?.summary ||
    interviewReport?.analysis?.diagnosis_summary ||
    DUMMY_AI_RESULT.summary;

  const keywords =
    interviewReport?.output?.keywords ||
    interviewReport?.analysis?.core_keywords ||
    DUMMY_AI_RESULT.keywords;

  const perspectives =
    interviewReport?.output?.perspectives ||
    interviewReport?.analysis?.multi_perspective_analysis ||
    {};

  return {
    summary,
    keywords,
    business:
      perspectives.business_perspective ||
      DUMMY_AI_RESULT.perspectives.business,
    user:
      perspectives.user_perspective || DUMMY_AI_RESULT.perspectives.user,
    market:
      perspectives.market_perspective ||
      DUMMY_AI_RESULT.perspectives.market,
  };
}, [interviewReport]);
// --------------------------------------------------


  // (기존 RAG 관련 추출 로직은 “선택 보기” 섹션에서만 사용)
  const rag = interviewReport?.rag_context || interviewReport?.ragContext || {};
  const step1 =
    rag?.step_1_analysis || rag?.step1_analysis || rag?.step1Analysis || {};
  const rawAnswers =
    rag?.step_1_raw_answers || rag?.step1_raw_answers || rag?.rawAnswers || {};

  const brandId = useMemo(() => {
    return (
      report?.brandId ??
      report?.data?.brandId ??
      interviewReport?.brandId ??
      location.state?.brandId ??
      null
    );
  }, [report, interviewReport, location.state]);

  const lastSaved = useMemo(() => {
    const t = report?.updatedAt || interviewReport?.updatedAt || null;
    if (!t) return "-";
    const d = new Date(t);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
  }, [report, interviewReport]);

  const goInterview = () => navigate("/diagnosis/interview");
  const goHome = () => navigate("/diagnosis");

  const goBrandConsultingStart = () => {
    const qs = brandId ? `?brandId=${encodeURIComponent(String(brandId))}` : "";
    navigate(`/brand/naming/interview${qs}`);
  };

  const handleReset = () => {
    DIAGNOSIS_DRAFT_KEYS.forEach((k) => userRemoveItem(k));
    userRemoveItem(DIAGNOSIS_RESULT_KEY);
    userRemoveItem(DIAGNOSIS_RESULT_KEY_LEGACY);
    localStorage.removeItem(DIAGNOSIS_RESULT_KEY);
    alert("기업진단 입력/결과 데이터를 초기화했습니다.");
    navigate("/diagnosis/interview");
  };

  const inputSummaryRows = useMemo(() => {
    if (!rawAnswers) return [];
    return [
      { k: "회사/프로젝트명", v: rawAnswers.companyName },
      { k: "웹사이트/링크", v: rawAnswers.website },
      { k: "한 줄 소개", v: rawAnswers.oneLine },
      { k: "고객 문제", v: rawAnswers.customerProblem },
      { k: "타깃 페르소나", v: personaLabel(rawAnswers.targetPersona) },
      { k: "USP", v: rawAnswers.usp },
      { k: "성장 단계", v: stageLabel(rawAnswers.stage) },
      { k: "산업군", v: industryLabel(rawAnswers.industry) },
      { k: "비전 헤드라인", v: rawAnswers.visionHeadline },
    ].filter((x) => String(x.v ?? "").trim());
  }, [rawAnswers]);

  const progress = interviewReport ? 100 : 0;
  const requiredDone = interviewReport ? 1 : 0;
  const requiredTotal = 1;

  return (
    <div className="diagResult">
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

      {/* ✅ 브랜드 컨설팅 시작 안내 모달 */}
      <PolicyModal
        open={openBrandStartGuide}
        title="브랜드 컨설팅 시작 안내"
        onClose={() => setOpenBrandStartGuide(false)}
      >
        <div style={{ lineHeight: 1.7, color: "#111827" }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>
            네이밍부터 순서대로 진행됩니다.
          </div>

          <div style={{ marginTop: 10, color: "#374151" }}>
            브랜드 컨설팅은 아래 순서로 진행돼요.
          </div>

          <ul style={{ marginTop: 10, paddingLeft: 18, color: "#374151" }}>
            <li>
              진행 순서: <b>네이밍 → 컨셉 → 스토리 → 로고</b>
            </li>
            <li>
              진행 중 이탈(뒤로가기/메뉴 이동/새로고침 등) 시{" "}
              <b>이탈 방지 안내</b>가 표시됩니다.
            </li>
            <li>
              중간에 나가면 <b>네이밍부터 다시 진행</b>하도록 구성되어 있습니다.
            </li>
          </ul>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "rgba(0,0,0,0.03)",
              fontSize: 13,
              color: "#374151",
            }}
          >
            * 다음 단계에서 만든 결과는 최종 리포트에 반영됩니다.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              type="button"
              className="btn ghost"
              onClick={() => setOpenBrandStartGuide(false)}
              style={{ flex: 1 }}
            >
              취소
            </button>
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                setOpenBrandStartGuide(false);
                goBrandConsultingStart();
              }}
              style={{ flex: 1 }}
            >
              확인하고 시작
            </button>
          </div>
        </div>
      </PolicyModal>

      <SiteHeader onLogout={onLogout} />

      <main className="diagResult__main">
        <div className="diagResult__container">
          <div className="diagResult__titleRow">
            <div>
              <h1 className="diagResult__title">기업 진단 결과 리포트</h1>
              <p className="diagResult__sub">
                팀 규칙: <b>요약 → 키워드 → 기업/유저/시장 관점</b> 순서로
                보여줍니다.
                {brandId ? ` (brandId: ${brandId})` : ""}
              </p>
            </div>

            <div className="diagResult__topActions">
              <button type="button" className="btn ghost" onClick={goHome}>
                기업진단 홈
              </button>
              <button type="button" className="btn" onClick={goInterview}>
                인터뷰로 돌아가기
              </button>
            </div>
          </div>

          <div className="diagResult__grid">
            <section className="diagResult__left">
              {!interviewReport ? (
                <div className="card">
                  <div className="card__head">
                    <h2>저장된 결과가 없습니다</h2>
                    <p>
                      인터뷰에서 <b>AI 분석 요청</b>을 누르면 결과가 생성됩니다.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      className="btn primary"
                      onClick={goInterview}
                    >
                      인터뷰 작성하러 가기
                    </button>
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={goHome}
                    >
                      기업진단 홈
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* ✅ 메인 리포트: 팀원이 말한 순서대로 고정 */}
                  <Card
                    title="AI 진단 리포트"
                    sub="요약 → 키워드 → 기업/유저/시장 관점 분석 순서로 정리했어요."
                    footer={
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        마지막 저장: {lastSaved}
                      </div>
                    }
                  >
                    <InfoGrid
                      rows={[
                        { k: "타깃 페르소나", v: normalized.persona },
                      ].filter((x) => String(x.v ?? "").trim())}
                    />

                    <Block title="요약">{renderText(normalized.summary)}</Block>

                    <div style={{ marginTop: 12 }}>
                      <div className="sectionTitle">키워드</div>
                      <Chips items={normalized.keywords} />
                    </div>

                    <Block title="기업 입장">{renderText(normalized.business)}</Block>
                    <Block title="유저 입장">{renderText(normalized.user)}</Block>
                    <Block title="시장 입장">{renderText(normalized.market)}</Block>
                  </Card>

                  {/* ✅ 선택(접기): 디버깅/검증용 정보들 */}
                  <div className="detailsWrap">
                    <details>
                      <summary>입력/근거 데이터(선택) 보기</summary>

                      <Card
                        title="인터뷰 입력 요약"
                        sub="원본 답변 전체를 JSON으로 보여주지 않고, 핵심 필드만 추려서 정리합니다."
                      >
                        <InfoGrid rows={inputSummaryRows} />
                      </Card>

                      <Card
                        title="근거 기반 분석(RAG, 선택)"
                        sub="현재 백 응답에 RAG가 있으면 참고용으로 보여줍니다."
                      >
                        <InfoGrid
                          rows={[
                            { k: "분석 요약", v: step1.summary },
                            { k: "핵심 인사이트", v: step1.key_insights },
                          ]}
                        />
                        <div style={{ marginTop: 12 }}>
                          <div className="sectionTitle">키워드</div>
                          <Chips items={step1.keywords} />
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <div className="sectionTitle">상세 분석</div>
                          <div style={{ whiteSpace: "pre-wrap", color: "#111827" }}>
                            {renderText(step1.analysis)}
                          </div>
                        </div>
                      </Card>

                      {/* analysis.raw_qa 또는 기존 rawAnswers.qa 둘 중 있는 걸 보여줌 */}
                      <QACard qa={normalized.rawQa || rawAnswers.qa} />
                    </details>
                  </div>
                </>
              )}
            </section>

            <aside className="diagResult__right">
              <div className="sideCard">
                <div className="sideCard__titleRow">
                  <h3>진행/상태</h3>
                  <span className="badge">{progress}%</span>
                </div>

                <div
                  className="progressBar"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <div
                    className="progressBar__fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="sideMeta">
                  <div className="sideMeta__row">
                    <span className="k">현재 단계</span>
                    <span className="v">{interviewReport ? "완료" : "-"}</span>
                  </div>
                  <div className="sideMeta__row">
                    <span className="k">필수 완료</span>
                    <span className="v">
                      {requiredDone}/{requiredTotal}
                    </span>
                  </div>
                  <div className="sideMeta__row">
                    <span className="k">마지막 저장</span>
                    <span className="v">{lastSaved}</span>
                  </div>
                </div>

                <div className="divider" />

                <button
                  type="button"
                  className="btn primary w100"
                  onClick={goInterview}
                >
                  입력 수정하기
                </button>

                <button
                  type="button"
                  className="btn ghost w100"
                  onClick={handleReset}
                  style={{ marginTop: 10 }}
                >
                  처음부터 다시하기(초기화)
                </button>

                <p className="hint">
                  * 인터뷰에서 “AI 요약 결과 보기” 요청이 성공하면 결과가 표시됩니다.
                </p>
              </div>

              {interviewReport ? (
                <div className="sideCard" style={{ marginTop: 14 }}>
                  <div className="sideCard__titleRow">
                    <h3>다음 단계</h3>
                    <span className="badge">완료</span>
                  </div>

                  <div style={{ marginTop: 8, color: "#111827" }}>
                    <b>기업 진단이 완료되었습니다.</b>
                    <div
                      style={{
                        marginTop: 6,
                        color: "#374151",
                        lineHeight: 1.55,
                      }}
                    >
                      이제 브랜드 컨설팅에서{" "}
                      <b>네이밍 · 컨셉 · 스토리 · 로고</b>까지 이어서 도와드릴게요.
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn primary w100"
                    onClick={() => setOpenBrandStartGuide(true)}
                    style={{ marginTop: 12 }}
                  >
                    브랜드 컨설팅 시작하기
                  </button>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter onOpenPolicy={setOpenType} />
    </div>
  );
}