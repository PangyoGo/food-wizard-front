"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const KakaoMap = () => {
    const mapElement = useRef<HTMLDivElement | null>(null);

    const initMap = () => {
        const location = new kakao.maps.LatLng(33.450701, 126.570667)
        const mapOption = { 
            center: location, // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };
    

    const map = new kakao.maps.Map(mapElement.current!, mapOption); 

    const marker = new kakao.maps.Marker({
        position: location
    });
    marker.setMap(map);

  
    }

    return (
      <>
        <h1>kakao map</h1>
<>
      <Script
        type="text/javascript"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
        onLoad={() => {
            kakao.maps.load(function() {
                // v3가 모두 로드된 후, 이 콜백 함수가 실행됩니다.
                initMap();
            });
    
        }}
      />
       <div ref={mapElement} style={{ width: "100%", height: "400px" }}></div>
    </>
      </>
    );
  };
  
  export default KakaoMap;