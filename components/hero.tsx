"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
          Your AI Career Coach for Professional Success
        </h1>
        <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
          Advance your career with personalized guidance, interview prep, and
          AI-powered tools for job success.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-6 text-lg">
              Get Started
            </Button>
          </Link>
          <Link
            href="https://youtu.be/wIuqGFw54jI"
            target="_blank">
              <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Watch Demo
              </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
