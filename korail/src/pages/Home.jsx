import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/Home.css";

import { Crosshair } from "lucide-react";
import emergencyIcon from "assets/home/emergency.svg";
import commonIcon from "assets/home/common.svg";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  ""; // 없으면 빈 문자열

// ----- 더미 데이터 -----
const DUMMY_AED = [
  {
    id: "aed1",
    name: "지인대병원",
    distance: 130,
    desc: "Lorem ipsum dolor sit amet consectetur. Odio nulla ut lectus blandit et faucibus.",
  },
  {
    id: "aed2",
    name: "서산시 보건소",
    distance: 310,
    desc: "Pellentesque id ante lacus leo diam justo adipiscing.",
  },
  {
    id: "aed3",
    name: "한서대학교 AED",
    distance: 520,
    desc: "캠퍼스 내 학생회관 1층 안내데스크 옆.",
  },
];

const DUMMY_ER = [
  {
    id: "er1",
    name: "지인대병원 응급의료센터",
    distance: 130,
    desc: "24시간 운영. 중증 응급환자 수용 가능.",
  },
  {
    id: "er2",
    name: "서산중앙병원 응급실",
    distance: 480,
    desc: "성인·소아 진료, CT 보유.",
  },
  {
    id: "er3",
    name: "태안의료원 응급실",
    distance: 1200,
    desc: "주말/야간 진료, 구급차 연계.",
  },
];

// ----- 유틸: API 시도 후 실패 시 더미 폴백 -----
async function loadNearby(type) {
  if (!API_BASE) return type === "aed" ? DUMMY_AED : DUMMY_ER;

  try {
    const res = await fetch(`${API_BASE}/nearby?type=${type}`);
    if (!res.ok) throw new Error("bad status");
    const json = await res.json();
    const list = json?.data || json?.results || json;
    if (!Array.isArray(list) || list.length === 0) {
      return type === "aed" ? DUMMY_AED : DUMMY_ER;
    }
    return list;
  } catch {
    return type === "aed" ? DUMMY_AED : DUMMY_ER;
  }
}

async function fetchAddress(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  const data = await res.json();
  let name = data?.display_name || "현재 위치";

  // ✅ "대한민국" 제거
  name = name.replace(/,?\s*대한민국\s*$/g, "");

  // ✅ 우편번호(5자리 숫자) 제거
  name = name.replace(/\b\d{5}\b,?\s*/g, "");

  // ✅ 양쪽 공백 및 쉼표 정리
  name = name.trim().replace(/,\s*,/g, ",").replace(/^,|,$/g, "");

  return name || "현재 위치";
}

// ----- 현재 위치 라벨 (자동 갱신) -----
function useLocationLabel() {
  const [label, setLabel] = useState("현재 위치 확인 중…");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLabel("위치 정보를 사용할 수 없습니다");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const address = await fetchAddress(latitude, longitude);
          setLabel(address);
        } catch {
          setLabel(`(${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
        }
      },
      () => setLabel("위치 정보를 불러올 수 없습니다"),
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return label;
}

// ========================== 메인 컴포넌트 ==========================
export default function Home() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("aed"); // "aed" | "er"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const locationLabel = useLocationLabel();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await loadNearby(mode);
      if (mounted) {
        setItems(data);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [mode]);

  const titleByMode = useMemo(
    () =>
      mode === "aed" ? "내 근처 AED(자동제세동기)" : "내 근처 응급의료기관",
    [mode]
  );

  return (
    <div className="home-wrap">
      {/* 상단 히어로 */}
      <section className="home-hero">
        <p className="home-hero__lead">
          응급상황이신가요? <br />
          응급 시 <strong>119 신고</strong>가 가장 먼저입니다!
        </p>

        <div className="mode-grid">
          <button
            className="mode-card mode-card--emergency"
            onClick={() => navigate("/map?type=emergency")}
          >
            <div className="mode-card__texts">
              <div className="mode-card__title">응급</div>
              <div className="mode-card__desc">가까운 AED/응급실 안내</div>
            </div>
            <img className="mode-card__icon" src={emergencyIcon} alt="" />
          </button>

          <button
            className="mode-card mode-card--general"
            onClick={() => navigate("/map?type=general")}
          >
            <div className="mode-card__texts">
              <div className="mode-card__title">일반</div>
              <div className="mode-card__desc">AI 기반 의료기관 탐색</div>
            </div>
            <img className="mode-card__icon" src={commonIcon} alt="" />
          </button>
        </div>
      </section>

      {/* 근처 AED / ER 섹션 */}
      <section className="home-nearby">
        <div className="nearby-head">
          <div className="nearby-left">
            <div className="nearby-location">
              <Crosshair className="gps-icon" aria-hidden />
              {locationLabel}
            </div>
            <h3 className="nearby-title">{titleByMode}</h3>
          </div>
        </div>

        {/* 칩 + 모두보기 */}
        <div className="nearby-controls">
          <div className="nearby-chips">
            <button
              className={`chip ${mode === "aed" ? "chip--active" : ""}`}
              onClick={() => setMode("aed")}
            >
              AED 자동제세동기
            </button>
            <button
              className={`chip ${mode === "er" ? "chip--active" : ""}`}
              onClick={() => setMode("er")}
            >
              ER 응급의료기관
            </button>
          </div>

          <button className="nearby-more" onClick={() => navigate("/map")}>
            모두보기
          </button>
        </div>

        {/* 카드 리스트 */}
        <ul className="home-cards">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <li key={`skel-${i}`} className="place-card is-skeleton">
                  <div className="place-thumb" />
                  <div className="place-meta">
                    <div className="skel skel--line" />
                    <div className="skel skel--title" />
                    <div className="skel skel--para" />
                  </div>
                </li>
              ))
            : items.map((it, idx) => (
                <li
                  key={it.id || `${mode}-${idx}`}
                  className="place-card"
                  onClick={() =>
                    navigate(
                      `/map?focus=${encodeURIComponent(it.id || it.name)}`
                    )
                  }
                >
                  <div className="place-thumb" />
                  <div className="place-meta">
                    <div className="place-distance">{it.distance}m</div>
                    <div className="place-name">{it.name}</div>
                    <p className="place-desc">{it.desc}</p>
                  </div>
                </li>
              ))}
        </ul>
      </section>
    </div>
  );
}
