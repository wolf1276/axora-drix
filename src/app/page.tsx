"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "@/components/Navbar";
import WeatherPanel from "@/components/WeatherPanel";
import SafetyIndicator from "@/components/SafetyIndicator";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather, computeSafety } from "@/hooks/useWeather";
import { Search, RefreshCw, MapPin } from "lucide-react";

function ShimmerCard({ className = "" }: { className?: string }) {
  return (
    <div className={`border-2 border-ink/10 overflow-hidden ${className}`}>
      <div className="shimmer h-full min-h-40" />
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [cityInput, setCityInput] = useState("");
  const [manualCity, setManualCity] = useState<string | null>(null);

  const geo = useGeolocation();

  // Use manual city override if set, otherwise use geo coords
  const { data, loading, error, refetch } = useWeather(
    manualCity ? null : geo.latitude,
    manualCity ? null : geo.longitude,
    manualCity
  );

  const safety = data ? computeSafety(data) : null;

  // GSAP hero entrance animation
  useEffect(() => {
    if (!heroRef.current) return;
    const el = heroRef.current;
    gsap.fromTo(
      el.querySelectorAll("[data-hero]"),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
      }
    );
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = cityInput.trim();
    if (val) {
      setManualCity(val);
      setCityInput("");
    }
  };

  const handleReset = () => {
    setManualCity(null);
    setCityInput("");
  };

  const locationLabel = data
    ? `${data.city}${data.country ? `, ${data.country}` : ""}`
    : geo.loading
    ? "Detecting..."
    : geo.error
    ? "Location unavailable"
    : undefined;

  return (
    <div className="min-h-screen bg-animated-gradient flex flex-col">
      <Navbar locationName={locationLabel} />

      {/* Hero */}
      <section ref={heroRef} className="px-6 py-14 md:py-20 text-center">
        <p data-hero className="text-xs font-medium uppercase tracking-[0.3em] text-ink/40 mb-4">
          Real-time Drone Safety Advisor
        </p>
        <h1
          data-hero
          className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-ink leading-none tracking-tight"
        >
          CAN YOUR DRONE
          <br />
          <span className="inline-block mt-1">FLY RIGHT NOW?</span>
        </h1>
        <p data-hero className="text-ink/50 mt-5 text-base max-w-md mx-auto">
          Live weather analysis. Instant flight clearance. No guessing.
        </p>

        {/* Search bar */}
        <form
          data-hero
          onSubmit={handleSearch}
          className="mt-8 flex items-stretch max-w-sm mx-auto"
        >
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Enter a city..."
            className="flex-1 border-2 border-r-0 border-ink px-4 py-2.5 text-sm bg-paper font-sans outline-none placeholder:text-ink/30 focus:bg-mist transition-colors"
          />
          <button
            type="submit"
            className="ripple-btn border-2 border-ink bg-ink text-paper px-4 py-2.5 hover:bg-ink/80 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Search size={14} />
            Search
          </button>
        </form>

        {/* Location indicators */}
        <div data-hero className="mt-4 flex items-center justify-center gap-3 text-xs text-ink/40">
          {manualCity ? (
            <>
              <span className="flex items-center gap-1">
                <Search size={11} />
                Showing: {manualCity}
              </span>
              <button
                onClick={handleReset}
                className="underline hover:text-ink transition-colors flex items-center gap-1"
              >
                <MapPin size={11} />
                Use my location
              </button>
            </>
          ) : geo.loading ? (
            <span>Detecting location...</span>
          ) : geo.error ? (
            <span className="text-danger/60">⚠ {geo.error}. Enter a city above.</span>
          ) : (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              Using your current location
            </span>
          )}
        </div>
      </section>

      {/* Dashboard */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 pb-16 space-y-4">
        {/* Error */}
        {error && (
          <div className="border-2 border-danger bg-danger/5 px-5 py-4 text-sm text-danger font-medium">
            ⚠ {error}
          </div>
        )}

        {/* Shimmer loading */}
        {(loading || geo.loading) && !data && (
          <>
            <ShimmerCard className="h-52" />
            <ShimmerCard className="h-40" />
          </>
        )}

        {/* Weather + Safety panels */}
        {data && !loading && (
          <>
            <WeatherPanel data={data} />
            {safety && <SafetyIndicator safe={safety.safe} reasons={safety.reasons} />}
          </>
        )}

        {/* Refresh button */}
        {data && (
          <div className="flex justify-center pt-2">
            <button
              onClick={refetch}
              disabled={loading}
              className="ripple-btn flex items-center gap-2 border-2 border-ink px-5 py-2.5 text-sm font-medium hover:bg-mist transition-colors disabled:opacity-40 shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh Weather
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-ink/10 px-6 py-5 text-center text-xs text-ink/30">
        AXORA © 2026 — Drone Weather Flight Advisor
      </footer>
    </div>
  );
}
