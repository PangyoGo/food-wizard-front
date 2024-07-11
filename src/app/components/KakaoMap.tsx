"use client";

import Script from "next/script";
import styles from "./kakaoMap.module.css";

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from "react";

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import useMapsStore from "../stores/map";
import { title } from "process";

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
  let infowindows = [];
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



    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
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
    const listEl = document.getElementById('placesList'), 
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(), 
    bounds = new kakao.maps.LatLngBounds(), 
    listStr = '';
    const zIndexBase = 1;
  
    const markerCnt = places.length > 0 && places.length <= 5 ? placesList.length : 5;
  
    for (let i = 0; i < markerCnt; i++) {
      const placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i, places[i].place_name, places[i].road_address_name),
            itemEl = getListItem(i, places[i]); 
  
      bounds.extend(placePosition);
  
      fragment.appendChild(itemEl);

      (function(marker, infowindow) {
        kakao.maps.event.addListener(marker, 'click', function() {
          // 모든 인포윈도우의 zIndex를 초기화
          infowindows.forEach(function(iw) {
            iw.setZIndex(zIndexBase);
          });
          // 클릭된 인포윈도우의 zIndex를 가장 높게 설정
          infowindow.setZIndex(zIndexBase + 1);
          infowindow.open(map, marker);
     
        });
      })(marker, infowindows[i]);
    }
  
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;
  
    map.setBounds(bounds);
  }
  
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

function addMarker(position, idx, title, address) {
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
   // 개별 인포윈도우 생성
  const infowindow = new kakao.maps.InfoWindow({
      content: '<div style="padding:5px;z-index:1;">' + title + '</div>'
  });
  infowindows.push(infowindow);

    // 클릭 이벤트 등록
    kakao.maps.event.addListener(marker, 'click', function() {
      infowindows.forEach(function(iw) {
        iw.setZIndex(1); // 모든 인포윈도우의 zIndex를 초기화
      });
   
      infowindow.setZIndex(2); // 현재 인포윈도우의 zIndex를 가장 높게 설정
      infowindow.open(map, marker);
      shareToKakao(title, address);
    });



  infowindow.open(map, marker); // 마커와 함께 인포윈도우를 표시
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

            const marker = new kakao.maps.Marker({
              position: location,
              map: map,
            });

            setMap(map);
            setPs(ps);


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


    
    }
    setIsLoading(false);
};

function shareToKakao(title: string, address: string) {

  // Kakao.Share.sendDefault({
  //   objectType: 'text',
  //   text:
  //     '기본 템플릿으로 제공되는 텍스트 템플릿은 텍스트를 최대 200자까지 표시할 수 있습니다. 텍스트 템플릿은 텍스트 영역과 하나의 기본 버튼을 가집니다. 임의의 버튼을 설정할 수도 있습니다. 여러 장의 이미지, 프로필 정보 등 보다 확장된 형태의 카카오톡 공유는 다른 템플릿을 이용해 보낼 수 있습니다.',
  //   link: {
  //     // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
  //     mobileWebUrl:'http://localhost:3000',
  //     webUrl: 'http://localhost:3000',
  //   },
  // });
  Kakao.Share.createDefaultButton({
    container: '#kakaotalk-sharing-btn',
    objectType: 'location',
    address: address,
    content: {
      title: title,
      description: 'title',
      imageUrl:
        'http://k.kakaocdn.net/dn/bSbH9w/btqgegaEDfW/vD9KKV0hEintg6bZT4v4WK/kakaolink40_original.png',
      link: {
        mobileWebUrl: 'http://localhost:3000',
        webUrl: 'http://localhost:3000',
      },
    },
    social: {
      likeCount: 286,
      commentCount: 45,
      sharedCount: 845,
    },
    buttons: [
      {
        title: '웹으로 보기',
        link: {
          mobileWebUrl: 'http://localhost:3000',
          webUrl: 'http://localhost:3000',
        },
      },
    ],
  });
  

}


    return (
      <>
        <h1>Map</h1>
        <h4>
          {selectedMoodFood && <p>추천 음식: {selectedMoodFood}</p>}
        </h4>
        <a id="kakaotalk-sharing-btn" href="javascript:shareToKakao()">
  <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
    alt="카카오톡 공유 보내기 버튼" />
</a>
        <Script
          type="text/javascript"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`}
          onLoad={() => {
              kakao.maps.load(function() {
                  initMap();
              });
          }}
        />

        <Script
          type="text/javascript"
          src={`https://developers.kakao.com/sdk/js/kakao.js`}
          onLoad={() => {
            Kakao.init(`${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}`); // 여기에 실제 카카오 앱 키를 넣어주세요.
            console.log(Kakao.isInitialized())
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