# Brain Games Backend

Backend for Brain Games and Rock-Stock integrated application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`

4. Build:
```bash
npm run build
```

5. Start:
```bash
npm start
```

## Development

Run in development mode with ts-node:
```bash
npm run dev
```

The backend will be available at `http://localhost:5001`

## API Routes

- `GET /api/search?q=SYMBOL` - Search for stocks
- `GET /api/quote?symbol=AAPL` - Get stock quote
- `GET /api/historical?symbol=AAPL` - Get historical data
