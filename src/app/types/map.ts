export type NaverMap = naver.maps.Map;

type Lat = number;
type Lng = number;
export type Coordinates = [Lat, Lng];


export interface Location {
    latitude: number;
    longitude: number;
  }
  
export interface Place {
    place_name: string;
    road_address_name?: string;
    address_name: string;
    phone: string;
    x: string;
    y: string;
  }
  
export  interface PlacesSearchCB {
    (data: Place[], status: string, pagination: any): void;
  }
