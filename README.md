# Knowledge Base MCP Server

An MCP (Model Context Protocol) server that provides a knowledge base interface using Mastra.ai and pgvector for vector similarity search. Store and retrieve information using semantic search powered by AI embeddings.

## Features

- **Add Knowledge**: Store text content in the knowledge base with automatic chunking and embedding
- **Query Knowledge**: Search for relevant information using semantic similarity
- **List Knowledge**: Get statistics about the knowledge base
- **Delete Knowledge**: Remove specific items from the knowledge base
- **Privacy-First**: You own and control your data at all times - host your vector store however you see fit

## Privacy & Data Ownership

**Your data, your control.** Unlike cloud-based knowledge base solutions, this MCP server gives you complete ownership and control over your knowledge base:

- 🔒 **Self-Hosted**: All data stays on your infrastructure - whether that's your local machine, private server, or cloud provider of your choice
- 🔑 **Full Control**: You own the database, you control access, and you decide data retention policies
- 🛡️ **Privacy by Design**: No third-party storage of your knowledge base - only the OpenAI API is used for generating embeddings (which are one-way transformations)
- 🏠 **Host Anywhere**: Use PostgreSQL locally with Docker, on your own server, or with any PostgreSQL provider (AWS RDS, Google Cloud SQL, Azure, Supabase, etc.)

This architecture ensures your proprietary code, internal documentation, and sensitive information never leaves your control.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js v20.0 or higher** installed
2. **PostgreSQL with pgvector extension** installed and running
3. **OpenAI API key** (for generating embeddings)

### Setting Up PostgreSQL with pgvector

Connect to your PostgreSQL database and run:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Quick Start

**No installation needed!** This package works with MCP clients like Cursor and Claude Desktop. Just add the configuration to your MCP settings file (see [Configuration](#configuration) below).

The package will be automatically downloaded via `npx` when first used.

### Optional: Global Installation

For faster startup times, you can install globally:
```bash
npm install -g mcp-kb
```

## MCP Tools

The server exposes the following tools:

### 1. add_knowledge

Add new content to the knowledge base. The content will be automatically chunked and embedded.

**Parameters:**
- `content` (required): The text content to add
- `metadata` (optional): Additional metadata (e.g., source, category, author)
- `chunkSize` (optional): Size of text chunks (default: 512)
- `chunkOverlap` (optional): Overlap between chunks (default: 50)

**Example:**
```json
{
  "content": "Machine learning is a subset of artificial intelligence...",
  "metadata": {
    "source": "documentation",
    "category": "AI",
    "author": "John Doe"
  }
}
```

### 2. query_knowledge

Search the knowledge base for relevant information using semantic similarity.

**Parameters:**
- `query` (required): The search query
- `topK` (optional): Number of results to return (default: 5)
- `filter` (optional): Metadata filters
- `minScore` (optional): Minimum similarity score 0-1 (default: 0)

**Example:**
```json
{
  "query": "What is machine learning?",
  "topK": 3,
  "filter": {
    "category": "AI"
  },
  "minScore": 0.7
}
```

### 3. list_knowledge

Get information about the knowledge base.

**Parameters:**
- `limit` (optional): Maximum number of items to return (default: 10)

**Example:**
```json
{
  "limit": 10
}
```

### 4. delete_knowledge

Delete a specific knowledge item by its ID.

**Parameters:**
- `id` (required): The ID of the knowledge item to delete

**Example:**
```json
{
  "id": "abc123"
}
```

## Configuration

### Cursor IDE

**Step 1: Configure Cursor**

Create or edit the MCP configuration file at `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "npx",
      "args": ["-y", "mcp-kb"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:password@localhost:5432/knowledge_base",
        "OPENAI_API_KEY": "your_openai_api_key_here",
        "VECTOR_INDEX_NAME": "knowledge_base",
        "VECTOR_DIMENSION": "1536"
      }
    }
  }
}
```

**Important**: Replace the environment variable values with your actual credentials:
- `POSTGRES_CONNECTION_STRING`: Your PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `VECTOR_INDEX_NAME`: Name for your vector index (default: `knowledge_base`)
- `VECTOR_DIMENSION`: Embedding dimension (default: `1536` for text-embedding-3-small)

**Step 2: Restart Cursor**

Restart Cursor to load the new configuration. The package will be automatically downloaded from npm on first use.

### Claude Desktop

Create or edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "npx",
      "args": ["-y", "mcp-kb"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:password@localhost:5432/knowledge_base",
        "OPENAI_API_KEY": "your_openai_api_key_here",
        "VECTOR_INDEX_NAME": "knowledge_base",
        "VECTOR_DIMENSION": "1536"
      }
    }
  }
}
```

### Using a Specific Version

To pin to a specific version, specify it in the args:

```json
"args": ["-y", "mcp-kb@1.0.0"]
```

## Cursor Rules Integration (Recommended)

To make Cursor automatically check the knowledge base when answering your questions, add this rule to your `.cursorrules` file in your project root or in Cursor's settings:

```
Before answering any question, always check the knowledge base first to see if there's relevant information available. The knowledge base contains:
- Troubleshooting strategies and solutions to common problems
- Design principles and architectural decisions
- Known gotchas and edge cases
- Team knowledge and best practices
- Project-specific documentation

If relevant information is found in the knowledge base, use it to inform your answer. If no relevant information is found, proceed with your normal response.
```

This ensures Cursor leverages your team's accumulated knowledge automatically, making it a powerful tool for onboarding, debugging, and maintaining consistency across your codebase.

## Usage Examples

Once configured, you can interact with the knowledge base directly from your MCP client:

**Adding Knowledge:**
```
Add this to the knowledge base: "TypeScript is a strongly typed programming language that builds on JavaScript."
```

**Querying Knowledge:**
```
Search the knowledge base for information about TypeScript
```

**Listing Knowledge:**
```
Show me what's in the knowledge base
```

**Deleting Knowledge:**
```
Delete the knowledge item with ID abc123
```

### Real-World Use Cases

**Team Onboarding:**
Store your team's coding standards, architecture decisions, and common patterns. New team members (and Cursor) will have instant access to institutional knowledge.

**Troubleshooting:**
Document solutions to tricky bugs and edge cases. When similar issues arise, Cursor can reference past solutions automatically.

**API Documentation:**
Store internal API documentation, usage examples, and gotchas so Cursor can provide accurate, project-specific guidance.

**Design Decisions:**
Record architectural decisions and their rationale. Cursor can help maintain consistency with past decisions.

## How It Works

1. **Adding Knowledge**: Text content is automatically chunked and converted to embeddings using OpenAI's API, then stored in PostgreSQL with pgvector.

2. **Querying Knowledge**: Your search query is converted to an embedding and compared against stored embeddings using vector similarity search to find the most relevant information.

3. **Metadata Filtering**: Apply optional filters to narrow down results based on categories, sources, or other custom metadata.

## Troubleshooting

### Server Not Starting
- Verify PostgreSQL is running: `pg_isready`
- Check that the pgvector extension is installed: `SELECT * FROM pg_extension WHERE extname = 'vector';`
- Ensure Node.js v20.0+ is installed: `node --version`

### Connection Issues
- Verify your `POSTGRES_CONNECTION_STRING` is correct
- Test your database connection independently
- Check PostgreSQL logs for detailed error messages

### Embedding Errors
- Verify your `OPENAI_API_KEY` is valid
- Check your OpenAI API quota and rate limits
- Ensure the text content is not empty

### MCP Client Integration
- Check that the `mcp.json` file is in the correct location (e.g., `~/.cursor/mcp.json`)
- Verify the JSON syntax is valid
- Restart your MCP client completely after making configuration changes
- Check your MCP client's logs for detailed error messages

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

