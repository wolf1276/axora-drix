"use client";

import { motion } from "framer-motion";
import { Thermometer, Wind, Droplets, Eye } from "lucide-react";
import type { WeatherData } from "@/hooks/useWeather";

interface WeatherPanelProps {
  data: WeatherData;
}

const metrics = [
  {
    key: "temperature",
    label: "Temperature",
    icon: Thermometer,
    format: (d: WeatherData) => `${d.temperature}°C`,
    sub: (d: WeatherData) => `Feels like ${d.feelsLike}°C`,
  },
  {
    key: "wind",
    label: "Wind Speed",
    icon: Wind,
    format: (d: WeatherData) => `${d.windSpeed} km/h`,
    sub: (d: WeatherData) => (d.windSpeed > 20 ? "⚠ Above limit" : "Within safe range"),
  },
  {
    key: "humidity",
    label: "Humidity",
    icon: Droplets,
    format: (d: WeatherData) => `${d.humidity}%`,
    sub: () => "Relative humidity",
  },
  {
    key: "visibility",
    label: "Visibility",
    icon: Eye,
    format: (d: WeatherData) => `${d.visibility} km`,
    sub: () => "Horizontal visibility",
  },
];

export default function WeatherPanel({ data }: WeatherPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="border-2 border-ink bg-paper shadow-brutal"
    >
      {/* Header */}
      <div className="border-b-2 border-ink px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-xl">
            {data.city}{data.country ? `, ${data.country}` : ""}
          </h2>
          <p className="text-sm text-ink/50 capitalize mt-0.5">{data.description}</p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          className="w-14 h-14"
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-ink">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="p-5"
            >
              <div className="flex items-center gap-2 text-ink/40 mb-2">
                <Icon size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">{metric.label}</span>
              </div>
              <p className="font-heading font-bold text-2xl">{metric.format(data)}</p>
              <p className="text-xs text-ink/50 mt-1">{metric.sub(data)}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
