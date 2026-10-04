"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./nav-config";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpenAI = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-polar-ai"));
      const el = document.getElementById("polar-ai-chat");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── 1. OFFICIAL GOVERNMENT RIBBON ── */}
      <div className="bg-white border-b border-slate-200 px-4 py-1.5 text-[11px] text-slate-600">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 tracking-wide">🇮🇳 GOVERNMENT OF INDIA</span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-600">Ministry of Earth Sciences (MoES)</span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="hidden md:inline font-medium text-slate-700">
              National Centre for Polar and Ocean Research (NCPOR)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
              SIH 2026 · PS 26063
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              National Gateway Active
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. UNIFIED ENTERPRISE NAVBAR ── */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-2 sm:py-2.5">

          {/* BRAND LOGO */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0" aria-label="POLARIS Home">
            <Image
              src="/images/polaris_logo.png"
              alt="POLARIS — India's Polar Science & Knowledge Portal"
              width={240}
              height={88}
              className="h-11 sm:h-12 md:h-14 w-auto object-contain transition duration-200 group-hover:opacity-90"
              priority
            />
          </Link>

          {/* NAV LINKS (Unified 9 Links, Strictly Identical Order) */}
          <div className="hidden items-center gap-0.5 text-sm font-medium lg:flex">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-2xs"
                      : "text-slate-600 border border-transparent hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* POLAR AI TRIGGER BUTTON */}
            <button
              type="button"
              onClick={handleOpenAI}
              aria-label="Open POLAR AI Assistant"
              className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition whitespace-nowrap shadow-2xs"
            >
              ✦ Polar AI
            </button>

            {/* ROUTE DESTINATION BUTTON */}
            {isHome ? (
              <Link
                href="/explore"
                className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm shadow-blue-500/20 whitespace-nowrap"
              >
                Explore Portal →
              </Link>
            ) : (
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm shadow-blue-500/20 whitespace-nowrap"
              >
                ← Home
              </Link>
            )}

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 shadow-lg space-y-1">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="text-xs text-blue-600 font-bold">● Active</span>}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {isHome ? (
                <Link
                  href="/explore"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Explore Portal →
                </Link>
              ) : (
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  ← Home
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
