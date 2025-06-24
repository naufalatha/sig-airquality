import { AQIInfo } from "@/types";

export const getAQIInfo = (aqi: number): AQIInfo => {
  const aqiLevels: Record<number, AQIInfo> = {
    1: {
      // Good air quality
      label: "Sangat Sehat",
      color: "#28a745",
      bgColor: "bg-green-500",
      textColor: "text-green-600",
    },
    2: {
      // Fair air quality
      label: "Cukup Sehat",
      color: "#ffc107",
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    3: {
      // Moderate air quality
      label: "Tidak Sehat",
      color: "#fd7e14",
      bgColor: "bg-orange-500",
      textColor: "text-orange-600",
    },
    4: {
      // Poor air quality
      label: "Sangat Tidak Sehat",
      color: "#dc3545",
      bgColor: "bg-red-500",
      textColor: "text-red-600",
    },
    5: {
      // very poor air quality
      label: "Berbahaya",
      color: "#6f42c1",
      bgColor: "bg-purple-500",
      textColor: "text-purple-600",
    },
  };
  return aqiLevels[aqi] || aqiLevels[1];
};

export const formatComponent = (value: number): string => {
  return value.toFixed(1);
};

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
