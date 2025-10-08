import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "components/Layout";
import Home from "pages/Home";
import Manual from "pages/manual/Manual";
import Report119 from "pages/Report119";
import MapPage from "pages/map/Map";
import Settings from "pages/Settings";
import Navigation from "pages/Navigation";

import CprAed from "pages/manual/pages/CprAed";
import Airway from "pages/manual/pages/Airway";
import Bleeding from "pages/manual/pages/Bleeding";
import Burn from "pages/manual/pages/Burn";
import Fracture from "pages/manual/pages/Fracture";
import Stroke from "pages/manual/pages/Stroke";
import Seizure from "pages/manual/pages/Seizure";
import Anaphylaxis from "pages/manual/pages/Anaphylaxis";
import Drowning from "pages/manual/pages/Drowning";
import Heat from "pages/manual/pages/Heat";

import LocationModal from "components/common/LocationModal"; // ✅ 새로 추가
import "styles/common/LocationModal.css"; // ✅ 모달 CSS 임포트

export default function App() {
  const [coords, setCoords] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(true);

  return (
    <>
      {/* ✅ 앱 첫 진입 시 위치 권한 모달 */}
      {showLocationModal && (
        <LocationModal
          onAllow={(pos) => {
            setCoords(pos);
            setShowLocationModal(false);
          }}
          onDeny={() => {
            setShowLocationModal(false);
          }}
        />
      )}

      {/* ✅ 실제 라우팅 구조 */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home userCoords={coords} />} />
          <Route path="manual" element={<Manual />} />
          <Route path="report" element={<Report119 />} />
          <Route path="map" element={<MapPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="nav" element={<Navigation />} />

          {/* 메뉴얼 하위 라우트 */}
          <Route path="/manual/search" element={<div>검색 화면 (추가 예정)</div>} />
          <Route path="/manual/cpr-aed" element={<CprAed />} />
          <Route path="/manual/airway" element={<Airway />} />
          <Route path="/manual/bleeding" element={<Bleeding />} />
          <Route path="/manual/burn" element={<Burn />} />
          <Route path="/manual/fracture" element={<Fracture />} />
          <Route path="/manual/stroke" element={<Stroke />} />
          <Route path="/manual/seizure" element={<Seizure />} />
          <Route path="/manual/anaphylaxis" element={<Anaphylaxis />} />
          <Route path="/manual/drowning" element={<Drowning />} />
          <Route path="/manual/heat" element={<Heat />} />
        </Route>
      </Routes>
    </>
  );
}
