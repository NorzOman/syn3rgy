"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { UnifrakturCook } from "next/font/google";

const fraktur = UnifrakturCook({
  subsets: ["latin"],
  weight: "700",
});

/* ---------------- ERROR BANNER (NEON STYLE) ---------------- */
function ErrorBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6 border border-red-500/80 bg-red-500/10 px-4 py-3 rounded-sm relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.2),transparent_70%)]" />
      <div className="relative flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-red-300 font-bold font-mono">
          ♥ ACCESS DENIED — {message}
        </span>
        <span className="text-red-400 animate-pulse">⚡</span>
      </div>
    </motion.div>
  );
}

/* ---------------- INPUT FIELD WITH NEON BORDERS ---------------- */
function InputField({ label, value, onChange, placeholder, suit }: any) {
  return (
    <div className="relative mb-6">
      <label className="text-xs uppercase tracking-widest text-red-400 font-mono font-bold flex items-center gap-2 mb-2">
        {suit} {label}
      </label>

      <div className="relative group">
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-black border border-red-500/40 rounded-sm text-white placeholder-red-900/50 outline-none focus:border-red-500 focus:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all font-mono text-sm uppercase"
        />
      </div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function CertificateGenerator() {
  const router = useRouter();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [particlesActive, setParticlesActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!particlesActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    particlesRef.current = [];

    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: ["#ff006e", "#fb5607", "#ffbe0b", "#ffffff"][
          Math.floor(Math.random() * 4)
        ],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= 0.02;

        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      if (particlesRef.current.length > 0) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [particlesActive]);

  const validate = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const cleanPhone = phone.replace(/\D/g, "");

    if (!name.trim()) {
      setGlobalError("Name field is empty");
      return false;
    }

    if (!nameRegex.test(name)) {
      setGlobalError("Invalid characters in name");
      return false;
    }

    if (cleanPhone.length !== 10) {
      setGlobalError("Phone must be 10 digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setGlobalError("");

    if (!validate()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim().split(" ")[0],
          phone: phone.replace(/\D/g, ""),
          event: "sy03",
        }),
      });

      const data = await res.json();

      if (res.ok && data.shareUrl) {
        setStatus("success");

        setParticlesActive(true);

        setTimeout(() => {
          router.push(data.shareUrl);
          setParticlesActive(false);
        }, 1200);
      } else {
        setGlobalError(data.message || "System rejected request");
        setStatus("error");
      }
    } catch {
      setGlobalError("Network failure detected");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#e0e0e0] flex items-center justify-center p-6 font-mono selection:bg-red-600">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      
      <div className="w-full max-w-lg relative">
        
        {/* TOP STATUS BAR */}
        <div className="flex justify-between items-end mb-2 px-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-red-600 font-black tracking-[.3em]">National Level Hackthon</span>
            <div className="h-1 w-12 bg-red-600 mt-1" />
          </div>
          <span className="text-[10px] text-zinc-500">REGION: TOKYO_SHIBUYA</span>
        </div>

        {/* MAIN TERMINAL CONTAINER */}
        <div className="relative border border-zinc-800 bg-[#0a0a0a] overflow-hidden">
          
          {/* THE "SHUTTER" ANIMATION ON LOAD */}
          <motion.div 
            initial={{ height: "100%" }}
            animate={{ height: 0 }}
            transition={{ duration: 1, ease: [0.45, 0, 0.55, 1] }}
            className="absolute inset-0 bg-zinc-100 z-50 pointer-events-none"
          />

          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            {/* HEADER SECTION */}
            <div className="mb-12">
              <div className={`${fraktur} text-4xl font-black tracking-[0.04em] uppercase leading-none mb-2 italic`}>
                SYNERGY 3.0<span className="text-red-600">_</span>
              </div>
              <div className="flex gap-4 text-[10px] text-zinc-500 tracking-widest">
                <span>[ A OF HEARTS ]</span>
                <span className="text-red-900 animate-pulse">● CONNECTION_STABLE</span>
              </div>
            </div>

            {/* FORM FIELDS */}
            <div className="space-y-8">
              <div className="group relative">
                <label className="text-[10px] uppercase text-zinc-300 block mb-2 tracking-widest">Subject Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-800 p-2 outline-none focus:border-red-600 transition-colors text-m uppercase tracking-tight"
                  placeholder="First Name"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] uppercase text-zinc-300 block mb-2 tracking-widest">Phone Number</label>
                <input 
                  type="text"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-800 p-2 outline-none focus:border-red-600 transition-colors text-m"
                  placeholder="9183497030"
                />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button 
              className="group relative w-full mt-12 bg-zinc-100 hover:bg-red-600 py-4 transition-all duration-300 overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-3 text-black group-hover:text-white font-black uppercase tracking-widest">
                {status === "loading" ? "Verifying..." : "Claim Certificate"}
                <span className="text-xl">→</span>
              </div>
              
              {/* BUTTON GLITCH OVERLAY */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,#000_1px,#000_2px)]" />
            </button>
          </form>

          {/* DECORATIVE CORNER DATA */}
          <div className="absolute bottom-2 right-2 flex gap-2">
             <div className="w-1 h-1 bg-red-600" />
             <div className="w-1 h-1 bg-zinc-800" />
             <div className="w-1 h-1 bg-zinc-800" />
          </div>
        </div>

        {/* BOTTOM DECORATIVE TEXT */}
        <div className="mt-4 flex justify-between font-mono text-[9px] text-zinc-600 uppercase tracking-[0.2em]">
          <span>© 2026 synergy_ops</span>
          <span>Do not leave the arena</span>
        </div>
      </div>
    </main>
  );
}