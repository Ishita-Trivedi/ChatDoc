import React from 'react';
import { FaCopyright, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'; // Social icons from Font Awesome
import { Button, Badge, IconButton } from '@material-tailwind/react';

// Animated Heart Component
const AnimatedHeart = () => (
  <span className="relative inline-block">
    <span className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
    <span className="relative text-red-500 animate-bounce">❤️</span>
  </span>
);

// Animated Dot Component
const AnimatedDot = () => (
  <span className="relative inline-block">
    <span className="absolute inset-0 bg-blue-500 rounded-full animate-ping" />
    <span className="relative text-blue-500">New</span>
  </span>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  //This was printed twice: as react strict mode in app.jsx loads a page twice
  //to ensure all the pages and its components are loaded properly
  // console.log('print');
  const handleFeedbackClick = () => {
  window.open("https://forms.gle/g65aFUhcZ3GDTyPWA", "_blank", "noopener,noreferrer");
  };
  return (
    // Transitioning footer shades
    <footer className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl font-bold mb-4">Chat Doc PDF</h2>
            <p className="text-sm text-gray-300">
              Revolutionizing document interactions through AI-powered conversations.
            </p>
          </div>

          {/* Center Section */}
          <div className="flex flex-col items-center md:items-center text-center">
            <h3 className="text-lg font-semibold mb-4">Feedback</h3>
            <div className="flex items-center">
              <Badge color="blue" className="animate-bounce mr-2">
                <span className="flex items-center">
                  <AnimatedDot /> 
                </span>
              </Badge>
              <span className="relative inline-block ">
              {/* <span className="absolute inset-0 bg-blue-500 rounded-full animate-ping" /> */}

              <a
                href="https://forms.gle/g65aFUhcZ3GDTyPWA" 
                //This would open the form in new window:security + better user experience
                //Prevents attackers to get access of window.opener + http.opener
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="filled"
                  color="black"
                  ripple={true}
                  onClick={handleFeedbackClick}
                >
                  Submit Feedback
                </Button>
              </a>
                </span>
            </div>
          </div>

          {/* Right Section: Social links */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://twitter.com/IshitaTrivedi28" target="_blank" rel="noopener noreferrer">
                <IconButton variant="gradient" className="rounded-full transition-transform transform hover:scale-110">
                  <FaTwitter size={24} />
                </IconButton>
              </a>
              <a href="https://github.com/Ishita-Trivedi" target="_blank" rel="noopener noreferrer">
                <IconButton variant="gradient" className="rounded-full transition-transform transform hover:scale-110">
                  <FaGithub size={24} />
                </IconButton>
              </a>
              <a href="https://www.linkedin.com/in/connect2ishita/" target="_blank" rel="noopener noreferrer">
                <IconButton variant="gradient" className="rounded-full transition-transform transform hover:scale-110">
                  <FaLinkedin size={24} />
                </IconButton>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-blue-500 my-8" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className='flex items-center justify-center gap-2'>
            Made with <AnimatedHeart /> by 
            <a className='underline' href="https://www.linkedin.com/in/connect2ishita/" target='_blank'> Ishita Trivedi</a>
          </p>

          <p className='text-sm text-gray-400 mt-4 md:mt-0 flex gap-2 items-center text-primary/70'>
            <FaCopyright /> {currentYear} Chat Doc PDF. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
