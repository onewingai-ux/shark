# Shark Board Game (Multiplayer)

A full-stack, real-time multiplayer implementation of the classic board game *Shark*.

## Tech Stack
- **Frontend**: React (Vite), Zustand, Tailwind CSS, Socket.io-client
- **Backend**: Node.js, Express, Socket.io, Knex.js, PostgreSQL
- **Deployment**: Configured for Railway (`railway.toml`)

## Features
- Real-time multiplayer synchronization via WebSockets
- Fully automated Game Logic Engine enforcing rules, building chains, stock pricing, takeovers, dividends, and losses
- Basic AI opponent implementation ("out-of-the-box")
- Leaderboards
- JWT Authentication

## Local Setup

### Database
1. Ensure PostgreSQL is running locally on port 5432.
2. Create a database named `shark_game`.
3. Set your environment variables in `.env` (or let the default fallback handle it for local development).

### Running Locally
Run the following from the root directory:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# To run the backend (which runs migrations and starts the server on port 3001)
cd backend && npm run start &

# In a separate terminal, to run the frontend
cd frontend && npm run dev &
```

## Deployment
This repository is configured to deploy automatically on Railway via Nixpacks using the included `railway.toml` configuration.
