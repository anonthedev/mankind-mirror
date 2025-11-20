import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ModerationResult {
  flagged: boolean;
  categories: {
    hate: boolean;
    "hate/threatening": boolean;
    harassment: boolean;
    "harassment/threatening": boolean;
    "self-harm": boolean;
    "self-harm/intent": boolean;
    "self-harm/instructions": boolean;
    sexual: boolean;
    "sexual/minors": boolean;
    violence: boolean;
    "violence/graphic": boolean;
  };
  categoryScores: {
    hate: number;
    "hate/threatening": number;
    harassment: number;
    "harassment/threatening": number;
    "self-harm": number;
    "self-harm/intent": number;
    "self-harm/instructions": number;
    sexual: number;
    "sexual/minors": number;
    violence: number;
    "violence/graphic": number;
  };
  message?: string;
}

/**
 * Moderates content using OpenAI's Moderation API
 * @param content - The text content to moderate
 * @returns ModerationResult with flagged status and categories
 */
export async function moderateContent(
  content: string
): Promise<ModerationResult> {
  try {
    const moderation = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: content,
    });

    const result = moderation.results[0];

    // Check if any harmful categories are flagged
    const flagged = result.flagged;

    // Build a user-friendly message if content is flagged
    let message = "";
    if (flagged) {
      const flaggedCategories: string[] = [];
      
      if (result.categories.hate || result.categories["hate/threatening"]) {
        flaggedCategories.push("hateful content");
      }
      if (result.categories.harassment || result.categories["harassment/threatening"]) {
        flaggedCategories.push("harassment");
      }
      if (result.categories["self-harm"] || result.categories["self-harm/intent"] || result.categories["self-harm/instructions"]) {
        flaggedCategories.push("self-harm content");
      }
      if (result.categories.sexual || result.categories["sexual/minors"]) {
        flaggedCategories.push("sexual content");
      }
      if (result.categories.violence || result.categories["violence/graphic"]) {
        flaggedCategories.push("violent content");
      }

      if (flaggedCategories.length > 0) {
        message = `Your content was flagged for: ${flaggedCategories.join(", ")}. Please revise your message to be more supportive and respectful.`;
      } else {
        message = "Your content was flagged as potentially harmful. Please revise your message to be more supportive and respectful.";
      }
    }

    return {
      flagged,
      categories: result.categories,
      categoryScores: result.category_scores,
      message,
    };
  } catch (error) {
    console.error("Error moderating content:", error);
    
    // If moderation fails, we'll be conservative and allow the content
    // but log the error for monitoring
    console.error("Moderation API failed, allowing content by default");
    
    return {
      flagged: false,
      categories: {
        hate: false,
        "hate/threatening": false,
        harassment: false,
        "harassment/threatening": false,
        "self-harm": false,
        "self-harm/intent": false,
        "self-harm/instructions": false,
        sexual: false,
        "sexual/minors": false,
        violence: false,
        "violence/graphic": false,
      },
      categoryScores: {
        hate: 0,
        "hate/threatening": 0,
        harassment: 0,
        "harassment/threatening": 0,
        "self-harm": 0,
        "self-harm/intent": 0,
        "self-harm/instructions": 0,
        sexual: 0,
        "sexual/minors": 0,
        violence: 0,
        "violence/graphic": 0,
      },
      message: "Moderation check was skipped due to a technical issue.",
    };
  }
}

/**
 * Checks if content is safe to post
 * @param content - The text content to check
 * @returns Object with isSafe boolean and optional error message
 */
export async function isContentSafe(
  content: string
): Promise<{ isSafe: boolean; message?: string }> {
  const result = await moderateContent(content);
  
  return {
    isSafe: !result.flagged,
    message: result.message,
  };
}

