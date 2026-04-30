// app/share/[code]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import CertImage from "@/app/components/cert";

const SITE_URLs = "https://djsceisaca.tech";

async function getVerifyData(code: string) {
  try {
    const res = await fetch(`${process.env.SITE_URL}/api/verify?code=${encodeURIComponent(code)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function CornerBracket({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base = "absolute w-4 h-4 border-red-600 opacity-50";
  const v: Record<string, string> = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };
  return <span className={`${base} ${v[pos]}`} />;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="font-mono text-[9px] text-red-600/70 uppercase tracking-[0.25em]">
        ▌ {label}
      </span>
      <div className="flex-1 h-px bg-red-600/20" />
    </div>
  );
}

function LinkedInShareButton({ code }: { code: string }) {
  const shareUrl = `${SITE_URLs}/share/${encodeURIComponent(code)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <a
      href={linkedInUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-full h-12 flex items-center justify-center gap-2.5 font-mono text-[10px] font-black uppercase tracking-widest overflow-hidden transition-all duration-200 border border-red-600/50 hover:border-red-500"
      style={{
        background: "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(127,29,29,0.1) 100%)",
      }}
    >
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(127,29,29,0.2) 100%)",
        }}
      />
      <span className="relative z-10 flex items-center gap-2 text-red-400 group-hover:text-red-300">
        {/* LinkedIn icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        SHARE ON LINKEDIN
      </span>
    </a>
  );
}

function DownloadButton({
  href,
  download,
  label,
}: {
  href: string;
  download?: string;
  label: string;
}) {
  return (
    <a
      href={href}
      download={download}
      className="group relative flex-1 h-11 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-widest overflow-hidden border border-red-600/40 hover:border-red-500 transition-colors duration-200"
      style={{ background: "rgba(239,68,68,0.05)" }}
    >
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(127,29,29,0.15) 100%)",
        }}
      />
      <span className="relative z-10 text-red-500/70 group-hover:text-red-400 transition-colors duration-200 flex items-center gap-1.5">
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M6 1v7M3 5l3 3 3-3M1 10h10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </span>
    </a>
  );
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = rawCode?.toLowerCase?.();
  if (!code) return notFound();

  const data = await getVerifyData(code);
  const verified = Boolean(data?.verified);
  console.log("[share/code]: Verified by code: ", verified);

  const certImageUrl = `${process.env.SITE_URL}/api/cert-image?code=${encodeURIComponent(code)}`;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center justify-center px-4 pt-8 relative overflow-hidden">
      {/* CYBERPUNK GRID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      
      {/* NEON GLOW ACCENTS */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none opacity-20" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none opacity-20" />

      <div className="z-10 w-full max-w-6xl">
        {/* ── TOP STATUS BAR ── */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-red-600/50" />
              <span className="w-2 h-2 rounded-full bg-red-600/30" />
            </div>
            <span className="font-mono text-[9px] text-red-600 uppercase tracking-[0.3em]">
              SYNERGY 3.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-red-600/60 uppercase tracking-widest">
              CERT_VIEWER
            </span>
            <span
              className="font-mono text-[9px] flex items-center gap-1.5 px-2 py-1 border"
              style={{
                color: verified ? "#f87171" : "#dc2626",
                borderColor: verified ? "rgba(248,113,113,0.3)" : "rgba(220,38,38,0.3)",
                background: verified ? "rgba(248,113,113,0.05)" : "rgba(220,38,38,0.05)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                style={{ backgroundColor: verified ? "#f87171" : "#dc2626" }}
              />
              {verified ? "VERIFIED" : "UNVERIFIED"}
            </span>
          </div>
        </div>

        {/* ── MAIN CARD ── */}
        <div
          className="border relative overflow-hidden"
          style={{
            borderColor: verified
              ? "rgba(239,68,68,0.5)"
              : "rgba(239,68,68,0.2)",
            boxShadow: verified
              ? "0 0 60px rgba(239,68,68,0.1), inset 0 0 0 1px rgba(239,68,68,0.1)"
              : "0 0 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(239,68,68,0.05)",
            background: "rgba(5,5,5,0.8)",
          }}
        >
          {verified ? (
            <div className="flex flex-col lg:flex-row">
              {/* LEFT — certificate image */}
              <div className="lg:w-[60%] border-b lg:border-b-0 lg:border-r border-red-600/30 bg-[#0a0a0a] relative flex items-center justify-center p-6 md:p-8">
                <div className="relative w-full max-w-[700px] overflow-hidden border border-red-600/40">
                  {/* SCAN LINES EFFECT */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.03) 2px, rgba(239,68,68,0.03) 4px)",
                    }}
                  />
                  
                  {/* CORNER BRACKETS */}
                  <div className="absolute inset-3 z-20 pointer-events-none">
                    <CornerBracket pos="tl" />
                    <CornerBracket pos="tr" />
                    <CornerBracket pos="bl" />
                    <CornerBracket pos="br" />
                  </div>
                  
                  <CertImage src={certImageUrl} />
                </div>
              </div>

              {/* RIGHT — info panel */}
              <div className="lg:w-[40%] flex flex-col p-6 md:p-8 bg-[#0a0a0a] relative overflow-hidden">
                {/* TOP ACCENT */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-red-600/0 via-red-600/50 to-red-600/0" />

                {/* HEADER */}
                <div className="items-center justify-between mb-6">
                  <span className="font-mono text-[9px] text-red-500 uppercase tracking-[0.25em]">
                    ♥ CERTIFICATE DETAILS
                  </span>
                </div>

                <div className="h-px bg-red-600/20 mb-6" />

                {/* Event info block */}
                <div className="mb-6">
                  <SectionLabel label="Event" />
                  <div
                    className="border border-red-600/30 p-4 font-mono text-[11px]"
                    style={{ background: "rgba(239,68,68,0.03)" }}
                  >
                    <p className="text-red-300/90 leading-relaxed">
                      SYNERGY 3.0 — NATIONAL LEVEL HACKATHON
                      <br />
                      <span className="text-red-500/60 text-[9px]">
                        VERIFIED PARTICIPANT CERTIFICATE
                      </span>
                    </p>
                  </div>
                </div>

                {/* Code display */}
                <div className="mb-6">
                  <SectionLabel label="Certificate ID" />
                  <div
                    className="border border-red-600/30 px-4 py-3 flex items-center justify-between"
                    style={{ background: "rgba(239,68,68,0.03)" }}
                  >
                    <span className="font-mono text-sm text-red-400 tracking-widest uppercase">
                      {code}
                    </span>
                    <span className="font-mono text-[8px] text-red-600/60 uppercase tracking-widest">
                      VALID ✓
                    </span>
                  </div>
                </div>

                {/* SPACER */}
                <div className="flex-1" />

                {/* Download buttons */}
                <div className="mb-4">
                  <SectionLabel label="Export" />
                  <div className="flex gap-2">
                    <DownloadButton
                      href={`/api/cert-image?code=${encodeURIComponent(code)}&format=pdf`}
                      label="PDF"
                    />
                    <DownloadButton
                      href={`/api/cert-image?code=${encodeURIComponent(code)}&format=png`}
                      download={`synergy3.0_cert_${code}.png`}
                      label="PNG"
                    />
                  </div>
                </div>

                {/* LinkedIn share */}
                <div>
                  <SectionLabel label="Share" />
                  <LinkedInShareButton code={code} />
                </div>

                {/* BOTTOM ACCENT */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0" />
              </div>
            </div>
          ) : (
            /* ── UNVERIFIED STATE ── */
            <div className="w-full flex items-center justify-center px-4 py-16 md:py-20">
              <div className="w-full max-w-2xl">
                <div 
                  className="w-full border p-8 md:p-12"
                  style={{
                    borderColor: "rgba(220,38,38,0.4)",
                    background: "linear-gradient(135deg, rgba(220,38,38,0.05) 0%, rgba(127,29,29,0.05) 100%)",
                    boxShadow: "0 0 40px rgba(220,38,38,0.1), inset 0 0 0 1px rgba(220,38,38,0.1)",
                  }}
                >
                  {/* ERROR BADGE */}
                  <div className="text-center mb-8">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 blur-xl rounded-full scale-150 animate-pulse bg-red-600/20" />
                      <div className="relative px-5 py-2 border border-red-600/60 text-[10px] font-bold tracking-widest uppercase text-red-400" 
                           style={{ background: "rgba(220,38,38,0.1)" }}>
                        ⚠ VERIFICATION FAILED
                      </div>
                    </div>
                  </div>

                  {/* ERROR MESSAGE */}
                  <div className="space-y-6 py-4 text-center">
                    <div 
                      className="border p-6"
                      style={{
                        borderColor: "rgba(239,68,68,0.3)",
                        background: "rgba(220,38,38,0.05)",
                      }}
                    >
                      <p className="text-red-300/80 mb-3 font-mono text-sm">
                        The certificate ID you are looking for does not exist in our database.
                      </p>
                      <span className="font-mono text-red-400 text-base uppercase tracking-wider">
                        {code}
                      </span>
                    </div>

                    <p className="text-red-400/60 text-sm font-mono">
                      If you believe this is an error, please contact the{" "}
                      <Link
                        href="/contact"
                        className="text-red-300 hover:text-red-200 transition-colors font-bold"
                      >
                        SYNERGY TEAM
                      </Link>
                      {" "}with your registration details.
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href={'/'}
                        className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-bold font-mono text-sm text-center uppercase tracking-widest hover:bg-red-500 transition-colors"
                      >
                        Return Home
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="mt-8 flex justify-between font-mono text-[8px] text-red-600/40 uppercase tracking-[0.2em] px-2">
          <span>© 2026 SYNERGY_OPS</span>
          <span>DO NOT LEAVE THE ARENA</span>
        </div>
      </div>
    </main>
  );
}