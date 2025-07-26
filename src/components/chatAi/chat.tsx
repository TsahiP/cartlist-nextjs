"use client";

import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ChatProps {
  listId: string;
  isInDialog?: boolean;
}

export default function Page({ listId, isInDialog = false }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit, status, stop } = useChat({
    maxSteps: 5,
    api: `/api/chat/${listId}`,
    streamProtocol: "data", // ensure structured stream parts reach the client
  });

  const router = useRouter();


  useEffect(() => {
    if (messages.length === 0) return;

    const last = messages[messages.length - 1] as any;

    // AI-SDK embeds tool results inside assistant messages as `toolInvocations`
    const invocations: any[] | undefined = last.toolInvocations;
    if (!invocations || invocations.length === 0) return;

    const mutatingTools = [
      "add_item_to_list",
      "add_many_items_to_list",
      "delete_item_from_list",
    ];

    const hasMutation = invocations.some(
      (inv) =>
        inv.state === "result" && mutatingTools.includes(inv.toolName)
    );

    if (hasMutation) {
      router.refresh();
    }
  }, [messages, router]);

  return (
    <div className={`flex flex-col bg-gray-50 ${isInDialog ? 'h-full' : 'h-screen'}`} dir="rtl">
      {/* Header - only show if not in dialog */}
      {!isInDialog && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            עוזר צ&apos;אט AI עגלת קניות
          </h1>
          <p className="text-sm text-gray-500">מופעל על ידי Google Gemini</p>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">
              התחל שיחה עם עוזר הבינה המלאכותית
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {message.role === "user" ? "אתה" : "עוזר AI"}
              </div>
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {(status === "submitted" || status === "streaming") && (
          <div className="flex justify-end">
            <div className="bg-white border border-gray-200 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="text-sm font-medium mb-1">עוזר AI</div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="flex space-x-1 space-x-reverse">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">חושב...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSubmit} className="flex space-x-4 space-x-reverse">
          <div className="flex-1 relative flex items-center">
            <input
              name="prompt"
              value={input}
              onChange={handleInputChange}
              disabled={status !== "ready"}
              placeholder="הקלד את ההודעה שלך..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-right"
            />
          </div>
          <div className="flex space-x-2 space-x-reverse">
            {(status === "submitted" || status === "streaming") && (
              <button
                type="button"
                onClick={() => stop()}
                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                עצור
              </button>
            )}
            <button
              type="submit"
              disabled={status !== "ready" || !input.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              שלח
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
