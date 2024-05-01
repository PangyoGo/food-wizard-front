import MapComponent from "@/app/components/MapComponent";
import useMapsStore from "@/app/stores/map";

const MapView = () => {
  return (
    <>
      <h1>지도 페이지</h1>
      <MapComponent />
    </>
  );
};

export default MapView;
