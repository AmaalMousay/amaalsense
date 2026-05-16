# AmalSense: Advanced Cognitive Analysis Platform

## Overview
AmalSense is an innovative platform designed to provide real-time emotional and cognitive analysis of global events. It aims to mimic human cognitive processes to understand, interpret, and predict the impact of news and social media narratives. By leveraging a sophisticated multi-agent system and a unique 24-layer cognitive architecture, AmalSense transforms raw data into actionable insights, offering a deeper understanding of public sentiment and potential future developments.

## Vision
Our vision is to empower users with an unparalleled understanding of the global emotional landscape. AmalSense moves beyond traditional sentiment analysis by incorporating contextual understanding, historical data, and a multi-faceted cognitive model to deliver more accurate and nuanced insights into how events shape collective human emotions and behaviors.

## Key Features
*   **Real-time Data Ingestion:** Gathers news and social media data from diverse sources.
*   **24-Layer Cognitive Architecture:** Processes information through a sophisticated model inspired by human cognition, enabling deep contextual and emotional understanding.
*   **Multi-Agent System:** Utilizes specialized AI agents for various tasks, from data collection to complex analysis and insight generation.
*   **Advanced Emotional & Cognitive Analysis:** Identifies subtle emotional nuances, causal relationships, and predicts potential impacts of events.
*   **Interactive Dashboards:** Provides intuitive visualizations of global sentiment, regional heatmaps, and trend analysis.
*   **Customizable Alerts:** Notifies users of significant shifts in sentiment or emerging events based on predefined criteria.
*   **Explainable AI (XAI):** Offers transparency into how insights are generated, fostering trust and understanding.

## Architecture
AmalSense follows a robust Client-Server architecture, designed for scalability, maintainability, and high performance. The server-side is built with Node.js and TypeScript, while the client-side utilizes React and TypeScript.

### Server-Side Structure
The server has been meticulously refactored into a clean and modular structure to enhance clarity and facilitate future development:

*   `_core/`: Contains fundamental services and configurations, such as database connections (`db.ts`), API keys (`apiKeys.ts`), and health monitoring (`apiHealthMonitor.ts`).
*   `engines/`: Houses the core analytical and processing units, including the 24 cognitive layers, sentiment analysis (`aiSentimentAnalyzer.ts`), prediction models (`predictionEngine.ts`), and unified analysis orchestrators (`unifiedAnalysisEngine.ts`).
*   `services/`: Provides external integrations and data fetching capabilities, such as news aggregation (`gnewsService.ts`), social media data (`twitterService.ts`), and user profile management (`userProfileService.ts`).
*   `routers/`: Defines the API endpoints and handles incoming requests, directing them to the appropriate engines and services. Examples include `predictionRouter.ts` and `agentRouter.ts`.
*   `utils/`: Contains shared utility functions, helper modules, and common logic used across various parts of the server, such as validation (`validation.ts`) and caching (`cacheManager.ts`).
*   `agents/`: Manages the multi-agent system, defining agent behaviors and interactions.
*   `cognitiveArchitecture/`: Contains the implementation details of the 24 cognitive layers, organized for modularity.
*   `dcft/`: Dedicated module for the DCFT (Dynamic Cognitive Flow Transformation) framework, including its core engine.

### Client-Side Structure
The client-side is a React application structured for maintainability and user experience:

*   `src/components/`: Reusable UI components (e.g., `WorldMap.tsx`, `DCFTVisualization.tsx`).
*   `src/pages/`: Top-level components representing different views or routes in the application (e.g., `Home.tsx`, `Admin.tsx`).
*   `src/hooks/`: Custom React hooks for encapsulating reusable logic (e.g., `useAnalysisData.ts`).
*   `src/utils/`: Client-side utility functions and helper modules.
*   `src/assets/`: Static assets like images, icons, and fonts.

## Technology Stack
*   **Backend:** Node.js, TypeScript, Express.js, Drizzle ORM, PostgreSQL (or compatible)
*   **Frontend:** React, TypeScript, Tailwind CSS, Chart.js
*   **Database:** PostgreSQL (or compatible)
*   **AI/ML:** Custom LLM integrations (e.g., Groq), Vector Embeddings, Proprietary Cognitive Models
*   **Deployment:** Docker, GitHub Actions (for CI/CD)

## Getting Started
To get a local copy up and running, follow these simple steps.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   Docker (optional, for database setup)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AmaalMousay/amaalsense.git
    cd amaalsense
    ```
2.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```
3.  **Install client dependencies:**
    ```bash
    cd client
    npm install --legacy-peer-deps
    cd ..
    ```
4.  **Set up environment variables:**
    Create a `.env` file in the `server/` directory based on `server/.env.example` and fill in your database credentials, API keys, etc.

### Running the Application
1.  **Start the server:**
    ```bash
    cd server
    npm run dev
    ```
2.  **Start the client:**
    ```bash
    cd client
    npm run dev
    ```
    The client application will typically run on `http://localhost:5173`.

## Contributing
We welcome contributions to AmalSense! Please read our `CONTRIBUTING.md` (to be created) for details on our code of conduct, and the process for submitting pull requests to us.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Amaal Rodwan – Founder & Visionary Architect
Website: [amaalsense.com](https://amaalsense.com)
Email: [amaalmousay@gmail.com](mailto:amaalmousay@gmail.com)

Project Link: [https://github.com/AmaalMousay/amaalsense](https://github.com/AmaalMousay/amaalsense)

---
*This README.md was generated and updated by Manus AI during an optimization and refactoring session.*
