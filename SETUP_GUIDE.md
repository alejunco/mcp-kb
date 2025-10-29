# Setup Guide for End Users

This guide will help you set up the Knowledge Base MCP Server for use with Cursor, Claude Desktop, or other MCP-compatible clients.

## Quick Start (5 minutes)

### Step 1: Set Up PostgreSQL with pgvector

You need a PostgreSQL database with the pgvector extension.

#### Option A: Using Docker (Easiest)

```bash
# Run PostgreSQL with pgvector
docker run -d \
  --name mcp-kb-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=knowledge_base \
  -p 5432:5432 \
  pgvector/pgvector:pg16

# Wait a few seconds for the database to start, then enable the extension
docker exec -it mcp-kb-postgres psql -U postgres -d knowledge_base -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

Your connection string will be:
```
postgresql://postgres:postgres@localhost:5432/knowledge_base
```

#### Option B: Using Existing PostgreSQL

If you already have PostgreSQL installed:

```bash
# Connect to your database
psql -U your_username -d your_database

# Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
```

Your connection string format:
```
postgresql://username:password@host:port/database_name
```

### Step 2: Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and save it securely

### Step 3: Configure Your MCP Client

#### For Cursor IDE

1. Open or create the file: `~/.cursor/mcp.json`

2. Add this configuration (replace with your credentials):

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "npx",
      "args": ["-y", "mcp-kb"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://postgres:postgres@localhost:5432/knowledge_base",
        "OPENAI_API_KEY": "sk-your-openai-api-key-here",
        "VECTOR_INDEX_NAME": "knowledge_base",
        "VECTOR_DIMENSION": "1536"
      }
    }
  }
}
```

3. **Replace these values**:
   - `POSTGRES_CONNECTION_STRING`: Your PostgreSQL connection from Step 1
   - `OPENAI_API_KEY`: Your OpenAI key from Step 2
   - `VECTOR_INDEX_NAME`: Keep as "knowledge_base" or choose your own
   - `VECTOR_DIMENSION`: Keep as "1536" (for OpenAI's text-embedding-3-small)

4. Save the file and restart Cursor

#### For Claude Desktop

1. Open or create: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. Add this configuration:

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "npx",
      "args": ["-y", "mcp-kb"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://postgres:postgres@localhost:5432/knowledge_base",
        "OPENAI_API_KEY": "sk-your-openai-api-key-here",
        "VECTOR_INDEX_NAME": "knowledge_base",
        "VECTOR_DIMENSION": "1536"
      }
    }
  }
}
```

3. Replace the values as mentioned above
4. Restart Claude Desktop

### Step 4: Test It Out

1. Restart your MCP client (Cursor or Claude Desktop)

2. Try adding some knowledge:
```
Add this to the knowledge base: "TypeScript is a strongly typed programming language that builds on JavaScript."
```

3. Query the knowledge base:
```
Search the knowledge base for information about TypeScript
```

4. List what's stored:
```
Show me what's in the knowledge base
```

## Configuration Options

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `POSTGRES_CONNECTION_STRING` | Yes | - | PostgreSQL connection string |
| `OPENAI_API_KEY` | Yes | - | OpenAI API key for embeddings |
| `VECTOR_INDEX_NAME` | No | `knowledge_base` | Name of the vector index |
| `VECTOR_DIMENSION` | No | `1536` | Embedding dimension size |

### PostgreSQL Connection String Format

```
postgresql://[user[:password]@][host][:port][/dbname]
```

Examples:
- Local: `postgresql://postgres:postgres@localhost:5432/knowledge_base`
- Remote: `postgresql://user:pass@db.example.com:5432/mydb`
- With SSL: `postgresql://user:pass@host:5432/db?sslmode=require`

## Troubleshooting

### "Cannot connect to PostgreSQL"

**Check if PostgreSQL is running:**
```bash
# For Docker
docker ps | grep postgres

# For system PostgreSQL
pg_isready
```

**Verify connection string:**
```bash
psql "postgresql://postgres:postgres@localhost:5432/knowledge_base"
```

### "pgvector extension not found"

**Install the extension:**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

**Check if it's installed:**
```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### "OpenAI API error"

**Check your API key:**
- Make sure it starts with `sk-`
- Verify it's not expired
- Check you have credits available

**Test the API key:**
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### "MCP server not appearing in Cursor"

1. Check the file location: `~/.cursor/mcp.json`
2. Validate JSON syntax (use [jsonlint.com](https://jsonlint.com/))
3. Ensure all paths are absolute
4. Restart Cursor completely (not just reload window)

### "Package download fails"

**Check npm connectivity:**
```bash
npm config get registry
# Should show: https://registry.npmjs.org/
```

**Clear npx cache:**
```bash
npx clear-npx-cache
```

**Try installing globally:**
```bash
npm install -g mcp-kb
```

## Advanced Configuration

### Using a Specific Version

Pin to a specific version to avoid automatic updates:

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "npx",
      "args": ["-y", "mcp-kb@1.0.0"],
      "env": { ... }
    }
  }
}
```

### Global Installation

For faster startup (no download on first use):

```bash
npm install -g mcp-kb
```

Your MCP config stays the same - npx will use the global version.

### Multiple Knowledge Bases

You can configure multiple instances with different databases:

```json
{
  "mcpServers": {
    "kb-work": {
      "command": "npx",
      "args": ["-y", "mcp-kb"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://localhost:5432/work_kb",
        "OPENAI_API_KEY": "your-key",
        "VECTOR_INDEX_NAME": "work_kb"
      }
    },
    "kb-personal": {
      "command": "npx",
      "args": ["-y", "mcp-kb"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://localhost:5432/personal_kb",
        "OPENAI_API_KEY": "your-key",
        "VECTOR_INDEX_NAME": "personal_kb"
      }
    }
  }
}
```

## Security Best Practices

### 1. Protect Your API Keys

- Never commit API keys to git
- Use environment variables or secure vaults
- Rotate keys periodically

### 2. Secure Your Database

- Use strong passwords
- Enable SSL for remote connections
- Restrict network access
- Regular backups

### 3. Use Separate Databases

- Don't use production databases for testing
- Create dedicated user accounts with limited permissions

### Example: Creating a Restricted User

```sql
-- Create a dedicated user
CREATE USER mcp_kb_user WITH PASSWORD 'strong_password';

-- Create a dedicated database
CREATE DATABASE knowledge_base OWNER mcp_kb_user;

-- Connect to the new database
\c knowledge_base

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE knowledge_base TO mcp_kb_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mcp_kb_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mcp_kb_user;
```

## Next Steps

Once you're up and running:

1. **Add domain-specific knowledge** to build your knowledge base
2. **Query effectively** using natural language
3. **Organize with metadata** for better filtering
4. **Monitor your OpenAI usage** to manage costs

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/alejandrojunco/mcp-kb/issues)
- **Discussions**: [GitHub Discussions](https://github.com/alejandrojunco/mcp-kb/discussions)
- **Documentation**: [Full README](./README.md)

## Cost Considerations

### OpenAI Embedding Costs

Using `text-embedding-3-small`:
- ~$0.02 per 1M tokens
- Average document (500 words) ≈ 650 tokens
- 1000 documents ≈ $0.013

### PostgreSQL Costs

- Self-hosted: Free (hardware costs only)
- Managed (AWS RDS, etc.): Variable based on instance size

**Tip**: Start with a small database and scale as needed.

