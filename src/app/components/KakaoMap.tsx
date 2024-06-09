"use client";

import Script from "next/script";
import styles from "./kakaoMap.module.css";

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from "react";

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import useMapsStore from "../stores/map";

const KakaoMap = () => {

  const router = useRouter();
  const { selectedMoodFood} = useMapsStore();

  const [map, setMap] = useState(null);
  const [ps, setPs] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const mapElement = useRef<HTMLDivElement | null>(null);

  const [curLocation, setCurLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // const [markers, setMarkers] = useState<any[]>([]);
  let markers = [];
  const [infowindow, setInfowindow] = useState<any>(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      // Kakao Maps API가 이미 로드된 경우
      initMap();
    }
  }, []);


  useEffect(()=>{
    if (map &&  ps  && selectedMoodFood){
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

  },[curLocation?.latitude, curLocation?.longitude, map, ps, selectedMoodFood])

  // useEffect(() => {
  //   if (!curLocation) return;
  //   const location = new kakao.maps.LatLng(
  //    curLocation.latitude,
  //     curLocation.longitude
  //   );
  //   const mapOptions = {
  //     center: location,
  //     zoom: 10,
  //   };

  //   const map = new kakao.maps.Map(mapElement && mapElement.current!, mapOptions);

  //   // new kakao.maps.Marker({
  //   //   position: location,
  //   //   map: map,
  //   // });
  //   map.panTo(location);
  // }, [curLocation]);

   

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
  
          // 정상적으로 검색이 완료됐으면
          // 검색 목록과 마커를 표출합니다
        displayPlaces(data);
  
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          alert('검색 결과가 존재하지 않습니다.');
          return;
      } else if (status === kakao.maps.services.Status.ERROR) {
          alert('검색 결과 중 오류가 발생했습니다.');
          return;
      }
  }

  function displayPlaces(places) {

    var listEl = document.getElementById('placesList'), 
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(), 
    bounds = new kakao.maps.LatLngBounds(), 
    listStr = '';
    
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    //removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    // removeMarker();
    
    for ( var i=0; i<6; i++ ) {

        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i), 
            itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
          
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function(marker, title) {
            kakao.maps.event.addListener(marker, 'mouseover', function() {
                displayInfowindow(marker, title);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
            });

            itemEl.onmouseover =  function () {
                displayInfowindow(marker, title);
            };

            itemEl.onmouseout =  function () {
                infowindow.close();
            };
        })(marker, places[i].place_name);

        fragment.appendChild(itemEl);
    }
    console.log(markers, "mar", marker)

    // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {

  var el = document.createElement('li'),
  itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
              '<div class="info">' +
              '   <h5>' + places.place_name + '</h5>';

  if (places.road_address_name) {
      itemStr += '    <span>' + places.road_address_name + '</span>' +
                  '   <span class="jibun gray">' +  places.address_name  + '</span>';
  } else {
      itemStr += '    <span>' +  places.address_name  + '</span>'; 
  }
               
    itemStr += '  <span class="tel">' + places.phone  + '</span>' +
              '</div>';           

  el.innerHTML = itemStr;
  el.className = 'item';

  return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
  var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
      imgOptions =  {
          spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
          marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage 
      });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker);  // 배열에 생성된 마커를 추가합니다
  return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
  for ( var i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
  } 
  markers = [];  
  //setMarkers([]);
}

function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

function removeAllChildNods(el) {   
  debugger
  while (el && el.hasChildNodes()) {
      el.removeChild (el.lastChild);
  }
}

  function displayMarker(place) {

    // 마커를 생성하고 지도에 표시
    let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x) 
    });

    // 마커에 클릭이벤트를 등록
    kakao.maps.event.addListener(marker, 'click', function() {
      // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
      infowindow.open(map, marker);
    });
}
  

  const handleNavigate = () => {
    router.push('/main');
  };

  const initMap = () => {
    let location = new kakao.maps.LatLng(33.450701, 126.570667);
    const infowindowInstance = new kakao.maps.InfoWindow({ zIndex: 1 });
    setInfowindow(infowindowInstance);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setCurLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
            location = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);

            const mapOption = {
                center: location, // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

            const map = new kakao.maps.Map(mapElement && mapElement.current!, mapOption);
            const ps = new kakao.maps.services.Places();

            setMap(map);
            setPs(ps);


            // const marker = new kakao.maps.Marker({
            //     position: location
            // });
            // marker.setMap(map);
        });
        setIsLoading(false);
    } else {
        const mapOption = {
            center: location, // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

        const map = new kakao.maps.Map(mapElement.current!, mapOption);
        const ps = new kakao.maps.services.Places();

        setMap(map);
        setPs(ps);


        // const marker = new kakao.maps.Marker({
        //     position: location
        // });
        // marker.setMap(map);
    }
    setIsLoading(false);
};


    return (
      <>
        <h1>Map</h1>
        <h4>
          {selectedMoodFood && <p>추천 음식: {selectedMoodFood}</p>}
        </h4>
        <Script
          type="text/javascript"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`}
          onLoad={() => {
              kakao.maps.load(function() {
                  initMap();
              });
          }}
        />
        {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', position:'relative'}}>
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <div ref={mapElement} style={{ width: "100%", height: "400px" }}></div>
      )}
      <div id="menu_wrap" className={styles.map_wrap}>
        <ul id="placesList"></ul>
      </div>
        <div>
          <Button onClick={handleNavigate} variant="outlined"  size="Xlarge" color="secondary">처음으로</Button>
        </div>
    </>
    );
  };
  
  export default KakaoMap;