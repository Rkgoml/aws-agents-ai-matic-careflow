# AI Matic CareFlow

A **next-generation AI agent** designed to revolutionize healthcare workflows by dynamically constructing and executing **agentic workflows** based on user input.

---

### **Project Overview**
The **Dynamic Agent Spinner** is an AI-powered system that interprets user descriptions, fetches relevant medical data, and autonomously builds and runs **intelligent, multi-agent workflows**. By integrating with multiple healthcare tools and APIs, it automates complex tasks, reduces manual intervention, and enhances decision-making efficiency.

---

### **Key Capabilities**
- **Agentic Workflow Generation** – Dynamically constructs **multi-agent workflows** tailored to user needs, enabling autonomous decision-making and task delegation.
- **Multi-Tool Integration** – Seamlessly connects with medical data sources, APIs, and external tools for real-time data processing.
- **Automated Execution** – Runs workflows intelligently, ensuring faster, more accurate, and context-aware results.

---
## Getting Started

### Prerequisites
- Git
- Node.js (v22)
- Python (3.11 or higher)
- [Astral uv](https://docs.astral.sh/uv/) (a fast Python package and project manager, written in Rust)
- AWS Bedrock 

## Tech Stack

### Backend
- FastAPI  
- Uvicorn  
- SQLite  
- AWS EC2  
- AWS Bedrock  

### AI Agent SDK
- StrandsAgents  

### Frontend
- React  
- Vite  
- npm  
---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Rkgoml/aws-agents-ai-matic-careflow.git
cd aws-agents-ai-matic-careflow
```

---

## 2. Environment Variables (Optional)

**Backend (`backend/.env`):**

```
AWS_ACCESS_KEY_ID= 
AWS_SECRET_ACCESS_KEY= 
```

**UI (`ui/.env`):**

```
VITE_PUBLIC_API_URL=
```

---


### 3. Set Up the Backend
```bash
cd backend
uv sync      # Install dependencies
uv run main.py
```

This will install dependencies and start the backend server at **[http://localhost:8000](http://localhost:8000)**.
You can access API docs at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

### 4. Set Up the UI
```bash
cd ui
npm install
npm run dev
```
This will start the UI development server at **[http://localhost:3000](http://localhost:3000)** and connect to the backend automatically.

---



