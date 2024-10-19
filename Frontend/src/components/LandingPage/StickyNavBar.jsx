import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import ChatDocLogo from "../ui/ChatDocLogo";
export default function StickyNavbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  const themeClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
  const buttonHoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300';

  return (
    <nav className={`w-full px-4 lg:px-0 h-[70px] z-[2] fixed top-0 backdrop-blur-sm border-b-[1px] transition duration-300 ${themeClass}`}>
      <div className="max-w-[1200px] w-full py-4 mx-auto flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="flex items-center">
           <ChatDocLogo/>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sign In Button for signed-out users */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button className={`transition-all duration-300 ${buttonHoverClass}`}>Sign In</Button>
            </SignInButton>
          </SignedOut>

          {/* Sign Up Button for signed-out users */}
          <SignedOut>
            <SignUpButton mode="modal">
              <Button className={`transition-all duration-300 ${buttonHoverClass}`}>Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          {/* User Button for signed-in users */}
          <SignedIn>
            <UserButton path="/" />
          </SignedIn>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded transition-colors duration-300 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
}
