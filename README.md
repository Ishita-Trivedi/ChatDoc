# ChatDoc

ChatDoc is a full-stack RAG application for asking grounded questions across multiple PDF and text documents. It embeds page-aware chunks, retrieves the most relevant evidence, and returns answers with citations validated against the retrieved sources.

## AI architecture

1. PDF text is extracted page by page and split into overlapping chunks.
2. OpenAI embeddings are generated once during upload and stored in the document index.
3. A question is embedded and compared with chunks from every selected document using cosine similarity.
4. Only the top passages are sent to the chat model.
5. The model returns structured source IDs; the backend validates them before exposing file, page, excerpt, and relevance metadata.

Conversation history helps resolve follow-up questions, but it is never treated as evidence.

## Environment

Create `Backend/.env` with `OPENAI_API_KEY`, optionally `OPENAI_CHAT_MODEL`, `OPENAI_EMBEDDING_MODEL`, and `PORT`. Create `Frontend/.env` with `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_BACKEND_URL`.

When `MONGODB_URI` is configured, documents, page chunks, and embeddings persist in MongoDB and are isolated by the authenticated Clerk user. Without MongoDB, ChatDoc falls back to an in-memory development store.

## Production AI capabilities

- Multi-document RAG with page-level citations
- Hybrid semantic and exact-keyword retrieval with reciprocal-rank fusion
- Persistent, user-scoped document and embedding storage
- Duplicate detection using SHA-256 file checksums
- Streaming retrieval, generation, and verification progress
- Dedicated cited document-comparison workflow
- Retrieval inspector with semantic, keyword, and fused scores
- Prompt-injection-aware system boundaries and structured model output
- API rate limiting, upload validation, and ownership checks
- Per-user latency, success-rate, and citation metrics at `GET /metrics`
- Offline evaluation harness for answer coverage, citation recall, and latency

Run an evaluation dataset with:

```bash
cd Backend
cp evals/dataset.example.json evals/dataset.json
npm run eval
```

Welcome to **ChatDoc**—a cutting-edge tool designed to revolutionize the way you interact with PDF documents. With ChatDoc, you can seamlessly chat with your PDFs, allowing for an intuitive and efficient way to extract information and gain insights from your documents.

## Table of Contents

- [Features](#features)
- [Benefits](#benefits)
- [How to Use](#how-to-use)
- [Installation](#installation)
- [Contribution](#contribution)
- [License](#license)
- [Contact](#contact)

## Features

- **Interactive Chat Interface**: Communicate with your PDFs just like you would in a conversation, making document navigation easier and more engaging.
- **Instant Answers**: Quickly obtain relevant information without the need to scroll through pages, saving you valuable time.
- **User-Friendly Design**: The simple and clean layout ensures a hassle-free experience for users of all technical backgrounds.
- **Supports Multiple PDF Formats**: Compatible with a wide range of PDF types, including reports, eBooks, and academic papers.
- **Contextual Understanding**: Leverages advanced algorithms to understand the context of your queries, providing accurate responses tailored to your needs.

## Benefits

- **Increased Productivity**: Reduce the time spent searching for information, allowing you to focus on what truly matters.
- **Enhanced Learning**: Ideal for students and professionals alike, ChatDoc makes it easier to digest and understand complex material.
- **Accessibility**: With an intuitive interface, ChatDoc is designed to be user-friendly for individuals at any skill level.
- **Collaboration Ready**: Share insights and information easily within teams, fostering better communication and collaboration.

## How to Use

1. **Upload Your PDF**: Start by uploading the PDF document you wish to engage with.
2. **Ask Questions**: Simply type your questions or prompts related to the content of the PDF.
3. **Receive Answers**: Get concise, relevant responses based on the content, enabling you to quickly gather the information you need.

## Installation

To set up ChatDoc on your local machine, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/chatdoc.git

2. **Navigate to the Project Directory:**
 ``` cd chatdoc ```

3. **Install Required Dependencies:**
 ``` npm install ```

4. **Start the application**
 ``` npm start ```
