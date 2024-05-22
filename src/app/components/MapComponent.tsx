"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const MapComponent = () => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const [curLocation, setCurLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (!curLocation) return;

    const tm128 = new naver.maps.Point(1291042123,  351383896); 
    const latLng = naver && naver.maps.TransCoord.fromTM128ToLatLng(tm128);

    const location = new naver.maps.LatLng(
      latLng.x,// curLocation.latitude,
      latLng.y//curLocation.longitude
    );
    const mapOptions = {
      center: location,
      zoom: 10,
    };

    const map = new naver.maps.Map(mapElement.current!, mapOptions);

    new naver.maps.Marker({
      position: location,
      map: map,
    });
  }, [curLocation]);

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
        onLoad={() => {
          initMap();
        }}
      />
      <div ref={mapElement} style={{ width: "100%", height: "400px" }}></div>
    </>
  );
};

export default MapComponent;
