import { useState, useRef, useEffect } from "react";
import { ArrowRight, Brain, Loader2, Recycle } from "lucide-react";
import MessageBubble from "./MessageBubble";

export default function ChatScreen({ messages, loading, onSend }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [pop, setPop] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  const handlePop = () => {
    setPop(!pop);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-gray-600 text-lg">Start your conversation</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-10 left-0 w-full border-gray-200 p-6 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex gap-3 items-end">
          <div className="relative">
            <button
              onClick={handlePop}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors flex items-center justify-center flex-shrink-0"
            >
              <Recycle className="w-5 h-5" />
            </button>

            {pop && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white p-3 rounded-md shadow-md w-40 z-10">
                <form className="flex flex-col space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="option" value="option1" />
                    <span>Workflow 1</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="option" value="option2" />
                    <span>Workflow 2</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="option" value="option3" />
                    <span>Workflow 3</span>
                  </label>
                </form>
              </div>
            )}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe the next step or refine your workflow..."
            disabled={loading}
            className="flex-1 px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors flex items-center justify-center flex-shrink-0"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
