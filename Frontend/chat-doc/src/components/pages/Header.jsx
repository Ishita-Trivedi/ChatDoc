import React from 'react';
import Logo from '../../assets/logo.svg';
// import './indexs.css'; // Ensure the custom CSS is imported

const Header = () => {
  const navItems = [
    { id: 1, text: 'Product' },
    { id: 2, text: 'Customers' },
    { id: 3, text: 'Resources' },
    { id: 4, text: 'Pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Centering the nav container */}
      <div className="max-w-screen-xl mx-auto p-4">
        <nav className="w-auto rounded-lg backdrop-blur-lg bg-white bg-opacity-50 border-b border-gray-200 flex items-center justify-around p-4 text-black font-roboto">
          {/* Logo and Title */}
          <a href="#" className="flex items-center space-x-2">
            <img src={Logo} alt="ChatDoc" className="h-8 w-8" />
            <p className="font-bold hover:underline text-xl py-4">ChatDoc</p>
          </a>
          
          {/* Navigation Items */}
          <ul className="flex space-x-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href="#" className="hover:underline">{item.text}</a>
              </li>
            ))}
          </ul>

          {/* Authentication Buttons */}
          <div className="space-x-2">
            <button className="px-2 py-2 bg-white text-blue-600 rounded hover:bg-gray-200">Login</button>
            <button className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200">Sign up</button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
