import { LocationData, AirQualityData } from "@/types";
import { getAQIInfo } from "@/utils/airQuality";

interface AirQualityStatsProps {
  locations: LocationData[];
  airQualityData: Record<string, AirQualityData>;
}

const AirQualityStats: React.FC<AirQualityStatsProps> = ({
  locations,
  airQualityData,
}) => {
  const aqiCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalAQI = 0;
  let dataCount = 0;

  locations.forEach((location) => {
    const data = airQualityData[location.id];
    if (data) {
      const aqi = data.list[0]?.main.aqi || 1;
      aqiCounts[aqi as keyof typeof aqiCounts]++;
      totalAQI += aqi;
      dataCount++;
    }
  });

  const averageAQI = dataCount > 0 ? Math.round(totalAQI / dataCount) : 1;
  const averageAQIInfo = getAQIInfo(averageAQI);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
        Jabodetabek Overview
      </h3>

      <div className="mb-6">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold"
            style={{ backgroundColor: averageAQIInfo.color }}
          >
            {averageAQI}
          </div>
          <div className="text-sm font-medium text-gray-600">
            Average AQI: {averageAQIInfo.label}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(aqiCounts).map(([level, count]) => {
          const aqiInfo = getAQIInfo(parseInt(level));
          const percentage = dataCount > 0 ? (count / dataCount) * 100 : 0;

          return (
            <div
              key={level}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: aqiInfo.color }}
                />
                <span className="text-gray-600">{aqiInfo.label}</span>
              </div>
              <div className="text-gray-900 font-medium">
                {count} ({percentage.toFixed(0)}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AirQualityStats;
