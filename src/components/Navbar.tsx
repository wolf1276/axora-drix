"use client";

import { MapPin } from "lucide-react";

interface NavbarProps {
  locationName?: string;
}

export default function Navbar({ locationName }: NavbarProps) {
  return (
    <nav className="w-full border-b-2 border-ink bg-paper px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-ink flex items-center justify-center">
          <span className="text-paper text-xs font-bold font-heading">AX</span>
        </div>
        <span className="font-heading font-bold text-lg tracking-tight">AXORA</span>
      </div>

      {locationName && (
        <div className="flex items-center gap-1.5 text-sm text-ink/60 border border-ink/20 px-3 py-1">
          <MapPin size={13} />
          <span>{locationName}</span>
        </div>
      )}
    </nav>
  );
}
