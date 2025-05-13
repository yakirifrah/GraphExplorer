# GraphExplorer

GraphExplorer is a modern web application for visualizing and exploring graph databases, built with React, TypeScript, and Neo4j. The application provides an intuitive interface for querying and visualizing graph data, making it easier to understand complex relationships in your data.

## Features

- Interactive graph visualization using Neo4j Visualization Library (NVL)
- Real-time graph exploration and querying
- Modern Material-UI based interface
- Type-safe development with TypeScript
- RESTful API backend with Express
- Neo4j database integration
## Future Enhancements
- OpenAI integration for natural language query processing - coming soon
- Movie recommendations dataset integration - coming soon

## Tech Stack

### Frontend
- TypeScript
- Material-UI (MUI)
- Neo4j Visualization Library (NVL)
- Vite for build tooling
- Emotion for styled components

### Backend
- Node.js with Express
- TypeScript
- Neo4j Driver
- OpenAI API integration

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.9.0 or higher)
- Neo4j Database instance (version 4.0 or higher)
- OpenAI API key
- Neo4j Desktop (for local development) or Neo4j Aura (for cloud deployment)

## Dataset Setup

This project uses the Neo4j Movie Recommendations dataset. You have several options to set up the dataset:

### Option 1: Using Neo4j Sandbox (Recommended for Quick Start)
1. Visit [Neo4j Sandbox](https://sandbox.neo4j.com?usecase=recommendations)
2. Sign in or create a Neo4j account
3. Launch the recommendations sandbox
4. Use the provided connection details in your `dev.env` file

### Option 2: Using Neo4j Desktop
1. Download and install [Neo4j Desktop](https://neo4j.com/download/)
2. Create a new project
3. Download the dataset dump file from [Neo4j Graph Examples](https://github.com/neo4j-graph-examples/recommendations)
4. Choose one of the following dump files:
   - `recommendations-embeddings-50.dump` (includes OpenAI embeddings)
   - `recommendations-40.dump` (standard version)
5. Drop the dump file into the `Files` section of your Neo4j Desktop project
6. Choose `Create new DBMS from dump` option
7. Start the database and use the connection details in your `dev.env` file

### Option 3: Using Neo4j Aura
1. Create a Neo4j Aura account at [console.neo4j.io](https://console.neo4j.io)
2. Create a new instance
3. Download the dataset dump file from [Neo4j Graph Examples](https://github.com/neo4j-graph-examples/recommendations)
4. Follow the import instructions at [console.neo4j.io/#import-instructions](https://console.neo4j.io/#import-instructions)
5. Use the provided connection details in your `dev.env` file

The dataset contains:
- 28,863 nodes
- 166,261 relationships
- Movie and user data with ratings
- Optional: OpenAI embeddings for enhanced search capabilities

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd GraphExplorer
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   pnpm install

   # Install frontend dependencies
   cd ../frontend
   pnpm install
   ```

3. Configure environment variables:
   - Copy `backend/dev.env.example` to `backend/dev.env`
   - Update the following variables in `backend/dev.env`:
     ```
     NEO4J_URI=your_neo4j_uri
     NEO4J_USERNAME=your_neo4j_username
     NEO4J_PASSWORD=your_neo4j_password
     NEO4J_DATABASE=your_database_name
     PORT=3001
     OPENAI_API_KEY=your_openai_api_key
     OMDB_API_KEY=your_omdb_api_key
     ```

4. Start the development servers:
   ```bash
   # Start backend server (from backend directory)
   pnpm dev

   # Start frontend server (from frontend directory)
   pnpm dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Project Structure

```
GraphExplorer/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── dev.env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Architecture Overview

### Frontend Architecture
- Component-based architecture using React
- Material-UI for consistent design system
- Neo4j Visualization Library for graph rendering
- Axios for API communication
- TypeScript for type safety

### Backend Architecture
- RESTful API design with Express
- Neo4j driver for database operations
- OpenAI integration for natural language processing
- Environment-based configuration
- TypeScript for type safety

## Design Decisions

1. **Technology Choices**
   - TypeScript: Chosen for type safety and better developer experience
   - pnpm: Selected for efficient package management and disk space usage
   - Vite: Used for fast development and optimized production builds
   - Neo4j NVL: Chosen for its powerful graph visualization capabilities

2. **Architecture**
   - Monorepo structure: Separates frontend and backend while maintaining version control
   - Environment-based configuration: Secure handling of sensitive data
   - RESTful API: Standard approach for backend communication

3. **UI/UX**
   - Material-UI: Provides consistent, accessible, and responsive design
   - Interactive graph visualization: Enables intuitive data exploration
   - Responsive design: Ensures usability across different devices

## Development

### Available Scripts

Backend:
- `pnpm dev`: Start development server
- `pnpm test`: Run tests (when implemented)

Frontend:
- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm lint`: Run ESLint
- `pnpm preview`: Preview production build

### Code Style
- ESLint for frontend code linting
- Biome for backend code formatting
- TypeScript for type checking
