#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
import { createVectorStore, initializeIndex } from "./vector-store.js";
import {
  addKnowledge,
  queryKnowledge,
  listKnowledge,
  deleteKnowledge,
  addKnowledgeSchema,
  queryKnowledgeSchema,
  listKnowledgeSchema,
  deleteKnowledgeSchema,
} from "./tools.js";

// Load environment variables
dotenv.config();

const VECTOR_INDEX_NAME = process.env.VECTOR_INDEX_NAME || "knowledge_base";
const VECTOR_DIMENSION = parseInt(process.env.VECTOR_DIMENSION || "1536", 10);

/**
 * Main server class
 */
class KnowledgeBaseServer {
  private server: Server;
  private vectorStore: ReturnType<typeof createVectorStore>;

  constructor() {
    this.server = new Server(
      {
        name: "knowledge-base-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize vector store
    this.vectorStore = createVectorStore();

    // Set up request handlers
    this.setupHandlers();

    // Handle errors
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.vectorStore.disconnect();
      process.exit(0);
    });
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "add_knowledge",
          description:
            "Add new content to the knowledge base. The content will be chunked and embedded automatically.",
          inputSchema: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description: "The text content to add to the knowledge base",
              },
              metadata: {
                type: "object",
                description:
                  "Optional metadata to associate with the content (e.g., source, category, author)",
                additionalProperties: true,
              },
              chunkSize: {
                type: "number",
                description: "Size of text chunks (default: 512)",
                default: 512,
              },
              chunkOverlap: {
                type: "number",
                description: "Overlap between chunks (default: 50)",
                default: 50,
              },
            },
            required: ["content"],
          },
        },
        {
          name: "query_knowledge",
          description:
            "Search the knowledge base for relevant information using semantic similarity.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query to find relevant knowledge",
              },
              topK: {
                type: "number",
                description: "Number of results to return (default: 5)",
                default: 5,
              },
              filter: {
                type: "object",
                description:
                  'Optional metadata filters (e.g., {"category": "documentation"})',
                additionalProperties: true,
              },
              minScore: {
                type: "number",
                description: "Minimum similarity score (0-1, default: 0)",
                default: 0,
              },
            },
            required: ["query"],
          },
        },
        {
          name: "list_knowledge",
          description:
            "Get information about the knowledge base (total items, dimension, etc.).",
          inputSchema: {
            type: "object",
            properties: {
              limit: {
                type: "number",
                description: "Maximum number of items to return (default: 10)",
                default: 10,
              },
            },
          },
        },
        {
          name: "delete_knowledge",
          description: "Delete a specific knowledge item by its ID.",
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "The ID of the knowledge item to delete",
              },
            },
            required: ["id"],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "add_knowledge": {
            const params = addKnowledgeSchema.parse(args);
            const result = await addKnowledge(
              this.vectorStore,
              VECTOR_INDEX_NAME,
              params
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "query_knowledge": {
            const params = queryKnowledgeSchema.parse(args);
            const result = await queryKnowledge(
              this.vectorStore,
              VECTOR_INDEX_NAME,
              params
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "list_knowledge": {
            const params = listKnowledgeSchema.parse(args || {});
            const result = await listKnowledge(
              this.vectorStore,
              VECTOR_INDEX_NAME,
              params
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "delete_knowledge": {
            const params = deleteKnowledgeSchema.parse(args);
            const result = await deleteKnowledge(
              this.vectorStore,
              VECTOR_INDEX_NAME,
              params
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error",
              }),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    // Initialize the vector index
    await initializeIndex(
      this.vectorStore,
      VECTOR_INDEX_NAME,
      VECTOR_DIMENSION
    );

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }

    // Start the server
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Knowledge Base MCP Server running on stdio");
  }
}

// Start the server
const server = new KnowledgeBaseServer();
server.run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
