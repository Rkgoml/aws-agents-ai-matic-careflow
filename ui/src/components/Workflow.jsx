import { useState, useEffect } from "react";
import { ChevronDown, Send, Trash2, Loader2 } from "lucide-react";
import WorkFlowDiagram from "./WorkFlowDiagram";
import Cookies from "js-cookie";
import { getWorkflowList, executeWorkflow } from "../services/workflow";
import ReportMarkdown from "./ReportMarkdown";

export default function Workflow() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [report, setReport] = useState("");
  const user_id = Cookies.get("user_id");

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await getWorkflowList(user_id);
        if (Array.isArray(response)) {
          setWorkflows(response);
          setSelectedWorkflow(response[0]?.id || null);
        }
      } catch (error) {
        console.error("Failed to fetch workflows:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchWorkflows();
  }, [user_id]);

  const currentWorkflow = workflows.find((wf) => wf.id === selectedWorkflow);

  let workflowData = null;
  let workflowTitle = "";

  if (currentWorkflow?.architecture) {
    try {
      const parsedArchitecture = JSON.parse(
        JSON.parse(currentWorkflow.architecture)
      );
      workflowData = parsedArchitecture;
      workflowTitle = parsedArchitecture.workflow_name;
    } catch (e) {
      console.error("Failed to parse architecture JSON:", e);
    }
  }

  const handleExecute = async () => {
    setLoading(true);
    try {
      const result = await executeWorkflow(selectedWorkflow);
      setReport(result.result);
      const newEntry = {
        id: executionHistory.length + 1,
        input: userInput,
        output: result,
        executed_at: new Date().toLocaleString(),
      };
      setExecutionHistory([newEntry, ...executionHistory]);
      setUserInput("");
      setExpandedHistory(newEntry.id);
    } catch {
      const newEntry = {
        id: executionHistory.length + 1,
        input: userInput,
        output: { error: "Workflow execution failed" },
        executed_at: new Date().toLocaleString(),
      };
      setExecutionHistory([newEntry, ...executionHistory]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = (id) => {
    setExecutionHistory(executionHistory.filter((e) => e.id !== id));
    if (expandedHistory === id) setExpandedHistory(null);
  };

  const toggleHistory = (id) =>
    setExpandedHistory(expandedHistory === id ? null : id);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) handleExecute();
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-gray-600 font-medium">Fetching your workflows...</p>
      </div>
    );
  }

  if (!workflows.length) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex flex-col items-center justify-center flex-1 text-gray-600">
          <p className="text-2xl font-semibold mb-2">No workflows found</p>
          <p className="text-gray-500">
            You haven’t created any workflows yet. Start by creating one!
          </p>
        </div>
        <footer className="p-6 text-center text-sm text-gray-600 border-t border-gray-200 w-full">
          Powered by AI Matic CareFlow • Your workflow assistant
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[1500px] px-10 py-10 flex flex-col gap-10 flex-grow">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Workflows
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {workflows.map((wf) => (
              <button
                key={wf.id}
                onClick={() => setSelectedWorkflow(wf.id)}
                className={`px-5 py-4 rounded-lg font-medium text-sm transition text-left ${
                  selectedWorkflow === wf.id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {wf.description.charAt(0).toUpperCase() +
                  wf.description.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {currentWorkflow && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden p-8 flex-grow">
            <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentWorkflow.description.charAt(0).toUpperCase() +
                    currentWorkflow.description.slice(1)}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  ID: {selectedWorkflow}
                </p>
              </div>

              <button
                onClick={handleExecute}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Execute
                  </>
                )}
              </button>
            </div>

            <div className="mb-8 border-b border-gray-200 pb-6">
              <details className="group" open>
                <summary className="flex items-center gap-2 text-lg font-semibold text-gray-900 cursor-pointer hover:text-orange-500 transition">
                  <ChevronDown
                    size={20}
                    className="group-open:rotate-180 transition"
                  />
                  View Workflow Diagram
                </summary>
                {workflowData && (
                  <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-3">
                      {workflowTitle}
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6 text-sm font-mono text-gray-700 border border-gray-200">
                      <WorkFlowDiagram workflowData={workflowData} />
                    </div>
                  </div>
                )}
              </details>
            </div>

            {report && <ReportMarkdown content={report} />}

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Execution History
              </h3>
              {executionHistory.length > 0 ? (
                <div className="space-y-3">
                  {executionHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:border-gray-300 transition"
                    >
                      <button
                        onClick={() => toggleHistory(entry.id)}
                        className="w-full px-5 py-4 bg-gray-100 hover:bg-gray-200 transition flex items-center justify-between"
                      >
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            Execution {entry.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {entry.executed_at}
                          </p>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-gray-500 transition ${
                            expandedHistory === entry.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expandedHistory === entry.id && (
                        <div className="px-5 py-5 bg-white border-t border-gray-200 space-y-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-2">
                              Input:
                            </p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded text-sm border border-gray-200">
                              {entry.input}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-2">
                              Output:
                            </p>
                            <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto text-gray-700 border border-gray-200 font-mono">
                              {JSON.stringify(entry.output, null, 2)}
                            </pre>
                          </div>
                          <button
                            onClick={() => handleDeleteHistory(entry.id)}
                            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 transition"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm border border-gray-200 rounded-lg bg-gray-50 w-1/2 mx-auto">
                  No execution history yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="p-6 text-center text-sm text-gray-600  border-gray-200 w-full mt-auto">
        Powered by AI Matic CareFlow • Your workflow assistant
      </footer>
    </div>
  );
}
