export interface AirQualityData {
  coord: [number, number];
  list: Array<{
    dt: number;
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}

export interface LocationData {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  population?: number;
}

export interface AQIInfo {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}
