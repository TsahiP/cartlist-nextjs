"use client";
import { Switch } from "@/components/ui/switch";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

export function ChatWithAI({ cart }: { cart: string[] }) {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(true);

  
  const askAI = async () => {
    setLoading(true);
    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: checked ? cart : [], prompt: question }),
    });

    const data = await res.json();
    setAnswer(data.answer);
    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col p-4 border rounded-xl shadow gap-4">
      <h2 className="text-lg font-semibold mb-2">איך אני יכול לסייע לך?</h2>
      <div className="mt-4 p-2 border rounded bg-gray-50 whitespace-pre-wrap">
        <strong>אני:</strong> {question}
      </div>
      {answer && (
        <div className="mt-4 p-2 border rounded bg-gray-50 whitespace-pre-wrap">
          <strong>AI:</strong> {answer}
        </div>
      )}
      <div>
        <div className="flex gap-2">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            onClick={askAI}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 h-16"
          >
            {loading ? "חושב..." : "שלח"}
          </button>
        </div>
        <div className="flex items-center space-x-2 ">
          <Checkbox id="airplane-mode" checked={checked} onCheckedChange={() => setChecked(!checked)}/>
          <Label htmlFor="airplane-mode">שאל על הרשימה</Label>
        </div>
      </div>
    </div>
  );
}
