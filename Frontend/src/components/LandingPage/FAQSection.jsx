import React, { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is ChatDoc?",
      answer: "ChatDoc is an AI-powered tool for interacting with documents via instant Q&A.",
    },
    {
      question: "How do I upload a document?",
      answer: "Hit \"Get Started\" to upload a document.",
    },
    {
      question: "What types of documents can I use with ChatDoc?",
      answer: "ChatDoc supports .docx, .pdf, and .txt file formats.",
    },
    {
      question: "What if I encounter technical issues?",
      answer: "Refresh the page or clear your browser cache, and reach out through feedback if problems persist.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl font-manrope text-center font-bold text-gray-900 leading-[3.25rem]">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="accordion-group">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`accordion border border-solid border-gray-300 p-4 rounded-xl mb-8 transition duration-500 ${openIndex === index ? 'bg-indigo-50 border-indigo-600' : ''}`}
            >
              <button
                className="accordion-toggle group inline-flex items-center justify-between text-left text-lg font-normal leading-8 text-gray-900 w-full transition duration-500 hover:text-indigo-600"
                onClick={() => handleToggle(index)}
                aria-controls={`collapse-${index}`}
                aria-expanded={openIndex === index}
              >
                <h5>{faq.question}</h5>
                <svg
                  className={`w-6 h-6 text-gray-900 transition duration-500 ${openIndex === index ? 'hidden' : 'block'} group-hover:text-indigo-600`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 12H18M12 18V6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <svg
                  className={`w-6 h-6 text-gray-900 transition duration-500 ${openIndex === index ? 'block' : 'hidden'} group-hover:text-indigo-600`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 12H18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
              <div
                id={`collapse-${index}`}
                className={`accordion-content w-full overflow-hidden pr-4 transition-max-height duration-500 ${openIndex === index ? 'max-h-60' : 'max-h-0'}`}
                aria-labelledby={`heading-${index}`}
              >
                <p className="text-base text-gray-900 font-normal leading-6">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
