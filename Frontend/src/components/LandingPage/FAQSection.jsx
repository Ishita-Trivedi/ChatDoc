import { useState } from "react";

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
      answer: "ChatDoc supports text-based PDF and TXT files. Scanned PDFs require OCR before upload.",
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
    <section className="theme-page py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="theme-heading text-center font-manrope text-4xl font-bold leading-[3.25rem]">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="accordion-group">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`theme-card accordion mb-8 rounded-xl border border-solid p-4 transition duration-500 ${openIndex === index ? '!border-indigo-500' : ''}`}
            >
              <button
                className="theme-heading accordion-toggle group inline-flex w-full items-center justify-between text-left text-lg font-normal leading-8 transition duration-500 hover:!text-indigo-500"
                onClick={() => handleToggle(index)}
                aria-controls={`collapse-${index}`}
                aria-expanded={openIndex === index}
              >
                <h5>{faq.question}</h5>
                <svg
                  className={`h-6 w-6 text-gray-900 transition duration-500 dark:text-slate-200 ${openIndex === index ? 'hidden' : 'block'} group-hover:text-indigo-600`}
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
                  className={`h-6 w-6 text-gray-900 transition duration-500 dark:text-slate-200 ${openIndex === index ? 'block' : 'hidden'} group-hover:text-indigo-600`}
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
                <p className="theme-body text-base font-normal leading-6">
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
