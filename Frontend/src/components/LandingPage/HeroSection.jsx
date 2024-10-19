import React, { useState, useEffect } from "react"
import { Button } from "@material-tailwind/react";
import { MessageCircleQuestion, FileText, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useUser,useClerk } from '@clerk/clerk-react'


const FeatureIcon = ({ Icon, text }) => (
  <div className="flex items-center space-x-2">
    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    <span>{text}</span>
  </div>
)

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 animate-gradient-slow"></div>
    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  </div>
)

export default function HeroSection() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate=useNavigate();
  const { isSignedIn, user, isLoaded } = useUser()
   const clerk = useClerk()

  const handleNavigate=async()=>{
   if (!isSignedIn) {
    // Open the Clerk sign-in modal and wait for the user to sign in
    await clerk.openSignIn({
      fallbackRedirectUrl: "/upload", // Redirect to the upload page after successful sign-in
    });
  } else {
    // If the user is already signed in, navigate to the upload page
    navigate("/upload");
  }
  }
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setIsDarkMode(savedTheme === 'dark')
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return (
    <section className="relative w-full min-h-screen pt-[70px] overflow-hidden transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <AnimatedBackground />
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Chat with Your Documents
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Powered by AI
            </span>
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-white">
            Upload your PDFs and instantly get answers to your questions. ChatDoc revolutionizes the way you interact with your documents.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
             onClick={handleNavigate}>
              Get Started Free
            </Button>
             {/* //later would use this for creating links to the SAAS's docs */}
            {/* <Button  className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
              Learn More
            </Button> */}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <FeatureIcon Icon={MessageCircleQuestion} text="AI-Powered Chat" />
            <FeatureIcon Icon={FileText} text="Instant PDF Analysis" />
            <FeatureIcon Icon={Zap} text="Lightning Fast Responses" />
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg transform -rotate-6 animate-pulse"></div>
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform rotate-3 flex items-center justify-center">
              <FileText className="w-32 h-32 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="absolute -top-4 -left-4 bg-yellow-400 rounded-full p-3 shadow-lg animate-bounce">
              <MessageCircleQuestion className="w-6 h-6 text-gray-800" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-green-400 rounded-full p-3 shadow-lg animate-bounce delay-150">
              <Zap className="w-6 h-6 text-gray-800" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}