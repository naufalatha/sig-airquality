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
  const [nextUpdateIn, setNextUpdateIn] = useState<number>(60); // seconds until next update
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);

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
    setNextUpdateIn(60); // Reset countdown

    let interval: NodeJS.Timeout | null = null;
    let countdownInterval: NodeJS.Timeout | null = null;

    if (autoRefreshEnabled) {
      // Set up auto-refresh every 1 minute (60000ms)
      interval = setInterval(() => {
        fetchAirQualityData();
        setNextUpdateIn(60); // Reset countdown after each fetch
      }, 60000);

      // Set up countdown timer that updates every second
      countdownInterval = setInterval(() => {
        setNextUpdateIn((prev) => {
          if (prev <= 1) {
            return 60; // Reset to 60 when it reaches 0
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup intervals on component unmount or when autoRefresh is disabled
    return () => {
      if (interval) clearInterval(interval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [fetchAirQualityData, autoRefreshEnabled]);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefreshEnabled((prev) => {
      if (!prev) {
        setNextUpdateIn(60); // Reset countdown when enabling
      }
      return !prev;
    });
  }, []);

  return {
    airQualityData,
    loading,
    error,
    fetchErrors,
    lastUpdated,
    nextUpdateIn,
    autoRefreshEnabled,
    refetch: fetchAirQualityData,
    toggleAutoRefresh,
  };
};
