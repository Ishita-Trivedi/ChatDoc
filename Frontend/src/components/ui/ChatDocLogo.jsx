// Created ChatDocLogo component to use it at multiple places
import React from 'react';

//#2563eb is bg-blue-600 tailwind
const ChatDocLogo = ({ size = 30, color = "#2563eb", text = "ChatDoc" }) => {
  return (
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse transition duration-500"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
      <p className="text-2xl font-semibold transition-transform duration-300 transform hover:scale-105 ml-2">
        {text}
      </p>
    </div>
  );
};

export default ChatDocLogo;
