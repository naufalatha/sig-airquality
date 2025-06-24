import { AirQualityData, LocationData } from "@/types";
import { getAQIInfo, formatComponent } from "@/utils/airQuality";

interface AirQualityCardProps {
  location: LocationData;
  data: AirQualityData;
  isSelected?: boolean;
  onClick?: () => void;
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({
  location,
  data,
  isSelected = false,
  onClick,
}) => {
  const aqi = data.list[0]?.main.aqi || 1;
  const aqiInfo = getAQIInfo(aqi);
  const components = data.list[0]?.components;

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            {location.name}
          </h3>
          <p className="text-xs text-gray-500">{location.region}</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold`}
            style={{ backgroundColor: aqiInfo.color }}
          >
            {aqi}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className={`text-xs font-medium ${aqiInfo.textColor}`}>
          {aqiInfo.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">PM2.5:</span>
          <span className="font-medium">
            {formatComponent(components.pm2_5)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">PM10:</span>
          <span className="font-medium">
            {formatComponent(components.pm10)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AirQualityCard;
