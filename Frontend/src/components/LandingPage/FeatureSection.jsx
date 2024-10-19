'use client'

import React from "react"
import { motion } from "framer-motion"
import { Zap, Shield, HeadphonesIcon, PuzzleIcon } from "lucide-react"

const features = [
  {
    title: "User-Friendly Interface",
    description: "Our platform is designed with ease of use in mind, making navigation effortless.",
    icon: Zap,
  },
  {
    title: "Secure Data Management",
    description: "We prioritize your data security with advanced encryption and privacy measures.",
    icon: Shield,
  },
  {
    title: "24/7 Customer Support",
    description: "Our dedicated support team is here to assist you around the clock.",
    icon: HeadphonesIcon,
  },
  {
    title: "Seamless Integrations",
    description: "Easily integrate with your favorite tools and platforms for a streamlined experience.",
    icon: PuzzleIcon,
  },
]

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-center w-12 h-12 mb-4 bg-primary rounded-full">
        <feature.icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </motion.div>
  )
}

export default function FeatureSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the amazing features that set us apart and elevate your experience.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
