"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { JABODETABEK_LOCATIONS } from "@/data/locations";
import { useAirQuality } from "@/hooks/useAirQuality";
import AirQualityCard from "@/components/AirQualityCard";
import AirQualityStats from "@/components/AirQualityStats";
import { LocationData } from "@/types";

const AirQualityMap = dynamic(() => import("@/components/AirQualityMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />
  ),
});

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const {
    airQualityData,
    loading,
    error,
    lastUpdated,
    nextUpdateIn,
    autoRefreshEnabled,
    refetch,
    toggleAutoRefresh,
  } = useAirQuality(JABODETABEK_LOCATIONS);

  const handleLocationClick = (location: LocationData) => {
    setSelectedLocation(location);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            🌤️ Monitoring Kualitas Udara Jabodetabek
          </h1>
          <p className="text-gray-600">
            Pantau kualitas udara di Jabodetabek secara real-time dengan data
            terkini dari berbagai lokasi.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats */}
            <AirQualityStats
              locations={JABODETABEK_LOCATIONS}
              airQualityData={airQualityData}
            />

            {/* Location Cards */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Locations
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {JABODETABEK_LOCATIONS.map((location) => {
                  const data = airQualityData[location.id];
                  if (!data) return null;

                  return (
                    <AirQualityCard
                      key={location.id}
                      location={location}
                      data={data}
                      isSelected={selectedLocation?.id === location.id}
                      onClick={() => handleLocationClick(location)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] overflow-hidden">
              {loading ? (
                <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500">Loading map...</div>
                </div>
              ) : (
                <AirQualityMap
                  locations={JABODETABEK_LOCATIONS}
                  airQualityData={airQualityData}
                  onLocationClick={handleLocationClick}
                />
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
          <button
            onClick={refetch}
            disabled={loading}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>{loading ? "⏳" : "🔄"}</span>
            {loading ? "Updating..." : "Update Data"}
          </button>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              autoRefreshEnabled
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                autoRefreshEnabled
                  ? "bg-green-500 animate-pulse"
                  : "bg-gray-400"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                autoRefreshEnabled ? "text-green-700" : "text-gray-600"
              }`}
            >
              Auto-refresh: {autoRefreshEnabled ? "ON" : "OFF"}
            </span>
            {autoRefreshEnabled && (
              <span className="text-xs text-green-600">
                (next in {nextUpdateIn}s)
              </span>
            )}
          </div>

          <button
            onClick={toggleAutoRefresh}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
              autoRefreshEnabled
                ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            }`}
          >
            <span>{autoRefreshEnabled ? "⏸️" : "▶️"}</span>
            {autoRefreshEnabled ? "Disable" : "Enable"}
          </button>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-4">
          <div className="text-sm text-gray-500">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                loading
                  ? "bg-orange-500 animate-pulse"
                  : "bg-green-500 animate-pulse-slow"
              }`}
            ></span>
            {loading ? "Updating data..." : "Last updated:"}{" "}
            {lastUpdated && !loading
              ? lastUpdated.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : loading
              ? "..."
              : "-"}
          </div>

          {/* footer created by */}
          <div className="text-sm text-gray-500 mt-4">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse-slow"></span>
            Created by{" "}
            <a
              href="https://github.com/naufalatha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Naufal Atha Yudha
            </a>{" "}
            | Mohamad Shafwan | Priski Jovanka
          </div>
        </div>
      </div>
    </div>
  );
}
