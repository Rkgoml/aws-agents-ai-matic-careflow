import { useState } from "react";
import HomeScreen from "../components/HomeScreen";
import Workflow from "../components/Workflow";
import StepLoader from "../components/StepLoader";
import { generateWorkflow } from "../services/workflow";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(false);
  const user_id = Cookies.get("user_id");
  const navigate = useNavigate();

  const startWorkflow = async (description) => {
    setLoading(true);
    try {
      const data = await generateWorkflow(user_id, description);
      console.log(data);
      setWorkflow(data);
      navigate("/home/workflows");
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

  return <HomeScreen loading={loading} onStart={startWorkflow} />;
}
