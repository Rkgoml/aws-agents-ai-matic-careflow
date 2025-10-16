import api from "./api";

export async function generateWorkflow(user_id, description) {
  const res = await api.post("/workflow/generate", null, {
    params: { user_id, description },
  });
  return res.data;
}

export async function getWorkflowList(user_id) {
  const res = await api.get("/workflow/list", {
    params: { user_id },
  });
  return res.data;
}

export async function executeWorkflow(workflow_id) {
  const input = "patient_id: 23434, connection_id:0324, organization: goml";
  const res = await api.get("/workflow/execute", {
    params: { workflow_id, input },
  });
  return res.data;
}
