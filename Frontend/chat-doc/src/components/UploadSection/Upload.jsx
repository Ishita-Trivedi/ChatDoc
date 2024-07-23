import React, { useState } from 'react';
import axios from 'axios';
import { UploadIcon } from '@radix-ui/react-icons';

const Upload = () => {
    const url = 'http://localhost:3000'; // Ensure this matches your backend server URL
    const [file, setFile] = useState(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const onFileChangeHandler = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            console.log('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', file); // Ensure the key matches the backend expectation

        try {
            const response = await axios.post(`${url}/file/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading file:', error.response?.data || error.message);
        }
    };

    const handleQuestionSubmit = async () => {
        try {
            const response = await axios.get(`${url}/file/ask`, {
                params: { question }
            });
            setAnswer(response.data.answer);
        } catch (error) {
            console.error('Error asking question:', error.response?.data || error.message);
        }
    };

    return (
        <div className='content-center'>
            <h1>Upload Section</h1>
            <input type="file" onChange={onFileChangeHandler} />
            <button
                className="flex items-center space-x-2 px-4 py-2 ring-2 m-5 ring-teal-300 bg-yellow-100 text-black rounded hover:bg-white-700"
                type="submit"
                onClick={handleFileUpload}
            >
                <UploadIcon className="h-5 w-5 animate-bounce" />
                <span className="text-sm">Upload</span>
            </button>
            <div>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question"
                />
                <button onClick={handleQuestionSubmit}>Ask</button>
            </div>
            {answer && <div><h2>Answer:</h2><p>{answer}</p></div>}
        </div>
    );
};

export default Upload;
