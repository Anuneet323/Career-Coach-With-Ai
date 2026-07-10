"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  ScrollText,
  Briefcase,
  FileText,
  LineChart,
} from "lucide-react";

export default function HeroAnimation() {
  // Define positions for our interactive nodes
  const nodes = [
    {
      id: "resume",
      title: "Resume Builder",
      icon: <ScrollText className="w-6 h-6 text-blue-400" />,
      color:
        "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-300",
      x: "10%",
      y: "20%",
      floatDelay: 0,
    },
    {
      id: "interview",
      title: "Mock Interview",
      icon: <Briefcase className="w-6 h-6 text-purple-400" />,
      color:
        "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300",
      x: "80%",
      y: "25%",
      floatDelay: 1,
    },
    {
      id: "cover-letter",
      title: "Cover Letter",
      icon: <FileText className="w-6 h-6 text-pink-400" />,
      color: "from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-300",
      x: "15%",
      y: "70%",
      floatDelay: 1.5,
    },
    {
      id: "insights",
      title: "Industry Insights",
      icon: <LineChart className="w-6 h-6 text-emerald-400" />,
      color:
        "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300",
      x: "75%",
      y: "65%",
      floatDelay: 0.5,
    },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[550px] md:h-[600px] bg-slate-950/20 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm flex items-center justify-center mt-12 shadow-2xl">
      {/* Premium background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* SVG Connecting Paths */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated connecting lines from center to nodes */}
        {/* Node 1: Resume */}
        <motion.path
          d="M 500,300 L 100,120"
          stroke="url(#gradient-blue)"
          strokeWidth="2"
          strokeDasharray="8 6"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, strokeDashoffset: [0, -50] }}
          transition={{
            strokeDashoffset: { repeat: Infinity, duration: 4, ease: "linear" },
            pathLength: { duration: 1.5 },
          }}
        />

        {/* Node 2: Interview */}
        <motion.path
          d="M 500,300 L 800,150"
          stroke="url(#gradient-purple)"
          strokeWidth="2"
          strokeDasharray="8 6"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, strokeDashoffset: [0, -50] }}
          transition={{
            strokeDashoffset: { repeat: Infinity, duration: 4, ease: "linear" },
            pathLength: { duration: 1.5 },
          }}
        />

        {/* Node 3: Cover Letter */}
        <motion.path
          d="M 500,300 L 150,420"
          stroke="url(#gradient-pink)"
          strokeWidth="2"
          strokeDasharray="8 6"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, strokeDashoffset: [0, -50] }}
          transition={{
            strokeDashoffset: { repeat: Infinity, duration: 4, ease: "linear" },
            pathLength: { duration: 1.5 },
          }}
        />

        {/* Node 4: Insights */}
        <motion.path
          d="M 500,300 L 750,390"
          stroke="url(#gradient-emerald)"
          strokeWidth="2"
          strokeDasharray="8 6"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, strokeDashoffset: [0, -50] }}
          transition={{
            strokeDashoffset: { repeat: Infinity, duration: 4, ease: "linear" },
            pathLength: { duration: 1.5 },
          }}
        />

        {/* Gradients definitions */}
        <defs>
          <linearGradient
            id="gradient-blue"
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient
            id="gradient-purple"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient
            id="gradient-pink"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient
            id="gradient-emerald"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central Node: AI Core */}
      <motion.div
        className="z-10 flex flex-col items-center justify-center p-6 rounded-full border border-purple-500/40 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 shadow-[0_0_50px_rgba(139,92,246,0.3)] w-36 h-36 relative"
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 30px rgba(139,92,246,0.2)",
            "0 0 50px rgba(139,92,246,0.4)",
            "0 0 30px rgba(139,92,246,0.2)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 animate-pulse pointer-events-none" />
        <Brain className="w-12 h-12 text-purple-400 mb-1 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-purple-200 text-center">
          AiCareer Core
        </span>
      </motion.div>

      {/* Outer Floating Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute z-20 flex items-center space-x-3 px-4 py-3 rounded-xl border bg-gradient-to-br shadow-lg cursor-pointer select-none"
          style={{ left: node.x, top: node.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -12, 0],
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
          }}
          transition={{
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: node.floatDelay,
            },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
          }}
        >
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            {node.icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide whitespace-nowrap text-white">
              {node.title}
            </h4>
            <p className="text-[10px] text-gray-400 font-medium">
              Click to access
            </p>
          </div>
        </motion.div>
      ))}

      {/* Subtle micro-text in corner */}
      <div className="absolute bottom-4 left-6 text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
        Autonomous AI Optimization System v2.0
      </div>
    </div>
  );
}
