import KakaoMap from "@/app/components/KakaoMap";
import ModeButtons from "@/app/components/ModeButtons";

const MapView = () => {
  return (
    <>
      <h1>지도 페이지</h1>
      <ModeButtons /> 
      <KakaoMap />
    </>
  );
};

export default MapView;
