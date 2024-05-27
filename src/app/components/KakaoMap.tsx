"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import useMapsStore from "../stores/map";

const KakaoMap = () => {
  const { selectedMoodFood} = useMapsStore();
  const [map, setMap] = useState(null);
  const [ps, setPs] = useState(null)

  const mapElement = useRef<HTMLDivElement | null>(null);

  const [curLocation, setCurLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);


  useEffect(()=>{
    if (map && selectedMoodFood){
      const location = new kakao.maps.LatLng(
        curLocation?.latitude,
         curLocation?.longitude
       );
      const options = {
        location: location,
        radius: 2000,
        sort: kakao.maps.services.SortBy.DISTANCE,
      };
      ps.keywordSearch( selectedMoodFood, placesSearchCB, options);
    }

  },[map,ps, selectedMoodFood])

  useEffect(() => {
    if (!curLocation) return;
    const location = new kakao.maps.LatLng(
     curLocation.latitude,
      curLocation.longitude
    );
    const mapOptions = {
      center: location,
      zoom: 10,
    };

    const map = new kakao.maps.Map(mapElement.current!, mapOptions);

    new kakao.maps.Marker({
      position: location,
      map: map,
    });
    map.panTo(location);
  }, [curLocation]);

    const markers = [];

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
  
          // 정상적으로 검색이 완료됐으면
          // 검색 목록과 마커를 표출합니다
          console.log("data", data)
        // displayPlaces(data);
  
          // 페이지 번호를 표출합니다
          //displayPagination(pagination);
  
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
  
          alert('검색 결과가 존재하지 않습니다.');
          return;
  
      } else if (status === kakao.maps.services.Status.ERROR) {
  
          alert('검색 결과 중 오류가 발생했습니다.');
          return;
  
      }
  }

  const initMap = () => {
    let location = new kakao.maps.LatLng(33.450701, 126.570667);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setCurLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
            location = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log(location);

            const mapOption = {
                center: location, // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

            const map = new kakao.maps.Map(mapElement.current!, mapOption);
            const ps = new kakao.maps.services.Places();

            setMap(map);
            setPs(ps);
            const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

            const marker = new kakao.maps.Marker({
                position: location
            });
            marker.setMap(map);
        });
    } else {
        const mapOption = {
            center: location, // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

        const map = new kakao.maps.Map(mapElement.current!, mapOption);
        const ps = new kakao.maps.services.Places();

        setMap(map);
        setPs(ps);
        const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

        const marker = new kakao.maps.Marker({
            position: location
        });
        marker.setMap(map);
    }
};


    return (
      <>
        <h1>kakao map</h1>
      <>
      <Script
        type="text/javascript"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`}
        onLoad={() => {
            kakao.maps.load(function() {
              console.log(kakao)
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