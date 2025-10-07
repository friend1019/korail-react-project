// src/components/manual/Manual.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ManualHeader from "./ManualHeader";
import "styles/manual/Manual.css";

// 아이콘 불러오기
import manual1 from "assets/manual/manual1.svg";
import manual2 from "assets/manual/manual2.svg";
import manual3 from "assets/manual/manual3.svg";
import manual4 from "assets/manual/manual4.svg";
import manual5 from "assets/manual/manual5.svg";
import manual6 from "assets/manual/manual6.svg";
import manual7 from "assets/manual/manual7.svg";
import manual8 from "assets/manual/manual8.svg";
import manual9 from "assets/manual/manual9.svg";
import manual10 from "assets/manual/manual10.svg";

export default function Manual() {
  const navigate = useNavigate();

  const sections = [
    {
      id: "life-support",
      title: "생명구조",
      desc: "“지금 당장 안 하면 위험함” 즉시 행동 항목.",
      items: [
        { key: "cpr-aed", title: ["CPR / AED"], icon: manual1, to: "/manual/cpr-aed" },
        { key: "airway", title: ["기도폐쇄"], caption: ["(하임리히)"], icon: manual2, to: "/manual/airway" },
      ],
    },
    {
      id: "trauma",
      title: "외상 응급",
      desc: "외부 손상·부상에 대한 처치.",
      items: [
        { key: "bleeding", title: ["출혈/상처"], caption: ["(지혈·상처처치)"], icon: manual3, to: "/manual/bleeding" },
        { key: "burn", title: ["화상"], caption: ["(열/저온/전기)"], icon: manual4, to: "/manual/burn" },
        { key: "fracture", title: ["골절/염좌/탈구"], icon: manual5, to: "/manual/fracture" },
      ],
    },
    {
      id: "medical",
      title: "의학적 응급",
      desc: "내과적·신경계 증상 위주, 빠른 병원 이송 판단.",
      items: [
        { key: "stroke", title: ["뇌졸중"], caption: ["(FAST)"], icon: manual6, to: "/manual/stroke" },
        { key: "seizure", title: ["경련/발작"], icon: manual7, to: "/manual/seizure" },
        { key: "anaphylaxis", title: ["알레르기 쇼크 /", "아나필락시스"], caption: ["(EpiPen)"], icon: manual8, to: "/manual/anaphylaxis" },
      ],
    },
    {
      id: "environment",
      title: "환경·상황",
      desc: "환경 요인이나 장소 특성으로 발생.",
      items: [
        { key: "drowning", title: ["익수/물놀이"], icon: manual9, to: "/manual/drowning" },
        { key: "heat", title: ["폭염/온열질환"], icon: manual10, to: "/manual/heat" },
      ],
    },
  ];

  return (
    <div className="manual-wrap">
      <ManualHeader title="메뉴얼" showBack={false} />

      {/* 검색 카드 */}
      <section className="manual-search">
        <button
          type="button"
          className="manual-search__box"
          aria-label="AI 검색 열기"
          onClick={() => navigate("/manual/search")}
        >
          <span className="manual-search__badge" aria-hidden>✦ AI 검색</span>
          <span className="manual-search__placeholder">사람이 목에 걸렸어요</span>
          <span className="manual-search__icon" aria-hidden>🔍</span>
        </button>
      </section>

      {/* 섹션들 */}
      {sections.map((sec) => (
        <section key={sec.id} className="manual-section" aria-labelledby={`${sec.id}-title`}>
          <h2 id={`${sec.id}-title`} className="manual-section__title">{sec.title}</h2>
          {sec.desc && <p className="manual-section__desc">{sec.desc}</p>}

          <ul className="manual-grid">
            {sec.items.map((item) => (
              <li key={item.key} className="manual-card">
                <button
                  type="button"
                  className="manual-card__button"
                  onClick={() => navigate(item.to)}
                  aria-label={`${item.title.join(" ")} 이동`}
                >
                  {/* 아이콘 영역 */}
                  <div className="icon-slot" aria-hidden>
                    <img src={item.icon} alt="" />
                  </div>

                  <div className="manual-card__text">
                    {item.title.map((line, i) => (
                      <span key={i} className="manual-card__title-line">{line}</span>
                    ))}
                    {item.caption?.map((line, i) => (
                      <span key={i} className="manual-card__caption">{line}</span>
                    ))}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
