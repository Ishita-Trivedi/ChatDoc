import React, { useState } from 'react';

const ChatBubble = ({ qlist }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset copied index after 2 seconds
    }).catch(err => {
      console.error("Could not copy text: ", err);
    });
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto"> {/* Added scrollable container */}
      {qlist.map((item, index) => (
        <div key={index} className="mr-auto flex flex-col gap-2 rounded-md bg-neutral-50 p-4 text-neutral-900 w-full max-w-full dark:bg-neutral-900 dark:text-white"> {/* Set to full width */}
          <span className="font-semibold">Q: {item.question}</span>
          <div className="flex justify-between items-center">
            <div className="text-sm text-neutral-600 dark:text-neutral-300">
              A: {item.answer}
            </div>
            <button 
              onClick={() => copyToClipboard(item.answer, index)} 
              className="ml-2 relative inline-flex items-center"
            >
              {copiedIndex === index ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="green" 
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-5 h-5 text-gray-500 hover:text-gray-700"
                >
                  <path d="M10 3C8.9 3 8 3.9 8 5V6H6C4.9 6 4 6.9 4 8V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8C20 6.9 19.1 6 18 6H16V5C16 3.9 15.1 3 14 3H10ZM6 8H18V20H6V8Z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatBubble;
