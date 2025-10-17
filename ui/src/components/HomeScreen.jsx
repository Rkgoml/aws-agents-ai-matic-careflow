import { useState } from "react";
import { Brain, Loader2, Sparkles } from "lucide-react";

export default function HomeScreen({ loading, onStart }) {
  const [prompt, setPrompt] = useState("");

  const handleStart = async () => {
    if (!prompt.trim()) {
      alert("Please enter a workflow goal");
      return;
    }
    onStart(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) onStart(prompt);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-3xl space-y-14">
          <div className="text-center space-y-6">
            <h1 className="text-6xl  text-gray-900">AI Matic CareFlow</h1>
            <p className="text-2xl text-gray-700">
              Create your agentic workflow in minutes
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 w-1/2 mx-auto px-4 py-2 bg-orange-100 rounded-full border border-orange-200">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-600">
              Natural Language to Workflow
            </span>
          </div>

          <div className="border bg-white border-gray-200 rounded-2xl p-12 shadow-md space-y-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Workflow Goal <span className="text-orange-500">*</span>
            </label>
            <textarea
              placeholder="Create an agent that can monitor a patient after discharge..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full min-h-[160px] p-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none text-lg"
            />

            <button
              onClick={handleStart}
              disabled={loading || !prompt.trim()}
              className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-lg bg-orange-500 text-white text-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300 transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Starting
                  Workflow...
                </>
              ) : (
                <>
                  <Brain className="w-6 h-6" /> Start Workflow
                </>
              )}
            </button>
          </div>

          <p className="text-center text-base text-gray-600">
            Enter any workflow goal and let AI Matic CareFlow help you build it
          </p>
        </div>
      </div>

      <footer className="p-6 text-center text-sm text-gray-600">
        Powered by AI Matic CareFlow • Your workflow assistant
      </footer>
    </div>
  );
}
