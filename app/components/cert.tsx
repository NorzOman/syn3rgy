"use client";

import { useState } from "react";

export default function CertImage({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full max-w-[720px] min-h-[200px] md:min-h-[300px] overflow-hidden border border-stone-800/50">
      
      {/* Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-stone-800/40 to-stone-900/60 flex items-center justify-center text-stone-600 font-mono text-xs tracking-widest">
          LOADING CERTIFICATE...
        </div>
      )}

      {/* Image */}
      <img
        src={src}
        alt="Certificate"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        ref={(img) => {
          if (img && img.complete) {
            setLoaded(true);
          }
        }}
        className={`w-full block transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}