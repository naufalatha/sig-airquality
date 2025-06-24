import { useState, useEffect, useCallback } from "react";
import { AirQualityData, LocationData } from "@/types";

export const useAirQuality = (locations: LocationData[]) => {
  const [airQualityData, setAirQualityData] = useState<
    Record<string, AirQualityData>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchErrors, setFetchErrors] = useState<Record<string, string>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAirQualityData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFetchErrors({}); // Reset individual errors on new fetch

    try {
      const promises = locations.map(async (location) => {
        const response = await fetch(
          `/api/air-quality?lat=${location.lat}&lon=${location.lon}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${location.name}`);
        }
        const data = await response.json();
        return { locationId: location.id, data };
      });

      const results = await Promise.allSettled(promises);
      const newData: Record<string, AirQualityData> = {};
      const newErrors: Record<string, string> = {};

      results.forEach((result, index) => {
        const locationId = locations[index].id;
        if (result.status === "fulfilled") {
          newData[locationId] = result.value.data;
        } else {
          const errorMessage =
            result.reason instanceof Error
              ? result.reason.message
              : "An unknown error occurred";
          newErrors[locationId] = errorMessage;
          console.error(
            `Error fetching data for ${locations[index].name}:`,
            result.reason
          );
        }
      });

      setAirQualityData(newData);
      setFetchErrors(newErrors);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [locations]);

  useEffect(() => {
    fetchAirQualityData();
  }, [fetchAirQualityData]);

  return {
    airQualityData,
    loading,
    error,
    fetchErrors,
    lastUpdated,
    refetch: fetchAirQualityData,
  };
};
