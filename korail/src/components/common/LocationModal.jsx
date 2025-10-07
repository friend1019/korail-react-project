import React, { useEffect, useState } from "react";
import "styles/common/LocationModal.css";

export default function LocationModal({ onAllow, onDeny }) {
  const [status, setStatus] = useState("loading"); // 'loading' | 'denied' | 'granted'

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setStatus("granted");
        onAllow?.({ lat: latitude, lng: longitude });
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 7000 }
    );
  }, [onAllow]);

  if (status === "granted") return null; // 모달 닫힘

  return (
    <div className="location-modal">
      <div className="location-modal__backdrop"></div>
      <div className="location-modal__content">
        {status === "loading" ? (
          <>
            <h3>현재 위치를 확인 중입니다...</h3>
            <p>잠시만 기다려 주세요.</p>
          </>
        ) : (
          <>
            <h3>위치 접근이 차단되었습니다</h3>
            <p>근처 AED 및 응급의료기관을 표시하려면 위치 권한이 필요합니다.</p>
            <div className="location-modal__buttons">
              <button
                className="btn btn--primary"
                onClick={() => window.location.reload()}
              >
                다시 시도
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => onDeny?.()}
              >
                나중에 설정
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
