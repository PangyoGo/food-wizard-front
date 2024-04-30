"use client";
import Script from "next/script";
import { useRef } from "react";

const MapComponent = () => {
  // const naverClientID = ;

  const mapElement = useRef<HTMLDivElement | null>(null);

  const initMap = () => {
    const location = new naver.maps.LatLng(37.3595704, 127.105399);
    const mapOptions = {
      center: location,
      zoom: 10,
    };

    const map = new naver.maps.Map(mapElement.current!, mapOptions);

    new naver.maps.Marker({
      position: location,
      map: map,
    });
  };

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={() => {
          initMap();
        }}
      />
      <div ref={mapElement} style={{ width: "100%", height: "400px" }}></div>
    </>
  );
};

export default MapComponent;
