import React, { useState, useRef } from 'react';
import { Button, Typography } from "@material-tailwind/react";
import { FaUpload, FaLink } from 'react-icons/fa';
import ChatBubble from '../ui/ChatBubble';
import { MdCheckCircle } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiHelpCircle } from 'react-icons/bi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SignedIn, UserButton, useClerk } from '@clerk/clerk-react';  // Add useClerk import
import { useNavigate } from 'react-router-dom'; 
import ChatDocLogo from '../ui/ChatDocLogo';
import axios from 'axios';



const UploadPage = () => {
  // State for storing the input file
  const [file, setFile] = useState(null);
  const fileContent = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); // New state variable
  const [question, setQuestion] = useState("");
  const [qlist, setQlist] = useState([
    { question: "What is React?", answer: "React is a JavaScript library for building user interfaces." },
    { question: "What is Tailwind CSS?", answer: "Tailwind CSS is a utility-first CSS framework for creating custom designs." }
  ]);

  const navigate = useNavigate();  // Use navigate for routing
  const clerk = useClerk();  // Get Clerk instance to access signOut function

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadSuccess(false); // Reset upload success when a new file is selected
  };

  // Logic to handle user file upload
  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      const formData = new FormData();  // Create FormData object
      formData.append('file', file);  // Add file to form data

      try {
        const response = await axios.post('http://localhost:300/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',  // Important header for file uploads
          },
        });
        toast.success("File uploaded successfully!");
        setUploadSuccess(true); // Set uploadSuccess to true on successful upload
        // Storing the file Content for answering queries
        fileContent.current = response.data;
        // console.log('FileContent saved as this on upload', response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("File upload failed.");
      } finally {
        setUploading(false);
      }
    } else {
      toast.error("Please select a file to upload.");
    }
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  // Handle question submission
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (question.length === 0) {
      alert('Please enter a non-empty question to proceed!');
      return;
    }
    if (!file) {
      alert('Please upload a file before asking a question!');
      return;
    }

    // Prepare the data to send to the backend
    const qaPair = { question, fileContent: fileContent };
    console.log(qaPair);
    try {
      const response = await axios.post('http://localhost:300/question/ask', qaPair);
      // Assuming backend responds with the OpenAI's answer
      const answer = response.data.answer;
      console.log('the answer we received', answer);
      // Update the Q&A list
      setQlist((prevQlist) => [...prevQlist, { question, answer }]);
      setQuestion("");  // Clear input
      // Do NOT clear the file here to allow for subsequent questions
      toast.success("Question submitted successfully!");

    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Error submitting question.");
    }
  };

  const handleSignOut = () => {
    clerk.signOut().then(() => {
      navigate('/');  // Redirect to home page after signing out
    });
  };

  return (
    <div className="flex flex-col min-h-screen" style={{
      backgroundColor: '#e5e5f7',
      backgroundImage: 'radial-gradient(#444cf7 1px, #e5e5f7 1px)',
      backgroundSize: '15px 15px',
      opacity: 1,
    }}>
      <ToastContainer />
      <header className="sticky top-0 w-2/4 bg-white bg-opacity-30 backdrop-filter backdrop-blur-2xl shadow-xl rounded-full p-2 mx-auto mt-4">
        <div className="flex items-center justify-between">
          {/* Left side - User button and sign out */}
          <div className="flex items-center">
            <SignedIn>
              <UserButton path="/" />
              <Button onClick={handleSignOut} color="red" className="ml-2">
                Sign Out
              </Button>
            </SignedIn>
          </div>

          {/* Centered Logo with Flex Centering */}
          <div className="flex-grow flex justify-center">
            <ChatDocLogo />
          </div>

          {/* Right side - Upload section */}
          <div className="flex items-center space-x-2">
            <form className="flex items-center">
              <label
                htmlFor="file-upload"
                className="cursor-pointer p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
              >
                <FaUpload size={24} />
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".docx,.txt,.pdf"
              />
              <Button onClick={handleUpload} color="blue">
                Upload
              </Button>
              <div className="flex items-center ml-2">
                {uploading ? (
                  <AiOutlineLoading3Quarters className="animate-spin" size={24} />
                ) : uploadSuccess ? (
                  <MdCheckCircle size={24} className="text-green-500" />
                ) : (
                  <BiHelpCircle size={24} className="text-gray-500" />
                )}
              </div>
            </form>
          </div>
        </div>
      </header>
      
      <div className="flex-grow flex flex-col items-center justify-center p-5">
        <div className="w-full max-w-2xl flex-1 p-4 bg-gray-100 rounded-lg mb-8">
          <Typography variant="h5" className="mb-4">Q&A Section</Typography>
          <ChatBubble qlist={qlist} />
        </div>
      </div>

      <footer className="sticky bottom-0 w-1/2 mx-auto bg-white shadow-lg rounded-t-lg p-2 flex items-center space-x-2">
        <form onSubmit={handleQuestionSubmit} className="flex w-full items-center">
          <label htmlFor="file-link" className="cursor-pointer p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <FaLink size={24} />
          </label>
          <input
            id="file-link"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="chat" className="sr-only">Your message</label>
          <div className="flex-grow">
            <textarea
              id="chat"
              rows="1"
              value={question}
              onChange={handleQuestionChange}
              placeholder="Your message..."
              className="block p-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
          >
            <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default UploadPage;
