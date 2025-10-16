import { useState } from "react";
import HomeScreen from "../components/HomeScreen";
import Workflow from "../components/Workflow";
import StepLoader from "../components/StepLoader";
import { generateWorkflow } from "../services/workflow";
import Cookies from "js-cookie";

export default function Home() {
  const [stage, setStage] = useState("home");
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(false);
  const user_id = Cookies.get("user_id");

  const startWorkflow = async (description) => {
    setLoading(true);
    try {
      const data = await generateWorkflow(user_id, description);
      console.log(data);
      setWorkflow(data);
      setStage("workflow");
    } catch (error) {
      console.error("Failed to generate workflow:", error);
      alert("Something went wrong while generating workflow.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <StepLoader />;
  }

  return stage === "home" ? (
    <HomeScreen loading={loading} onStart={startWorkflow} />
  ) : (
    <Workflow workflowData={workflow} />
  );
}
