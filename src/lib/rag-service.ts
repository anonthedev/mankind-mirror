// lib/rag-service.ts
import { createClient } from "@/utils/supabase/server";
import { openai } from "@ai-sdk/openai";
import { embed, generateText } from "ai";

export async function embedJournalEntry(
  journalId: string,
  userId: string,
  content: string
) {
  const supabase = await createClient();

  try {
    console.log("🔄 Starting embedding generation for journal:", journalId);

    // Generate embedding
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: content,
    });

    console.log("✅ Embedding generated successfully");

    // Store embedding in database
    const { error, data } = await supabase.from("journal_embeddings").insert({
      journal_id: journalId,
      user_id: userId,
      content,
      embedding,
    });

    if (error) {
      console.error("❌ Error storing embedding:", error);
      throw error;
    }

    console.log("✅ Embedding stored successfully in database");
    return data;
  } catch (error) {
    console.error("❌ Error in embedJournalEntry:", error);
    throw error;
  }
}

export async function retrieveRelevantJournals(
  userId: string,
  query: string,
  limit: number = 5
) {
  const supabase = await createClient();

  try {
    console.log("🔍 Searching journals for query:", query);

    // Generate embedding for query
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: query,
    });

    console.log("✅ Query embedding generated");

    // Call RPC function for similarity search
    const { data, error } = await supabase.rpc("match_journal_embeddings", {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: limit,
      user_id_param: userId,
    });

    if (error) {
      console.error("❌ Error retrieving embeddings:", error);
      throw error;
    }

    console.log(`✅ Found ${data?.length || 0} matching journals`);
    return data || [];
  } catch (error) {
    console.error("❌ Error in retrieveRelevantJournals:", error);
    throw error;
  }
}

export async function answerFromJournals(userId: string, question: string) {
  try {
    // Retrieve relevant journal entries
    const relevantEntries = await retrieveRelevantJournals(userId, question);

    if (!relevantEntries || relevantEntries.length === 0) {
      return {
        answer:
          "I couldn't find relevant information in your journals to answer this question.",
        sources: [],
      };
    }

    // Create context from retrieved entries
    const context = relevantEntries
      .map((entry: any) => entry.content)
      .join("\n\n---\n\n");

    // Generate answer using Claude
    const { text } = await generateText({
      model: openai("gpt-4-turbo"),
      system: `You are a helpful assistant that answers questions based on the user's journal entries. 
Use the provided journal content to answer questions accurately and thoughtfully. 
If the information isn't in the journals, say you don't have that information. 
Be conversational, friendly, and insightful.`,
      prompt: `Journal entries for context:
${context}

User Question: ${question}`,
    });

    return {
      answer: text,
      sources: relevantEntries.map((entry: any) => ({
        journalId: entry.journal_id,
        similarity: entry.similarity,
        excerpt: entry.content.substring(0, 150) + "...",
      })),
    };
  } catch (error) {
    console.error("Error in answerFromJournals:", error);
    throw error;
  }
}
