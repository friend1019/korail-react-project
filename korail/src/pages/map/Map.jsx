import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "libs/api.js";
import "styles/map/Map.css";
import MapModal from "./MapModal";
import manualIcon from "assets/manual/manual1.svg";

const DAEJEON_CITY_HALL = { lat: 36.3504, lng: 127.3845 };

function normalizeAedInfo(item) {
  if (!item || typeof item !== "object") return null;

  const name =
    item.buildAddress ||
    item.name ||
    item.facilityName ||
    item.installationPlace ||
    item.centerName ||
    item.place ||
    item.spot ||
    item.title ||
    "AED 위치";

  const distance =
    typeof item.distance === "number"
      ? item.distance
      : typeof item.meter === "number"
      ? item.meter
      : typeof item.range === "number"
      ? item.range
      : null;

  const address =
    item.buildAddress ||
    "";

  const detail =
    item.buildPlace ||
    "";

  const phone =
    item.managerTel ||
    "";

  return {
    name,
    distance,
    address,
    detail,
    phone,
  };
}

export default function Map() {
  const mapRef = useRef(null);
  const markerRef = useRef(null); // my location marker
  const aedMarkersRef = useRef([]); // AED markers
  const clustererRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [highlight, setHighlight] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const infoWindowRef = useRef(null);
  const hasCenteredRef = useRef(false);

  // 1) 지도 생성
  useEffect(() => {
    const { naver } = window;
    if (!naver || !mapRef.current) return;

    const mapOptions = {
      center: new naver.maps.LatLng(
        DAEJEON_CITY_HALL.lat,
        DAEJEON_CITY_HALL.lng
      ),
      zoom: 20,
      // 네이버 API 요구사항에 맞춰 최소 줌 레벨을 6 이상으로 지정
      minZoom: 6,
      maxZoom: 20,
    };
    const mapInstance = new naver.maps.Map(mapRef.current, mapOptions);
    setMap(mapInstance);
  }, []);

  // 클러스터러 초기화
  useEffect(() => {
    const { naver } = window;
    if (!map || !naver?.maps?.MarkerClustering) return;

    const clusterIcon = {
      content: '<div class="map-cluster"><span>0</span></div>',
      size: new naver.maps.Size(46, 46),
      anchor: new naver.maps.Point(23, 23),
    };

    const clusterer = new naver.maps.MarkerClustering({
      map,
      minClusterSize: 2,
      maxZoom: 16,
      gridSize: 120,
      averageCenter: true,
      disableClickZoom: false,
      icons: [clusterIcon],
      indexGenerator: [10, 20, 30, 50, 100],
      stylingFunction(clusterMarker, count) {
        const el = clusterMarker.getElement();
        if (!el) return;
        const span = el.querySelector("span");
        if (span) {
          span.textContent = count > 99 ? "99+" : String(count);
        }
      },
    });

    clustererRef.current = clusterer;

    if (aedMarkersRef.current.length > 0) {
      clusterer.setMarkers([...aedMarkersRef.current]);
    }

    return () => {
      clusterer.setMap(null);
      clustererRef.current = null;
    };
  }, [map]);

  // 2) 사용자 위치 추적 마커
  useEffect(() => {
    const { naver } = window;
    if (!map || !navigator.geolocation) return;

    let cancelled = false;

    const ensureMarker = () => {
      if (!markerRef.current) {
        markerRef.current = new naver.maps.Marker({
          map,
          zIndex: 1000,
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
      } else if (!markerRef.current.getMap()) {
        markerRef.current.setMap(map);
      }
      return markerRef.current;
    };

    const handleSuccess = (pos) => {
      if (cancelled) return;
      const { latitude, longitude } = pos.coords;
      const latLng = new naver.maps.LatLng(latitude, longitude);
      const marker = ensureMarker();
      marker.setPosition(latLng);

      if (!hasCenteredRef.current) {
        map.setZoom(15);
        map.panTo(latLng);
        hasCenteredRef.current = true;
      }
    };

    const handleError = (err) => {
      console.warn("위치 추적 실패:", err);
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    });

    return () => {
      cancelled = true;
      navigator.geolocation.clearWatch(watchId);
      if (markerRef.current) markerRef.current.setMap(null);
    };
  }, [map]);

  /*
  // 2) 내 위치 추적 마커 (향후 재사용 예정)
  useEffect(() => {
    const { naver } = window;
    if (!map || !navigator.geolocation) return;

    const myMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(37.5665, 126.9780),
      map,
      zIndex: 1000,
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

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLatLng = new naver.maps.LatLng(latitude, longitude);
        myMarker.setPosition(newLatLng);
        map.panTo(newLatLng);
      },
      (err) => {
        console.warn("위치 추적 실패:", err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (markerRef.current) markerRef.current.setMap(null);
    };
  }, [map]);
  */

  // 3) AED 위치 불러와서 빨간 점 마커로 표시
  useEffect(() => {
    const { naver } = window;
    if (!map) return;

    let isCanceled = false;

    async function loadAeds() {
      try {
        const data = await api("/aed/Daegeon"); // [{ id, latitude, longitude, ... }, ...]

        if (isCanceled) return;

        // 기존 AED 마커 제거
        aedMarkersRef.current.forEach((m) => m.setMap(null));
        aedMarkersRef.current = [];
        if (clustererRef.current) {
          clustererRef.current.setMarkers([]);
        }

        const list = Array.isArray(data) ? data : [];

        if (list.length === 0) {
          setHighlight(null);
          setSelectedPoint(null);
        } else {
          const firstValid = list.find(
            (item) =>
              typeof item?.latitude === "number" &&
              typeof item?.longitude === "number"
          );

          if (firstValid) {
            setHighlight(normalizeAedInfo(firstValid));
            setSelectedPoint({
              lat: firstValid.latitude,
              lng: firstValid.longitude,
            });
          }
        }

        const bounds = new naver.maps.LatLngBounds();

        const markers = list
          .filter(
            (d) =>
              typeof d.latitude === "number" && typeof d.longitude === "number"
          )
          .map((d) => {
            const pos = new naver.maps.LatLng(d.latitude, d.longitude);
            const meta = normalizeAedInfo(d);
            const marker = new naver.maps.Marker({
              position: pos,
              map: null,
              zIndex: 900, // 내 위치보다 아래
              icon: {
                content: `
                  <div style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.95);
                    border: 6px solid rgba(244, 63, 94, 0.25);
                    box-shadow: 0 8px 18px rgba(244,63,94,0.25);
                  ">
                    <img src="${manualIcon}" alt="AED" style="width: 20px; height: 20px;" />
                  </div>
                `,
                anchor: new naver.maps.Point(22, 22),
              },
            });
            bounds.extend(pos);

            if (meta) {
              naver.maps.Event.addListener(marker, "click", () => {
                setHighlight(meta);
                setSelectedPoint({ lat: d.latitude, lng: d.longitude });
                setIsModalOpen(true);
                map.setZoom(Math.max(map.getZoom(), 19));
                map.panTo(pos);
              });
            }
            return marker;
          });

        aedMarkersRef.current = markers;

        // 마커가 있으면 화면에 모두 보이게 (사용자 위치로 이미 센터된 경우는 제외)
        if (markers.length > 0 && !hasCenteredRef.current) {
          map.fitBounds(bounds);
        }

        if (clustererRef.current) {
          clustererRef.current.setMarkers([...markers]);
        } else {
          markers.forEach((m) => m.setMap(map));
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadAeds();

    // cleanup
    return () => {
      isCanceled = true;
      aedMarkersRef.current.forEach((m) => m.setMap(null));
      aedMarkersRef.current = [];
      if (clustererRef.current) {
        clustererRef.current.setMarkers([]);
      }
    };
  }, [map]);

  const handleToggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  const handleRecenter = useCallback(() => {
    if (!map) return;
    if (highlight && selectedPoint) {
      const target = new window.naver.maps.LatLng(
        selectedPoint.lat,
        selectedPoint.lng
      );
      map.setZoom(19);
      map.panTo(target);
      return;
    }
    if (markerRef.current) {
      const pos = markerRef.current.getPosition?.();
      if (pos) {
        map.panTo(pos);
      }
    }
  }, [map, highlight, selectedPoint]);

  useEffect(() => {
    const { naver } = window;
    if (!map || infoWindowRef.current) return;

    infoWindowRef.current = new naver.maps.InfoWindow({
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 0,
      pixelOffset: new naver.maps.Point(0, -6),
      disableAnchor: true,
    });
  }, [map]);

  useEffect(() => {
    const { naver } = window;
    if (!map || !infoWindowRef.current) return;

    if (!highlight || !selectedPoint) {
      infoWindowRef.current.close();
      return;
    }

    const position = new naver.maps.LatLng(selectedPoint.lat, selectedPoint.lng);
    const content = buildInfoWindowContent(highlight);

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(map, position);
  }, [map, highlight, selectedPoint]);

  useEffect(() => {
    return () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };
  }, []);

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="map-canvas" />
      <div className="map-top-frost" />
      <MapModal
        open={isModalOpen}
        onToggle={handleToggleModal}
        onRelocate={handleRecenter}
        highlight={highlight}
      />
    </div>
  );
}

function buildInfoWindowContent(info) {
  const esc = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const lines = [];

  if (info.detail) {
    lines.push(`<div class="map-spot-card__line">${esc(info.detail)}</div>`);
  }

  if (info.address) {
    lines.push(
      `<div class="map-spot-card__line map-spot-card__line--muted">${esc(
        info.address
      )}</div>`
    );
  }

  if (info.phone) {
    lines.push(
      `<div class="map-spot-card__line map-spot-card__line--muted">${esc(
        info.phone
      )}</div>`
    );
  }

  if (lines.length === 0) {
    lines.push(
      `<div class="map-spot-card__line map-spot-card__line--muted">추가 정보가 준비 중입니다.</div>`
    );
  }

  return `
    <div class="map-spot-overlay">
      <div class="map-spot-card">
        <div class="map-spot-card__title">${esc(info.name || "AED 위치")}</div>
        ${lines.join("")}
      </div>
      <div class="map-spot-card__arrow"></div>
    </div>
  `;
}
