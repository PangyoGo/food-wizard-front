"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import useMapsStore from "../stores/map";

const MapComponent = () => {
  const { resultLocation } = useMapsStore();
  const { mapsLoaded, setMapsLoaded } = useMapsStore();

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

  useEffect(() => {
    if (!curLocation) return;
    // if (mapsLoaded && window.naver && naver.maps.TM128Coord) {
    //   const tm128 = new naver.maps.Point(
    //     resultLocation?.longitude!,
    //     resultLocation?.latitude!
    //   );

    //   const location = naver.maps.TransCoord.fromTM128ToLatLng(tm128);
    //   const location1 = new naver.maps.LatLng(
    //     curLocation.latitude,
    //     curLocation.longitude
    //   );
    //   console.log(location, location1);

    //   const mapOptions = {
    //     center: location,
    //     zoom: 10,
    //   };

    //   const map = new naver.maps.Map(mapElement.current!, mapOptions);

    //   new naver.maps.Marker({
    //     position: location,
    //     map: map,
    //   });
    // }
  }, [
    mapsLoaded,
    resultLocation?.latitude,
    resultLocation?.longitude,
    curLocation,
  ]);

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

    setMapsLoaded();
  };

  const initSubModule = () => {
    const tm128 = new naver.maps.Point(
      resultLocation?.latitude!,
      resultLocation?.longitude!
    );
  };

  return (
    <>
      <div ref={mapElement} style={{ width: "100%", height: "400px" }}></div>
      <Script
        id="naver-maps"
        type="text/javascript"
<<<<<<< HEAD
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onLoad={() => {
          initMap();
=======
        strategy="beforeInteractive"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        onLoad={() => {
          console.log(naver.maps.Map, naver.maps.Service, "3");
          if (!window.naver || !window.naver.maps) {
            console.error("Failed to load Naver Maps API");
            return;
          }
          if (!window.naver.maps.Service) {
            console.error("Geocoder module is not available");
            return;
          }
          console.log("Naver Maps API and Geocoder module are ready");
          initMap(); // Naver Maps API 및 Geocoder 모듈이 준비된 후 지도 초기화
>>>>>>> 1839fb4355b72358dbc9a9a6dda54b9aed273bff
        }}
      />
    </>
  );
};

export default MapComponent;
