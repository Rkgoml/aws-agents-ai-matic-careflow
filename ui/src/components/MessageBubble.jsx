import { Loader2 } from "lucide-react";

export default function MessageBubble({ msg }) {
  if (msg.type === "loader") {
    return (
      <div className="flex justify-start">
        <div className="flex items-center gap-3 bg-white  text-gray-700 px-6 py-4 rounded-2xl shadow-sm border border-gray-200">
          <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
          <span>{msg.text}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        msg.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-lg px-6 py-4 rounded-2xl shadow-sm whitespace-pre-wrap ${
          msg.type === "user"
            ? "bg-orange-500 text-white"
            : "bg-white text-gray-900 border border-gray-200"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}
