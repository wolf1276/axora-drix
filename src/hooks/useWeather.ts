"use client";

import { useState, useEffect, useCallback } from "react";

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number; // km/h
  description: string;
  conditionCode: number;
  icon: string;
  visibility: number;
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  if (!API_KEY || API_KEY === "your_openweather_api_key_here") {
    // Return mock data for demo
    return getMockWeather("Your Location");
  }
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Failed to fetch weather data.");
  const json = await res.json();
  return parseWeather(json);
}

async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  if (!API_KEY || API_KEY === "your_openweather_api_key_here") {
    return getMockWeather(city);
  }
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error(`City "${city}" not found.`);
    throw new Error("Failed to fetch weather data.");
  }
  const json = await res.json();
  return parseWeather(json);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseWeather(json: any): WeatherData {
  return {
    city: json.name,
    country: json.sys?.country ?? "",
    temperature: Math.round(json.main.temp),
    feelsLike: Math.round(json.main.feels_like),
    humidity: json.main.humidity,
    windSpeed: Math.round((json.wind?.speed ?? 0) * 3.6), // m/s to km/h
    description: json.weather?.[0]?.description ?? "Unknown",
    conditionCode: json.weather?.[0]?.id ?? 800,
    icon: json.weather?.[0]?.icon ?? "01d",
    visibility: Math.round((json.visibility ?? 10000) / 1000),
  };
}

function getMockWeather(city: string): WeatherData {
  return {
    city: city,
    country: "IN",
    temperature: 26,
    feelsLike: 27,
    humidity: 58,
    windSpeed: 13,
    description: "few clouds",
    conditionCode: 801,
    icon: "02d",
    visibility: 10,
  };
}

export function useWeather(
  lat: number | null,
  lon: number | null,
  manualCity: string | null
) {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      let data: WeatherData;
      if (manualCity) {
        data = await fetchWeatherByCity(manualCity);
      } else if (lat !== null && lon !== null) {
        data = await fetchWeatherByCoords(lat, lon);
      } else {
        setState({ data: null, loading: false, error: null });
        return;
      }
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error occurred.",
      });
    }
  }, [lat, lon, manualCity]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

export function computeSafety(data: WeatherData): {
  safe: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (data.windSpeed > 20) {
    reasons.push(`Wind speed ${data.windSpeed} km/h exceeds 20 km/h limit`);
  }

  const code = data.conditionCode;

  // Thunderstorm group
  if (code >= 200 && code < 300) {
    reasons.push("Thunderstorm conditions detected");
  }
  // Rain group
  if (code >= 300 && code < 600) {
    reasons.push("Rain or drizzle detected");
  }
  // Snow group
  if (code >= 600 && code < 700) {
    reasons.push("Snow conditions detected");
  }
  // Atmospheric (fog, haze, etc.)
  if (code >= 700 && code < 800) {
    reasons.push("Poor visibility conditions (fog/haze)");
  }

  return { safe: reasons.length === 0, reasons };
}
