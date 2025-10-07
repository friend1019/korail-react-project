import React from "react";
import ManualHeader from "../ManualHeader";
import "styles/manual/pages/ManualDetail.css"; // 경로는 프로젝트 별칭에 맞게 조정

export default function Heat() {
  return (
    <div className="manual-wrap">
      <ManualHeader title="CPR / AED" />

      <main className="manual-detail">
        {/* 헤드 */}
        <header className="detail-header">
          <h2 className="detail-title detail-title--accent">CPR / AED</h2>
          <p className="detail-subtitle">
            의식·호흡이 없을 때 생명을 살리는 최우선 처치.
          </p>
        </header>

        {/* 콜아웃(첫 행동 / 주의) */}
        <section className="detail-block">
          <div className="callout">
            <div className="callout__label callout__label--primary">첫 행동</div>
            <p className="callout__text">
              반응·호흡 확인 → 119 → 즉시 가슴압박 100~120회/분 시작 → 가능하면 AED 사용.
            </p>
          </div>

          <div className="callout">
            <div className="callout__label callout__label--warn">주의</div>
            <p className="callout__text">
              맨손 압박 주저하지 말기 / 불필요한 인공호흡 강박 금지(교육 받은 경우만).
            </p>
          </div>
        </section>

        {/* 추천 영상 카드 */}
        <section className="detail-videos">
          <a
            className="video-card"
            href="https://www.youtube.com/watch?v=xxxxxxxx"
            target="_blank"
            rel="noreferrer"
          >
            <div className="video-thumb">
              {/* 썸네일 이미지는 아래 img에 src만 채워 넣으면 됨 */}
              {/* <img src={thumb1} alt="호흡확인 교육 영상 썸네일" /> */}
              <div className="detail-badge">호흡확인</div>
            </div>
            <div className="video-meta">
              <div className="video-channel">소방청TV</div>
              <div className="video-title">
                [소방청N] - 전문가가 상세히 보여드리는 ‘심폐소생술&자동심장충격기(AED)’의 A to Z
              </div>
            </div>
          </a>

          <a
            className="video-card"
            href="https://www.youtube.com/watch?v=yyyyyyyy"
            target="_blank"
            rel="noreferrer"
          >
            <div className="video-thumb">
              {/* <img src={thumb2} alt="심폐소생술 이렇게 합니다 썸네일" /> */}
            </div>
            <div className="video-meta">
              <div className="video-channel">질병관리청 아프지마TV</div>
              <div className="video-title">
                [생명을 살리는 심폐소생술] 5. 심폐소생술! 이렇게 합니다.
              </div>
            </div>
          </a>
        </section>
      </main>
    </div>
  );
}
