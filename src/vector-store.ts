import { PgVector } from '@mastra/pg';
import { openai } from '@ai-sdk/openai';
import { embed, embedMany } from 'ai';

/**
 * Initialize the pgvector store
 */
export function createVectorStore() {
  const connectionString = process.env.POSTGRES_CONNECTION_STRING;
  
  if (!connectionString) {
    throw new Error('POSTGRES_CONNECTION_STRING environment variable is required');
  }

  return new PgVector({
    connectionString,
  });
}

/**
 * Initialize the vector index if it doesn't exist
 */
export async function initializeIndex(
  store: PgVector,
  indexName: string,
  dimension: number = 1536
) {
  try {
    // Try to describe the index to see if it exists
    await store.describeIndex({ indexName });
    console.log(`Index "${indexName}" already exists`);
  } catch (error) {
    // Index doesn't exist, create it
    console.log(`Creating index "${indexName}"...`);
    await store.createIndex({
      indexName,
      dimension,
      metric: 'cosine',
    });
    console.log(`Index "${indexName}" created successfully`);
  }
}

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  });
  
  return embedding;
}

/**
 * Generate embeddings for multiple texts
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: texts,
  });
  
  return embeddings;
}
