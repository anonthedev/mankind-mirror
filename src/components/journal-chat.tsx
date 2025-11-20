"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

interface Message {
  id: string;
  type: "question" | "answer";
  content: string;
  sources?: Array<{
    journalId: string;
    similarity: number;
    excerpt: string;
  }>;
}

export function JournalChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "question",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/journal-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "answer",
        content: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "answer",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background border border-accent rounded-md flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Ask me anything about your journals...</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === "question" ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`max-w-xs lg:max-w-md p-3 ${
                msg.type === "question"
                  ? "bg-primary text-primary-foreground rounded-lg"
                  : "bg-muted text-foreground rounded-lg"
              }`}
            >
              <p className="text-md font-semibold">{msg.content}</p>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  <p className="text-xs font-semibold">Sources:</p>
                  {msg.sources.map((source, idx) => (
                    <div key={idx} className="text-xs bg-accent p-2 rounded">
                      <p className="font-semibold">Match {idx + 1}</p>
                      <div 
                        className="italic text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: source.excerpt }}
                      />
                      <p className="text-muted-foreground">
                        Similarity: {(source.similarity * 100).toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your journals..."
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            disabled={loading}
          />
          <Button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
