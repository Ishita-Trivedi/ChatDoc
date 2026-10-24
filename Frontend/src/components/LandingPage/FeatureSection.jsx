'use client'

import { motion } from "framer-motion"
import { BadgeCheck, BrainCircuit, Files, GitCompareArrows, Search, ShieldCheck } from "lucide-react"

const features = [
  {
    title: "Grounded Document Q&A",
    description: "Ask natural-language questions and receive answers grounded only in evidence retrieved from your documents.",
    icon: BrainCircuit,
  },
  {
    title: "Multi-Document Conversations",
    description: "Select multiple PDFs or text files and carry context-aware conversations across your entire knowledge base.",
    icon: Files,
  },
  {
    title: "Verified Page Citations",
    description: "Every supported answer links back to validated filenames, page numbers, and the exact source excerpts.",
    icon: BadgeCheck,
  },
  {
    title: "Hybrid AI Retrieval",
    description: "Semantic embeddings and exact keyword search are fused to find concepts, names, codes, and precise facts.",
    icon: Search,
  },
  {
    title: "Cited Document Comparison",
    description: "Compare conclusions, risks, and recommendations across documents with evidence for every factual claim.",
    icon: GitCompareArrows,
  },
  {
    title: "Private and Explainable",
    description: "User-isolated document access, prompt-injection defenses, retrieval scores, and transparent AI status build trust.",
    icon: ShieldCheck,
  },
]

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="theme-card group rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:!border-blue-300 hover:shadow-xl dark:hover:shadow-blue-950/30"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 transition-transform group-hover:scale-110">
        <feature.icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="theme-heading mb-2 text-xl font-semibold">{feature.title}</h3>
      <p className="theme-body leading-7">{feature.description}</p>
    </motion.div>
  )
}

export default function FeatureSection() {
  return (
    <section className="theme-section relative overflow-hidden py-24 transition-colors duration-300">
      <div className="theme-body absolute inset-0 z-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Built for trustworthy AI</p>
          <h2 className="theme-heading mb-4 text-4xl font-bold">Turn documents into cited answers</h2>
          <p className="theme-body mx-auto max-w-2xl text-xl">
            Production-minded retrieval, transparent evidence, and secure multi-document intelligence in one workspace.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
