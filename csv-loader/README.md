# CSV Loader

A production-ready Node.js project using Express to process large CSV files and load them into PostgreSQL.

## Features
- Express.js server
- Processes large CSV files efficiently
- Loads data into PostgreSQL
- Uses dotenv for environment variables
- Docker and docker-compose support

## Project Structure
```
project
│
├ src
│ ├ config
│ ├ controllers
│ ├ services
│ ├ repositories
│ ├ processors
│ ├ strategies
│ ├ utils
│ ├ db
│ ├ app.js
│ └ server.js
│
├ data/
│ └ users.csv
│
├ Dockerfile
├ docker-compose.yml
├ init.sql
├ package.json
└ .env
```

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy and edit `.env` as needed.
3. Start with Docker Compose:
   ```sh
   docker-compose up --build
   ```

### Development
- Start server locally:
  ```sh
  npm run dev
  ```

## License
MIT
