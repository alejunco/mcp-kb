# Quick Start Guide

## 1. Start PostgreSQL with pgvector

```bash
docker-compose up -d
```

This will:
- Pull the pgvector Docker image (if needed)
- Start PostgreSQL on port 5432 (not conflicting with your existing PostgreSQL)
- Automatically install the pgvector extension
- Create the `knowledge_base` database

## 2. Verify PostgreSQL is running

```bash
docker-compose ps
```

You should see the `mcp-kb-postgres` container running.

## 3. Test the MCP server

```bash
npm run dev
```

Or build and run:
```bash
npm run build
npm start
```

## 4. Restart Cursor

After the server is running:
1. Close and reopen Cursor
2. Check the MCP section in Cursor settings
3. You should see 4 tools available from `knowledge-base`

## Useful Commands

```bash
# View PostgreSQL logs
docker-compose logs -f postgres

# Stop PostgreSQL
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v

# Connect to PostgreSQL directly
psql postgresql://postgres:postgres@localhost:5432/knowledge_base
```

## Database Credentials

- Host: localhost
- Port: 5432
- Database: knowledge_base
- User: postgres
- Password: postgres

