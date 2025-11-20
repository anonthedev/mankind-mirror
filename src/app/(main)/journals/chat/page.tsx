import { JournalChat } from "@/components/journal-chat";

export default function ChatPage() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Chat with Your Journals</h1>
        <div className="bg-white rounded-lg shadow h-[600px]">
          <JournalChat />
        </div>
      </div>
    </div>
  );
}
