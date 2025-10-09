import { z } from 'zod';
import { PgVector } from '@mastra/pg';
import { MDocument } from '@mastra/rag';
import { generateEmbedding, generateEmbeddings } from './vector-store.js';

/**
 * Tool schemas
 */
export const addKnowledgeSchema = z.object({
  content: z.string().describe('The text content to add to the knowledge base'),
  metadata: z.record(z.any()).optional().describe('Optional metadata to associate with the content'),
  chunkSize: z.number().optional().default(512).describe('Size of text chunks (default: 512)'),
  chunkOverlap: z.number().optional().default(50).describe('Overlap between chunks (default: 50)'),
});

export const queryKnowledgeSchema = z.object({
  query: z.string().describe('The search query to find relevant knowledge'),
  topK: z.number().optional().default(5).describe('Number of results to return (default: 5)'),
  filter: z.record(z.any()).optional().describe('Optional metadata filters'),
  minScore: z.number().optional().default(0).describe('Minimum similarity score (0-1)'),
});

export const listKnowledgeSchema = z.object({
  limit: z.number().optional().default(10).describe('Maximum number of items to return'),
});

export const deleteKnowledgeSchema = z.object({
  id: z.string().describe('The ID of the knowledge item to delete'),
});

/**
 * Tool implementations
 */
export async function addKnowledge(
  store: PgVector,
  indexName: string,
  params: z.infer<typeof addKnowledgeSchema>
) {
  const { content, metadata = {}, chunkSize, chunkOverlap } = params;

  try {
    // Create document and chunk it
    const doc = MDocument.fromText(content);
    const chunks = await doc.chunk({
      strategy: 'recursive',
      maxSize: chunkSize,
      overlap: chunkOverlap,
      separators: ['\n\n', '\n', '. ', ' '],
    });

    // Generate embeddings for all chunks
    const chunkTexts = chunks.map(chunk => chunk.text);
    const embeddings = await generateEmbeddings(chunkTexts);

    // Prepare metadata for each chunk
    const chunkMetadata = chunks.map((chunk, index) => ({
      text: chunk.text,
      chunkIndex: index,
      totalChunks: chunks.length,
      ...metadata,
      addedAt: new Date().toISOString(),
    }));

    // Store in vector database
    await store.upsert({
      indexName,
      vectors: embeddings,
      metadata: chunkMetadata,
    });

    return {
      success: true,
      message: `Successfully added ${chunks.length} chunks to the knowledge base`,
      chunksAdded: chunks.length,
    };
  } catch (error) {
    console.error('Error adding knowledge:', error);
    throw new Error(`Failed to add knowledge: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function queryKnowledge(
  store: PgVector,
  indexName: string,
  params: z.infer<typeof queryKnowledgeSchema>
) {
  const { query, topK, filter, minScore } = params;

  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Query the vector store
    const results = await store.query({
      indexName,
      queryVector: queryEmbedding,
      topK,
      filter,
      minScore,
      includeVector: false,
    });

    return {
      success: true,
      query,
      results: results.map(result => ({
        text: result.metadata?.text,
        score: result.score,
        metadata: result.metadata,
        id: result.id,
      })),
      count: results.length,
    };
  } catch (error) {
    console.error('Error querying knowledge:', error);
    throw new Error(`Failed to query knowledge: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function listKnowledge(
  store: PgVector,
  indexName: string,
  params: z.infer<typeof listKnowledgeSchema>
) {
  try {
    const stats = await store.describeIndex({ indexName });
    
    return {
      success: true,
      indexName,
      totalItems: stats.count,
      dimension: stats.dimension,
      metric: stats.metric,
    };
  } catch (error) {
    console.error('Error listing knowledge:', error);
    throw new Error(`Failed to list knowledge: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteKnowledge(
  store: PgVector,
  indexName: string,
  params: z.infer<typeof deleteKnowledgeSchema>
) {
  const { id } = params;

  try {
    await store.deleteVector({
      indexName,
      id,
    });

    return {
      success: true,
      message: `Successfully deleted knowledge item with ID: ${id}`,
      id,
    };
  } catch (error) {
    console.error('Error deleting knowledge:', error);
    throw new Error(`Failed to delete knowledge: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
