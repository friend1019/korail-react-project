import { useEffect, useRef } from 'react'

export default function Map() {
  const mapRef = useRef(null)

  useEffect(() => {
    // 네이버 맵 객체 생성
    const { naver } = window
    if (!naver) return

    const mapOptions = {
      center: new naver.maps.LatLng(37.5665, 126.9780), // 기본 좌표: 서울시청
      zoom: 15,
    }

    const map = new naver.maps.Map(mapRef.current, mapOptions)

    // 마커 예시
    new naver.maps.Marker({
      position: new naver.maps.LatLng(37.5665, 126.9780),
      map,
      title: '서울시청',
    })
  }, [])

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: 'calc(100vh - 12rem)', // 헤더+메뉴 높이만큼 빼줌
      }}
    />
  )
}
