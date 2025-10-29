# Knowledge Base MCP Server

An MCP (Model Context Protocol) server that provides a knowledge base interface using Mastra.ai and pgvector for vector similarity search.

## Features

- **Add Knowledge**: Store text content in the knowledge base with automatic chunking and embedding
- **Query Knowledge**: Search for relevant information using semantic similarity
- **List Knowledge**: Get statistics about the knowledge base
- **Delete Knowledge**: Remove specific items from the knowledge base

## Prerequisites

- Node.js v20.0 or higher
- PostgreSQL with pgvector extension installed
- OpenAI API key (for generating embeddings)

## Installation

### For End Users (Using with MCP Clients)

If you want to use this package with Cursor, Claude Desktop, or other MCP clients:

**No installation needed!** Just add the configuration to your MCP settings file (see [Configuration with MCP Clients](#configuration-with-mcp-clients) below).

The package will be automatically downloaded via `npx` when first used.

**Optional**: Install globally for faster startup:
```bash
npm install -g mcp-kb
```

**Prerequisites**:
1. **PostgreSQL with pgvector** installed and running
2. **OpenAI API key** for embeddings
3. **Set up your database**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

Then configure your MCP client with your database credentials (see configuration examples below).

### For Developers (Local Development)

If you want to contribute or modify the code:

1. Clone the repository:
```bash
git clone https://github.com/alejandrojunco/mcp-kb.git
cd mcp-kb
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL with pgvector:
```bash
# Connect to your PostgreSQL database and run:
CREATE EXTENSION IF NOT EXISTS vector;
```

4. Configure environment variables:

Create a `.env` file in the project root:
```env
POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:5432/knowledge_base
OPENAI_API_KEY=your_openai_api_key_here
VECTOR_INDEX_NAME=knowledge_base
VECTOR_DIMENSION=1536
```

5. Build the project:
```bash
npm run build
```

## Publishing to npm

If you want to publish this package to npm and use it from there instead of a local installation:

### Step 1: Prepare for Publishing

1. Ensure you have an npm account. If not, create one at [npmjs.com](https://www.npmjs.com/)

2. Login to npm from your terminal:
```bash
npm login
```

3. Update the `package.json` with your information:
   - Change the package name if `mcp-kb` is already taken (check with `npm search mcp-kb`)
   - Update the repository URLs to point to your GitHub repository
   - Consider updating the version if needed

### Step 2: Build and Test

Before publishing, make sure everything works:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test locally
npm start
```

### Step 3: Publish to npm

```bash
# Publish to npm (this will automatically run the build via prepublishOnly script)
npm publish
```

For scoped packages (e.g., `@yourusername/mcp-kb`):
```bash
npm publish --access public
```

### Step 4: Update Package Version

For future updates:

```bash
# For bug fixes
npm version patch

# For new features
npm version minor

# For breaking changes
npm version major

# Then publish
npm publish
```

## Usage

### Development Mode

Run the server in development mode with hot reload:
```bash
npm run dev
```

### Production Mode

Build and run the server:
```bash
npm run build
npm start
```

### Watch Mode

Run with automatic restart on file changes:
```bash
npm run watch
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

## Configuration with MCP Clients

### Cursor IDE

To use this MCP server in Cursor, you need to configure it in your MCP settings file. You can use either the npm package (recommended) or a local installation.

#### Option A: Using the npm Package (Recommended)

This is the easiest way to use the package. The package will be automatically downloaded and run by npx.

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
- `VECTOR_INDEX_NAME`: Name for your vector index (default: knowledge_base)
- `VECTOR_DIMENSION`: Embedding dimension (default: 1536 for text-embedding-3-small)

**Optional: Using a Specific Version**

To pin to a specific version, specify it in the args:

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "npx",
      "args": ["-y", "mcp-kb@1.0.0"],
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

**Optional: Install Globally**

While npx will automatically download the package, you can also install it globally for faster startup:

```bash
npm install -g mcp-kb
```

Your MCP configuration remains the same - npx will use the globally installed version if available.

**Step 2: Restart Cursor**

Restart Cursor to load the new configuration. The package will be automatically downloaded from npm on first use.

#### Option B: Using a Local Installation

If you're developing or want to use a local copy:

**Step 1: Build the Project**

First, make sure the project is built:

```bash
npm install
npm run build
```

**Step 2: Configure Cursor**

Create or edit the MCP configuration file at `~/.cursor/mcp.json` (or `.cursor/mcp.json` in your home directory):

**Basic Configuration:**
```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-kb/dist/index.js"],
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

**Configuration with Development Mode (using tsx):**
```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "npx",
      "args": [
        "tsx",
        "/absolute/path/to/mcp-kb/src/index.ts"
      ],
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

**Configuration using .env file (Recommended):**

If you prefer to keep your environment variables in a `.env` file in the project directory:

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-kb/dist/index.js"],
      "cwd": "/absolute/path/to/mcp-kb"
    }
  }
}
```

Then create a `.env` file in your project root:
```env
POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:5432/knowledge_base
OPENAI_API_KEY=your_openai_api_key_here
VECTOR_INDEX_NAME=knowledge_base
VECTOR_DIMENSION=1536
```

#### Step 3: Restart Cursor

After configuring the MCP server, restart Cursor to load the new configuration.

#### Step 4: Verify the Setup

Once Cursor is restarted, you can verify the MCP server is working by:

1. Opening the MCP panel in Cursor (usually accessible from the command palette)
2. Looking for the "knowledge-base" server in the list of available MCP servers
3. Trying to use one of the tools (e.g., `list_knowledge`)

#### Example Usage in Cursor

Once configured, you can interact with the knowledge base directly from Cursor's chat:

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

#### Configuration Tips

1. **Use Absolute Paths**: Always use absolute paths in your configuration, not relative paths
2. **Environment Variables**: Store sensitive data like API keys in environment variables
3. **PostgreSQL Setup**: Ensure PostgreSQL is running before starting Cursor
4. **Node Version**: Make sure you're using Node.js v20.0 or higher
5. **Hot Reload**: Use the development mode configuration for hot reloading during development

#### Troubleshooting Cursor Integration

**Server Not Appearing in Cursor:**
- Check that the `mcp.json` file is in the correct location (`~/.cursor/mcp.json`)
- Verify the JSON syntax is valid (use a JSON validator)
- Ensure all paths are absolute and correct
- Restart Cursor completely

**Connection Errors:**
- Verify PostgreSQL is running: `pg_isready`
- Test your connection string independently
- Check that the pgvector extension is installed
- Verify your OpenAI API key is valid

**Tool Execution Errors:**
- Check Cursor's MCP logs (usually in Settings > MCP > View Logs)
- Ensure the server process has necessary permissions
- Verify environment variables are properly set
- Check that the database has been initialized with the pgvector extension

### Claude Desktop

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "node",
      "args": ["/path/to/mcp-kb/dist/index.js"],
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

## Architecture

The server is built with:

- **MCP SDK**: For implementing the Model Context Protocol
- **Mastra.ai**: For RAG (Retrieval-Augmented Generation) capabilities
- **pgvector**: PostgreSQL extension for vector similarity search
- **OpenAI**: For generating text embeddings
- **TypeScript**: For type safety and better developer experience

## Project Structure

```
mcp-kb/
├── src/
│   ├── index.ts          # Main server implementation
│   ├── vector-store.ts   # Vector store initialization and utilities
│   └── tools.ts          # Tool implementations
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

1. **Adding Knowledge**: 
   - Text content is chunked using Mastra's recursive chunking strategy
   - Each chunk is converted to an embedding using OpenAI's text-embedding-3-small model
   - Embeddings and metadata are stored in PostgreSQL with pgvector

2. **Querying Knowledge**:
   - Query text is converted to an embedding
   - Vector similarity search finds the most relevant chunks
   - Results are ranked by cosine similarity score

3. **Metadata Filtering**:
   - Optional filters can be applied to narrow down results
   - Supports complex queries with multiple conditions

## Troubleshooting

### Connection Issues

If you encounter connection issues with PostgreSQL:
- Verify your connection string is correct
- Ensure PostgreSQL is running
- Check that pgvector extension is installed

### Embedding Errors

If you encounter embedding errors:
- Verify your OpenAI API key is valid
- Check your API quota and rate limits
- Ensure the text content is not empty

### Index Creation

If the index fails to create:
- Verify the dimension matches your embedding model (1536 for text-embedding-3-small)
- Check PostgreSQL logs for detailed error messages

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

