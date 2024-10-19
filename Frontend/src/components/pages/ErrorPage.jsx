import React from 'react';
import { Button, Typography } from "@material-tailwind/react";
// import { useNavigate } from 'react-router-dom'; // Uncomment if using navigation

const ErrorPage = () => {
  // const navigate = useNavigate();

  // const goHome = () => {
  //   navigate('/'); 
  // };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: `url('/assets/errorSvg.svg')`, // Ensure the path is correct
        backgroundSize: 'contain', // Change to contain for better scaling
        minHeight: '100vh', // Ensure it covers the full height
      }}
    >
      <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-md text-center">
        <Typography variant="h5" className="mb-8 animate-pulse">
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Button
          color="blue"
          variant="outlined"
          // onClick={goHome}
          ripple={true}
          className="px-6 py-2 "
        >
          Go Back to Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
