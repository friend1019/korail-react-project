/* global naver */
import { useEffect, useRef, useState } from "react";

export default function Map() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const { naver } = window;
    if (!naver || !mapRef.current) return;

    // 기본 지도 설정
    const mapOptions = {
      center: new naver.maps.LatLng(37.5665, 126.9780), // 기본값: 서울시청
      zoom: 15,
      minZoom: 5,
    };
    const mapInstance = new naver.maps.Map(mapRef.current, mapOptions);
    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (!map || !navigator.geolocation) return;

    // 내 위치 마커 생성
    const myMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(37.5665, 126.9780),
      map,
      icon: {
        content: `
          <div style="
            width: 1.2rem; height: 1.2rem;
            background: #007aff;
            border-radius: 50%;
            border: 0.25rem solid rgba(0,122,255,0.25);
            box-shadow: 0 0 0.6rem rgba(0,122,255,0.35);
          "></div>
        `,
        anchor: new naver.maps.Point(6, 6),
      },
    });
    markerRef.current = myMarker;

    // 🔄 실시간 위치 추적 (watchPosition)
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLatLng = new naver.maps.LatLng(latitude, longitude);

        // 마커 이동
        myMarker.setPosition(newLatLng);

        // 지도 중심 부드럽게 이동
        map.panTo(newLatLng);
      },
      (err) => {
        console.warn("위치 추적 실패:", err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [map]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "calc(100vh - 12rem)",
      }}
    />
  );
}
