import { useState, useEffect } from "react";
import { Calendar, Clock, Play, Loader2, PlusCircle } from "lucide-react";
import Cookies from "js-cookie";
import { getWorkflowList } from "../services/workflow";

export default function WorkflowSchedular() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const user_id = Cookies.get("user_id");

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const res = await getWorkflowList(user_id || "");
        if (Array.isArray(res)) setWorkflows(res);
        else if (Array.isArray(res.data)) setWorkflows(res.data);
      } catch (err) {
        console.error("Error fetching workflows:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkflows();
  }, [user_id]);

  const handleSchedule = () => {
    if (!selectedWorkflow || !date || !time) {
      alert("Please select a workflow, date, and time.");
      return;
    }

    const selected = workflows.find((w) => w.id === selectedWorkflow);
    const newSchedule = {
      id: schedules.length + 1,
      workflowId: selectedWorkflow,
      description: selected?.description || "Untitled Workflow",
      date,
      time,
      status: "Scheduled",
    };
    setSchedules([newSchedule, ...schedules]);
    setDate("");
    setTime("");
    setSelectedWorkflow("");
  };

  const markAsExecuted = (id) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, status: "Executed" } : s))
    );
  };

  return (
    <div className="min-h-screen text-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Clock className="text-orange-500" /> Workflow Scheduler
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6 italic">
          Note: This is just an idea of implementation
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Workflow Selection */}
          <div className="lg:col-span-1 border border-gray-200 rounded-xl p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Available Workflows</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              </div>
            ) : workflows.length === 0 ? (
              <p className="text-gray-500 text-sm">No workflows found.</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {workflows.map((wf) => (
                  <button
                    key={wf.id}
                    onClick={() => setSelectedWorkflow(wf.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition ${
                      selectedWorkflow === wf.id
                        ? "bg-orange-500 text-white border-orange-600"
                        : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
                    }`}
                  >
                    <p className="truncate">{wf.description}</p>
                    <p className="text-xs opacity-70">{wf.id}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Middle: Scheduling Form */}
          <div className="lg:col-span-2 border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="text-orange-500" /> Schedule Execution
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">
                  Selected Workflow
                </label>
                <input
                  type="text"
                  readOnly
                  value={
                    workflows.find((w) => w.id === selectedWorkflow)
                      ?.description || ""
                  }
                  placeholder="Select a workflow from the left panel"
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-semibold block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-sm font-semibold block mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSchedule}
                className="w-full sm:w-auto mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
              >
                <PlusCircle size={18} />
                Add Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Scheduled List */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-4">Scheduled Workflows</h2>
          {schedules.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-6">
              No workflows scheduled yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-xl text-sm">
                <thead className="bg-gray-100 border-b border-gray-200 text-gray-800">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">#</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Workflow
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">{s.id}</td>
                      <td className="py-3 px-4">{s.description}</td>
                      <td className="py-3 px-4">{s.date}</td>
                      <td className="py-3 px-4">{s.time}</td>
                      <td
                        className={`py-3 px-4 font-medium ${
                          s.status === "Executed"
                            ? "text-green-600"
                            : "text-orange-500"
                        }`}
                      >
                        {s.status}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => markAsExecuted(s.id)}
                          className="flex items-center gap-1 justify-center px-3 py-1 text-sm text-white bg-green-500 hover:bg-green-600 rounded-lg transition"
                        >
                          <Play size={14} />
                          Run Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
