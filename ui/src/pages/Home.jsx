import { useState } from "react";
import HomeScreen from "../components/HomeScreen";
import Workflow from "../components/Workflow";
import StepLoader from "../components/StepLoader";
import { generateWorkflow } from "../services/workflow";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
      const errorMessage =
        error.response?.data?.detail || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <StepLoader />;
  }

  return <HomeScreen loading={loading} onStart={startWorkflow} />;
}
