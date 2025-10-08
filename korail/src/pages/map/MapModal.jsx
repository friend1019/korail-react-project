import { memo } from "react";
import { Crosshair } from "lucide-react";
import "styles/map/MapModal.css";

const DEFAULT_INFO = {
  name: "지인대병원",
  distance: 130,
  address: "대전광역시 서구 둔산로 73",
  detail: "설치 위치: 중앙현관 우측",
  phone: "042-000-0000",
};

function formatDistance(meters) {
  if (typeof meters !== "number" || Number.isNaN(meters)) return "";
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)}km`;
  return `${Math.round(meters)}m`;
}

function MapModal({ open, onToggle, highlight = {}, onRelocate }) {
  const safeHighlight =
    highlight && typeof highlight === "object" ? highlight : {};

  const info = {
    ...DEFAULT_INFO,
    ...safeHighlight,
  };

  return (
    <div className={`map-modal${open ? " map-modal--open" : ""}`}>
      <div className="map-modal__surface">
        <button
          type="button"
          className="map-modal__grab"
          onClick={onToggle}
          aria-label={open ? "숨기기" : "펼치기"}
        >
          <span className="map-modal__pill" />
        </button>

        <div className="map-modal__header" onClick={onToggle} role="presentation">
          <p className="map-modal__caption">
            현재 위치와 가까운 AED·응급의료기관을 지도에 표시했어요
          </p>
          {onRelocate ? (
            <button
              type="button"
              className="map-modal__circle-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRelocate();
              }}
              aria-label="현재 위치 중심으로 이동"
            >
              <Crosshair size={18} strokeWidth={2.5} />
            </button>
          ) : null}
        </div>

        <div className="map-modal__content">
          <div className="map-modal__title-row">
            <span className="map-modal__title">{info.name}</span>
            {info.distance ? (
              <span className="map-modal__distance">{formatDistance(info.distance)}</span>
            ) : null}
          </div>

          <div className="map-modal__card">
            {info.address ? (
              <p className="map-modal__address">{info.address}</p>
            ) : null}
            {info.detail ? (
              <p className="map-modal__detail">설치 위치 · {info.detail}</p>
            ) : null}
            {info.phone ? (
              <p className="map-modal__phone">관리자 전화 · {info.phone}</p>
            ) : null}
            {!info.detail && !info.phone ? (
              <p className="map-modal__placeholder">
                상세 정보가 준비되는 대로 안내할 예정입니다.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MapModal);
